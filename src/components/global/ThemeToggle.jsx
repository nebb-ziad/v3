import { Sun, Moon } from 'lucide-react'
import { useRef } from 'react'
import { wipeTransition } from '../../lib/viewTransition.js'

export default function ThemeToggle({ dark, setDark, compact = false }) {
  const btnRef = useRef(null)

  const toggleTheme = () => {
    wipeTransition(btnRef.current, () => {
      const nextDark = !dark
      document.documentElement.classList.toggle('dark', nextDark)
      setDark(nextDark)
    })
  }

  const trackSize = compact ? 'h-6 w-11 p-[3px]' : 'h-11 w-20 p-1'
  const thumbSize = compact ? 'h-4 w-4' : 'h-8 w-8'
  const thumbTravel = compact ? 'translate-x-5' : 'translate-x-9'
  const iconSize = compact ? 11 : 16

  return (
    <button
      ref={btnRef}
      onClick={toggleTheme}
      role="switch"
      aria-checked={dark}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`group relative inline-flex shrink-0 items-center rounded-full border border-ink-950/25 dark:border-paper-100/30 bg-ink-950/[0.06] dark:bg-paper-100/10 hover:border-signal-500 transition-colors ${trackSize}`}
    >
      <Sun size={iconSize} strokeWidth={1.5} className="pointer-events-none absolute left-1 top-1/2 -translate-y-1/2 text-ink-950/35 dark:text-paper-100/20" />
      <Moon size={iconSize} strokeWidth={1.5} className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-ink-950/20 dark:text-paper-100/65" />
      <span
        className={`relative flex items-center justify-center rounded-full bg-paper-100 dark:bg-ink-950 shadow-sm transition-transform duration-500 ease-out ${thumbSize} ${dark ? thumbTravel : 'translate-x-0'}`}
      >
        <Sun size={iconSize} strokeWidth={1.5} className={`absolute text-signal-500 transition-all duration-500 ease-out ${dark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`} />
        <Moon size={iconSize} strokeWidth={1.5} className={`absolute text-signal-400 transition-all duration-500 ease-out ${dark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'}`} />
      </span>
    </button>
  )
}
