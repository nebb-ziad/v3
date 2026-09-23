import { ArrowLeft, Archive } from 'lucide-react'
import { useMode, MODES } from '../../lib/ModeContext.jsx'
import SignatureMark from '../signature/SignatureMark.jsx'

// Swap this whole component out once the original portfolio files are
// dropped in — see /LEGACY_SETUP.md at the project root for the exact
// steps (drop files into src/components/legacy/original/, then render
// them here instead of this placeholder).
export default function LegacyTheme() {
  const { setMode } = useMode()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 signal-glow">
      <span className="h-16 w-16 rounded-full bg-signal-500/10 text-signal-500 flex items-center justify-center mb-8">
        <Archive size={24} strokeWidth={1.5} />
      </span>
      <p className="font-mono text-xs uppercase tracking-widest3 text-signal-500 mb-4">{MODES.legacy.desc}</p>
      <h1 className="font-display text-3xl sm:text-5xl tracking-tight max-w-xl mb-5">
        The original portfolio lives here soon.
      </h1>
      <p className="text-ink-950/60 dark:text-paper-100/60 max-w-md leading-relaxed mb-10">
        This space is reserved for the very first version of this site — a time capsule sitting
        right next to the current one. Once the old files are added, they'll render exactly as they
        did back then, right in this slot.
      </p>
      <button
        onClick={() => setMode('signature')}
        className="inline-flex items-center gap-2 bg-ink-950 dark:bg-signal-500 text-paper-100 px-6 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest2 hover:opacity-85 transition-opacity"
      >
        <ArrowLeft size={14} /> Back to Signature
      </button>
      <SignatureMark animated={false} className="w-40 mt-16 text-ink-950/15 dark:text-paper-100/15" />
    </div>
  )
}
