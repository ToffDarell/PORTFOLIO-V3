import { Fragment, useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { useLocation } from 'react-router-dom'
import { PaperPlaneTilt, X, ChatsCircle, ArrowUpRight } from '@/components/slab'
import { profile } from '@/data/profile'
import type { ChatSection } from '@/data/chatPrompt'
import { DRAFTS, LIVE_CHAT, openGmail } from '@/lib/gmail'

/**
 * "Ask Toff" - the floating chat. A portrait button bottom-right with a
 * "How can I help?" bubble; open, it is a small panel that streams answers
 * from api/chat.ts (Groq, the system prompt built from src/data).
 *
 * The API key never reaches the browser: the Edge Function holds it. On the
 * plain Vite dev server there is no /api, so in DEV only - with
 * VITE_GROQ_API_KEY in .env - it calls Groq directly. That branch is
 * stripped from production builds.
 */

type Msg = { id: number; role: 'user' | 'assistant'; content: string }

/** "Talk to the real me": the live channels behind the Contact / Chat live
 *  buttons, as on v2. */
const CHANNELS = [
  { id: 'messenger', label: 'Messenger', note: 'Direct chat with Toff', icon: '/icons/brands/messenger.svg', open: () => window.open(LIVE_CHAT.messenger, '_blank', 'noopener,noreferrer') },
  { id: 'gmail', label: 'Gmail', note: 'Send documents & details', icon: '/icons/brands/gmail.svg', open: () => openGmail(DRAFTS.chat) },
  { id: 'instagram', label: 'Instagram', note: 'Direct message on IG', icon: '/icons/brands/instagram.svg', open: () => window.open(LIVE_CHAT.instagram, '_blank', 'noopener,noreferrer') },
] as const

const ROUTE_SECTION: Record<string, ChatSection> = {
  '/': 'hero',
  '/projects': 'projects',
  '/services': 'services',
  '/stack': 'stack',
  '/testimonials': 'testimonials',
  '/about': 'about',
  '/contact': 'contact',
}

const SUGGESTIONS: Record<ChatSection, string[]> = {
  hero: ['Tell me about yourself', "What's your tech stack?", 'What services do you offer?', 'How can I contact you?'],
  about: ['How old are you?', 'Where are you from?', 'What year are you in college?', 'What makes you unique?'],
  stack: ['What AI tools do you use?', 'What backend frameworks do you use?', 'Tell me about your CCNA', 'Do you know TypeScript?'],
  projects: ['Tell me about PayMonitor', "What's SafeRide?", "What's your most complex project?", 'Do you have AI projects?'],
  services: ['What can you build for me?', 'Do you do capstone systems?', 'Can you build a SaaS?', 'Do you do UI/UX design?'],
  testimonials: ['What do teammates say about you?', 'What was your role in capstones?', 'How do you work with a team?', 'Are you available?'],
  contact: ['How can I hire you?', "What's your email?", "What's your GitHub?", 'Are you available for freelance?'],
}

class RateLimited extends Error {
  constructor(public retryAfter: number) {
    super('RATE_LIMITED')
  }
}

async function streamChat(
  messages: { role: string; content: string }[],
  section: ChatSection,
  onChunk: (text: string) => void,
) {
  let res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, activeSection: section }),
  })

  if (import.meta.env.DEV && res.status === 404 && import.meta.env.VITE_GROQ_API_KEY) {
    const { buildSystemPrompt } = await import('@/data/chatPrompt')
    res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [{ role: 'system', content: buildSystemPrompt(section) }, ...messages],
        model: 'openai/gpt-oss-120b',
        max_tokens: 700,
        temperature: 0.7,
        reasoning_effort: 'low',
        include_reasoning: false,
        stream: true,
      }),
    })
  }

  if (res.status === 429) {
    throw new RateLimited(parseFloat(res.headers.get('retry-after') || '60'))
  }
  if (!res.ok || !res.body) throw new Error(`Chat error ${res.status}`)

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  for (;;) {
    const { done, value } = await reader.read()
    if (done) return
    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const data = line.slice(6).trim()
      if (data === '[DONE]') return
      try {
        const delta = JSON.parse(data)?.choices?.[0]?.delta?.content
        if (delta) onChunk(delta)
      } catch {
        // a partial frame; the next read completes it
      }
    }
  }
}

export default function ChatBot() {
  const { pathname } = useLocation()
  const section = ROUTE_SECTION[pathname] ?? 'hero'
  const [open, setOpen] = useState(false)
  const [nudge, setNudge] = useState(true)
  const [messages, setMessages] = useState<Msg[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [blockedUntil, setBlockedUntil] = useState(0)
  const [sheet, setSheet] = useState(false)
  const nextId = useRef(0)
  const logRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [messages])

  useEffect(() => {
    if (!open) return
    requestAnimationFrame(() => inputRef.current?.focus())
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (sheet) {
          setSheet(false)
          return
        }
        setOpen(false)
        buttonRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, sheet])

  const send = useCallback(
    async (text: string) => {
      const q = text.trim()
      if (!q || busy || Date.now() < blockedUntil) return
      const user: Msg = { id: ++nextId.current, role: 'user', content: q }
      const reply: Msg = { id: ++nextId.current, role: 'assistant', content: '' }
      const history = [...messages, user].slice(-10).map(({ role, content }) => ({ role, content }))
      setMessages((m) => [...m, user, reply])
      setInput('')
      setBusy(true)
      const write = (content: string) =>
        setMessages((m) => m.map((x) => (x.id === reply.id ? { ...x, content } : x)))
      let acc = ''
      try {
        await streamChat(history, section, (chunk) => {
          acc += chunk
          write(acc)
        })
        if (!acc) write("I couldn't come up with an answer just now. Try asking another way?")
      } catch (err) {
        if (err instanceof RateLimited) {
          setBlockedUntil(Date.now() + err.retryAfter * 1000)
          write(`I'm getting a lot of questions right now. Try again in about ${Math.ceil(err.retryAfter)} seconds, or email me at ${profile.email}.`)
        } else {
          write(`Something went wrong on my end. You can reach me directly at ${profile.email}.`)
        }
      } finally {
        setBusy(false)
      }
    },
    [busy, blockedUntil, messages, section],
  )

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    void send(input)
  }

  return (
    <div className="chatbot" data-open={open ? 'true' : 'false'}>
      {open && (
        <div className="chatbot__panel" role="dialog" aria-label={`Chat with ${profile.firstName}`}>
          <header className="chatbot__head">
            <span className="chatbot__avatar">
              <img src={profile.avatarSrc} alt="" width={36} height={36} />
              <i aria-hidden="true" />
            </span>
            <span className="chatbot__who">
              <b>{profile.firstName}</b>
              <span>AI version of me · usually right</span>
            </span>
            <button
              type="button"
              className="chatbot__close"
              onClick={() => {
                setOpen(false)
                buttonRef.current?.focus()
              }}
              aria-label="Close chat"
            >
              <X size={16} weight="bold" />
            </button>
          </header>

          <div className="chatbot__log" ref={logRef} aria-live="polite">
            {messages.length === 0 && (
              <div className="chatbot__welcome">
                <p className="chatbot__hello">
                  Hi, I'm {profile.firstName}. Ask me about my projects, my stack, or what I can build for you.
                </p>
                <button type="button" className="chatbot__contact" onClick={() => setSheet(true)}>
                  <ChatsCircle size={16} weight="fill" aria-hidden="true" />
                  Contact Toff
                </button>
                <p className="chatbot__contact-note">Discuss projects, internships, collaborations, or freelance work.</p>
              </div>
            )}
            {messages.map((m) => {
              const bubble = (
                <p className={`chatbot__msg chatbot__msg--${m.role}`}>
                  {m.content || <span className="chatbot__dots" aria-label="Typing"><i /><i /><i /></span>}
                </p>
              )
              // My replies carry my face, like a real chat thread.
              return m.role === 'assistant' ? (
                <div key={m.id} className="chatbot__row">
                  <img className="chatbot__row-avatar" src={profile.avatarSrc} alt="" width={28} height={28} />
                  {bubble}
                </div>
              ) : (
                <Fragment key={m.id}>{bubble}</Fragment>
              )
            })}
            {!busy && messages.at(-1)?.role === 'assistant' && (
              <button type="button" className="chatbot__live" onClick={() => setSheet(true)}>
                <ChatsCircle size={14} weight="fill" aria-hidden="true" />
                Chat live
              </button>
            )}
          </div>

          {sheet && (
            <div className="chatbot__sheet" role="dialog" aria-label={`Contact ${profile.firstName} directly`}>
              <div className="chatbot__sheet-head">
                <b>Talk to the real {profile.firstName}</b>
                <button type="button" className="chatbot__close" onClick={() => setSheet(false)} aria-label="Back to chat">
                  <X size={14} weight="bold" />
                </button>
              </div>
              <ul className="chatbot__channels" role="list">
                {CHANNELS.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      className="chatbot__channel"
                      onClick={() => {
                        c.open()
                        setSheet(false)
                      }}
                    >
                      <span className="chatbot__channel-mark">
                        <img src={c.icon} alt="" width={20} height={20} />
                      </span>
                      <span className="chatbot__channel-copy">
                        <b>{c.label}</b>
                        <span>{c.note}</span>
                      </span>
                      <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {messages.length === 0 && (
            <ul className="chatbot__sugs" role="list">
              {SUGGESTIONS[section].map((s) => (
                <li key={s}>
                  <button type="button" onClick={() => void send(s)}>
                    {s}
                  </button>
                </li>
              ))}
            </ul>
          )}

          <form className="chatbot__form" onSubmit={onSubmit}>
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              maxLength={500}
              aria-label="Your question"
            />
            <button type="submit" disabled={busy || !input.trim()} aria-label="Send">
              <PaperPlaneTilt size={16} weight="fill" />
            </button>
          </form>
        </div>
      )}

      {!open && nudge && (
        <button type="button" className="chatbot__nudge" onClick={() => setOpen(true)}>
          How can I help?
          <span
            role="button"
            tabIndex={-1}
            aria-label="Dismiss"
            className="chatbot__nudge-x"
            onClick={(e) => {
              e.stopPropagation()
              setNudge(false)
            }}
          >
            <X size={10} weight="bold" />
          </span>
        </button>
      )}

      <button
        ref={buttonRef}
        type="button"
        className="chatbot__fab"
        onClick={() => {
          setOpen((o) => !o)
          setNudge(false)
        }}
        aria-expanded={open}
        aria-label={open ? 'Close chat' : `Chat with ${profile.firstName}`}
      >
        <img src={profile.avatarSrc} alt="" width={64} height={64} />
        <i className="chatbot__online" aria-hidden="true" />
      </button>
    </div>
  )
}
