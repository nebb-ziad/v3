// Data for the "Recent Works" strip on the homepage only.
// This is intentionally separate from lib/portfolioData.js (the full Works
// page) so the homepage can show a hand-picked, differently-curated set
// without touching the Works page data.
//
// WHERE TO PUT YOUR IMAGES:
// Drop image files into: public/images/recent-works/
// Then reference them below as '/images/recent-works/your-file.png'
// (no "public" in the path — anything in /public is served from the root).
//
// If an entry has no `image` (or the path is wrong / file missing), the
// card automatically falls back to the black/white/blue "Preview coming
// soon" placeholder — no crash, nothing extra to configure.

export const RECENT_WORKS = [
  {
    id: 'campus-park',
    title: 'CampusPark',
    category: 'School Project',
    image: '/images/campuspark.png',
  },
  {
    id: 'project-2',
    title: 'Project Title',
    category: 'Category',
  },
  {
    id: 'project-3',
    title: 'Project Title',
    category: 'Category',
  },
  {
    id: 'project-4',
    title: 'Project Title',
    category: 'Category',
  },
  {
    id: 'project-5',
    title: 'Project Title',
    category: 'Category',
  },
  {
    id: 'project-6',
    title: 'Project Title',
    category: 'Category',
  },
  {
    id: 'project-7',
    title: 'Project Title',
    category: 'Category',
  },
  {
    id: 'project-8',
    title: 'Project Title',
    category: 'Category',
  },
]
