/**
 * The builds. One record per project, and the only place project copy lives:
 * the Projects view, the 3D reel, the case-study cards, the screenshot strip
 * and Home's chips all read from here.
 *
 * Screenshots live in public/projects/. `logos` are marks from public/icons.
 */

export type WorkStatus = 'Live' | 'Shipped' | 'Academic'

export type Work = {
  id: string
  title: string
  /** Short name for chips and small labels. */
  short: string
  category: string
  description: string
  image: string
  /** Extra screenshots, first one included. Defaults to [image]. */
  images?: string[]
  live?: string
  github?: string
  tags: string[]
  logos: string[]
  status: WorkStatus
  /** Brand-external accent for the case-study card. */
  accent: string
}

const I = (n: string) => `/icons/tech/${n}.svg`

export const work: Work[] = [
  {
    id: 'ka-buksuan',
    title: 'Ka-Buksuan - Anonymous Video Chat for BukSU Students',
    short: 'Ka-Buksuan',
    category: 'Real-time web app',
    description:
      'Developed a real-time random video and text chat platform for Bukidnon State University students, with interest-based and same-college matching, peer-to-peer WebRTC video, and built-in moderation through user reports, bans, and rate limiting.',
    image: '/projects/ka-buksuans.webp',
    images: ['/projects/ka-buksuans.webp', '/projects/chat2.webp', '/projects/chat3.webp', '/projects/chat4.webp'],
    live: 'https://ka-buksuans.onrender.com/',
    tags: ['Node.js', 'Express', 'Socket.IO', 'WebRTC', 'Supabase'],
    logos: [I('nodejs'), I('socketio'), I('webrtc'), I('supabase')],
    status: 'Live',
    accent: '#7C3AED',
  },
  {
    id: 'paymonitor',
    title: 'PayMonitor - Multi-Tenant Lending SaaS',
    short: 'PayMonitor',
    category: 'SaaS platform',
    description:
      'Developed a multi-tenant lending and payment monitoring SaaS platform for cooperatives and small lending institutions with automated ledger calculations, payment tracking, and analytics.',
    image: '/projects/paymonitor.webp',
    github: 'https://github.com/ToffDarell/PayMonitor',
    tags: ['Laravel', 'MySQL', 'Tailwind CSS', 'Alpine.js', 'Multi-Tenancy'],
    logos: [I('laravel'), I('mysql'), I('tailwindcss'), I('alpinejs')],
    status: 'Shipped',
    accent: '#FF2D20',
  },
  {
    id: 'saferide',
    title: 'SafeRide - AI Helmet & License Plate Detection',
    short: 'SafeRide',
    category: 'AI / Computer vision',
    description:
      'Developed an AI-powered safety and violation detection system using YOLO, Python, and OpenCV to recognize helmet usage and capture license plates in real-time for traffic monitoring.',
    image: '/projects/saferide.webp',
    github: 'https://github.com/ToffDarell/SAFERIDEWEB',
    tags: ['YOLOv8', 'Python', 'OpenCV', 'PyTorch', 'Flask'],
    logos: [I('python'), I('pytorch'), I('opencv'), I('flask')],
    status: 'Shipped',
    accent: '#EE4C2C',
  },
  {
    id: 'cpag',
    title: 'CPAG - Graduate Research Archive & Monitoring System',
    short: 'CPAG',
    category: 'MERN stack',
    description:
      'Built a MERN stack academic research archive and document tracking platform for organizing, archiving, and monitoring masteral research documents and student progress.',
    image: '/projects/cpag.webp',
    github: 'https://github.com/ToffDarell/CPAG-Graduates-Research-Monitoring-System',
    tags: ['MongoDB', 'Express', 'React', 'Node.js', 'MERN'],
    logos: [I('mongodb'), I('express'), I('react'), I('nodejs')],
    status: 'Shipped',
    accent: '#47A248',
  },
  {
    id: 'mugna',
    title: 'Mugna Arts - Handcrafted Leather E-Commerce',
    short: 'Mugna Arts',
    category: 'E-commerce',
    description:
      'Designed and built a modern e-commerce storefront for handcrafted leather goods featuring dynamic product catalogs, seamless shopping cart, and custom order requests.',
    image: '/projects/mugna.webp',
    github: 'https://github.com/ToffDarell/-Mugna-Leather-Arts',
    tags: ['Laravel', 'React', 'Tailwind CSS', 'MySQL'],
    logos: [I('laravel'), I('react'), I('tailwindcss'), I('mysql')],
    status: 'Shipped',
    accent: '#A16207',
  },
  {
    id: 'blackout',
    title: 'Blackout Esports - Lounge & Reservation System',
    short: 'Blackout Esports',
    category: 'Web application',
    description:
      'Engineered a computer reservation and lounge management system featuring QR-based check-ins, automated time billing, and integrated digital payment collection.',
    image: '/projects/blackout.webp',
    github: 'https://github.com/ToffDarell/BLACKOUTESPORTS',
    tags: ['PHP', 'MySQL', 'JavaScript', 'QR Booking'],
    logos: [I('php'), I('mysql'), I('javascript')],
    status: 'Shipped',
    accent: '#18181B',
  },
  {
    id: 'barangay',
    title: 'Smart Barangay - Resident & Digital Services System',
    short: 'Smart Barangay',
    category: 'Government system',
    description:
      'Developed a local government digital services portal for resident records management, official document requests, clearance issuance, and community announcements.',
    image: '/projects/barangay.webp',
    github: 'https://github.com/ToffDarell/Barangay-Smart-Services',
    tags: ['Laravel', 'MySQL', 'Alpine.js', 'Tailwind CSS'],
    logos: [I('laravel'), I('mysql'), I('alpinejs'), I('tailwindcss')],
    status: 'Shipped',
    accent: '#2563EB',
  },
  {
    id: 'skyfall',
    title: 'Malaybalay Skyfall - 2D Java Arcade Game',
    short: 'Malaybalay Skyfall',
    category: 'Game development',
    description:
      'Created an exciting 2D arcade game built from scratch in Java featuring custom pixel graphics, physics calculations, collision detection, and high-score tracking.',
    image: '/projects/skyfall.webp',
    github: 'https://github.com/ToffDarell/DODGING-BIRD-GAME',
    tags: ['Java', 'OOP', 'Custom Engine', '2D Physics'],
    logos: [I('java')],
    status: 'Academic',
    accent: '#0EA5E9',
  },
  {
    id: 'homeroom',
    title: 'Homeroom Management - Data Structures in C',
    short: 'Homeroom',
    category: 'Systems software',
    description:
      'Developed a high-performance student and classroom management system built completely in C language utilizing file handling, dynamic memory, and linked list data structures.',
    image: '/projects/homeroom.webp',
    github: 'https://github.com/ToffDarell/Homeroom-Management-System',
    tags: ['C Language', 'Data Structures', 'File I/O', 'Memory Allocation'],
    logos: [I('c')],
    status: 'Academic',
    accent: '#5C6BC0',
  },
]

export const workById = (id: string) => work.find((w) => w.id === id)

/** Every screenshot, in project order - the strip and the Home reel. */
export const allShots = work.flatMap((w) => (w.images ?? [w.image]).map((src) => ({ src, label: w.short })))

export const GITHUB_REPOS = 'https://github.com/ToffDarell?tab=repositories'
