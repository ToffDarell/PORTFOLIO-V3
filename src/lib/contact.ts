import { profile } from '@/data/profile'

/**
 * Contact submission.
 *
 * Three paths, tried in order:
 *   1. EmailJS, when VITE_EMAILJS_SERVICE_ID / _TEMPLATE_ID / _PUBLIC_KEY are
 *      set (.env locally, Vercel env vars in production). The template gets
 *      from_name, from_email, subject and message - the same fields v2 sent.
 *   2. VITE_CONTACT_ENDPOINT, below.
 *   3. Neither: the visitor's mail client, addressed to profile.email.
 *
 * To wire a different backend (Formspree, a serverless function, a webhook...):
 *   1. Set VITE_CONTACT_ENDPOINT in .env.production to the URL that accepts
 *      a JSON POST of the Lead type below.
 *   2. Have it answer 2xx on success, or a non-2xx with { "error": "..." }
 *      and that sentence is shown to the visitor as-is.
 * With the variable unset the mail client path below is used instead.
 */

export const ENDPOINT: string = import.meta.env.VITE_CONTACT_ENDPOINT ?? ''
export const RECIPIENT = profile.email

export const MAX_NAME = 80
export const MAX_EMAIL = 254
export const MAX_MESSAGE = 5000

// Built from \u escapes so the source stays pure ASCII.
// Control chars U+0000-U+001F and U+007F; when newlines are allowed, tab,
// LF and CR survive. Zero-width and bidi marks always go.
const CTRL_NO_NL = new RegExp('[\\u0000-\\u001F\\u007F]', 'g')
const CTRL_KEEP_NL = new RegExp('[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F\\u007F]', 'g')
const ZERO_WIDTH = new RegExp('[\\u200B-\\u200F\\u202A-\\u202E\\u2060\\uFEFF]', 'g')

export function sanitize(input: string, allowNewlines = false): string {
  const controls = allowNewlines ? CTRL_KEEP_NL : CTRL_NO_NL
  return input.replace(controls, '').replace(ZERO_WIDTH, '')
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export type Lead = {
  firstName: string
  lastName: string
  email: string
  message: string
  /** Honeypot. Empty for a person; your backend should drop anything else. */
  website: string
}

export type SubmitResult = { via: 'webhook' } | { via: 'mailto' }

const EMAILJS = {
  service: import.meta.env.VITE_EMAILJS_SERVICE_ID ?? '',
  template: import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? '',
  key: import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? '',
}
const HAS_EMAILJS = Boolean(EMAILJS.service && EMAILJS.template && EMAILJS.key)

/** Read, trim, cap and sanitise the four fields. Returns null if a required
 *  field is missing or the email does not look like one. */
export function readLead(data: FormData): Lead | null {
  const firstName = sanitize(String(data.get('firstName') ?? '').trim()).slice(0, MAX_NAME)
  const lastName = sanitize(String(data.get('lastName') ?? '').trim()).slice(0, MAX_NAME)
  const email = sanitize(String(data.get('email') ?? '').trim()).slice(0, MAX_EMAIL)
  const message = sanitize(String(data.get('message') ?? '').trim(), true).slice(0, MAX_MESSAGE)
  if (!firstName || !lastName || !email || !message || !EMAIL_RE.test(email)) return null
  const website = String(data.get('website') ?? '')
  return { firstName, lastName, email, message, website }
}

export class SubmitError extends Error {}

export async function submitLead(lead: Lead): Promise<SubmitResult> {
  // A filled honeypot is a bot: report success and send nothing.
  if (lead.website) return { via: 'webhook' }

  if (HAS_EMAILJS) {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS.service,
        template_id: EMAILJS.template,
        user_id: EMAILJS.key,
        template_params: {
          from_name: `${lead.firstName} ${lead.lastName}`,
          from_email: lead.email,
          subject: `Portfolio inquiry from ${lead.firstName} ${lead.lastName}`,
          message: lead.message,
        },
      }),
    })
    if (!res.ok) throw new SubmitError(`That did not go through. Email me at ${RECIPIENT} instead.`)
    return { via: 'webhook' }
  }

  if (ENDPOINT) {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
    })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      throw new SubmitError(body?.error || `The server answered ${res.status}.`)
    }
    return { via: 'webhook' }
  }

  const subject = `Project inquiry from ${lead.firstName} ${lead.lastName}`
  const body = [`Name: ${lead.firstName} ${lead.lastName}`, `Email: ${lead.email}`, '', lead.message].join('\n')
  // encodeURIComponent on every value blocks header injection (CR/LF) and
  // parameter smuggling via & or ?.
  window.location.href = `mailto:${encodeURIComponent(RECIPIENT)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  return { via: 'mailto' }
}
