import { useState } from 'react'
import { ArrowLeft, ChevronDown } from 'lucide-react'
import WorksTab from '../tabs/WorksTab.jsx'
// Adjust this path to wherever you place works-bg.jpg in your project (e.g. src/assets/)
import worksBg from '../../../assets/works-bg.jpg'

const NAV_ITEMS = [
  { id: 'work-projects', number: '01', label: 'Projects', caption: 'Development & Design Works' },
  { id: 'work-certificates', number: '02', label: 'Certificates', caption: 'Professional Achievements' },
]

export default function WorksPage({ onBack }) {
  const [activeTab, setActiveTab] = useState('work-projects')

  const goToTab = (id) => {
    setActiveTab(id)
    document.getElementById('works-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div>
      {/* ---------------- Hero ---------------- */}
      <section className="relative min-h-[90vh] flex flex-col justify-between overflow-hidden bg-ink-950">
        <img
          src={worksBg}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/60 via-ink-950/70 to-ink-950" />

        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-6 sm:px-8 pt-24 sm:pt-28 pb-8 flex-1 flex flex-col justify-between">
          {/* Top Bar: Back home */}
          <div>
            <button
              onClick={onBack}
              className="inline-flex items-center gap-2 py-2.5 -my-2.5 -mx-2 px-2 font-mono text-xs uppercase tracking-widest2 text-paper-100/60 hover:text-signal-500 active:text-signal-500 transition-colors w-fit cursor-pointer"
            >
              <ArrowLeft size={14} /> Back home
            </button>
          </div>

          {/* Vertical Centered Hero Block with Original Left Layout */}
          <div className="my-auto py-10">
            <h1 className="font-display italic text-[clamp(3.5rem,11vw,7rem)] leading-none text-paper-100">
              Works
            </h1>
            <p className="mt-4 font-mono text-sm sm:text-base text-paper-100/55">
              Projects, Certificates, and Experiences
            </p>

            {/* Original Tab Switcher Layout */}
            <nav className="mt-14 flex flex-col gap-6">
              {NAV_ITEMS.map((item) => {
                const isActive = activeTab === item.id
                return (
                  <button
                    key={item.id}
                    onClick={() => goToTab(item.id)}
                    aria-current={isActive ? 'true' : undefined}
                    className="group flex items-stretch gap-4 text-left w-fit py-2 -my-2 cursor-pointer"
                  >
                    <span
                      className={`w-1 rounded-full transition-colors duration-300 ${
                        isActive ? 'bg-signal-500' : 'bg-paper-100/15'
                      }`}
                    />
                    <span className="font-mono text-xs text-paper-100/35 self-center">
                      {item.number}
                    </span>
                    <span>
                      <span
                        className={`block font-display text-2xl sm:text-3xl transition-colors duration-300 ${
                          isActive ? 'text-paper-100' : 'text-paper-100/35 group-hover:text-paper-100/60'
                        }`}
                      >
                        {item.label}
                      </span>
                      <span className="block font-mono text-xs text-paper-100/35">{item.caption}</span>
                    </span>
                  </button>
                )
              })}
            </nav>
          </div>

          {/* Bottom Scroll Indicator */}
          <button
            onClick={() => goToTab(activeTab)}
            className="mx-auto mb-2 flex flex-col items-center gap-2 py-2 font-mono text-xs uppercase tracking-widest2 text-paper-100/45 hover:text-signal-500 active:text-signal-500 transition-colors cursor-pointer"
          >
            Scroll Down
            <ChevronDown size={16} className="animate-bounce" />
          </button>
        </div>
      </section>

      {/* ---------------- Content ---------------- */}
      <section id="works-content" className="py-24 sm:py-32">
        <div className="mx-auto max-w-[1200px] px-6 sm:px-8">
          <WorksTab activeTab={activeTab} />
        </div>
      </section>
    </div>
  )
}