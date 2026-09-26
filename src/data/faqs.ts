export type QA = { q: string; a: string }

/**
 * The questions people ask before they email. One list, used by the FAQ
 * accordion on the Contact view (and the legacy long-scroll FAQ section).
 * Five questions, two or three sentences each: the accordion sits in a
 * fixed panel and more than that pushes the email row off the plate.
 */
export const FAQS: QA[] = [
  {
    q: 'What can you build for me?',
    a: 'Full stack web apps, SaaS platforms, business websites, dashboards and UI/UX in Figma. I work mostly with React, Laravel and Node.js, and I explore AI and computer vision on the side.',
  },
  {
    q: 'Are you available?',
    a: 'Yes - for freelance work, internships, and exciting projects. I am a fourth-year IT student at Bukidnon State University, so write and tell me what you have in mind.',
  },
  {
    q: 'Do you help with capstone and thesis systems?',
    a: 'Yes. I guide and develop complete capstone projects from concept to deployment: system design, documentation, deployment and support. I have been the System Developer on capstone teams before - see Testimonials.',
  },
  {
    q: 'How much does a project cost?',
    a: 'It depends on the scope. Send a short brief, or a proposal PDF with your timeline and budget, and I will reply with a quote.',
  },
  {
    q: 'Where are you based?',
    a: 'Maramag, Bukidnon, in the Philippines (GMT+8).',
  },
]
