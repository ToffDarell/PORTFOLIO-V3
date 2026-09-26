/**
 * api/chat.ts — Vercel Edge Serverless Function
 *
 * Direct Groq API Proxy with origin validation, rate limit handling,
 * multi-model resilience, payload validation, and system prompt protection.
 */

import { buildSystemPrompt } from '../src/data/chatPrompt';

export const config = { runtime: 'edge' };

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// ── Model Resilience Strategy ────────────────────────────────────────────────
const PRIMARY_MODEL  = 'openai/gpt-oss-120b';
const FALLBACK_MODEL = 'openai/gpt-oss-20b';
const ENFORCED_MAX_TOKENS  = 700;
const ENFORCED_TEMPERATURE = 0.7;

// ── CORS & Origin Validation ──────────────────────────────────────────────────
// Only my own sites may call this: toffdarell.dev, this project's own Vercel
// URLs (production, branch and per-deploy, which Vercel exposes at runtime),
// and localhost for `vercel dev`. Not every *.vercel.app - that is anyone's
// Vercel site, and would let other pages spend this key. Browsers always send
// Origin on a POST, so a missing one is a script, not the chat widget.
const OWN_VERCEL_HOSTS = [
  process.env.VERCEL_URL,
  process.env.VERCEL_BRANCH_URL,
  process.env.VERCEL_PROJECT_PRODUCTION_URL,
]
  .filter((h): h is string => Boolean(h))
  .map((h) => h.toLowerCase())

function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return false;
  try {
    const hostname = new URL(origin).hostname.toLowerCase();
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    if (hostname === 'toffdarell.dev' || hostname.endsWith('.toffdarell.dev')) return true;
    if (OWN_VERCEL_HOSTS.includes(hostname)) return true;
  } catch {
    // Malformed origin header
  }
  return false;
}

// ── Rate limit ────────────────────────────────────────────────────────────────
// Per visitor IP, per Edge instance. Instances are short-lived and not shared,
// so this is a speed bump against a script hammering the key, not a hard
// quota - the hard cap is the spend limit on the Groq account.
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 12;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

type ChatMessage = { role: string; content: unknown }

export default async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin');
  const allowed = isAllowedOrigin(origin);

  const corsHeaders = {
    'Access-Control-Allow-Origin': allowed && origin ? origin : 'https://www.toffdarell.dev',
    Vary: 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Reject unauthorized (or missing) origins
  if (!allowed) {
    return new Response(JSON.stringify({ error: 'Forbidden origin' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const ip = (req.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': '60', ...corsHeaders },
    });
  }

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('[api/chat] GROQ_API_KEY is not set in the Vercel environment');
    return new Response(
      JSON.stringify({
        // Setup detail stays in the logs, not the response.
        error: 'Chat is not available right now.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }

  let body: { messages?: unknown; activeSection?: string };
  try {
    const rawBody = await req.text();
    if (rawBody.length > 10_000) {
      return new Response(JSON.stringify({ error: 'Payload too large' }), {
        status: 413,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
    body = JSON.parse(rawBody);
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  if (!Array.isArray(body.messages)) {
    return new Response(JSON.stringify({ error: 'Invalid request: messages array required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const safeMessages = (body.messages as ChatMessage[]).filter((m) => m.role !== 'system');
  if (safeMessages.length === 0) {
    return new Response(JSON.stringify({ error: 'Invalid request: no user messages provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const validRoles = new Set(['user', 'assistant']);
  const hasInvalidMessage = safeMessages.some(
    (m) => !validRoles.has(m.role) || typeof m.content !== 'string' || (m.content as string).trim() === ''
  );
  if (hasInvalidMessage) {
    return new Response(JSON.stringify({ error: 'Invalid request: malformed message object' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }

  const systemMessage = {
    role: 'system',
    content: buildSystemPrompt(body.activeSection || 'hero'),
  };
  const finalMessages = [systemMessage, ...safeMessages];

  // Helper function to call Groq API
  const fetchGroq = async (model: string) => {
    return fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        messages: finalMessages,
        model,
        max_tokens: ENFORCED_MAX_TOKENS,
        temperature: ENFORCED_TEMPERATURE,
        // gpt-oss models reason before answering — keep it short and hidden so
        // the reply fits in max_tokens and only the answer is streamed.
        reasoning_effort: 'low',
        include_reasoning: false,
        stream: true,
      }),
    });
  };

  try {
    let groqResponse = await fetchGroq(PRIMARY_MODEL);

    // If primary model encounters rate limit or server issue, try fallback model
    if (!groqResponse.ok && groqResponse.status !== 401) {
      console.warn(`[api/chat] ${PRIMARY_MODEL} returned ${groqResponse.status}. Attempting fallback to ${FALLBACK_MODEL}`);
      const fallbackResponse = await fetchGroq(FALLBACK_MODEL);
      if (fallbackResponse.ok) {
        groqResponse = fallbackResponse;
      }
    }

    if (!groqResponse.ok) {
      // Log Groq's detail server-side; the browser only needs the status.
      console.error('[api/chat] Groq error', groqResponse.status, await groqResponse.text());
      return new Response(JSON.stringify({ error: 'The AI service could not answer right now.' }), {
        status: groqResponse.status === 429 ? 429 : 502,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }

    return new Response(groqResponse.body, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'X-Accel-Buffering': 'no',
        ...corsHeaders,
      },
    });
  } catch (err) {
    console.error('[api/chat] Failed to reach Groq API:', err);
    return new Response(JSON.stringify({ error: 'Failed to reach AI service. Please try again.' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
}

