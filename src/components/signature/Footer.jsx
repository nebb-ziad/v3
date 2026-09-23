import { Mail, Linkedin, ArrowUpRight } from 'lucide-react'
import { PROFILE, SOCIALS } from '../../lib/portfolioData.js'
import { useReveal } from '../../hooks/useReveal.js'

export default function Footer({ onOpenBookMeeting }) {
  const linkedin = SOCIALS.find((s) => s.key === 'linkedin')
  const [ref, visible] = useReveal(0.15)

  return (
    <footer className="relative min-h-screen flex flex-col justify-end pt-24 pb-10 overflow-hidden content-auto">
      {/* Background image */}
      <img
        src="/images/footer-bg.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover gpu-layer"
      />
      {/* Dark overlay so the text stays readable over the photo */}
      <div className="absolute inset-0 bg-ink-950/80" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/70 to-ink-950/40" />
      {/* Fades the top edge of the background image so it doesn't cut in abruptly */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-ink-950 to-transparent" />

      <div ref={ref} className={`relative mx-auto max-w-[1200px] w-full px-6 sm:px-8 transition-all duration-700 ease-out-expo ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <h2 className="font-display text-[clamp(2rem,9vw,3rem)] sm:text-6xl lg:text-7xl font-medium leading-[1.05] sm:leading-tight tracking-tight max-w-3xl text-paper-50">
          Anything I can<br />help with?
        </h2>

        <div className="mt-10 flex flex-wrap gap-3 sm:gap-4">
          <button
            onClick={onOpenBookMeeting}
            className="inline-flex items-center justify-center gap-2 min-h-[46px] bg-signal-500 text-ink-950 px-7 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest2 hover:shadow-[0_0_25px_rgba(61,99,255,0.4)] active:scale-95 transition-all duration-300 ease-out-expo cursor-pointer"
          >
            Book a Meeting <ArrowUpRight size={14} className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-1" />
          </button>
          <a href={`mailto:${PROFILE.email}`} className="inline-flex items-center justify-center gap-2 min-h-[46px] border border-paper-100/20 text-paper-50 px-6 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest2 hover:border-signal-500 hover:text-signal-500 hover:shadow-[0_0_15px_rgba(61,99,255,0.25)] active:scale-95 transition-all duration-300 ease-out-expo cursor-pointer">
            <Mail size={14} /> {PROFILE.email}
          </a>
          <a href={linkedin?.href || '#'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 min-h-[46px] border border-paper-100/20 text-paper-50 px-6 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest2 hover:border-signal-500 hover:text-signal-500 hover:shadow-[0_0_15px_rgba(61,99,255,0.25)] active:scale-95 transition-all duration-300 ease-out-expo cursor-pointer">
            <Linkedin size={14} /> LinkedIn
          </a>
        </div>

        <div className="mt-20 flex items-center justify-end flex-wrap gap-4 pt-8 border-t border-paper-100/10">
          <p className="text-xs text-paper-100/45">
            © {new Date().getFullYear()} {PROFILE.name} — {PROFILE.handle}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}