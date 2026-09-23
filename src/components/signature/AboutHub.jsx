import { useEffect, useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { PROFILE } from '../../lib/portfolioData.js'
import { useReveal } from '../../hooks/useReveal.js'

// Fires the top-level page swap handled in SignatureTheme.jsx
function goTo(page) {
  window.dispatchEvent(new CustomEvent('markineb:navigate', { detail: page }))
}

function FeaturedCard({ image, video, eyebrow, title, desc, page, className = '' }) {
  const videoRef = useRef(null)

  useEffect(() => {
    if (!video || !videoRef.current) return
    const el = videoRef.current
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {})
        } else {
          el.pause()
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [video])

  return (
    <button
      onClick={() => goTo(page)}
      className={`group relative rounded-3xl overflow-hidden border border-ink-950/10 dark:border-paper-100/12 text-left w-full active:scale-[0.98] transition-all duration-500 ease-out-expo hover:border-signal-500/40 hover:shadow-[0_20px_50px_-15px_rgba(61,99,255,0.22)] ${className}`}
    >
      {video ? (
        <video
          ref={videoRef}
          src={video}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out-expo pointer-events-none gpu-layer"
        />
      ) : (
        <img
          src={image}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover opacity-75 group-hover:opacity-90 group-hover:scale-105 transition-transform duration-700 ease-out-expo pointer-events-none gpu-layer"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-ink-950/40 to-transparent" />

      <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
        <p className="font-mono text-[10px] uppercase tracking-widest2 text-signal-500 mb-2">{eyebrow}</p>
        <h3 className="font-display text-2xl sm:text-3xl text-paper-50 font-medium tracking-tight mb-2">{title}</h3>
        <p className="text-paper-50/70 text-sm mb-5 max-w-xs">{desc}</p>
        <span className="inline-flex items-center gap-2 self-start font-mono text-xs uppercase tracking-widest2 text-paper-50 group-hover:text-signal-500 transition-colors">
          Learn more
          <ArrowUpRight size={14} className="transition-transform duration-300 ease-out-expo group-hover:translate-x-1 group-hover:-translate-y-1" />
        </span>
      </div>
    </button>
  )
}

export default function AboutHub() {
  const [ref, visible] = useReveal(0.15)

  return (
    <section id="about-hub" className="py-24 sm:py-32 content-auto">
      <div ref={ref} className="mx-auto max-w-[1200px] px-6 sm:px-8">
        <div className={`mb-12 transition-all duration-700 ease-out-expo ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <p className="font-mono text-xs uppercase tracking-widest3 text-signal-500 mb-3 flex items-center gap-3">
            <span className="h-px w-8 bg-signal-500" /> Get to know the work
          </p>
          <h2 className="font-display text-3xl sm:text-5xl font-medium tracking-tight mb-3">Know Me More</h2>
          <p className="text-ink-950/60 dark:text-paper-100/60 max-w-md">
            Beyond The Interface
          </p>
        </div>

        <div className={`grid lg:grid-cols-2 lg:grid-rows-[2fr_1fr] gap-6 transition-all duration-700 ease-out-expo delay-100 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <FeaturedCard
            className="min-h-[320px] lg:row-span-2"
            image="/images/about-featured.png"
            eyebrow="Who I Am"
            title={PROFILE.name}
            desc="A Glimpse Into Who I Am"
            page="about"
          />
          <FeaturedCard
            className="min-h-[340px]"
            video="/images/0923(1).mp4"
            eyebrow="Selected Work"
            title="Works"
            desc="Project showcases and experiences."
            page="works"
          />
          <FeaturedCard
            className="min-h-[140px]"
            image="/images/socials.png"
            eyebrow="Stay Connected"
            title="Socials"
            desc="Connect with me on social media."
            page="social"
          />
        </div>
      </div>
    </section>
  )
}