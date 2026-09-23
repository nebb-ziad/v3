import { useEffect, useState } from 'react'
import Cal, { getCalApi } from '@calcom/embed-react'
import { Mail, Linkedin, ArrowUpRight, Loader2, Clock, Calendar, Sparkles } from 'lucide-react'
import ModalShell from './ModalShell.jsx'
import { PROFILE, SOCIALS } from '../../lib/portfolioData.js'

const CAL_NAMESPACE = 'book-a-meeting'
const BRAND_COLOR = '#3d63ff' // matches signal-500

const MEETING_TYPES = [
  {
    id: '30min',
    slug: 'benmarkdiaz-iueznm/30min',
    title: '30 Min Meeting',
    duration: '30 mins',
    desc: 'Deep dive into project requirements, tech stack, or collaboration.',
    icon: Calendar,
  },
  {
    id: '15min',
    slug: 'benmarkdiaz-iueznm/15min',
    title: '15 Min Meeting',
    duration: '15 mins',
    desc: 'Quick intro, casual chat, or brief Q&A session.',
    icon: Clock,
  },
  {
    id: 'all',
    slug: 'benmarkdiaz-iueznm',
    title: 'All Event Slots',
    duration: '15m / 30m',
    desc: 'View all event options and pick what fits best.',
    icon: Sparkles,
  },
]

export default function BookMeetingModal({ open, onClose }) {
  const [selectedType, setSelectedType] = useState('30min')
  const [embedReady, setEmbedReady] = useState(false)

  const linkedin = SOCIALS.find((s) => s.key === 'linkedin')
  const subject = encodeURIComponent('Let’s talk — meeting request')
  const body = encodeURIComponent(
    `Hi Benmark,\n\nI'd like to set up some time to talk. Here's a bit about what I have in mind:\n\n[ your project / topic ]\n\nThanks!`
  )

  const activeOption = MEETING_TYPES.find((m) => m.id === selectedType) || MEETING_TYPES[0]

  useEffect(() => {
    if (!open) return
    let cancelled = false
    setEmbedReady(false)

    ;(async () => {
      const cal = await getCalApi({ namespace: CAL_NAMESPACE })
      if (cancelled) return
      const isDark = document.documentElement.classList.contains('dark')
      cal('ui', {
        theme: isDark ? 'dark' : 'light',
        hideEventTypeDetails: true,
        layout: 'month_view',
        cssVarsPerTheme: {
          light: { 'cal-brand': BRAND_COLOR },
          dark: { 'cal-brand': BRAND_COLOR },
        },
      })
      setEmbedReady(true)
    })()

    return () => {
      cancelled = true
    }
  }, [open, selectedType])

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      eyebrow="Book a Meeting"
      meta={<span>Powered by Cal.com</span>}
      maxWidth="max-w-5xl"
    >
      <div className="flex flex-col gap-5 sm:gap-6 py-1 sm:py-2">
        {/* Unboxed Profile & Contact Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 sm:pb-6 border-b border-ink-950/10 dark:border-paper-100/10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative flex-shrink-0">
              <img
                src={PROFILE.avatar}
                alt={PROFILE.name}
                className="h-11 w-11 sm:h-14 sm:w-14 rounded-full object-cover border-2 border-signal-500/30 shadow-md"
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full bg-emerald-500 border-2 border-paper-100 dark:border-ink-950" title="Available for meeting" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display text-base sm:text-xl font-medium text-ink-950 dark:text-paper-100">
                  {PROFILE.name}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-signal-500/10 text-signal-500 text-[9px] sm:text-[10px] font-mono uppercase tracking-wider">
                  Available
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-ink-950/65 dark:text-paper-100/65 mt-0.5">
                Pick a duration below to view available dates & times.
              </p>
            </div>
          </div>

          {/* Direct Contact Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            <a
              href={`mailto:${PROFILE.email}?subject=${subject}&body=${body}`}
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-ink-950/15 dark:border-paper-100/20 text-[11px] sm:text-xs font-mono uppercase tracking-wider hover:border-signal-500 hover:text-signal-500 transition-all cursor-pointer"
            >
              <Mail size={12} className="text-signal-500" />
              <span>Email</span>
              <ArrowUpRight size={11} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
            <a
              href={linkedin?.href || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full border border-ink-950/15 dark:border-paper-100/20 text-[11px] sm:text-xs font-mono uppercase tracking-wider hover:border-signal-500 hover:text-signal-500 transition-all cursor-pointer"
            >
              <Linkedin size={12} className="text-signal-500" />
              <span>LinkedIn</span>
              <ArrowUpRight size={11} className="opacity-50 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          </div>
        </div>

        {/* Meeting Type Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {MEETING_TYPES.map((type) => {
            const Icon = type.icon
            const active = selectedType === type.id
            return (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={`group relative flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl text-left transition-all duration-300 cursor-pointer ${
                  active
                    ? 'bg-signal-500 text-white shadow-[0_0_25px_rgba(61,99,255,0.35)] scale-[1.01]'
                    : 'bg-paper-50/60 dark:bg-ink-900/50 hover:bg-paper-200/50 dark:hover:bg-ink-800/60 text-ink-950 dark:text-paper-100 border border-ink-950/8 dark:border-paper-100/10'
                }`}
              >
                <div className="flex items-center justify-between w-full mb-2.5 sm:mb-3">
                  <div className={`h-7 w-7 sm:h-8 sm:w-8 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${active ? 'bg-white/20 text-white' : 'bg-signal-500/10 text-signal-500'}`}>
                    <Icon size={15} />
                  </div>
                  <span className={`text-[9px] sm:text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-ink-950/5 dark:bg-paper-100/10 text-ink-950/60 dark:text-paper-100/60'}`}>
                    {type.duration}
                  </span>
                </div>
                <div>
                  <h4 className="font-semibold text-xs sm:text-sm">{type.title}</h4>
                  <p className={`text-[11px] sm:text-xs mt-0.5 sm:mt-1 leading-snug ${active ? 'text-white/80' : 'text-ink-950/60 dark:text-paper-100/60'}`}>
                    {type.desc}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Cal.com Embed — Responsive container height */}
        <div className="relative h-[480px] sm:h-[560px] w-full rounded-2xl overflow-hidden bg-paper-50/30 dark:bg-ink-900/30">
          {!embedReady && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-ink-950/50 dark:text-paper-100/50">
              <Loader2 size={22} className="animate-spin text-signal-500" />
              <p className="font-mono text-xs uppercase tracking-widest2">Loading Cal.com scheduler…</p>
            </div>
          )}
          <Cal
            key={selectedType}
            namespace={CAL_NAMESPACE}
            calLink={activeOption.slug}
            style={{ width: '100%', height: '100%', border: 'none' }}
            config={{ layout: 'month_view' }}
          />
        </div>
      </div>
    </ModalShell>
  )
}
