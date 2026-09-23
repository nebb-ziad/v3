import { STACK, PROFILE, DEV_QUOTES } from '../../../lib/portfolioData.js'

export default function AboutTab() {
  const stackEntries = Object.entries(STACK)

  return (
    <div className="grid lg:grid-cols-2 gap-14">
      <div>
        <p className="font-mono text-[11px] uppercase tracking-widest2 text-signal-500 mb-4">Who I Am</p>
        <div className="space-y-4 text-lg leading-relaxed text-ink-950/78 dark:text-paper-100/78">
          <p>
            I'm Benmark Diaz, A Front-End Developer at {PROFILE.school}.
          </p>
          <p>
            I got into web development the moment I realized code could turn a blank page into something
            people actually enjoy using — since then it's been an ongoing obsession with clean structure,
            smooth motion, and interfaces that feel considered rather than assembled.
          </p>
          <p>
            I care about the details most people scroll past: the timing of a hover state, the rhythm of a
            layout, the difference between "it works" and "it feels right."
          </p>
        </div>

        <p className="mt-10 font-mono text-[11px] uppercase tracking-widest2 text-signal-500 mb-4">Tech Stack</p>
        <div className="space-y-5">
          {stackEntries.map(([group, items]) => (
            <div key={group}>
              <p className="text-xs font-semibold text-ink-950/55 dark:text-paper-100/55 mb-2">{group}</p>
              <div className="flex flex-wrap gap-2">
                {items.map((it) => (
                  <span
                    key={it.name}
                    className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border ${
                      it.usage === 'daily'
                        ? 'border-signal-500/40 text-signal-500 bg-signal-500/5'
                        : 'border-ink-950/12 dark:border-paper-100/15 text-ink-950/65 dark:text-paper-100/65'
                    }`}
                  >
                    {it.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="grid grid-cols-2 gap-px bg-ink-950/8 dark:bg-paper-100/10 border border-ink-950/8 dark:border-paper-100/10 rounded-2xl overflow-hidden">
          {[
            ['Role', PROFILE.role],
            ['Education', PROFILE.study],
            ['Location', PROFILE.location],
            ['Status', PROFILE.availability],
          ].map(([l, v]) => (
            <div key={l} className="bg-paper-50 dark:bg-ink-950 p-4">
              <p className="font-mono text-[10px] uppercase tracking-widest2 text-ink-950/50 dark:text-paper-100/50">{l}</p>
              <p className="mt-1 font-medium text-sm">{v}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 font-mono text-[11px] uppercase tracking-widest2 text-signal-500 mb-4">What Other Developers Say</p>
        <div className="space-y-3">
          {DEV_QUOTES.map((q) => (
            <div key={q.quote} className="p-4 rounded-xl border border-ink-950/8 dark:border-paper-100/10">
              <p className="font-display text-base leading-snug">&ldquo;{q.quote}&rdquo;</p>
              <p className="mt-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-950/45 dark:text-paper-100/45">— {q.author}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}