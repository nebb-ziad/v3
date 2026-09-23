import { ArrowLeft, Mail, ArrowUpRight } from 'lucide-react'
import SocialTab from '../tabs/SocialTab.jsx'
import { PROFILE } from '../../../lib/portfolioData.js'
// Swap in socials-bg.png (the grayscale app-icon grid) — place it next to
// your other page backgrounds, e.g. src/assets/socials-bg.png
import socialsBg from '../../../assets/socials-bg.png'

// Same top-level page-swap event AboutHub.jsx and Nav.jsx use — SignatureTheme
// listens for this and swaps in AboutPage.
function goToAbout() {
  window.dispatchEvent(new CustomEvent('markineb:navigate', { detail: 'about' }))
}

export default function SocialsPage({ onBack }) {
  return (
    <div className="bg-ink-950">
      {/* ---------------- Hero ---------------- */}
      {/* Sized to its content (no min-h-screen) so the cards below sit right
          under the intro instead of leaving a big empty gap to scroll through. */}
      <section className="relative overflow-hidden pt-28 sm:pt-36 pb-16 sm:pb-20">
        <img
          src={socialsBg}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/10 via-ink-950/70 to-ink-950" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-6 sm:px-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest2 text-paper-100/60 hover:text-signal-500 transition-colors mb-10"
          >
            <ArrowLeft size={14} /> Back home
          </button>

          <p className="font-mono text-xs uppercase tracking-widest3 text-signal-500 mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-signal-500" /> Socials
          </p>
          <h1 className="font-display text-3xl sm:text-5xl font-medium tracking-tight mb-5 text-paper-100">Connect</h1>
          <p className="max-w-xl text-sm sm:text-base text-paper-100/60 mb-8">
            Every place I post, build, and share in public — plus the fastest way to reach me directly if you have something in mind.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href={`mailto:${PROFILE.email}`}
              className="inline-flex items-center gap-2 text-sm font-medium border border-paper-100/15 rounded-xl px-4 py-2.5 text-paper-100 hover:border-signal-500 hover:text-signal-500 transition-colors"
            >
              Email me <Mail size={14} />
            </a>
            <button
              onClick={goToAbout}
              className="inline-flex items-center gap-2 text-sm font-medium border border-paper-100/15 rounded-xl px-4 py-2.5 text-paper-100 hover:border-signal-500 hover:text-signal-500 transition-colors"
            >
              About <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- Content ---------------- */}
      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
          <SocialTab />
        </div>
      </section>
    </div>
  )
}