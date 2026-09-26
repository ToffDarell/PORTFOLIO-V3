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
function isAllowedOrigin(origin: string | null): boolean {
  if (!origin) return true; // Same-origin or non-browser server call
  try {
    const url = new URL(origin);
    const hostname = url.hostname.toLowerCase();

    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '0.0.0.0') {
      return true;
    }
    if (hostname === 'vercel.app' || hostname.endsWith('.vercel.app')) {
      return true;
    }
    if (hostname === 'toffdarell.dev' || hostname.endsWith('.toffdarell.dev')) {
      return true;
    }
  } catch {
    // Malformed origin header
  }
  return false;
}

type ChatMessage = { role: string; content: unknown }

export default async function handler(req: Request): Promise<Response> {
  const origin = req.headers.get('origin');
  const allowed = isAllowedOrigin(origin);

  const corsHeaders = {
    'Access-Control-Allow-Origin': origin && allowed ? origin : '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight OPTIONS
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  // Reject unauthorized origins
  if (origin && !allowed) {
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

  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({
        error: 'GROQ_API_KEY is not configured. Please set GROQ_API_KEY in Vercel → Settings → Environment Variables.',
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
      const errText = await groqResponse.text();
      return new Response(errText, {
        status: groqResponse.status,
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

