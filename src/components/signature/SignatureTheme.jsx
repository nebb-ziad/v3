import { useEffect, useState } from 'react'
import Nav from './Nav.jsx'
import Hero from './Hero.jsx'
import AboutHub from './AboutHub.jsx'
import Experience from './Experience.jsx'
import RecentWorks from './RecentWorks.jsx'
import Footer from './Footer.jsx'
import AboutPage from './pages/Aboutpage.jsx'
import WorksPage from './pages/Workspage.jsx'
import SocialsPage from './pages/Socialspage.jsx'
import { useMode } from '../../lib/ModeContext.jsx'

// Each "Learn more" card / nav link dispatches markineb:navigate with one of
// these keys (or 'home') instead of just scrolling to a tab anymore.
const PAGES = { about: AboutPage, works: WorksPage, social: SocialsPage }

// Pages that render their own closing (own hero/footer-like ending) and
// therefore skip the shared global Footer below.
const HIDE_GLOBAL_FOOTER = ['about', 'works', 'social']

export default function SignatureTheme({ onOpenBookMeeting }) {
  const { dark, setDark } = useMode()
  const [page, setPage] = useState(null) // null = home

  useEffect(() => {
    const onNavigate = (e) => {
      setPage(e.detail === 'home' ? null : e.detail)
      // Instant scroll reset via Lenis without fighting layout
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true })
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
      }
    }
    window.addEventListener('markineb:navigate', onNavigate)
    return () => window.removeEventListener('markineb:navigate', onNavigate)
  }, [])

  const PageComp = page && PAGES[page]

  return (
    <>
      <Nav dark={dark} setDark={setDark} />
      <main key={page || 'home'} className="animate-[fadeIn_0.45s_cubic-bezier(0.16,1,0.3,1)]">
        {PageComp ? (
          <PageComp onBack={() => {
            setPage(null)
            if (window.__lenis) {
              window.__lenis.scrollTo(0, { immediate: true })
            } else {
              window.scrollTo({ top: 0 })
            }
          }} />
        ) : (
          <>
            <Hero onOpenBookMeeting={onOpenBookMeeting} />
            <AboutHub />
            <Experience />
            <RecentWorks />
          </>
        )}
      </main>
      {/* About and Works pages have their own closing — no global footer there */}
      {!HIDE_GLOBAL_FOOTER.includes(page) && <Footer onOpenBookMeeting={onOpenBookMeeting} />}
    </>
  )
}