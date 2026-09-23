import { useEffect, useState } from 'react'
import { ArrowDown, ArrowUpRight, Calendar, FileText } from 'lucide-react'
import { useReveal } from '../../hooks/useReveal.js'
import { PROFILE } from '../../lib/portfolioData.js'

// Words that rotate in place of "Stand Out." — all stacked in the same
// grid cell so the box sizes to the widest word and nothing ever jumps.
const ROTATING_WORDS = ['Stand Out.', 'Feel Different.', 'Come Alive.', 'Tell a Story.', 'Get Noticed.']

function RotatingWord() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % ROTATING_WORDS.length)
    }, 2600)
    return () => clearInterval(id)
  }, [])

  return (
    <span className="inline-grid align-baseline">
      {ROTATING_WORDS.map((word, i) => (
        <span
          key={word}
          aria-hidden={i !== index}
          className={`[grid-area:1/1] whitespace-nowrap italic text-signal-500 decoration-1 underline-offset-8 transition-all duration-700 ease-out-expo motion-reduce:transition-none ${
            i === index ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3 pointer-events-none'
          }`}
        >
          {word}
        </span>
      ))}
    </span>
  )
}

export default function Hero({ onOpenBookMeeting }) {
  const [ref, visible] = useReveal(0.05)
  const fade = () =>
    `transition-all duration-1000 ease-out-expo ${
      visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-[0.98]'
    }`

  const goAbout = () => {
    const el = document.getElementById('about-hub')
    if (window.__lenis) {
      window.__lenis.scrollTo(el, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    } else {
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="signature" className="relative min-h-[92vh] flex flex-col justify-center pt-20 pb-16 overflow-hidden signal-glow">
      <img
        src="/images/herobg.png"
        alt=""
        className="hero-grid-bg pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60 dark:opacity-90 gpu-layer"
      />

      <div className="pointer-events-none absolute left-1/4 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-signal-500/15 blur-[120px] animate-glowPulse gpu-layer" />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-paper-50 dark:to-ink-950" />

      <div ref={ref} className="relative mx-auto max-w-[1200px] w-full px-6 sm:px-8">
        <p style={{ transitionDelay: '0ms' }} className={`${fade()} font-mono text-xs uppercase tracking-widest3 text-signal-500 mb-6 flex items-center justify-center sm:justify-start gap-3`}>
          <span className="h-px w-8 bg-signal-500" />
          Main
        </p>

        <h1
          style={{ transitionDelay: '100ms' }}
          className={`${fade()} font-display font-medium leading-[1.02] sm:leading-[0.98] tracking-tight text-[clamp(2.4rem,11vw,3.75rem)] sm:text-[8vw] lg:text-[5.4vw] max-w-4xl text-center sm:text-left`}
        >
          Building Interfaces
          <br />
          That <RotatingWord />
        </h1>

        <p
          style={{ transitionDelay: '220ms' }}
          className={`${fade()} mt-8 max-w-xl text-base sm:text-lg text-ink-950/75 dark:text-paper-100/75 leading-relaxed text-center sm:text-left mx-auto sm:mx-0`}
        >
          {PROFILE.heroSummary}
        </p>

        <div style={{ transitionDelay: '340ms' }} className={`${fade()} mt-10 flex flex-wrap items-center justify-center sm:justify-start gap-4`}>
          {/* Resume button */}

          {/* Book a Meeting button */}
          <button
            onClick={onOpenBookMeeting}
            className="group relative inline-flex items-center justify-center gap-2.5 min-h-[48px] px-7 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest2 text-white bg-signal-500 hover:bg-signal-600 shadow-[0_0_20px_rgba(61,99,255,0.4)] hover:shadow-[0_0_30px_rgba(61,99,255,0.65)] hover:scale-[1.02] active:scale-95 transition-all duration-300 ease-out-expo cursor-pointer overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            <Calendar size={15} className="transition-transform duration-300 group-hover:scale-110" />
            <span>Book a Meeting</span>
            <ArrowUpRight size={14} className="transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>

      <button
        onClick={goAbout}
        aria-label="Scroll to About"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 h-11 w-11 rounded-full border border-ink-950/15 dark:border-paper-100/18 flex items-center justify-center animate-floatSlow hover:border-signal-500 hover:text-signal-500 hover:shadow-[0_0_15px_rgba(61,99,255,0.3)] active:scale-95 transition-all duration-300 ease-out-expo cursor-pointer"
      >
        <ArrowDown size={14} />
      </button>
    </section>
  )
}