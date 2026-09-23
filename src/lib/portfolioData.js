// ============================================================================
// SINGLE SOURCE OF TRUTH
// Add a new project, cert, timeline entry, or social by pushing a new object
// into the matching array below — every theme (Signature / Minimalist /
// Legacy) and every tab reads from this same file, so nothing gets out of
// sync and the layout never breaks from adding one more entry.
// ============================================================================

export const PROFILE = {
  name: 'Benmark Diaz',
  handle: 'markineb.dev',
  role: 'Front-End Developer',
  study: 'College BSIT Student',
  school: 'Granby Colleges of Science and Technology',
  location: 'Philippines',
  avatar: '/images/profile.png',
  email: 'diazbenmark10@gmail.com',
  phone: '+63 994 646 1102',
  tagline: 'Building Interfaces That Stand Out',
  heroSummary:
    'I Am Benmark Diaz is a 3rd Year BSIT Student and Front-End Developer who transforms ideas into fast, accessible, interactive, and visually refined digital experiences.',
  minimalSummary:
    'I build clean web design that feels premium and turns ideas into fast, accessible, visually refined web experiences.',
  availability: 'Available for OJT',
  resume: '/documents/Benmark-Diaz-CV.pdf',
}

// Add another quote any time — the About tab lays these out as a wall,
// so any count looks intentional.
export const DEV_QUOTES = [
  { quote: 'HTML builds it. CSS breaks it. JavaScript blames everyone.', author: 'Benmark Diaz', role: 'Isang walang bitaw' },
  { quote: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds', role: 'Creator of Linux & Git' },
  { quote: 'First, solve the problem. Then, write the code.', author: 'John Johnson', role: 'Software Developer' },
  { quote: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman', role: 'Software Developer' },
  { quote: 'Code is like humor. When you have to explain it, it’s bad.', author: 'Cory House', role: 'Software Consultant & Speaker' },
  { quote: 'Make it work, make it right, make it fast.', author: 'Kent Beck', role: 'Creator of Extreme Programming' },
]

// Push a new entry with a higher `year` — timelines auto-sort, newest first.
export const EXPERIENCE = [
  {
    id: 'bsit-3rd-year',
    year: '2026 — Present',
    title: 'BSIT — 3rd Year Student',
    org: 'Granby Colleges of Science and Technology',
    desc: 'Building responsive websites, landing pages, and school systems focused on premium UI and smooth user experience, while deepening front-end fundamentals.',
    tags: ['Front-End Development', 'UI/UX Design'],
    current: true,
  },
  {
    id: 'front-end-journey',
    year: '2024 — 2025',
    title: 'Began the Front-End Journey',
    org: 'Self-Directed',
    desc: 'Developed personal projects while mastering HTML, CSS, JavaScript, and responsive layouts.',
    tags: ['HTML', 'CSS', 'JavaScript'],
  },
  {
    id: 'learning-to-code',
    year: '2023 — 2024',
    title: 'Started Learning to Code',
    org: 'Self-Directed',
    desc: 'Discovered a passion for programming and began exploring the fundamentals of web development.',
    tags: ['Fundamentals'],
  },
  {
    id: 'enrolled-bsit',
    year: '2023',
    title: 'Enrolled in BSIT',
    org: 'Granby Colleges of Science and Technology',
    desc: 'Started the Information Technology journey, discovering an early interest in software engineering and interface design.',
    tags: ['Education'],
  },
]

// Projects — set `type: 'certificate'` vs `type: 'project'` so Works tab
// can separate them automatically without any manual grouping.
export const WORKS = [
  {
    id: 'campus-parking',
    type: 'project',
    title: 'CampusPark',
    fullTitle: 'Campus Parking and Monitoring System',
    category: 'School Project',
    status: 'In Development',
    year: '2026',
    desc: 'A system designed to streamline campus parking through real-time monitoring, clean dashboards, and an accessible, responsive interface for staff and students.',
    tags: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'],
    image: '/images/campuspark.png',
    gallery: ['/images/ss1.png', '/images/ss2.png', '/images/ss3.png'],
    live: 'http://localhost/campus_parking/php/welcome.php',
    repo: 'https://github.com/Mentaikotrash',
  },
  // Add your next project here — same shape as above.
]

export const CERTIFICATES = [
  // Add certificates here as you earn them, e.g.:
  // { id: 'cert-slug', title: 'Certificate Name', issuer: 'Issuer', year: '2026', file: '/documents/cert.pdf' },
]

export const VISUALS = [
  // UI concepts / design shots — image + short caption.
  // { id: 'concept-1', image: '/images/concept-1.png', caption: 'Dashboard concept' },
]

export const SOCIALS = [
  { key: 'facebook', label: 'Facebook', href: 'https://www.facebook.com/share/1D6zEun9Jo/', handle: '@benmarkdiaz' },
  { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/_zxcvben', handle: '@_zxcvben' },
  { key: 'github', label: 'GitHub', href: 'https://github.com/markineb', handle: 'markineb' },
  { key: 'costar', label: 'Co-Star', href: 'costarastrology.com/howl_skii', handle: '@howl_skii' },
  { key: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/benmark-diaz-563b113a5/', handle: '@benmarkdiaz' },
  { key: 'telegram', label: 'Telegram', href: 't.me/howl_skii', handle: '@howl_skii' },
  { key: 'x', label: 'X', href: 'https://x.com/BenmarkDiz', handle: '@BenmarkDiz' },
  { key: 'spotify', label: 'Spotify', href: 'https://open.spotify.com/user/31rhyotqepcitpf64b5iwmhsihbi', handle: 'markineb' },
]

// Stack — `usage: 'daily' | 'occasional'` drives the grouping in the
// Minimalist theme's Stack section.
export const STACK = {
  Frontend: [
    { name: 'HTML5', usage: 'daily' },
    { name: 'CSS3', usage: 'daily' },
    { name: 'JavaScript', usage: 'daily' },
    { name: 'React', usage: 'daily' },
    { name: 'Tailwind CSS', usage: 'daily' },
    { name: 'Next.js', usage: 'occasional' },
    { name: 'TypeScript', usage: 'occasional' },
  ],
  Backend: [
    { name: 'PHP', usage: 'daily' },
    { name: 'MySQL', usage: 'daily' },
    { name: 'PostgreSQL', usage: 'daily' },
    { name: 'Node.js', usage: 'occasional' },
    { name: 'Express.js', usage: 'occasional' },
    { name: 'MongoDB', usage: 'occasional' },
    { name: 'Laravel', usage: 'occasional' },
  ],
  'AI & Agents': [
    { name: 'Claude', usage: 'daily' },
    { name: 'ChatGPT', usage: 'daily' },
  ],
  'Dev Tools': [
    { name: 'VS Code', usage: 'daily' },
    { name: 'Git / GitHub', usage: 'daily' },
    { name: 'Vite', usage: 'daily' },
    { name: 'Figma', usage: 'occasional' },
  ],
}
