import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

export default function ModalShell({
  open,
  onClose,
  title,
  eyebrow,
  meta,
  children,
  maxWidth = 'max-w-lg',
  footerLeft,
}) {
  const [rendered, setRendered] = useState(open)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) {
      setRendered(true)
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
      document.documentElement.classList.add('overflow-hidden')
      return () => cancelAnimationFrame(raf)
    } else {
      setVisible(false)
      const timer = setTimeout(() => {
        setRendered(false)
        document.documentElement.classList.remove('overflow-hidden')
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!rendered) return null

  const label = eyebrow ?? title

  return (
    <div
      className={`fixed inset-0 z-[95] flex flex-col bg-paper-100/98 dark:bg-ink-950/98 backdrop-blur-2xl text-ink-950 dark:text-paper-100 transition-all duration-300 ease-out-expo ${
        visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-[0.98] translate-y-2 pointer-events-none'
      }`}
    >
      <div className="flex items-center justify-between gap-4 px-5 sm:px-8 py-5 sm:py-6 flex-shrink-0">
        <span className="flex items-baseline gap-2.5 min-w-0">
          {label && (
            <span className="font-display text-sm sm:text-base uppercase tracking-widest2 truncate">
              {label}
            </span>
          )}
          {meta && (
            <span className="inline-flex items-center gap-1.5 font-mono text-[10px] sm:text-[11px] text-ink-950/45 dark:text-paper-100/45 whitespace-nowrap">
              {meta}
            </span>
          )}
        </span>
        <button
          onClick={onClose}
          aria-label="Close"
          className="h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-full border border-ink-950/15 dark:border-paper-100/18 hover:border-signal-500 hover:text-signal-500 transition-colors flex-shrink-0"
        >
          <X size={16} />
        </button>
      </div>

      <div className="no-scrollbar flex-1 min-h-0 overflow-y-auto overscroll-contain">
        <div className="min-h-full flex items-center justify-center px-5 sm:px-8 py-6">
          <div className={`w-full ${maxWidth}`}>{children}</div>
        </div>
      </div>

      <div className="flex-shrink-0 flex items-center justify-center gap-5 py-5 sm:py-6 font-mono text-[11px] uppercase tracking-widest2 text-ink-950/45 dark:text-paper-100/45">
        {footerLeft}
        <span className="inline-flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 border border-ink-950/20 dark:border-paper-100/20 rounded-sm text-[10px] normal-case">esc</kbd>
          close
        </span>
      </div>
    </div>
  )
}