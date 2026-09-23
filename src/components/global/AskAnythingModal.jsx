import { useEffect, useRef, useState } from 'react'
import { ArrowUp, RotateCcw, ExternalLink, Download, Mail } from 'lucide-react'
import ModalShell from './ModalShell.jsx'
import { PROFILE } from '../../lib/portfolioData.js'
import { getScriptedResponse } from '../../lib/askScriptEngine.js'

// Optional backend proxy URL. If not provided or still pointing at default dummy localhost,
// the widget immediately uses the smart scripted engine with zero network lag or console errors.
const CONFIGURED_API_URL = import.meta.env?.VITE_ASK_API_URL
const HAS_CUSTOM_BACKEND = Boolean(
  CONFIGURED_API_URL && !CONFIGURED_API_URL.includes('localhost:5000')
)

const INITIAL_SUGGESTIONS = [
  "What is Benmark's tech stack?",
  'What projects has he built?',
  'Is he available for OJT?',
  'Where does he study?',
]

const ORB_STYLES = `
@keyframes orbPulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.06); opacity: 0.85; }
}
@keyframes dotBounce {
  0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
  30% { transform: translateY(-3px); opacity: 1; }
}
.ai-orb {
  background: conic-gradient(from 0deg, #6366f1, #8b5cf6, #22d3ee, #6366f1);
}
.ai-orb--idle {
  animation: orbPulse 2.4s ease-in-out infinite;
}
.ai-dot {
  animation: dotBounce 1.1s ease-in-out infinite;
}
`

function Orb({ size = 12, idle = false }) {
  return (
    <span
      className={`inline-block rounded-full flex-shrink-0 ${idle ? 'ai-orb--idle' : 'ai-orb'}`}
      style={{ width: size, height: size }}
    />
  )
}

function FormattedMessage({ text }) {
  if (!text) return null
  const paragraphs = text.split('\n\n')

  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {paragraphs.map((p, pIdx) => {
        const isQuote = p.startsWith('> ')
        if (isQuote) {
          const quoteContent = p.replace(/^>\s*/gm, '')
          return (
            <blockquote
              key={pIdx}
              className="border-l-2 border-indigo-400 pl-3 italic text-ink-950/80 dark:text-paper-100/80 my-1.5"
            >
              {quoteContent}
            </blockquote>
          )
        }

        const lines = p.split('\n')
        return (
          <div key={pIdx}>
            {lines.map((line, lIdx) => {
              const isBullet = line.startsWith('• ') || line.startsWith('- ')
              const cleanLine = isBullet ? line.replace(/^[•\-]\s*/, '') : line
              const parts = cleanLine.split(/(\*\*.*?\*\*)/g)

              return (
                <div key={lIdx} className={isBullet ? 'flex items-start gap-1.5 my-0.5' : ''}>
                  {isBullet && <span className="text-signal-500 font-bold">•</span>}
                  <span>
                    {parts.map((part, partIdx) => {
                      if (part.startsWith('**') && part.endsWith('**')) {
                        return (
                          <strong
                            key={partIdx}
                            className="font-semibold text-ink-950 dark:text-paper-50"
                          >
                            {part.slice(2, -2)}
                          </strong>
                        )
                      }
                      return part
                    })}
                  </span>
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default function AskAnythingModal({ open, onClose }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
    } else {
      setMessages([])
      setInput('')
      setLoading(false)
    }
  }, [open])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages, loading])

  const handleReset = () => {
    setMessages([])
    setInput('')
    setLoading(false)
    setTimeout(() => inputRef.current?.focus(), 80)
  }

  const send = async (text) => {
    const content = (text ?? input).trim()
    if (!content || loading) return

    setInput('')
    const next = [...messages, { role: 'user', content }]
    setMessages(next)
    setLoading(true)

    // Check if a custom backend endpoint is provided
    if (HAS_CUSTOM_BACKEND) {
      try {
        const res = await fetch(CONFIGURED_API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: next }),
        })
        const data = await res.json().catch(() => ({}))
        if (res.ok && data.reply) {
          setMessages((m) => [
            ...m,
            { role: 'assistant', content: data.reply, suggestions: [], actions: [] },
          ])
          setLoading(false)
          return
        }
      } catch (err) {
        console.warn('Backend unavailable, falling back to script engine:', err)
      }
    }

    // High-performance, intelligent scripted assistant response
    // Simulated realistic response timing
    setTimeout(() => {
      const response = getScriptedResponse(content)
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: response.text,
          suggestions: response.suggestions || [],
          actions: response.actions || [],
        },
      ])
      setLoading(false)
    }, 380)
  }

  const firstName = PROFILE.name.split(' ')[0]

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      eyebrow="Ask Anything"
      meta={
        <div className="flex items-center gap-3">
          {messages.length > 0 && (
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider text-ink-950/60 dark:text-paper-100/60 hover:text-signal-500 transition-colors"
              title="Reset conversation"
            >
              <RotateCcw size={11} />
              <span>Reset</span>
            </button>
          )}
          <span className="inline-flex items-center gap-1.5 text-xs font-mono">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            AI Assistant
          </span>
        </div>
      }
      maxWidth="max-w-2xl"
    >
      <style>{ORB_STYLES}</style>

      <div className="flex flex-col h-[min(74dvh,640px)]">
        {messages.length === 0 ? (
          <div className="flex-1 min-h-0 flex flex-col items-center justify-center text-center gap-5 px-2">
            <span className="h-16 w-16 rounded-full flex items-center justify-center p-[3px]">
            <span className="ai-orb--idle h-full w-full rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="images/profile.png"
                alt={PROFILE.name}
                className="h-[85%] w-[85%] rounded-full object-cover"
              />
            </span>
          </span>

            <div className="space-y-1.5">
              <h3 className="font-display text-2xl sm:text-3xl font-semibold">
                Ask me anything
              </h3>
              <p className="text-sm text-ink-950/60 dark:text-paper-100/60 max-w-sm mx-auto">
                Ask about {firstName}'s tech stack, featured projects, education, or availability.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 max-w-md">
              {INITIAL_SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="font-mono text-[11px] border border-ink-950/15 dark:border-paper-100/18 rounded-full px-3 py-1.5 hover:border-signal-500 hover:text-signal-500 transition-all active:scale-95 text-left"
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
              className="group relative mt-2 w-full max-w-lg flex items-center gap-2"
            >
              <span className="relative flex-1 flex items-center gap-2 rounded-full pl-4 pr-1.5 py-1.5 shadow-sm border border-ink-950/10 dark:border-paper-100/10 focus-within:border-signal-500 transition-colors">
                <span className="pointer-events-none absolute inset-[1.5px] rounded-full bg-paper-100 dark:bg-ink-950" />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask ${firstName}'s assistant…`}
                  className="relative flex-1 min-w-0 bg-transparent text-sm focus:outline-none py-1.5 placeholder:text-ink-950/40 dark:placeholder:text-paper-100/40"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                  className="relative h-8 w-8 flex-shrink-0 rounded-full text-white flex items-center justify-center disabled:opacity-30 hover:opacity-90 transition-all active:scale-90 ai-orb"
                >
                  <ArrowUp size={14} />
                </button>
              </span>
            </form>
          </div>
        ) : (
          <>
            <div
              ref={scrollRef}
              className="flex-1 min-h-0 overflow-y-auto space-y-4 pr-1 -mr-1"
            >
              {messages.map((m, i) => (
                <div key={i} className="space-y-2">
                  <div
                    className={`flex gap-2.5 ${
                      m.role === 'user' ? 'justify-end' : 'justify-start items-start'
                    }`}
                  >
                    {m.role === 'assistant' && (
                      <div className="mt-1">
                        <Orb size={16} />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        m.role === 'user'
                          ? 'bg-ink-950 dark:bg-paper-100 text-paper-100 dark:text-ink-950 rounded-br-sm'
                          : 'bg-ink-950/6 dark:bg-paper-100/8 border border-ink-950/5 dark:border-paper-100/10 rounded-bl-sm'
                      }`}
                    >
                      {m.role === 'user' ? (
                        <p>{m.content}</p>
                      ) : (
                        <div>
                          <FormattedMessage text={m.content} />

                          {/* Quick action buttons if available */}
                          {m.actions && m.actions.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3 pt-2.5 border-t border-ink-950/10 dark:border-paper-100/10">
                              {m.actions.map((act, aIdx) => (
                                <a
                                  key={aIdx}
                                  href={act.href}
                                  target={act.type === 'email' ? undefined : '_blank'}
                                  rel="noopener noreferrer"
                                  download={act.type === 'file'}
                                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-ink-950/10 dark:bg-paper-100/10 hover:bg-signal-500 hover:text-white dark:hover:bg-signal-500 dark:hover:text-white transition-colors"
                                >
                                  {act.type === 'email' && <Mail size={12} />}
                                  {act.type === 'file' && <Download size={12} />}
                                  {act.type === 'external' && <ExternalLink size={12} />}
                                  <span>{act.label}</span>
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Suggestion pills under the latest assistant response */}
                  {i === messages.length - 1 &&
                    m.role === 'assistant' &&
                    m.suggestions &&
                    m.suggestions.length > 0 &&
                    !loading && (
                      <div className="flex flex-wrap gap-1.5 pl-6 pt-1">
                        {m.suggestions.map((sug, sIdx) => (
                          <button
                            key={sIdx}
                            onClick={() => send(sug)}
                            className="font-mono text-[11px] px-2.5 py-1 rounded-full border border-ink-950/15 dark:border-paper-100/18 text-ink-950/80 dark:text-paper-100/80 hover:border-signal-500 hover:text-signal-500 hover:bg-signal-500/5 transition-all text-left active:scale-95"
                          >
                            + {sug}
                          </button>
                        ))}
                      </div>
                    )}
                </div>
              ))}

              {loading && (
                <div className="flex gap-2.5 justify-start items-start">
                  <div className="mt-1">
                    <Orb size={16} />
                  </div>
                  <div className="bg-ink-950/6 dark:bg-paper-100/8 border border-ink-950/5 dark:border-paper-100/10 rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                    <span
                      className="ai-dot h-1.5 w-1.5 rounded-full bg-current text-ink-950/60 dark:text-paper-100/60"
                      style={{ animationDelay: '0ms' }}
                    />
                    <span
                      className="ai-dot h-1.5 w-1.5 rounded-full bg-current text-ink-950/60 dark:text-paper-100/60"
                      style={{ animationDelay: '150ms' }}
                    />
                    <span
                      className="ai-dot h-1.5 w-1.5 rounded-full bg-current text-ink-950/60 dark:text-paper-100/60"
                      style={{ animationDelay: '300ms' }}
                    />
                  </div>
                </div>
              )}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                send()
              }}
              className="group relative mt-4 flex-shrink-0 flex items-center gap-2"
            >
              <span className="relative flex-1 flex items-center gap-2 rounded-full pl-4 pr-1.5 py-1.5 border border-ink-950/15 dark:border-paper-100/18 focus-within:border-signal-500 transition-colors">
                <span className="pointer-events-none absolute inset-[1.5px] rounded-full bg-paper-100 dark:bg-ink-950" />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Ask about ${firstName}'s work…`}
                  className="relative flex-1 min-w-0 bg-transparent text-sm focus:outline-none py-1.5 placeholder:text-ink-950/40 dark:placeholder:text-paper-100/40"
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim()}
                  aria-label="Send"
                  className="relative h-8 w-8 flex-shrink-0 rounded-full text-white flex items-center justify-center disabled:opacity-30 hover:opacity-90 transition-all active:scale-90 ai-orb"
                >
                  <ArrowUp size={14} />
                </button>
              </span>
            </form>
          </>
        )}
      </div>
    </ModalShell>
  )
}