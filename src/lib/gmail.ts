import { profile } from '@/data/profile'

/**
 * Ready-to-send Gmail drafts, as on v2: the visitor lands in a compose window
 * addressed to me with the subject and a fill-in-the-blanks body already in.
 *
 * Gmail is opened the way each platform allows: the Gmail app on iOS, the
 * Gmail app via a SENDTO intent on Android, and Gmail web everywhere else.
 */

export type Draft = { subject: string; body: string }

export const DRAFTS = {
  inquiry: {
    subject: "Project Inquiry / Let's Collaborate!",
    body: "Hi Toff,\n\nI found your portfolio and would love to chat about a potential project, internship, or collaboration opportunity!\n\nHere is what's on my mind:\n- What I want to build/discuss: \n- Best way to reach back: \n\nTalk soon!",
  },
  proposal: {
    subject: 'Project Proposal & Documentation',
    body: "Hi Toff,\n\nI have a project proposal, wireframe, or scope document I'd like to share with you!\n\nHere are the quick details:\n- Project Name: \n- Estimated Timeline/Budget: \n- Brief Overview: \n\n(Please click the attachment icon below in Gmail to upload your PDF/file!)",
  },
  chat: {
    subject: "Let's Connect / Project Inquiry",
    body: "Hi Toff,\n\nI'd love to connect! Here is what's on my mind:\n\n[Briefly describe your project, system idea, or query here...]\n\nLooking forward to hearing from you!",
  },
} satisfies Record<string, Draft>

/** Where the "live chat" options go. */
export const LIVE_CHAT = {
  messenger: 'https://m.me/toffdarell',
  instagram: 'https://www.instagram.com/direct/t/17848317639209823/',
}

/** The compose URL for this device. Safe to call during render. */
export function gmailLink({ subject, body }: Draft): string {
  const to = encodeURIComponent(profile.email)
  const su = encodeURIComponent(subject)
  const b = encodeURIComponent(body)
  const ua = typeof navigator === 'undefined' ? '' : navigator.userAgent
  if (/iPhone|iPad|iPod/i.test(ua)) return `googlegmail:///co?to=${to}&su=${su}&body=${b}`
  if (/Android/i.test(ua)) {
    return `mailto:${profile.email}?subject=${su}&body=${b}#Intent;action=android.intent.action.SENDTO;type=message/rfc822;package=com.google.android.gm;end`
  }
  return `https://mail.google.com/mail/?view=cm&to=${to}&su=${su}&body=${b}`
}

/** Open the draft: a new tab for Gmail web, the app hand-off on phones. */
export function openGmail(draft: Draft) {
  const url = gmailLink(draft)
  if (url.startsWith('https://')) window.open(url, '_blank', 'noopener,noreferrer')
  else window.location.href = url
}
