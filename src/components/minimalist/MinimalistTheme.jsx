import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import { useMode } from '../../lib/ModeContext.jsx'
import MinimalistHeader from './MinimalistHeader.jsx'
import MinimalistIntro from './MinimalistIntro.jsx'
import MinimalistWork from './MinimalistWork.jsx'
import MinimalistExperience from './MinimalistExperience.jsx'
import MinimalistStack from './MinimalistStack.jsx'
import MinimalistFooter from './MinimalistFooter.jsx'
import MinimalistPolkaDots from './MinimalistPolkaDots.jsx'

// Desktop: the whole viewport is locked to h-screen/overflow-hidden, and
// only <main> gets its own overflow-y-auto — so the sidebar truly never
// moves and the right column is the only thing that scrolls. On mobile
// there's no room for a split pane, so it falls back to normal stacked
// scrolling for the whole page.
export default function MinimalistTheme() {
  const { dark, setDark } = useMode()
  const mainRef = useRef(null)
  const contentRef = useRef(null)

  // Buttery momentum scroll for the right column, desktop only — mobile
  // already gets smooth native touch scrolling, and there's no separate
  // scroll wrapper there since the layout just stacks below `lg`.
  // The instance is stashed on window so Nav.jsx can drive the same
  // eased scroll when jumping to a section, instead of a plain jump.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    let lenis
    let rafId

    const setup = () => {
      if (lenis) { lenis.destroy(); lenis = null; window.__lenis = null }
      if (rafId) cancelAnimationFrame(rafId)
      if (!mq.matches || !mainRef.current || !contentRef.current) return

      lenis = new Lenis({
        wrapper: mainRef.current,
        content: contentRef.current,
        duration: 1.1,
        smoothWheel: true,
        touchMultiplier: 1.1,
      })
      window.__lenis = lenis

      const raf = (time) => {
        lenis.raf(time)
        rafId = requestAnimationFrame(raf)
      }
      rafId = requestAnimationFrame(raf)
    }

    setup()
    mq.addEventListener('change', setup)
    return () => {
      mq.removeEventListener('change', setup)
      if (lenis) lenis.destroy()
      if (rafId) cancelAnimationFrame(rafId)
      window.__lenis = null
    }
  }, [])

  return (
    <div className="relative min-h-screen lg:h-screen lg:overflow-hidden overscroll-none scroll-smooth bg-paper-50 dark:bg-ink-950">
      <style>{`
        .minimalist-scroll::-webkit-scrollbar { display: none; }
        .minimalist-scroll { scrollbar-width: none; -ms-overflow-style: none; }
      `}</style>

      <MinimalistPolkaDots />

      <div className="relative z-10 mx-auto max-w-[1200px] px-6 sm:px-10 lg:h-full lg:grid lg:grid-cols-[300px_1fr] lg:gap-16">
        <aside className="pt-10 sm:pt-16 lg:pt-16 lg:h-full lg:flex lg:flex-col lg:justify-start">
          <MinimalistHeader />
          <MinimalistIntro dark={dark} setDark={setDark} />
        </aside>

        <main
          ref={mainRef}
          className="minimalist-scroll overscroll-none lg:h-full lg:overflow-y-auto lg:py-16"
        >
          <div ref={contentRef}>
            <MinimalistWork />
            <MinimalistExperience />
            <MinimalistStack />
            <MinimalistFooter />
          </div>
        </main>
      </div>
    </div>
  )
}