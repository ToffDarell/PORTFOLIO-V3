/**
 * The stack and the credentials, for the Stack & Certs view (and the
 * Credentials card on Home). Logos live in public/icons/.
 */

export type Tech = { name: string; icon: string; description: string }
export type TechGroup = { name: string; items: Tech[] }

const T = (n: string) => `/icons/tech/${n}.svg`

export const techGroups: TechGroup[] = [
  {
    name: 'Languages',
    items: [
      { name: 'Java', icon: T('java'), description: 'Object-oriented language for enterprise applications and Android development.' },
      { name: 'JavaScript', icon: T('javascript'), description: 'The language of the web, powering interactive and dynamic interfaces.' },
      { name: 'TypeScript', icon: T('typescript'), description: 'JavaScript with static typing for scalable, maintainable codebases.' },
      { name: 'Python', icon: T('python'), description: 'Versatile language for web, data science, AI/ML, and automation.' },
      { name: 'PHP', icon: T('php'), description: 'Server-side language powering WordPress and Laravel applications.' },
    ],
  },
  {
    name: 'Frontend',
    items: [
      { name: 'HTML5', icon: T('html5'), description: 'The standard markup language for structuring web content.' },
      { name: 'CSS3', icon: T('css3'), description: 'Stylesheet language for designing beautiful, responsive layouts.' },
      { name: 'React', icon: T('react'), description: 'Component-based library for building modern user interfaces.' },
      { name: 'Next.js', icon: T('nextjs'), description: 'React framework for full stack apps with server rendering and routing.' },
      { name: 'Vite', icon: T('vitejs'), description: 'Lightning-fast build tool for next-generation frontend projects.' },
      { name: 'Tailwind', icon: T('tailwindcss'), description: 'Utility-first CSS framework for rapid UI development.' },
      { name: 'Alpine.js', icon: T('alpinejs'), description: 'Lightweight framework for declarative, reactive UI components.' },
    ],
  },
  {
    name: 'Backend & Frameworks',
    items: [
      { name: 'Laravel', icon: T('laravel'), description: 'Elegant PHP framework for building robust web applications.' },
      { name: 'Django', icon: T('django'), description: 'High-level Python framework for rapid, secure web development.' },
      { name: 'Apache', icon: T('apache'), description: "World's most popular web server for hosting applications." },
    ],
  },
  {
    name: 'Databases & Cloud',
    items: [
      { name: 'MySQL', icon: T('mysql'), description: "World's most popular open-source relational database." },
      { name: 'MongoDB', icon: T('mongodb'), description: 'NoSQL document database for flexible, scalable data storage.' },
      { name: 'Firebase', icon: T('firebase'), description: "Google's platform for building web and mobile applications." },
      { name: 'Vercel', icon: T('vercel'), description: 'Frontend cloud platform for deploying Next.js and static sites.' },
      { name: 'Render', icon: T('render'), description: 'Cloud platform for hosting web apps, APIs, and databases.' },
    ],
  },
  {
    name: 'AI / ML',
    items: [
      { name: 'PyTorch', icon: T('pytorch'), description: 'Open-source machine learning framework for deep learning research.' },
      { name: 'TensorFlow', icon: T('tensorflow'), description: "Google's end-to-end platform for building ML models." },
      { name: 'NumPy', icon: T('numpy'), description: 'Fundamental package for scientific computing with Python.' },
      { name: 'OpenCV', icon: T('opencv'), description: 'Open-source library for computer vision and image processing.' },
    ],
  },
  {
    name: 'AI Dev Tools & Agents',
    items: [
      { name: 'Claude', icon: '/icons/ai/claude-color.svg', description: 'Anthropic AI assistant & Claude Code for architectural design, code generation, and complex debugging.' },
      { name: 'Codex', icon: '/icons/ai/codex.svg', description: 'OpenAI model engine for rapid logic generation, intelligent completions, and automated script workflows.' },
      { name: 'OpenCode', icon: '/icons/ai/opencode.svg', description: 'Agentic terminal AI assistant for autonomous multi-file workflows and codebase intelligence.' },
      { name: 'Antigravity', icon: '/icons/ai/antigravity.svg', description: 'Google DeepMind advanced agentic coding environment for high-velocity full-stack pair programming.' },
      { name: 'MiMo Code', icon: '/icons/ai/mimo.jpg', description: 'Xiaomi MiMo agentic coding assistant for planning and building features across a codebase.' },
    ],
  },
  {
    name: 'Tools & Others',
    items: [
      { name: 'Git', icon: T('git'), description: 'Distributed version control system for tracking code changes.' },
      { name: 'GitHub', icon: T('github'), description: 'Platform for hosting, reviewing, and collaborating on code.' },
      { name: 'Figma', icon: T('figma'), description: 'Collaborative design platform for UI/UX and prototyping.' },
      { name: 'Canva', icon: T('canva'), description: 'Graphic design tool for creating visuals and marketing materials.' },
      { name: 'Cisco', icon: T('cisco'), description: 'Networking equipment and certification for IT infrastructure.' },
      { name: 'Raspberry Pi', icon: T('raspberrypi'), description: 'Single-board computer for DIY projects, IoT, and prototyping.' },
    ],
  },
]

export const techCount = techGroups.reduce((n, g) => n + g.items.length, 0)

export type Cert = {
  id: string
  title: string
  issuer: string
  date: string
  category: string
  image: string
  link?: string
  tags: string[]
  description: string
}

export const certs: Cert[] = [
  {
    id: 'ccna-srwe',
    title: 'CCNA: Switching, Routing, and Wireless Essentials',
    issuer: 'Cisco Networking Academy',
    date: 'Dec 2025',
    category: 'Networking & Infrastructure',
    image: '/certs/ccna-srwe.webp',
    tags: ['Cisco CCNA', 'Routing & Switching', 'Wireless Essentials', 'Network Security'],
    description:
      'Verified certification in configuring, troubleshooting, and securing enterprise routers, switches, and wireless networks.',
  },
  {
    id: 'ccna-itn',
    title: 'CCNA: Introduction to Networks',
    issuer: 'Cisco / Credly',
    date: 'May 2025',
    category: 'Verified Credential',
    image: '/certs/ccna-itn.webp',
    link: 'https://www.credly.com/badges/25dea922-2e0b-478e-8c77-d61aef79a693',
    tags: ['Cisco', 'Network Fundamentals', 'IPv4 / IPv6', 'Subnetting', 'Credly Badge'],
    description:
      'Verified credential covering network architecture, IP addressing, Ethernet protocols, and foundational network operations.',
  },
  {
    id: 'hackerrank-se',
    title: 'Software Engineer Certificate',
    issuer: 'HackerRank',
    date: 'Aug 2026',
    category: 'Software Engineering',
    image: '/certs/hackerrank-se.webp',
    link: 'https://www.hackerrank.com/certificates/8ed574f2a073',
    tags: ['HackerRank Verified', 'Algorithms', 'Data Structures', 'Problem Solving', 'Software Design'],
    description:
      'Passed HackerRank skill assessment for core software engineering principles, data structures, and technical problem solving.',
  },
  {
    id: 'ipt2',
    title: 'Certificate of Recognition: Integrative Programming & Technology 2',
    issuer: 'Bukidnon State University - Computer Society',
    date: 'Dec 2025',
    category: 'Academic Recognition',
    image: '/certs/ipt2.webp',
    tags: ['Bukidnon State University', 'Computer Society', 'Integrative Programming', 'Academic Mentoring', 'IPT 2'],
    description:
      'In recognition of active participation, dedication to learning, and commitment as a mentee in Integrative Programming and Technology 2 under the Academic Mentoring Program.',
  },
]
