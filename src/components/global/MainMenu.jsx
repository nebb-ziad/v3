import { useEffect, useRef, useState } from 'react'
import {
  Plus, X, CalendarClock, Gauge, Keyboard, Sparkles, ArrowUp, Layers,
} from 'lucide-react'
import { MODES, useMode } from '../../lib/ModeContext.jsx'
import { wipeTransition } from '../../lib/viewTransition.js'
import { useViewingNow } from '../../lib/useViewingNow.js'

export default function MainMenu({ onOpenBookMeeting, onOpenSpeedTest, onOpenTypingTest, onOpenAskAnything }) {
  const [open, setOpen] = useState(false)
  const viewingNow = useViewingNow()
  const { mode, setMode, setDark } = useMode()
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const modeRowRef = useRef(null)

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    if (!open) return
    const onPointer = (e) => {
      if (!rootRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    return () => document.removeEventListener('mousedown', onPointer)
  }, [open])

  const backToTop = () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    setOpen(false)
  }

  const runAndClose = (fn) => {
    fn?.()
    setOpen(false)
  }

  const switchMode = (key) => {
    if (key === mode) return
    wipeTransition(modeRowRef.current, () => {
      setMode(key)
      if (key !== 'minimalist') {
        document.documentElement.classList.add('dark')
        setDark(true)
      }
    })
    setOpen(false)
  }

  const ITEMS = [
    { icon: CalendarClock, label: 'Book a Meeting', hint: 'Pick a time', accent: '#3d63ff', action: onOpenBookMeeting },
    { icon: Gauge, label: 'Speed Test', hint: 'Edge network', accent: '#f6821f', action: onOpenSpeedTest },
    { icon: Keyboard, label: 'Typing Test', hint: 'Laptop & Desktop', accent: '#a78bfa', action: onOpenTypingTest },
    { icon: Sparkles, label: 'Ask Anything', hint: 'Ask the site', accent: '#38bdf8', action: onOpenAskAnything },
  ]

  return (
    <div
      ref={rootRef}
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-[90] flex flex-col items-end gap-3 pointer-events-none"
    >
      <div
        className={`w-[19rem] max-w-[86vw] origin-bottom-right will-change-transform transition-[opacity,transform] duration-400 ease-out-expo ${
          open
            ? 'opacity-100 scale-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 scale-[0.94] translate-y-4 pointer-events-none'
        }`}
      >
        <div className="relative overflow-hidden rounded-[1.75rem] border border-ink-950/12 dark:border-white/10 bg-paper-100 dark:bg-ink-900/95 text-ink-950 dark:text-paper-50 shadow-[0_24px_60px_-20px_rgba(5,6,10,0.45)]">
          <div className="relative px-4 pt-4 pb-3 flex items-center justify-between gap-3">
            <p className="font-display text-[22px] leading-none tracking-tight text-ink-950 dark:text-paper-50">
              Main Menu
            </p>
            <div
              className="inline-flex items-center gap-1.5 rounded-full bg-ink-950/[0.06] dark:bg-white/10 px-2.5 py-1 text-[10px] font-mono font-medium text-ink-950/80 dark:text-paper-100/80 whitespace-nowrap select-none"
              title="Real-time active visitors on the portfolio right now"
            >
              <span className="relative flex h-2 w-2 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                {viewingNow}
              </span>
              <span>viewing now</span>
            </div>
          </div>

          <div className="relative grid grid-cols-2 gap-1.5 px-2.5">
            {ITEMS.map(({ icon: Icon, label, hint, accent, action }, i) => (
              <button
                key={label}
                onClick={() => runAndClose(action)}
                style={{ transitionDelay: open ? `${50 + i * 40}ms` : '0ms' }}
                className={`group relative flex flex-col items-start gap-3 rounded-2xl border border-ink-950/10 dark:border-white/10 bg-paper-50 dark:bg-ink-800/70 px-3 py-3 text-left text-ink-950 dark:text-paper-50 transition-[transform,opacity,background-color,border-color] duration-400 ease-out-expo hover:border-signal-500/40 hover:bg-white dark:hover:bg-ink-700 ${
                  open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                }`}
              >
                <span className="flex w-full items-center justify-between">
                  <span
                    className="h-8 w-8 rounded-xl flex items-center justify-center ring-1 ring-ink-950/10 dark:ring-white/10 transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `${accent}22`, color: accent }}
                  >
                    <Icon size={15} strokeWidth={1.75} />
                  </span>
                  <span className="font-mono text-[9px] tabular-nums text-ink-950/40 dark:text-paper-100/40">
                    0{i + 1}
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block text-[12.5px] font-semibold leading-tight whitespace-nowrap text-ink-950 dark:text-paper-50">
                    {label}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-ink-950/60 dark:text-paper-100/55">
                    {hint}
                  </span>
                </span>
              </button>
            ))}
          </div>

          <div className="relative mx-2.5 mt-2 rounded-2xl border border-ink-950/10 dark:border-white/10 bg-ink-950/[0.04] dark:bg-white/[0.05] p-2">
            <div className="flex items-center gap-1.5 px-1 pb-1.5">
              <Layers size={12} strokeWidth={1.75} className="text-ink-950/55 dark:text-paper-100/50" />
              <span className="font-mono text-[9px] uppercase tracking-widest2 text-ink-950/55 dark:text-paper-100/50">
                Viewing
              </span>
              <span className="ml-auto text-[10px] text-ink-950/55 dark:text-paper-100/50">
                {MODES[mode].desc}
              </span>
            </div>
            <div
              ref={modeRowRef}
              className="grid grid-cols-3 gap-1 rounded-xl bg-paper-100 dark:bg-ink-950/60 p-0.5"
            >
              {Object.values(MODES).map((m) => {
                const active = mode === m.key
                return (
                  <button
                    key={m.key}
                    onClick={() => switchMode(m.key)}
                    aria-pressed={active}
                    className={`rounded-[0.7rem] px-1 py-2 text-center text-[11px] font-medium leading-none transition-colors duration-200 ${
                      active
                        ? 'bg-signal-500 text-paper-50 shadow-[0_6px_16px_-8px_rgba(61,99,255,0.8)]'
                        : 'text-ink-950/70 dark:text-paper-100/65 hover:text-ink-950 dark:hover:text-paper-50'
                    }`}
                  >
                    {m.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="relative px-2.5 pb-2.5 pt-1.5">
            <button
              onClick={backToTop}
              className="w-full flex items-center justify-center gap-2 rounded-2xl px-3 py-2.5 text-[12px] font-medium text-ink-950/70 dark:text-paper-100/60 hover:bg-signal-500/8 hover:text-signal-500 transition-colors"
            >
              <ArrowUp size={13} strokeWidth={2} />
              Back to top
            </button>
          </div>
        </div>
      </div>

      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className={`relative h-14 w-14 rounded-full text-paper-100 flex items-center justify-center shadow-[0_12px_32px_-8px_rgba(61,99,255,0.55)] hover:scale-105 active:scale-95 transition-[transform,background-color,box-shadow] duration-400 ease-out-expo pointer-events-auto ${
          open
            ? 'bg-ink-950 ring-2 ring-signal-500'
            : 'bg-signal-500'
        }`}
      >
        <span
          className={`absolute inset-0 rounded-[1.35rem] bg-signal-500/40 blur-md transition-opacity duration-300 ${
            open ? 'opacity-0' : 'opacity-100'
          }`}
        />
        <Plus
          size={22}
          className={`absolute transition-all duration-300 ease-out-expo ${
            open ? 'rotate-90 opacity-0 scale-50' : 'rotate-0 opacity-100 scale-100'
          }`}
        />
        <X
          size={20}
          className={`absolute transition-all duration-300 ease-out-expo ${
            open ? 'rotate-0 opacity-100 scale-100' : '-rotate-90 opacity-0 scale-50'
          }`}
        />
      </button>
    </div>
  )
}
