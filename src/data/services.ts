/**
 * What I offer. Rendered by the Services view and the Services card on Home,
 * and fed to the chatbot, so the offer is written once.
 */

export type Service = {
  index: string
  title: string
  description: string
  chip: string
  logos: string[]
  bullets: string[]
}

const T = (n: string) => `/icons/tech/${n}.svg`

export const SERVICES: Service[] = [
  {
    index: '01',
    title: 'Full Stack Web Development',
    description: 'End-to-end web applications using React, Laravel, Node.js, and modern databases.',
    chip: 'Web apps',
    logos: [T('react'), T('laravel')],
    bullets: ['React / Next.js', 'Laravel / Django', 'REST APIs', 'Database Design'],
  },
  {
    index: '02',
    title: 'SaaS Development',
    description: 'Scalable multi-tenant SaaS platforms with subscription billing and admin dashboards.',
    chip: 'SaaS',
    logos: [T('laravel'), T('mysql')],
    bullets: ['Multi-tenancy', 'Billing Systems', 'Role-based Access', 'Analytics'],
  },
  {
    index: '03',
    title: 'UI/UX Design',
    description: 'Modern, aesthetic, and user-centric interfaces designed and prototyped in Figma.',
    chip: 'Design',
    logos: [T('figma'), T('canva')],
    bullets: ['Figma Prototypes', 'Design Systems', 'User Flows', 'Responsive Layouts'],
  },
  {
    index: '04',
    title: 'Business Websites',
    description: 'High-converting, blazing-fast landing pages and corporate websites with SEO in mind.',
    chip: 'Websites',
    logos: [T('react'), T('vitejs')],
    bullets: ['Landing Pages', 'Corporate Sites', 'SEO Optimized', 'Performance'],
  },
  {
    index: '05',
    title: 'Dashboard Systems',
    description: 'Complex data visualization and management dashboards for administrators and analysts.',
    chip: 'Dashboards',
    logos: [T('react'), T('mongodb')],
    bullets: ['Charts & Graphs', 'Data Tables', 'Real-time Data', 'Admin Panels'],
  },
  {
    index: '06',
    title: 'Capstone Systems',
    description: 'Guiding and developing complete thesis / capstone projects from concept to deployment.',
    chip: 'Capstone',
    logos: [T('github'), T('render')],
    bullets: ['System Design', 'Documentation', 'Deployment', 'Full Support'],
  },
]

export const SERVICES_TEXT = SERVICES.map(
  (s, i) => `${i + 1}. ${s.title}: ${s.description} (${s.bullets.join(', ')})`,
).join('\n')
