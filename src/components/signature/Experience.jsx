import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../../hooks/useReveal.js'
import { EXPERIENCE } from '../../lib/portfolioData.js'

// Tracks how far the page has scrolled past the timeline line directly via DOM ref & scaleY transform.
// Zero React re-renders during scroll, and zero layout reflows (transform vs height).
function useProgressLine() {
  const containerRef = useRef(null)
  const fillRef = useRef(null)

  useEffect(() => {
    const el = containerRef.current
    const fill = fillRef.current
    if (!el || !fill) return
    let ticking = false

    const measure = () => {
      const rect = el.getBoundingClientRect()
      const trigger = window.innerHeight * 0.55
      const raw = Math.min(1, Math.max(0, (trigger - rect.top) / (rect.height || 1)))
      fill.style.transform = `scaleY(${raw})`
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(measure)
    }

    measure()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return [containerRef, fillRef]
}

// The line itself: a muted base track with an accent-colored fill that
// scales vertically on the GPU (scaleY) as the user scrolls past it.
function TimelineLine({ containerRef, fillRef, className = '' }) {
  return (
    <div ref={containerRef} className={`w-px bg-ink-950/15 dark:bg-paper-100/18 overflow-hidden ${className}`}>
      <div
        ref={fillRef}
        className="w-px h-full bg-signal-500 origin-top will-change-transform"
        style={{ transform: 'scaleY(0)', transition: 'transform 0.12s cubic-bezier(0.16, 1, 0.3, 1)' }}
      />
    </div>
  )
}

function Content({ item, align = 'left' }) {
  return (
    <div className={align === 'right' ? 'sm:text-right' : ''}>
      <p className="font-mono text-xs uppercase tracking-widest2 text-signal-500 mb-1.5">{item.year}</p>
      <h3 className="font-display text-xl sm:text-2xl mb-1">{item.title}</h3>
      <p className="text-sm text-ink-950/50 dark:text-paper-100/50 mb-3">{item.org}</p>
      <p className={`text-ink-950/72 dark:text-paper-100/72 leading-relaxed ${align === 'right' ? 'sm:ml-auto' : ''} max-w-xl`}>
        {item.desc}
      </p>
      {item.tags?.length > 0 && (
        <div className={`mt-4 flex flex-wrap gap-2 ${align === 'right' ? 'sm:justify-end' : ''}`}>
          {item.tags.map((t) => (
            <span key={t} className="text-xs px-3 py-1 rounded-full border border-ink-950/12 dark:border-paper-100/15 text-ink-950/60 dark:text-paper-100/60">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

// Simple left-rail layout for narrow screens — a centered alternating
// timeline doesn't have room to breathe below the sm breakpoint.
function MobileItem({ item }) {
  const [ref, visible] = useReveal(0.15)
  return (
    <div ref={ref} className={`relative pl-9 pb-12 last:pb-0 transition-all duration-700 ease-out-expo ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
      <span className={`absolute left-0 top-1 h-3 w-3 rounded-full border-2 transition-all duration-500 ease-out-expo ${item.current ? 'border-signal-500 bg-signal-500 shadow-[0_0_12px_rgba(61,99,255,0.6)]' : 'border-ink-950/40 dark:border-paper-100/40 bg-paper-50 dark:bg-ink-950'}`} />
      <Content item={item} />
    </div>
  )
}

// Centered, alternating layout for sm and up — content fades in from the
// side it sits on as it enters the viewport, and the dot pops in on the line.
function DesktopItem({ item, index }) {
  const [ref, visible] = useReveal(0.2)
  const isLeft = index % 2 === 0

  return (
    <div ref={ref} className="relative grid grid-cols-[1fr_auto_1fr] gap-x-10 pb-16 last:pb-0">
      <div className={`transition-all duration-700 ease-out-expo ${isLeft ? (visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10') : ''}`}>
        {isLeft && <Content item={item} align="right" />}
      </div>

      <span
        className={`relative top-1 h-3 w-3 rounded-full border-2 transition-transform duration-500 ease-spring ${visible ? 'scale-100' : 'scale-0'} ${
          item.current ? 'border-signal-500 bg-signal-500 shadow-[0_0_12px_rgba(61,99,255,0.6)]' : 'border-ink-950/40 dark:border-paper-100/40 bg-paper-50 dark:bg-ink-950'
        }`}
      />

      <div className={`transition-all duration-700 ease-out-expo ${!isLeft ? (visible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10') : ''}`}>
        {!isLeft && <Content item={item} />}
      </div>
    </div>
  )
}

export default function Experience() {
  const [headerRef, headerVisible] = useReveal(0.2)
  const [mobileLineRef, mobileFillRef] = useProgressLine()
  const [desktopLineRef, desktopFillRef] = useProgressLine()

  return (
    <section id="experience" className="py-24 sm:py-32 content-auto">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <div
          ref={headerRef}
          className={`text-center max-w-lg mx-auto mb-16 transition-all duration-700 ease-out-expo ${
            headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="font-mono text-xs uppercase tracking-widest3 text-signal-500 mb-3 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-signal-500" /> Milestones so far <span className="h-px w-8 bg-signal-500" />
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-tight mb-4">Experience</h2>
          <p className="text-ink-950/60 dark:text-paper-100/60">
            Early in the journey — this list grows as the work does.
          </p>
        </div>

        {/* Mobile: left-rail timeline, line fills in as you scroll */}
        <div className="sm:hidden relative max-w-2xl mx-auto">
          <TimelineLine containerRef={mobileLineRef} fillRef={mobileFillRef} className="absolute left-0 top-0 bottom-0" />
          {EXPERIENCE.map((item) => (
            <MobileItem key={item.id} item={item} />
          ))}
        </div>

        {/* Desktop: centered, alternating timeline, line fills in as you scroll */}
        <div className="hidden sm:block relative max-w-3xl mx-auto">
          <TimelineLine containerRef={desktopLineRef} fillRef={desktopFillRef} className="absolute left-1/2 -translate-x-1/2 top-2 bottom-2" />
          {EXPERIENCE.map((item, i) => (
            <DesktopItem key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}