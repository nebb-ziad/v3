import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Mail } from 'lucide-react'
import Logo from '../global/Logo.jsx'
import { PROFILE, SOCIALS } from '../../lib/portfolioData.js'

// Each link maps straight to a page key SignatureTheme listens for.
const LINKS = [
  { page: 'home', label: 'Home' },
  { page: 'about', label: 'Know Me More' },
  { page: 'experience', label: 'Experience' },
  { page: 'works', label: 'At Work' },
]

// Nav page keys don't always match the id on the actual section element,
// so map them explicitly instead of assuming page === id.
const SECTION_IDS = {
  home: 'signature',
  about: 'about-hub',
  experience: 'experience',
  works: 'recent-works',
}

function navigate(page) {
  window.dispatchEvent(new CustomEvent('markineb:navigate', { detail: page }))
}

// Smoothly scrolls to the section with a matching id on the current page.
// Uses the global Lenis instance with luxury cubic easing, falling back
// to native smooth scroll.
function scrollToSection(page) {
  const el = document.getElementById(SECTION_IDS[page] || page)
  if (!el) {
    navigate(page)
    return
  }
  if (window.__lenis) {
    window.__lenis.scrollTo(el, {
      offset: -20,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the panel on outside click or Escape. The toggle button itself
  // is excluded so clicking it doesn't first get treated as an "outside"
  // click (which closed the panel) right before its own onClick reopened it.
  useEffect(() => {
    if (!open) return
    const onClick = (e) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        buttonRef.current && !buttonRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onClick)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onClick)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const go = (page) => {
    if (page === 'home') {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, {
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
      navigate(page)
    } else {
      scrollToSection(page)
    }
    setOpen(false)
  }

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled || open ? 'bg-paper-50/85 dark:bg-ink-950/85 backdrop-blur-md' : ''
      } ${scrolled && !open ? 'border-b border-ink-950/8 dark:border-paper-100/10' : ''}`}
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 h-16 flex items-center justify-between">
        <button onClick={() => go('home')} className="flex items-center gap-1.5 p-2 -m-2">
          <Logo className="text-lg tracking-tight" />
          <span className="text-ink-950/45 dark:text-paper-100/45 text-sm">.dev</span>
        </button>

        {/* Three lines morph into an X instead of swapping icons outright */}
        <button
          ref={buttonRef}
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          className="group relative h-11 w-11 rounded-full border border-ink-950/15 dark:border-paper-100/18 flex items-center justify-center hover:border-signal-500 active:scale-95 transition-all flex-shrink-0"
        >
          <span className="relative flex h-[11px] w-4 flex-col justify-between">
            <span
              className={`h-px w-full origin-center bg-ink-950 dark:bg-paper-100 transition-all duration-300 group-hover:bg-signal-500 ${
                open ? 'translate-y-[5px] rotate-45' : ''
              }`}
            />
            <span
              className={`h-px w-full bg-ink-950 dark:bg-paper-100 transition-all duration-200 group-hover:bg-signal-500 ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`h-px w-full origin-center bg-ink-950 dark:bg-paper-100 transition-all duration-300 group-hover:bg-signal-500 ${
                open ? '-translate-y-[5px] -rotate-45' : ''
              }`}
            />
          </span>
        </button>
      </div>

      {/* Quick menu: numbered links + a compact contact/socials footer */}
      <div
        ref={panelRef}
        className={`absolute top-full inset-x-0 origin-top transition-all duration-500 ease-out-expo ${
          open ? 'opacity-100 scale-y-100 pointer-events-auto' : 'opacity-0 scale-y-95 pointer-events-none'
        }`}
      >
        <div className="mx-auto max-w-[1400px] px-5 sm:px-8 pb-6">
          <div className="rounded-3xl border border-ink-950/10 dark:border-paper-100/12 bg-paper-50/95 dark:bg-ink-950/95 backdrop-blur-md shadow-xl overflow-hidden">
            <div className="p-5 sm:p-7">
              <p className="font-mono text-[10px] uppercase tracking-widest3 text-signal-500 mb-4 flex items-center gap-3">
                <span className="h-px w-8 bg-signal-500" /> Quick Menu
              </p>

              <nav>
                {LINKS.map((l, i) => (
                  <button
                    key={l.page}
                    onClick={() => go(l.page)}
                    className="group w-full min-h-[52px] flex items-center justify-between gap-4 py-3 border-t border-ink-950/8 dark:border-paper-100/10 first:border-t-0 text-left active:opacity-60 transition-opacity"
                  >
                    <span className="flex items-baseline gap-3">
                      <span className="font-mono text-[10px] text-ink-950/35 dark:text-paper-100/35">{String(i + 1).padStart(2, '0')}</span>
                      <span className="font-display text-xl sm:text-2xl font-medium tracking-tight group-hover:text-signal-500 transition-colors">
                        {l.label}
                      </span>
                    </span>
                    <ArrowUpRight
                      size={16}
                      className="text-ink-950/25 dark:text-paper-100/25 group-hover:text-signal-500 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all flex-shrink-0"
                    />
                  </button>
                ))}
              </nav>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 px-5 sm:px-7 py-4 border-t border-ink-950/8 dark:border-paper-100/10 bg-ink-950/[0.02] dark:bg-paper-100/[0.02]">
              <a
                href={`mailto:${PROFILE.email}`}
                className="inline-flex items-center gap-2 py-2 -my-2 font-mono text-xs uppercase tracking-widest2 text-ink-950/55 dark:text-paper-100/55 hover:text-signal-500 active:text-signal-500 transition-colors"
              >
                <Mail size={13} /> {PROFILE.email}
              </a>
              <div className="flex items-center gap-2 sm:gap-4">
                {SOCIALS.slice(0, 4).map((s) => (
                  <a
                    key={s.key}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-[10px] uppercase tracking-widest2 text-ink-950/45 dark:text-paper-100/45 hover:text-signal-500 active:text-signal-500 transition-colors py-2.5 px-1.5 -my-2.5"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}