import { useEffect, useLayoutEffect, useState } from 'react'
import Lenis from 'lenis'
import { ModeContext } from './lib/ModeContext.jsx'
import Preloader from './components/signature/Preloader.jsx'
import MainMenu from './components/global/MainMenu.jsx'
import BookMeetingModal from './components/global/BookMeetingModal.jsx'
import SpeedTestModal from './components/global/SpeedTestModal.jsx'
import TypingTestModal from './components/global/TypingTestModal.jsx'
import AskAnythingModal from './components/global/AskAnythingModal.jsx'
import SignatureTheme from './components/signature/SignatureTheme.jsx'
import MinimalistTheme from './components/minimalist/MinimalistTheme.jsx'
import LegacyTheme from './components/legacy/LegacyTheme.jsx'

export default function App() {
  const [mode, setMode] = useState('signature')
  const [dark, setDark] = useState(true)

  const [bookOpen, setBookOpen] = useState(false)
  const [speedOpen, setSpeedOpen] = useState(false)
  const [typingOpen, setTypingOpen] = useState(false)
  const [askOpen, setAskOpen] = useState(false)

  useEffect(() => {
    if (mode === 'minimalist' && window.innerWidth >= 1024) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) return

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.1,
    })
    window.__lenis = lenis

    let rafId
    function raf(time) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      if (window.__lenis === lenis) {
        window.__lenis = null
      }
    }
  }, [mode])

  useEffect(() => {
    const isAnyModalOpen = bookOpen || speedOpen || typingOpen || askOpen
    if (isAnyModalOpen) {
      window.__lenis?.stop()
    } else {
      window.__lenis?.start()
    }
  }, [bookOpen, speedOpen, typingOpen, askOpen])

  // Light/dark switching only ever applies to the Minimalist theme.
  // Signature and Legacy keep one fixed (dark) look regardless of the
  // toggle, so hopping modes never changes their appearance — the `dark`
  // state itself is still preserved in the background so Minimalist
  // remembers your last choice when you switch back to it.
  useLayoutEffect(() => {
    const effectiveDark = mode === 'minimalist' ? dark : true
    document.documentElement.classList.toggle('dark', effectiveDark)
  }, [mode, dark])

  useLayoutEffect(() => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [mode])

  return (
    <ModeContext.Provider value={{ mode, setMode, dark, setDark }}>
      <div className="min-h-screen">
        {mode === 'signature' && <Preloader />}
        <div className="grain-overlay" />

        {mode === 'signature' && <SignatureTheme onOpenBookMeeting={() => setBookOpen(true)} />}
        {mode === 'minimalist' && <MinimalistTheme />}
        {mode === 'legacy' && <LegacyTheme />}

        <MainMenu
          onOpenBookMeeting={() => setBookOpen(true)}
          onOpenSpeedTest={() => setSpeedOpen(true)}
          onOpenTypingTest={() => setTypingOpen(true)}
          onOpenAskAnything={() => setAskOpen(true)}
        />

        <BookMeetingModal open={bookOpen} onClose={() => setBookOpen(false)} />
        <SpeedTestModal open={speedOpen} onClose={() => setSpeedOpen(false)} />
        <TypingTestModal open={typingOpen} onClose={() => setTypingOpen(false)} />
        <AskAnythingModal open={askOpen} onClose={() => setAskOpen(false)} />
      </div>
    </ModeContext.Provider>
  )
}