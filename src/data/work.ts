/**
 * The builds. One record per project, and the only place project copy lives:
 * the Projects view, the 3D reel, the case-study cards, the screenshot strip
 * and Home's chips all read from here.
 *
 * Screenshots live in public/projects/. `logos` are marks from public/icons.
 */

export type WorkStatus = 'Live' | 'Client' | 'Capstone' | 'Academic' | 'Proposed'

export type Work = {
  id: string
  title: string
  /** Short name for chips and small labels. */
  short: string
  category: string
  description: string
  /** Main screenshot. Omit for a text-only build: it gets a case card but
   *  stays out of the reel and the screenshot strips. */
  image?: string
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
    status: 'Academic',
    accent: '#FF2D20',
  },
  {
    id: 'saferide',
    title: 'SafeRide - AI Helmet & License Plate Detection',
    short: 'SafeRide',
    category: 'AI / Computer vision',
    description:
      'Built a real-time CCTV-based system that detects motorcycle helmet violations and recognizes license plates using YOLOv11 and OpenCV, with a Django REST backend and a React + TypeScript frontend for live monitoring and violation log management.',
    image: '/projects/saferide.webp',
    github: 'https://github.com/ToffDarell/SAFERIDEWEB',
    tags: ['YOLOv11', 'OpenCV', 'PyTorch', 'Django REST', 'React + TypeScript'],
    logos: [I('python'), I('pytorch'), I('opencv'), I('django'), I('react'), I('typescript')],
    status: 'Capstone',
    accent: '#EE4C2C',
  },
  {
    id: 'cpag',
    title: 'CPAG - Graduate Research Archive & Monitoring System',
    short: 'CPAG Research Archive',
    category: 'MERN stack',
    description:
      'Built a MERN stack academic research archive and document tracking platform for organizing, archiving, and monitoring masteral research documents and student progress.',
    image: '/projects/cpag.webp',
    github: 'https://github.com/ToffDarell/CPAG-Graduates-Research-Monitoring-System',
    tags: ['MongoDB', 'Express', 'React', 'Node.js', 'MERN'],
    logos: [I('mongodb'), I('express'), I('react'), I('nodejs')],
    status: 'Academic',
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
    status: 'Proposed',
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
    status: 'Academic',
    accent: '#18181B',
  },
  {
    id: 'borongan',
    title: 'Borongan City Transit - QR Ticketing & Fee Collection System',
    short: 'Borongan City Transit',
    category: 'Client project',
    description:
      'Developed a municipal transport ticketing and fee collection system that enables passengers to pay fares via QR code scanning, manages digital wallet balances, automates route-based fare calculations, and tracks daily collection logs for transit administrators.',
    image: '/projects/borongan.webp',
    tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    logos: [I('php'), I('mysql'), I('javascript'), I('html5'), I('css3')],
    status: 'Client',
    accent: '#0F766E',
  },
  {
    id: 'barangay',
    title: 'Smart Services for Barangay North Poblacion Residents',
    short: 'Smart Services for Barangay North Poblacion Residents',
    category: 'Government system',
    description:
      'Developed an online document request system for Barangay North Poblacion, where residents can request barangay documents online, such as a Certificate of Residency, Certificate of Indigency, First Time Job Seeker certificate, etc., without having to line up at the barangay hall.',
    image: '/projects/barangay.webp',
    github: 'https://github.com/ToffDarell/Barangay-Smart-Services',
    tags: ['Laravel', 'MySQL', 'Alpine.js', 'Tailwind CSS'],
    logos: [I('laravel'), I('mysql'), I('alpinejs'), I('tailwindcss')],
    status: 'Proposed',
    accent: '#2563EB',
  },
  {
    id: 'jams-gadget',
    title: "Jam's Gadget - Android Inventory App",
    short: "Jam's Gadget",
    category: 'Android app',
    description:
      'Contributed to building an Android inventory management application for a smartphone retail business as part of a three-person development team.',
    tags: ['Java', 'Android Studio'],
    logos: [I('java')],
    status: 'Academic',
    accent: '#3DDC84',
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

/** A build's screenshots, first one included; empty for a text-only build. */
export const shotsOf = (w: Work) => w.images ?? (w.image ? [w.image] : [])

/** Every screenshot, in project order - the strip and the Home reel. */
export const allShots = work.flatMap((w) => shotsOf(w).map((src) => ({ src, label: w.short })))

export const GITHUB_REPOS = 'https://github.com/ToffDarell?tab=repositories'
