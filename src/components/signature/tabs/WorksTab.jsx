import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Award, Github } from 'lucide-react'
import { WORKS, CERTIFICATES } from '../../../lib/WorksData.js'

function pad(n) {
  return String(n).padStart(2, '0')
}

function Tag({ children }) {
  return (
    <span className="text-[11px] px-2.5 py-1 rounded-full border border-ink-950/12 dark:border-paper-100/15 text-ink-950/55 dark:text-paper-100/55">
      {children}
    </span>
  )
}

function useRowVisibility() {
  const [node, setNode] = useState(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    if (!node) return
    const obs = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: '-42% 0px -42% 0px', threshold: 0 }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [node])

  return [setNode, active]
}

/**
 * Drives a DOM node's transform with simple exponential smoothing (lerp)
 * so a floating element can trail the cursor smoothly instead of snapping
 * to it. Position is written straight to the ref's style on every
 * animation frame (no React state), so the whole list never re-renders
 * while the mouse moves. Deliberately has no velocity/spring term — a
 * spring can overshoot and oscillate ("shake"); a lerp toward the target
 * every frame can't overshoot, so it's just a smooth, settled glide.
 */
function useCursorFollow() {
  const elRef = useRef(null)
  const target = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const raf = useRef(null)
  const initialized = useRef(false)

  useEffect(() => {
    // Higher = catches up to the cursor faster; lower = more trailing lag.
    const ease = 0.18

    const loop = () => {
      pos.current.x += (target.current.x - pos.current.x) * ease
      pos.current.y += (target.current.y - pos.current.y) * ease

      if (elRef.current) {
        elRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0) translate(-50%, -55%)`
      }

      raf.current = requestAnimationFrame(loop)
    }

    raf.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  const updateTarget = (x, y) => {
    // Snap instantly the very first time so the preview doesn't fly in
    // from the top-left corner on the first hover of a session.
    if (!initialized.current) {
      pos.current = { x, y }
      initialized.current = true
    }
    target.current = { x, y }
  }

  return [elRef, updateTarget]
}

function ProjectRow({ p, index, isHovered, onHover, onLeave, onMove }) {
  const [setNode, nearCenter] = useRowVisibility()
  const lit = nearCenter || isHovered

  return (
    <div
      ref={setNode}
      onMouseEnter={() => onHover(p.id)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="border-b border-ink-950/10 dark:border-paper-100/10 py-8 sm:py-10 transition-opacity duration-500"
      style={{ opacity: lit ? 1 : 0.35 }}
    >
      <div className="flex items-baseline gap-3 sm:gap-5">
        <span className="font-mono text-xs text-ink-950/35 dark:text-paper-100/35 shrink-0">
          {pad(index + 1)}.
        </span>
        <h3
          className={`font-display text-[clamp(2rem,6vw,3.75rem)] leading-[1.05] tracking-tight transition-colors duration-300 ${
            lit ? 'text-signal-500' : 'text-ink-950 dark:text-paper-100'
          }`}
        >
          {p.title}
        </h3>
      </div>

      <div className="mt-5 flex flex-wrap gap-1.5 pl-0 sm:pl-[3.25rem]">
        {p.tags?.map((t) => <Tag key={t}>{t}</Tag>)}
      </div>

      <div className="mt-4 flex flex-wrap gap-3 pl-0 sm:pl-[3.25rem]">
        {p.live && (
          <a
            href={p.live}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest2 border border-ink-950/15 dark:border-paper-100/18 rounded-full px-4 py-2 text-ink-950/70 dark:text-paper-100/70 hover:border-signal-500 hover:text-signal-500 transition-colors"
          >
            <ArrowUpRight size={13} /> Visit Site
          </a>
        )}
        {p.repo && (
          <a
            href={p.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest2 border border-ink-950/15 dark:border-paper-100/18 rounded-full px-4 py-2 text-ink-950/70 dark:text-paper-100/70 hover:border-signal-500 hover:text-signal-500 transition-colors"
          >
            <Github size={13} /> Source
          </a>
        )}
      </div>
    </div>
  )
}

function CertRow({ c, index, isHovered, onHover, onLeave, onMove }) {
  const [setNode, nearCenter] = useRowVisibility()
  const lit = nearCenter || isHovered

  return (
    <div
      ref={setNode}
      onMouseEnter={() => onHover(c.id)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="border-b border-ink-950/10 dark:border-paper-100/10 py-8 sm:py-10 transition-opacity duration-500"
      style={{ opacity: lit ? 1 : 0.35 }}
    >
      <div className="flex items-baseline gap-3 sm:gap-5">
        <span className="font-mono text-xs text-ink-950/35 dark:text-paper-100/35 shrink-0">
          {pad(index + 1)}.
        </span>
        <h3
          className={`font-display text-[clamp(1.5rem,4.5vw,2.75rem)] leading-[1.1] tracking-tight transition-colors duration-300 ${
            lit ? 'text-signal-500' : 'text-ink-950 dark:text-paper-100'
          }`}
        >
          {c.title}
        </h3>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5 pl-0 sm:pl-[3.25rem]">
        <Tag>{c.issuer}</Tag>
        {c.tags?.map((t) => <Tag key={t}>{t}</Tag>)}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-5 pl-0 sm:pl-[3.25rem]">
        {c.file && (
          <a
            href={c.file}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest2 border border-ink-950/15 dark:border-paper-100/18 rounded-full px-4 py-2 text-ink-950/70 dark:text-paper-100/70 hover:border-signal-500 hover:text-signal-500 transition-colors"
          >
            <Award size={13} /> View Certificate
          </a>
        )}
        <span className="text-xs text-ink-950/45 dark:text-paper-100/45">
          Issue Date: <span className="text-ink-950/70 dark:text-paper-100/70">{c.year}</span>
        </span>
      </div>
    </div>
  )
}

/**
 * Floating preview that trails the cursor (with spring/momentum) instead of
 * sitting fixed in a sidebar. It's mounted once, positioned `fixed`, and only
 * shown while a row is actively hovered. Desktop-only (lg+), same as before.
 */
function FloatingPreview({ previewRef, item, kind, visible }) {
  const showImage = Boolean(item?.image)

  return (
    <div
      ref={previewRef}
      className="pointer-events-none fixed left-0 top-0 z-50 hidden lg:block will-change-transform"
      style={{
        opacity: visible && item ? 1 : 0,
        transition: 'opacity 220ms ease',
      }}
    >
      <div className="group relative w-[300px] h-[200px] rounded-2xl overflow-hidden bg-ink-900 shadow-2xl shadow-ink-950/40">
        {showImage ? (
          <img
            src={item.image}
            alt={item.fullTitle || item.title}
            className="h-full w-full object-cover transition-all duration-500"
          />
        ) : item ? (
          <div className="h-full w-full flex flex-col items-center justify-center gap-3 text-paper-50/50">
            <Award size={32} strokeWidth={1.25} />
            <span className="font-mono text-[10px] uppercase tracking-widest2 text-center px-6">
              {item.title}
            </span>
          </div>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 py-3 bg-gradient-to-t from-ink-950/80 to-transparent">
          <ArrowUpRight size={13} className="text-paper-50" />
          <span className="font-mono text-[10px] uppercase tracking-widest2 text-paper-50">
            {kind === 'cert' ? 'Click to view certificate' : 'Click to view full project details'}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * `activeTab` controls which section renders — 'work-projects' or
 * 'work-certificates'. Only one is ever mounted at a time, so Projects
 * and Certificates never appear stacked together.
 */
export default function WorksTab({ activeTab = 'work-projects' }) {
  const [projectFilter, setProjectFilter] = useState('All Projects')
  const [hoveredWork, setHoveredWork] = useState(null)
  const [hoveredCert, setHoveredCert] = useState(null)

  const [previewRef, updatePreviewTarget] = useCursorFollow()

  const handleRowMouseMove = (e) => {
    updatePreviewTarget(e.clientX, e.clientY)
  }

  const filters = useMemo(() => {
    const cats = [...new Set(WORKS.map((p) => p.category).filter(Boolean))]
    const list = ['All Projects', ...cats]
    if (WORKS.some((p) => p.highlight)) list.splice(1, 0, 'Highlights')
    return list
  }, [])

  const filteredWorks = useMemo(() => {
    if (projectFilter === 'All Projects') return WORKS
    if (projectFilter === 'Highlights') return WORKS.filter((p) => p.highlight)
    return WORKS.filter((p) => p.category === projectFilter)
  }, [projectFilter])

  const activeWork = filteredWorks.find((p) => p.id === hoveredWork) || null
  const activeCert = CERTIFICATES.find((c) => c.id === hoveredCert) || null

  if (activeTab === 'work-certificates') {
    return (
      <section id="work-certificates" className="animate-in fade-in duration-300">
        <p className="font-mono text-xs uppercase tracking-widest3 text-signal-500 mb-8 flex items-center gap-2">
          <span aria-hidden>✳</span> Certifications
        </p>

        <div>
          {CERTIFICATES.map((c, i) => (
            <CertRow
              key={c.id}
              c={c}
              index={i}
              isHovered={hoveredCert === c.id}
              onHover={setHoveredCert}
              onMove={handleRowMouseMove}
              onLeave={() => setHoveredCert(null)}
            />
          ))}
        </div>

        <FloatingPreview
          previewRef={previewRef}
          item={activeCert}
          kind="cert"
          visible={Boolean(hoveredCert)}
        />
      </section>
    )
  }

  return (
    <section id="work-projects" className="animate-in fade-in duration-300">
      <p className="font-mono text-xs uppercase tracking-widest3 text-signal-500 mb-8 flex items-center gap-2">
        <span aria-hidden>✳</span> Selected Projects
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setProjectFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              projectFilter === f
                ? 'bg-ink-950 dark:bg-paper-100 text-paper-100 dark:text-ink-950 border-transparent'
                : 'border-ink-950/15 dark:border-paper-100/18 text-ink-950/65 dark:text-paper-100/65 hover:border-signal-500 hover:text-signal-500'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div>
        {filteredWorks.map((p, i) => (
          <ProjectRow
            key={p.id}
            p={p}
            index={i}
            isHovered={hoveredWork === p.id}
            onHover={setHoveredWork}
            onMove={handleRowMouseMove}
            onLeave={() => setHoveredWork(null)}
          />
        ))}
      </div>

      <FloatingPreview
        previewRef={previewRef}
        item={activeWork}
        kind="project"
        visible={Boolean(hoveredWork)}
      />
    </section>
  )
}