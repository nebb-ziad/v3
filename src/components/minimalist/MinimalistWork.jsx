import { ArrowUpRight } from 'lucide-react'
import { WORKS } from '../../lib/portfolioData.js'

export default function MinimalistWork() {
  return (
    <section className="py-10 sm:py-14">
      <p className="font-mono text-xs uppercase tracking-widest2 text-ink-950/45 dark:text-paper-100/45 mb-8">Selected Work</p>
      <div className="space-y-10">
        {WORKS.map((p) => (
          <a key={p.id} href={p.live} target="_blank" rel="noopener noreferrer" className="group block">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-2xl group-hover:text-signal-500 transition-colors">{p.title}</h3>
              <ArrowUpRight size={16} className="text-ink-950/30 dark:text-paper-100/30 group-hover:text-signal-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
            </div>
            <p className="mt-2 text-ink-950/65 dark:text-paper-100/65 leading-relaxed">{p.desc}</p>
            <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
              {p.tags.map((t) => (
                <span key={t} className="text-xs font-mono text-ink-950/40 dark:text-paper-100/40">{t}</span>
              ))}
            </div>
          </a>
        ))}
        <p className="text-sm text-ink-950/35 dark:text-paper-100/35 italic">More work in progress — this list grows as new projects ship.</p>
      </div>
    </section>
  )
}