import { useEffect, useState } from 'react'

const LETTERS = [
  { char: 'm', isAccent: false },
  { char: 'a', isAccent: true },
  { char: 'r', isAccent: true },
  { char: 'k', isAccent: true },
  { char: 'i', isAccent: false },
  { char: 'n', isAccent: false },
  { char: 'e', isAccent: false },
  { char: 'b', isAccent: false },
]

export default function Preloader() {
  const [show, setShow] = useState(true)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setExiting(true), 2700)
    const t2 = setTimeout(() => setShow(false), 3250)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('overflow-hidden', show)
    return () => document.documentElement.classList.remove('overflow-hidden')
  }, [show])

  if (!show) return null

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 bg-paper-50 dark:bg-ink-950 transition-opacity duration-500 ease-out select-none ${
        exiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <style>{`
        /* Diagonal Blue Light Beam (Bottom-Left to Top-Right) */
        @keyframes diagonalLightPass {
          0% {
            transform: translate(-150%, 150%) rotate(-45deg);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          75% {
            opacity: 1;
          }
          100% {
            transform: translate(150%, -150%) rotate(-45deg);
            opacity: 0;
          }
        }

        /* Ambient Glow Pulse on Logo */
        @keyframes logoPulseGlow {
          0%, 100% {
            filter: drop-shadow(0 0 12px rgba(61,99,255,0.3));
            transform: scale(0.98);
          }
          50% {
            filter: drop-shadow(0 0 30px rgba(61,99,255,0.8));
            transform: scale(1.02);
          }
        }

        /* Staggered Letter Pop-In */
        @keyframes letterPop {
          0% {
            opacity: 0;
            transform: translateY(16px) scale(0.8);
            filter: blur(4px);
          }
          70% {
            transform: translateY(-2px) scale(1.05);
            filter: blur(0px);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
            filter: blur(0px);
          }
        }
      `}</style>

      {/* Main Logo Container (Unclipped, No Square Box) */}
      <div className="relative w-36 h-36 sm:w-44 sm:h-44 flex items-center justify-center">
        {/* Soft Radial Backlight Glow */}
        <div className="absolute inset-0 bg-signal-500/20 rounded-full blur-3xl animate-pulse pointer-events-none" />

        {/* Base Logo Image */}
        <img
          src="/images/logo.png"
          alt="markineb logo"
          className="relative z-10 w-full h-full object-contain pointer-events-none"
          style={{
            animation: 'logoPulseGlow 2.4s ease-in-out infinite',
          }}
        />

        {/* Masked Diagonal Blue Light Beam Pass (Only shines inside the logo image itself!) */}
        <div
          className="absolute inset-0 z-20 pointer-events-none overflow-hidden"
          style={{
            maskImage: 'url(/images/logo.png)',
            WebkitMaskImage: 'url(/images/logo.png)',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
          }}
        >
          <div
            className="w-full h-full"
            style={{
              background:
                'linear-gradient(135deg, transparent 20%, rgba(61,99,255,0.4) 35%, rgba(200,220,255,0.95) 50%, rgba(61,99,255,0.6) 65%, transparent 80%)',
              animation: 'diagonalLightPass 1.8s cubic-bezier(0.4, 0, 0.2, 1) infinite 0.2s',
            }}
          />
        </div>
      </div>

      {/* Animated Brand Text Below */}
      <div className="flex items-center gap-0.5 font-brand font-bold text-2xl sm:text-3xl tracking-widest uppercase text-ink-950 dark:text-paper-100">
        {LETTERS.map((item, idx) => (
          <span
            key={idx}
            className={`inline-block transition-transform ${
              item.isAccent ? 'text-signal-500 font-mono italic' : ''
            }`}
            style={{
              animation: `letterPop 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards ${
                0.2 + idx * 0.07
              }s`,
              opacity: 0,
            }}
          >
            {item.char}
          </span>
        ))}
      </div>
    </div>
  )
}