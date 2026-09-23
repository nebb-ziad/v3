import { PROFILE } from '../../lib/portfolioData.js'

export default function MinimalistFooter() {
  return (
    <footer className="py-10 sm:py-14 border-t border-ink-950/10 dark:border-paper-100/12 flex items-center justify-between flex-wrap gap-3">
      <p className="text-xs text-ink-950/40 dark:text-paper-100/40">
        © {new Date().getFullYear()} {PROFILE.name}
      </p>
      <p className="text-xs text-ink-950/30 dark:text-paper-100/30">Built with React &amp; Tailwind CSS</p>
    </footer>
  )
}