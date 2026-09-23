// ---------------------------------------------------------------------------
// Portfolio data — consumed by WorksTab.jsx via:
//   import { WORKS, CERTIFICATES } from '../../../lib/worksData.js'
//
// Drop this file in your `lib/` folder (adjust the path above if yours
// differs). Put project/cert screenshots in an `assets/` folder and import
// them the same way `worksBg` is imported in WorksPage.jsx.
// ---------------------------------------------------------------------------

// --- Image imports -----------------------------------------------------
// Adjust this path to wherever you actually place the file.
import campusparkImg from '../assets/works/campuspark.png'
import certImg from '../assets/works/html-fundamentals-certificate.png'

// --- Projects ------------------------------------------------------------
export const WORKS = [
  {
    id: 'campuspark',
    title: 'CampusPark',
    category: 'Web App',
    highlight: false,
    tags: ['Smart Parking', 'Dashboard', 'Real-time'], // TODO: adjust to actual stack (e.g. Next.js, Tailwind CSS, etc.)
    live: '', // TODO: paste the live CampusPark URL
    repo: '', // TODO: paste the GitHub repo URL, if public
    image: campusparkImg,
    fullTitle: 'CampusPark — Smart Campus Parking Management',
  },
]

// --- Certificates ----------------------------------------------------------
export const CERTIFICATES = [
  {
    id: 'html-fundamentals',
    title: 'HTML Fundamentals',
    issuer: 'CodeCred',
    year: '2026',
    tags: ['HTML5', 'Semantic Markup', 'Forms', 'Accessibility'],
    file: 'https://drive.google.com/file/d/15mLTlq19b84V4Bge9PSIMBdWFadsajPU/view?usp=sharing',
    image: certImg, // walang preview image ang cert na ito, so fallback icon lang ang lalabas
    fullTitle: 'HTML Fundamentals — 96% Final Score',
  },
]