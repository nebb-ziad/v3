import { useEffect, useMemo, useRef, useState } from 'react'
import { X, RotateCcw, Check } from 'lucide-react'
import ModalShell from './ModalShell.jsx'

const WORD_BANK = [
  // common everyday words
  'there', 'even', 'who', 'own', 'know', 'from', 'take', 'here', 'part', 'show',
  'house', 'child', 'person', 'too', 'they', 'follow', 'want', 'possible', 'tell', 'get',
  'good', 'little', 'might', 'never', 'always', 'often', 'because', 'before', 'after', 'again',
  'people', 'place', 'thing', 'world', 'time', 'year', 'day', 'life', 'hand', 'eye',
  // dev / design themed words
  'code', 'build', 'design', 'clean', 'ship', 'focus', 'craft', 'simple', 'fast', 'learn',
  'grow', 'create', 'system', 'layout', 'pixel', 'react', 'style', 'front', 'logic', 'input',
  'output', 'device', 'screen', 'motion', 'detail', 'ready', 'work', 'function', 'component', 'browser',
]

function generateWords(count) {
  const out = []
  for (let i = 0; i < count; i++) {
    out.push(WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)])
  }
  return out
}

const KEY_ROWS = [
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
]

const WORD_COUNT = 26
const BEST_KEY = 'markineb_typing_best_wpm'
const OWNER_NAME = 'markineb'

const ANIM_STYLES = `
@keyframes keyPopIn {
  0% { opacity: 0; transform: translateY(10px) scale(0.85); }
  60% { opacity: 1; transform: translateY(-2px) scale(1.03); }
  100% { opacity: 1; transform: translateY(0) scale(1); }
}
.key-pop-in {
  opacity: 0;
  animation: keyPopIn 0.38s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
@keyframes cursorBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.15; }
}
.blue-cursor {
  animation: cursorBlink 1s step-end infinite;
}
@keyframes chartDraw {
  from { stroke-dashoffset: 1400; }
  to { stroke-dashoffset: 0; }
}
.chart-line {
  stroke-dasharray: 1400;
  stroke-dashoffset: 1400;
  animation: chartDraw 900ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
@keyframes resultFadeUp {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.result-fade-up {
  opacity: 0;
  animation: resultFadeUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}
`

function niceCeil(v, step) {
  return Math.max(step, Math.ceil(v / step) * step)
}

function smoothPath(points) {
  if (points.length === 0) return ''
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`
  let d = `M ${points[0].x} ${points[0].y}`
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i]
    const p1 = points[i + 1]
    const mx = (p0.x + p1.x) / 2
    const my = (p0.y + p1.y) / 2
    d += ` Q ${p0.x} ${p0.y} ${mx} ${my}`
  }
  const last = points[points.length - 1]
  d += ` T ${last.x} ${last.y}`
  return d
}

// Monkeytype-style consistency: 100 minus the coefficient of variation
// of the wpm samples across the run, clamped to [0, 100].
function computeConsistency(series) {
  const vals = series.map((s) => s.wpm).filter((v) => v > 0)
  if (vals.length < 2) return 100
  const mean = vals.reduce((a, b) => a + b, 0) / vals.length
  const variance = vals.reduce((a, b) => a + (b - mean) ** 2, 0) / vals.length
  const stddev = Math.sqrt(variance)
  const cv = mean > 0 ? (stddev / mean) * 100 : 0
  return Math.max(0, Math.min(100, Math.round(100 - cv)))
}

function ResultsChart({ series, errorMarks, elapsed }) {
  const width = 640
  const height = 200
  const pad = { top: 12, right: 34, bottom: 22, left: 34 }
  const plotW = width - pad.left - pad.right
  const plotH = height - pad.top - pad.bottom

  const points = series.length ? series : [{ t: 0, wpm: 0, raw: 0 }]
  const xMax = Math.max(1, Math.ceil(elapsed))
  const yMaxLeft = niceCeil(Math.max(...points.map((p) => Math.max(p.wpm, p.raw)), 10) * 1.15, 10)
  const yMaxRight = niceCeil(Math.max(...errorMarks.map((e) => e.count), 2), 1)

  const xScale = (t) => pad.left + (t / xMax) * plotW
  const yScaleL = (v) => pad.top + plotH - (v / yMaxLeft) * plotH
  const yScaleR = (v) => pad.top + plotH - (v / yMaxRight) * plotH

  const wpmPts = points.map((p) => ({ x: xScale(p.t), y: yScaleL(p.wpm) }))
  const rawPts = points.map((p) => ({ x: xScale(p.t), y: yScaleL(p.raw) }))
  const wpmPath = smoothPath(wpmPts)
  const rawPath = smoothPath(rawPts)

  const yTicksLeft = [0, yMaxLeft / 2, yMaxLeft]
  const yTicksRight = Array.from({ length: yMaxRight + 1 }, (_, i) => i).filter(
    (v) => v === 0 || v === yMaxRight || v === Math.round(yMaxRight / 2)
  )
  const xTicks = [0, xMax / 2, xMax].map((v) => Math.round(v))

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
      {/* horizontal grid */}
      {yTicksLeft.map((v) => (
        <line
          key={v}
          x1={pad.left}
          x2={width - pad.right}
          y1={yScaleL(v)}
          y2={yScaleL(v)}
          className="stroke-black/8 dark:stroke-white/8"
          strokeWidth="1"
        />
      ))}

      {/* left axis labels (wpm/raw) */}
      {yTicksLeft.map((v) => (
        <text
          key={`yl-${v}`}
          x={pad.left - 8}
          y={yScaleL(v) + 3}
          textAnchor="end"
          className="fill-black/40 dark:fill-white/40"
          fontSize="9"
          fontFamily="ui-monospace, monospace"
        >
          {Math.round(v)}
        </text>
      ))}

      {/* right axis labels (errors) */}
      {yTicksRight.map((v) => (
        <text
          key={`yr-${v}`}
          x={width - pad.right + 8}
          y={yScaleR(v) + 3}
          textAnchor="start"
          className="fill-black/30 dark:fill-white/30"
          fontSize="9"
          fontFamily="ui-monospace, monospace"
        >
          {v}
        </text>
      ))}

      {/* x axis labels */}
      {xTicks.map((v, i) => (
        <text
          key={`x-${i}`}
          x={xScale(v)}
          y={height - 4}
          textAnchor={i === 0 ? 'start' : i === xTicks.length - 1 ? 'end' : 'middle'}
          className="fill-black/40 dark:fill-white/40"
          fontSize="9"
          fontFamily="ui-monospace, monospace"
        >
          {v}
        </text>
      ))}

      {/* raw line (thin, muted) */}
      <path
        d={rawPath}
        fill="none"
        className="stroke-black/25 dark:stroke-white/30"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* wpm line (signature, blue) */}
      <path
        key={`wpm-${points.length}`}
        d={wpmPath}
        fill="none"
        stroke="#3d63ff"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="chart-line"
      />

      {/* error markers */}
      {errorMarks.map((e, i) => {
        const cx = xScale(e.t)
        const cy = yScaleR(e.count)
        return (
          <g key={i} stroke="#ef6461" strokeWidth="1.75" strokeLinecap="round">
            <line x1={cx - 3.5} y1={cy} x2={cx + 3.5} y2={cy} />
            <line x1={cx} y1={cy - 3.5} x2={cx} y2={cy + 3.5} />
          </g>
        )
      })}
    </svg>
  )
}

export default function TypingTestModal({ open, onClose }) {
  const [seed, setSeed] = useState(0)
  const words = useMemo(() => generateWords(WORD_COUNT), [seed])

  const [wordIndex, setWordIndex] = useState(0)
  const [current, setCurrent] = useState('')
  const [history, setHistory] = useState([])
  const [correctChars, setCorrectChars] = useState(0)
  const [totalChars, setTotalChars] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [elapsed, setElapsed] = useState(0)
  const [done, setDone] = useState(false)
  const [best, setBest] = useState(null)
  const [isNewBest, setIsNewBest] = useState(false)
  const [series, setSeries] = useState([])
  const [errorMarks, setErrorMarks] = useState([])

  const inputRef = useRef(null)
  const lastSampleRef = useRef(0)
  const errorCountRef = useRef(0)
  const latestStatsRef = useRef({ wpm: 0, raw: 0 })

  const reset = () => {
    setSeed((s) => s + 1)
    setWordIndex(0)
    setCurrent('')
    setHistory([])
    setCorrectChars(0)
    setTotalChars(0)
    setStartTime(null)
    setElapsed(0)
    setDone(false)
    setIsNewBest(false)
    setSeries([])
    setErrorMarks([])
    lastSampleRef.current = 0
    errorCountRef.current = 0
  }

  const target = words[wordIndex] || ''

  const liveCorrect = [...current].filter((c, i) => c === target[i]).length
  const minutes = Math.max(elapsed / 60, 1 / 60)
  const totalCorrectSoFar = correctChars + liveCorrect
  const totalCharsSoFar = totalChars + current.length
  const wpm = totalCorrectSoFar > 0 ? Math.round(totalCorrectSoFar / 5 / minutes) : 0
  const rawWpm = totalCharsSoFar > 0 ? Math.round(totalCharsSoFar / 5 / minutes) : 0
  const acc = totalCharsSoFar > 0 ? Math.round((totalCorrectSoFar / totalCharsSoFar) * 100) : 100
  const nextChar = current.length < target.length ? target[current.length] : ' '
  const errorCharsSoFar = Math.max(0, totalCharsSoFar - totalCorrectSoFar)
  const consistency = computeConsistency(series)

  useEffect(() => {
    latestStatsRef.current = { wpm, raw: rawWpm }
  })

  useEffect(() => {
    if (open) {
      try {
        const stored = parseInt(localStorage.getItem(BEST_KEY) || '0', 10)
        setBest(stored || null)
      } catch {
        setBest(null)
      }
      reset()
      const t = setTimeout(() => inputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    if (!startTime || done) return
    const id = setInterval(() => {
      const t = (Date.now() - startTime) / 1000
      setElapsed(t)
      const sec = Math.floor(t)
      if (sec > lastSampleRef.current) {
        lastSampleRef.current = sec
        setSeries((s) => [...s, { t: sec, wpm: latestStatsRef.current.wpm, raw: latestStatsRef.current.raw }])
      }
    }, 200)
    return () => clearInterval(id)
  }, [startTime, done])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        reset()
        inputRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (!done) return
    // capture a final sample so the line reaches the finish time
    setSeries((s) => {
      const last = s[s.length - 1]
      if (last && Math.abs(last.t - elapsed) < 0.3) return s
      return [...s, { t: elapsed, wpm, raw: rawWpm }]
    })
    try {
      const stored = parseInt(localStorage.getItem(BEST_KEY) || '0', 10)
      if (wpm > stored) {
        localStorage.setItem(BEST_KEY, String(wpm))
        setIsNewBest(true)
        setBest(wpm)
      } else {
        setIsNewBest(false)
        setBest(stored)
      }
    } catch {
      // storage unavailable — skip persistence
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done])

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('markineb:typingtest', { detail: { open } }))
    return () => {
      if (open) window.dispatchEvent(new CustomEvent('markineb:typingtest', { detail: { open: false } }))
    }
  }, [open])

  if (!open) return null

  const commitWord = (typedWord, countSeparator = true) => {
    const len = Math.max(typedWord.length, target.length)
    let matched = 0
    for (let i = 0; i < len; i++) {
      if (typedWord[i] && typedWord[i] === target[i]) matched++
    }
    const sep = countSeparator ? 1 : 0 // +1 for the separating space, skipped on auto-finish
    setCorrectChars((c) => c + matched + sep)
    setTotalChars((t) => t + len + sep)
    setHistory((h) => [...h, { word: target, typed: typedWord, correct: typedWord === target }])

    if (typedWord !== target) {
      errorCountRef.current += 1
      setErrorMarks((m) => [...m, { t: elapsed, count: errorCountRef.current }])
    }
  }

  const onChange = (e) => {
    const val = e.target.value
    if (done) return
    if (!startTime) setStartTime(Date.now())

    const isLastWord = wordIndex === words.length - 1

    if (val.endsWith(' ')) {
      const typedWord = val.trim()
      if (!typedWord) return
      commitWord(typedWord)
      const nextIndex = wordIndex + 1
      setCurrent('')
      if (nextIndex >= words.length) {
        setDone(true)
      } else {
        setWordIndex(nextIndex)
      }
    } else if (isLastWord && val.length >= target.length) {
      // last word finished — auto-submit without waiting for a trailing space
      commitWord(val, false)
      setCurrent(val)
      setDone(true)
    } else {
      setCurrent(val)
    }
  }

  return (
    <ModalShell
      open={open}
      onClose={onClose}
      eyebrow="Typing Test"
      maxWidth="max-w-3xl"
      footerLeft={
        <button onClick={reset} className="inline-flex items-center gap-2 hover:text-signal-500 transition-colors">
          <kbd className="px-1.5 py-0.5 border border-ink-950/20 dark:border-paper-100/20 rounded-sm text-[10px] normal-case">tab</kbd>
          restart
        </button>
      }
    >
      <style>{ANIM_STYLES}</style>

      <div className="text-black dark:text-white">
        {done ? (
              /* ---------- Results screen ---------- */
              <div className="result-fade-up">
                <div className="flex flex-col sm:flex-row sm:items-stretch gap-8 sm:gap-6">
                  {/* left: headline stats */}
                  <div className="flex sm:flex-col gap-8 sm:gap-6 sm:w-28 flex-shrink-0">
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest2 text-black/45 dark:text-white/45 mb-1">WPM</p>
                      <p className="font-pixel text-5xl leading-none tabular-nums text-signal-500">{wpm}</p>
                    </div>
                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest2 text-black/45 dark:text-white/45 mb-1">ACC</p>
                      <p className="font-pixel text-5xl leading-none tabular-nums text-black dark:text-white">
                        {acc}<span className="text-lg align-top ml-0.5 text-black/50 dark:text-white/50">%</span>
                      </p>
                    </div>
                  </div>

                  {/* right: chart */}
                  <div className="flex-1 min-w-0">
                    <ResultsChart series={series} errorMarks={errorMarks} elapsed={elapsed} />
                  </div>
                </div>

                <div className="mt-2 flex items-center gap-2 font-mono text-xs text-black/60 dark:text-white/60">
                  {isNewBest ? (
                    <>
                      <Check size={13} className="text-signal-500" />
                      <span className="text-signal-500">new personal best · {wpm} wpm</span>
                    </>
                  ) : (
                    <>
                      <X size={13} />
                      <span>you didn&apos;t beat {OWNER_NAME} · {best ?? wpm} wpm</span>
                    </>
                  )}
                </div>

                <div className="h-px bg-black/8 dark:bg-white/10 my-6" />

                <div className="flex flex-wrap items-start gap-x-10 gap-y-5">
                  {[
                    ['TEST TYPE', `words ${WORD_COUNT}`],
                    ['RAW', rawWpm],
                    ['CHARACTERS', `${totalCorrectSoFar}/${errorCharsSoFar}`],
                    ['CONSISTENCY', `${consistency}%`],
                    ['TIME', `${elapsed.toFixed(1)}s`],
                  ].map(([label, val]) => (
                    <div key={label}>
                      <p className="font-mono text-[10px] uppercase tracking-widest2 text-black/45 dark:text-white/45 mb-1">{label}</p>
                      <p className="font-mono text-lg text-black dark:text-white">{val}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 bg-signal-500 text-white px-6 py-3 rounded-full font-mono text-xs normal-case hover:opacity-85 transition-opacity"
                  >
                    <RotateCcw size={14} /> restart
                  </button>
                </div>
              </div>
            ) : (
              /* ---------- Active test ---------- */
              <>
                <div className="flex flex-wrap items-end gap-6 sm:gap-10 mb-8">
                  {[
                    ['WPM', wpm, ''],
                    ['ACC', acc, '%'],
                    ['TIME', Math.floor(elapsed), 's'],
                  ].map(([label, val, suffix]) => (
                    <div key={label}>
                      <div className="flex items-baseline gap-1">
                        <span className="font-pixel text-3xl sm:text-4xl tabular-nums text-signal-500">{val}</span>
                        {suffix && <span className="text-sm text-black/50 dark:text-white/50">{suffix}</span>}
                      </div>
                      <p className="mt-1 font-mono text-[10px] uppercase tracking-widest2 text-black/50 dark:text-white/50">{label}</p>
                    </div>
                  ))}
                </div>

                <div
                  onClick={() => inputRef.current?.focus()}
                  className="relative font-mono text-lg leading-relaxed tracking-wide cursor-text select-none mb-8 min-h-[84px]"
                >
                  {words.map((w, wi) => {
                    if (wi < wordIndex) {
                      const h = history[wi]
                      return (
                        <span key={wi} className="mr-2.5 inline-block">
                          {[...w].map((ch, ci) => (
                            <span
                              key={ci}
                              className={
                                h && h.typed[ci] === ch
                                  ? 'text-black/35 dark:text-white/35'
                                  : 'text-signal-500 underline decoration-2 underline-offset-2'
                              }
                            >
                              {ch}
                            </span>
                          ))}
                        </span>
                      )
                    }
                    if (wi === wordIndex) {
                      return (
                        <span key={wi} className="mr-2.5 inline-block relative">
                          {[...w].map((ch, ci) => {
                            const typedCh = current[ci]
                            let cls = 'text-black/30 dark:text-white/30'
                            if (typedCh !== undefined) {
                              cls = typedCh === ch
                                ? 'text-black dark:text-white'
                                : 'text-signal-500 bg-signal-500/10'
                            }
                            return (
                              <span key={ci} className="relative">
                                {ci === current.length && (
                                  <span className="blue-cursor absolute -left-px top-0 bottom-0 w-[2px] bg-signal-500" />
                                )}
                                <span className={cls}>{ch}</span>
                              </span>
                            )
                          })}
                          {current.length >= w.length && (
                            <span className="relative">
                              <span className="blue-cursor absolute -left-px top-0 bottom-0 w-[2px] bg-signal-500" />
                            </span>
                          )}
                          {current.length > w.length && (
                            <span className="text-signal-500/70">{current.slice(w.length)}</span>
                          )}
                        </span>
                      )
                    }
                    return (
                      <span key={wi} className="mr-2.5 inline-block text-black/30 dark:text-white/30">
                        {w}
                      </span>
                    )
                  })}
                  <input
                    ref={inputRef}
                    value={current}
                    onChange={onChange}
                    className="absolute inset-0 opacity-0 cursor-text"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck="false"
                  />
                </div>

                {/* Decorative next-key highlight — needs room for a full QWERTY
                   row, so it only shows from tablet width up; phones still
                   type fine via the hidden input above, just without it. */}
                <div className="hidden sm:block space-y-2.5 mb-2">
                  {KEY_ROWS.map((row, ri) => (
                    <div key={ri} className="flex justify-center gap-2 md:gap-2.5" style={{ paddingLeft: `${ri * 22}px` }}>
                      {row.map((k, ki) => {
                        const isNext = nextChar?.toLowerCase() === k
                        const keyDelay = (ri * row.length + ki) * 18
                        return (
                          <span
                            key={k}
                            style={{ animationDelay: `${keyDelay}ms` }}
                            className={`key-pop-in h-10 w-10 md:h-12 md:w-12 flex items-center justify-center rounded-lg font-mono text-sm lowercase transition-colors duration-150 ${
                              isNext
                                ? 'bg-signal-500 text-white border border-signal-500'
                                : 'bg-white dark:bg-black text-black dark:text-white border border-black/15 dark:border-white/15'
                            }`}
                          >
                            {k}
                          </span>
                        )
                      })}
                    </div>
                  ))}
                  <div className="flex justify-center pt-1">
                    <span
                      style={{ animationDelay: `${KEY_ROWS.reduce((n, r) => n + r.length, 0) * 18}ms` }}
                      className={`key-pop-in h-10 md:h-12 w-52 flex items-center justify-center rounded-lg font-mono text-[10px] uppercase tracking-widest2 transition-colors duration-150 ${
                        nextChar === ' '
                          ? 'bg-signal-500 text-white border border-signal-500'
                          : 'bg-white dark:bg-black text-black/50 dark:text-white/50 border border-black/15 dark:border-white/15'
                      }`}
                    >
                      Space
                    </span>
                  </div>
                </div>
              </>
            )}
      </div>
    </ModalShell>
  )
}