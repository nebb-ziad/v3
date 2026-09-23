import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ImageOff } from 'lucide-react'
import { RECENT_WORKS } from '../../lib/recentWorksData.js'
import { useReveal } from '../../hooks/useReveal.js'

function openWorksPage() {
  window.dispatchEvent(new CustomEvent('markineb:navigate', { detail: 'works' }))
}

// Styled stand-in for projects that don't have a real screenshot yet, or
// whose image failed to load — a dark, black/white/blue duotone card
// instead of a flat "coming soon" box (or, worse, a raw broken-image icon).
function PlaceholderPreview({ label = 'Preview coming soon' }) {
  return (
    <div className="h-full w-full relative flex flex-col items-center justify-center gap-2 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-ink-950 via-ink-900 to-signal-500/20" />
      <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,rgba(255,255,255,0.05)_0px,rgba(255,255,255,0.05)_1px,transparent_1px,transparent_5px)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.08),transparent_60%)]" />
      <ImageOff size={16} strokeWidth={1.5} className="relative text-paper-50/35" />
      <span className="relative font-mono text-[9px] uppercase tracking-widest2 text-paper-50/40">{label}</span>
    </div>
  )
}

// Just the image (or placeholder), no monitor/pedestal chrome around it —
// a flat rounded plate that scrolls by like a filmstrip.
function ImagePlate({ image, title }) {
  const [errored, setErrored] = useState(false)
  const showImage = Boolean(image) && !errored

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden border border-ink-950/10 dark:border-paper-100/10 bg-ink-950 shadow-[0_20px_45px_-18px_rgba(15,15,20,0.45)] transition-all duration-500 ease-out-expo group-hover:scale-[1.02] group-hover:border-signal-500/40 group-hover:shadow-[0_25px_50px_-15px_rgba(61,99,255,0.2)]">
      {showImage ? (
        <img
          src={image}
          alt={title}
          onError={() => setErrored(true)}
          className="h-full w-full object-cover object-center transition-transform duration-700 ease-out-expo group-hover:scale-[1.05]"
        />
      ) : (
        <PlaceholderPreview />
      )}
    </div>
  )
}

// Two-set infinite marquee with pure GPU composited translate3d.
// Automatically pauses when scrolled out of view to consume 0% GPU/CPU.
function MarqueeRow({ items, reverse, pxPerSecond = 60, isSectionVisible = true }) {
  const safeItems = items.length ? items : [{ id: 'placeholder' }]
  // Tile minimally so 1 set is at least 3200px wide, then clone once for a 50% seamless loop
  const minSetCount = Math.max(1, Math.ceil(3200 / (safeItems.length * 484)))
  const oneSet = Array.from({ length: minSetCount }, () => safeItems).flat()
  const loop = [...oneSet, ...oneSet]
  const oneSetWidth = oneSet.length * 484
  const duration = Math.max(12, oneSetWidth / pxPerSecond)

  return (
    <div className="overflow-hidden select-none">
      <div
        className="flex gap-6 w-max gpu-layer hover:[animation-play-state:paused]"
        style={{
          animation: `${reverse ? 'marqueeRev' : 'marqueeFwd'} ${duration}s linear infinite`,
          animationPlayState: isSectionVisible ? 'running' : 'paused',
        }}
      >
        {loop.map((p, i) => (
          <button
            key={`${p.id}-${i}`}
            onClick={openWorksPage}
            className="group w-[340px] sm:w-[460px] flex-shrink-0 text-left cursor-pointer"
          >
            <div className="aspect-video">
              <ImagePlate image={p.image} title={p.title} />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default function RecentWorks() {
  const [ref, visible] = useReveal(0.15)
  const sectionRef = useRef(null)
  const [inView, setInView] = useState(true)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
      },
      { rootMargin: '200px 0px 200px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="recent-works" className="py-24 sm:py-32 overflow-hidden content-auto">
      <div className="mx-auto max-w-[1200px] px-6 sm:px-8 flex items-end justify-between flex-wrap gap-6 mb-14">
        <div ref={ref} className={`transition-all duration-700 ease-out-expo max-w-xl ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-mono text-xs uppercase tracking-widest3 text-signal-500 mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-signal-500" /> Selected & shipping
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-tight mb-4">Recent Works</h2>
          <p className="text-ink-950/60 dark:text-paper-100/60 leading-relaxed">
            Explore selected works crafted to solve real problems, simplify experiences, and create meaningful digital impact.
          </p>
        </div>
        <button onClick={openWorksPage} className="group inline-flex items-center gap-2 py-2.5 -my-2.5 px-2 -mx-2 font-mono text-xs uppercase tracking-widest2 text-signal-500 active:opacity-60 transition-opacity">
          View all works
          <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      <div className="relative flex flex-col gap-8">
        <MarqueeRow items={RECENT_WORKS} pxPerSecond={65} isSectionVisible={inView} />
        <MarqueeRow items={RECENT_WORKS} reverse pxPerSecond={48} isSectionVisible={inView} />

        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 sm:w-44 bg-gradient-to-r from-paper-50 dark:from-ink-950 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 sm:w-44 bg-gradient-to-l from-paper-50 dark:from-ink-950 to-transparent z-10" />
      </div>
    </section>
  )
}