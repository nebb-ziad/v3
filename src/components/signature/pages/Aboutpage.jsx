import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import AboutTab from '../tabs/AboutTab.jsx'
import aboutHero from '../../../assets/about-hero-4.png'

// Same top-level page-swap event AboutHub.jsx / Nav.jsx / SocialsPage.jsx use —
// SignatureTheme listens for this and swaps in the matching page.
function goTo(page) {
  window.dispatchEvent(new CustomEvent('markineb:navigate', { detail: page }))
}

export default function AboutPage({ onBack }) {
  return (
    <section className="min-h-screen">
      {/* Hero — full-bleed background photo, dark gradient for legibility.
          Sized to its content (not a fixed vh) so the tagline/buttons never
          get clipped by overflow-hidden as the copy grows. */}
      <div className="relative w-full overflow-hidden">
        <img
          src={aboutHero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/75 to-ink-950/25" />
        <div className="absolute inset-0 bg-ink-950/15" />

        <div className="relative mx-auto max-w-[1200px] px-6 sm:px-8 pt-28 sm:pt-36 pb-8 sm:pb-10">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest2 text-paper-50/70 hover:text-signal-500 transition-colors mb-8 w-fit"
          >
            <ArrowLeft size={14} /> Back home
          </button>

          <p className="font-mono text-xs uppercase tracking-widest3 text-signal-500 mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-signal-500" /> About Me
          </p>
          <h1 className="font-display text-4xl sm:text-6xl font-medium tracking-tight text-paper-50">
            Benmark Diaz
          </h1>

          <p className="mt-4 max-w-md text-sm sm:text-base text-paper-50/65">
            From complex ideas to simple, usable digital experiences.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => goTo('social')}
              className="inline-flex items-center gap-2 text-sm font-medium border border-paper-100/15 rounded-xl px-4 py-2.5 text-paper-100 hover:border-signal-500 hover:text-signal-500 transition-colors"
            >
              Socials <ArrowUpRight size={14} />
            </button>
            <button
              onClick={() => goTo('works')}
              className="inline-flex items-center gap-2 text-sm font-medium border border-paper-100/15 rounded-xl px-4 py-2.5 text-paper-100 hover:border-signal-500 hover:text-signal-500 transition-colors"
            >
              Works <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 pt-4 sm:pt-6 pb-24 sm:pb-32">
        <AboutTab />
      </div>
    </section>
  )
}