import ThemeToggle from '../global/ThemeToggle.jsx'
import { PROFILE, SOCIALS } from '../../lib/portfolioData.js'

// Rest of the sidebar: bio, availability status, email, quick social
// links, and the theme toggle — everything below the name/photo block.
export default function MinimalistIntro({ dark, setDark }) {
  return (
    <div className="mt-6">
      <p className="text-[15px] text-ink-950/72 dark:text-paper-100/72 leading-relaxed max-w-sm">
        {PROFILE.minimalSummary}
      </p>

      <div className="mt-5 flex items-center gap-2.5">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-signal-500/70" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-signal-500" />
        </span>
        <span className="font-mono text-xs uppercase tracking-widest2 text-ink-950/55 dark:text-paper-100/55">
          {PROFILE.availability}
        </span>
      </div>

      <a href={`mailto:${PROFILE.email}`} className="mt-3 block text-sm text-signal-500 hover:underline">
        {PROFILE.email}
      </a>

      <div className="mt-5 flex items-center gap-4">
        {SOCIALS.slice(0, 3).map((s) => (
          <a
            key={s.key}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-mono uppercase tracking-widest2 text-ink-950/50 dark:text-paper-100/50 hover:text-signal-500 transition-colors"
          >
            {s.label}
          </a>
        ))}
      </div>

      <div className="mt-6">
        <ThemeToggle dark={dark} setDark={setDark} compact />
      </div>
    </div>
  )
}