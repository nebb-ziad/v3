import { EXPERIENCE } from '../../lib/portfolioData.js'

export default function MinimalistExperience() {
  return (
    <section className="py-10 sm:py-14 border-t border-ink-950/10 dark:border-paper-100/12">
      <p className="font-mono text-xs uppercase tracking-widest2 text-ink-950/45 dark:text-paper-100/45 mb-8">Experience</p>
      <div className="space-y-8">
        {EXPERIENCE.map((e) => (
          <div key={e.id} className="grid grid-cols-[100px_1fr] sm:grid-cols-[140px_1fr] gap-4">
            <p className="font-mono text-xs text-ink-950/45 dark:text-paper-100/45 pt-0.5">{e.year}</p>
            <div>
              <h4 className="font-medium">{e.title}</h4>
              <p className="text-sm text-ink-950/50 dark:text-paper-100/50 mb-1.5">{e.org}</p>
              <p className="text-sm text-ink-950/65 dark:text-paper-100/65 leading-relaxed">{e.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}