import React, { useEffect, useMemo, useRef, useState } from 'react'
import { X, Cloud, Play, Pause, RotateCcw, Globe, Laptop, Activity, Wifi, ArrowDown, ArrowUp, Clock, AlertCircle } from 'lucide-react'
import { runSpeedTest } from '../../lib/cloudflareSpeed.js'

const PHASE_LABEL = {
  idle: 'READY TO TEST',
  locating: 'LOCATING EDGE SERVER…',
  latency: 'TESTING LATENCY & JITTER',
  download: 'DOWNLOAD',
  upload: 'UPLOAD',
  packetloss: 'PACKET STABILITY',
  done: 'TEST COMPLETE',
  error: 'TEST FAILED',
}

const PHASE_ORDER = ['locating', 'latency', 'download', 'upload', 'packetloss', 'done']
const MAX_SAMPLES = 48

function clamp(n, a, b) {
  return Math.min(b, Math.max(a, n))
}

function formatMbps(n) {
  const v = Number(n) || 0
  if (v >= 100) return v.toFixed(0)
  if (v >= 10) return v.toFixed(1)
  return v.toFixed(2)
}

function percentile(arr, p) {
  if (!arr.length) return 0
  const s = [...arr].sort((a, b) => a - b)
  const i = clamp((s.length - 1) * p, 0, s.length - 1)
  const lo = Math.floor(i)
  const hi = Math.ceil(i)
  const t = i - lo
  return s[lo] * (1 - t) + s[hi] * t
}

function smoothPath(values, width, height, max) {
  if (!values.length) return ''
  const n = values.length
  const safeMax = Math.max(1, max)
  const pts = values.map((v, i) => {
    const x = n === 1 ? 0 : (i / (n - 1)) * width
    const y = height - (v / safeMax) * height
    return [x, y]
  })
  if (pts.length === 1) return `M 0 ${pts[0][1]} L ${width} ${pts[0][1]}`

  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? 0 : i - 1]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] || p2
    const cp1x = (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)
    const cp1y = (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)
    const cp2x = (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)
    const cp2y = (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)
    d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`
  }
  return d
}

function gradeFrom(result) {
  if (!result) return null
  const d = result.downloadMbps || 0
  const ping = result.pingMs ?? 999
  const loss = result.packetLossPct ?? 0
  if (d >= 150 && ping < 30 && loss < 1) return { label: 'EXCELLENT', color: '#6f8dff' }
  if (d >= 50 && ping < 60 && loss < 2) return { label: 'STRONG', color: '#3d63ff' }
  if (d >= 20 && ping < 90) return { label: 'FAIR', color: '#f59e0b' }
  return { label: 'LIMITED', color: '#f43f5e' }
}

export default function SpeedTestModal({ open, onClose }) {
  const [rendered, setRendered] = useState(open)
  const [visible, setVisible] = useState(false)

  const [phase, setPhase] = useState('idle')
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [paused, setPaused] = useState(false)

  // Animated display values
  const [displayDown, setDisplayDown] = useState(0)
  const [displayUp, setDisplayUp] = useState(0)
  const [liveLatency, setLiveLatency] = useState(null)
  const [liveJitter, setLiveJitter] = useState(null)
  const [liveLoss, setLiveLoss] = useState(null)

  // Sparkline sample arrays
  const [downloadSamples, setDownloadSamples] = useState([])
  const [uploadSamples, setUploadSamples] = useState([])

  // Internal animation & status refs
  const testHandleRef = useRef(null)
  const targetDownRef = useRef(0)
  const targetUpRef = useRef(0)
  const currentDownRef = useRef(0)
  const currentUpRef = useRef(0)
  const runningRef = useRef(false)
  const lastSamplePushRef = useRef(0)
  const rafRef = useRef(null)

  const isRunning = ['locating', 'latency', 'download', 'upload', 'packetloss'].includes(phase)

  // Handle open / close animation & body overflow
  useEffect(() => {
    if (open) {
      setRendered(true)
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
      document.documentElement.classList.add('overflow-hidden')
      return () => cancelAnimationFrame(raf)
    } else {
      setVisible(false)
      const timer = setTimeout(() => {
        setRendered(false)
        document.documentElement.classList.remove('overflow-hidden')
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [open])

  // ESC key listener
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Cleanup on close / unmount
  useEffect(() => {
    if (!open) {
      if (testHandleRef.current) {
        testHandleRef.current.abort()
        testHandleRef.current = null
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      runningRef.current = false
      setPhase('idle')
      setResult(null)
      setError(null)
      setPaused(false)
      setDisplayDown(0)
      setDisplayUp(0)
      setLiveLatency(null)
      setLiveJitter(null)
      setLiveLoss(null)
      setDownloadSamples([])
      setUploadSamples([])
    }
  }, [open])

  // Butter-Smooth Animation Loop for display number interpolation
  const startAnimationLoop = () => {
    if (rafRef.current) return

    let lastFlush = 0
    const tick = (now) => {
      const ease = 0.16
      const dDiff = targetDownRef.current - currentDownRef.current
      const uDiff = targetUpRef.current - currentUpRef.current

      currentDownRef.current += dDiff * ease
      currentUpRef.current += uDiff * ease

      if (now - lastFlush > 32) {
        lastFlush = now
        setDisplayDown(currentDownRef.current)
        setDisplayUp(currentUpRef.current)
      }

      if (runningRef.current || Math.abs(dDiff) > 0.05 || Math.abs(uDiff) > 0.05) {
        rafRef.current = requestAnimationFrame(tick)
      } else {
        setDisplayDown(targetDownRef.current)
        setDisplayUp(targetUpRef.current)
        rafRef.current = null
      }
    }

    rafRef.current = requestAnimationFrame(tick)
  }

  const start = async () => {
    if (runningRef.current) return
    runningRef.current = true

    if (testHandleRef.current) {
      testHandleRef.current.abort()
      testHandleRef.current = null
    }

    setPaused(false)
    setError(null)
    setResult(null)
    targetDownRef.current = 0
    targetUpRef.current = 0
    currentDownRef.current = 0
    currentUpRef.current = 0
    setDisplayDown(0)
    setDisplayUp(0)
    setLiveLatency(null)
    setLiveJitter(null)
    setLiveLoss(null)
    setDownloadSamples([])
    setUploadSamples([])
    lastSamplePushRef.current = 0

    startAnimationLoop()

    try {
      const handle = runSpeedTest({
        onPhase: (newPhase) => {
          setPhase(newPhase)
        },
        onProgress: (data) => {
          const now = performance.now()

          if (data.downloadMbps > 0) targetDownRef.current = data.downloadMbps
          if (data.uploadMbps > 0) targetUpRef.current = data.uploadMbps
          if (data.pingMs != null) setLiveLatency(data.pingMs)
          if (data.jitterMs != null) setLiveJitter(data.jitterMs)
          if (data.packetLossPct != null) setLiveLoss(data.packetLossPct)

          if (now - lastSamplePushRef.current >= 95) {
            lastSamplePushRef.current = now
            if (data.phase === 'download' && data.downloadMbps > 0) {
              setDownloadSamples((prev) => {
                const next =
                  prev.length >= MAX_SAMPLES ? prev.slice(prev.length - MAX_SAMPLES + 1) : [...prev]
                next.push(data.downloadMbps)
                return next
              })
            } else if (data.phase === 'upload' && data.uploadMbps > 0) {
              setUploadSamples((prev) => {
                const next =
                  prev.length >= MAX_SAMPLES ? prev.slice(prev.length - MAX_SAMPLES + 1) : [...prev]
                next.push(data.uploadMbps)
                return next
              })
            }
          }
        },
      })

      testHandleRef.current = handle
      const res = await handle
      setResult(res)
      targetDownRef.current = res.downloadMbps || 0
      targetUpRef.current = res.uploadMbps || 0
      setPhase('done')
    } catch (e) {
      setPhase('error')
      setError(e.message || 'Connection test failed. Please try again.')
    } finally {
      runningRef.current = false
      testHandleRef.current = null
    }
  }

  const togglePause = () => {
    if (!isRunning || !testHandleRef.current) return
    if (paused) {
      testHandleRef.current.play()
      setPaused(false)
    } else {
      testHandleRef.current.pause()
      setPaused(true)
    }
  }

  if (!rendered) return null

  // Metric value formatting
  const mainValue =
    phase === 'upload'
      ? formatMbps(displayUp)
      : phase === 'latency'
      ? liveLatency != null
        ? liveLatency.toFixed(0)
        : '0'
      : formatMbps(displayDown)

  const mainUnit = phase === 'latency' ? 'ms' : 'Mbps'

  const activeSamples = phase === 'upload' ? uploadSamples : downloadSamples
  const sparklineColor = phase === 'upload' ? '#a78bfa' : '#3d63ff'
  const sparklineMax = Math.max(10, ...activeSamples, percentile(activeSamples, 0.9) * 1.1)
  const sparklinePath = smoothPath(activeSamples, 600, 120, sparklineMax)

  const latencyVal =
    result?.pingMs != null
      ? result.pingMs.toFixed(0)
      : liveLatency != null
      ? liveLatency.toFixed(0)
      : '—'

  const jitterVal =
    result?.jitterMs != null
      ? result.jitterMs.toFixed(1)
      : liveJitter != null
      ? liveJitter.toFixed(1)
      : '—'

  const lossVal =
    result?.packetLossPct != null
      ? `${result.packetLossPct}%`
      : liveLoss != null
      ? `${liveLoss}%`
      : '—'

  const grade = gradeFrom(result)

  return (
    <div
      className={`fixed inset-0 z-[95] bg-[#07080b] text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden transition-all duration-300 ease-out-expo ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-[0.99] pointer-events-none'
      }`}
    >
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-signal-500/15 blur-[160px]" />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <h2 className="font-display text-sm sm:text-base uppercase tracking-widest2 text-white/90">
            SPEED TEST
          </h2>
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-white/45 border-l border-white/15 pl-3 sm:pl-4">
            <span>Powered by</span>
            {/* Cloudflare logo icon */}
            <svg className="h-3 w-auto fill-[#f6821f]" viewBox="0 0 120 40">
              <path d="M93.3 27.2c-1.3 0-2.4-.8-2.8-2l-1-3.6c-.3-1-1.2-1.7-2.3-1.7h-9.9c-.8 0-1.5.5-1.8 1.2l-1.4 3.7c-.4 1.2-1.5 2-2.8 2h-4.3l9.8-22.9c.7-1.6 2.3-2.6 4.1-2.6h3.4c1.8 0 3.4 1 4.1 2.6l9.9 22.9h-5.1zm-8.8-12.7l-3.2 8.5h6.4l-3.2-8.5z" />
            </svg>
            <span className="font-sans text-xs font-semibold text-white/80">Cloudflare</span>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="h-10 w-10 sm:h-11 sm:w-11 flex items-center justify-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all text-white/80 hover:text-white cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Left Y-Axis Scale Markers (Desktop view) */}
      <div className="hidden lg:flex flex-col justify-between absolute left-10 top-1/3 bottom-1/4 text-white/25 font-mono text-xs pointer-events-none z-10 select-none">
        <div className="flex items-center gap-3">
          <span>1 Gbps</span>
          <div className="h-px w-6 bg-white/10" />
        </div>
        <div className="flex items-center gap-3">
          <span>100 Mbps</span>
          <div className="h-px w-6 bg-white/10" />
        </div>
        <div className="flex items-center gap-3">
          <span>10 Mbps</span>
          <div className="h-px w-6 bg-white/10" />
        </div>
      </div>

      {/* Background Sparkline Wave */}
      {activeSamples.length > 1 && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-40 pointer-events-none opacity-20 transition-opacity duration-700">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 600 120">
            <path d={sparklinePath} fill="none" stroke={sparklineColor} strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>
      )}

      {/* Center Hero Readout */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center my-auto px-4">
        {/* Metric Phase Title */}
        <p className="font-mono text-xs sm:text-sm uppercase tracking-[0.35em] text-signal-400 font-medium mb-3">
          {PHASE_LABEL[phase]}
        </p>

        {/* Main Speed Value Number & Unit */}
        <div className="flex items-baseline justify-center">
          <span className="font-display font-light text-6xl sm:text-8xl md:text-[10rem] leading-none tracking-tight text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.1)]">
            {phase === 'idle' ? '0.00' : mainValue}
          </span>
          <span className="text-2xl sm:text-4xl text-white/55 font-sans font-normal tracking-normal ml-3 sm:ml-5">
            {mainUnit}
          </span>
        </div>

        {/* Connection Visualizer / Network Dots */}
        <div className="mt-8 flex items-center justify-center gap-4 text-white/40">
          <Globe size={18} className={isRunning ? 'text-signal-400 animate-pulse' : 'text-white/40'} />
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${isRunning ? 'bg-signal-500 animate-ping' : 'bg-white/20'}`} />
            <span className={`h-1.5 w-1.5 rounded-full ${isRunning ? 'bg-signal-500/80' : 'bg-white/20'}`} />
            <span className={`h-1.5 w-1.5 rounded-full ${isRunning ? 'bg-signal-500/60' : 'bg-white/20'}`} />
          </div>
          <Laptop size={18} className={isRunning ? 'text-signal-400' : 'text-white/40'} />
        </div>

        {/* Error message if any */}
        {error && (
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
            <AlertCircle size={14} />
            <span>{error}</span>
          </div>
        )}

        {/* Secondary Results & Controls Bar */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {/* Download stat */}
          <div className="text-center">
            <span className="block font-mono text-[10px] uppercase tracking-widest2 text-white/40 mb-1">
              Download
            </span>
            <span className="font-display text-xl sm:text-2xl text-white font-medium">
              {formatMbps(displayDown)} <span className="text-xs text-white/50 font-sans">Mbps</span>
            </span>
          </div>

          {/* Upload stat */}
          <div className="text-center border-l border-white/10 pl-6 sm:pl-10">
            <span className="block font-mono text-[10px] uppercase tracking-widest2 text-white/40 mb-1">
              Upload
            </span>
            <span className="font-display text-xl sm:text-2xl text-white font-medium">
              {formatMbps(displayUp)} <span className="text-xs text-white/50 font-sans">Mbps</span>
            </span>
          </div>

          {/* Latency stat */}
          <div className="text-center border-l border-white/10 pl-6 sm:pl-10">
            <span className="block font-mono text-[10px] uppercase tracking-widest2 text-white/40 mb-1">
              Latency
            </span>
            <span className="font-display text-xl sm:text-2xl text-white font-medium">
              {latencyVal} <span className="text-xs text-white/50 font-sans">{latencyVal !== '—' ? 'ms' : ''}</span>
            </span>
          </div>

          {/* Jitter stat */}
          <div className="text-center border-l border-white/10 pl-6 sm:pl-10 hidden sm:block">
            <span className="block font-mono text-[10px] uppercase tracking-widest2 text-white/40 mb-1">
              Jitter
            </span>
            <span className="font-display text-xl sm:text-2xl text-white font-medium">
              {jitterVal} <span className="text-xs text-white/50 font-sans">{jitterVal !== '—' ? 'ms' : ''}</span>
            </span>
          </div>

          {/* Grade pill if complete */}
          {grade && (
            <div className="border-l border-white/10 pl-6 sm:pl-10">
              <span className="block font-mono text-[10px] uppercase tracking-widest2 text-white/40 mb-1">
                Quality
              </span>
              <span
                className="inline-block px-3 py-0.5 rounded-full text-xs font-mono font-bold tracking-wider"
                style={{ backgroundColor: `${grade.color}25`, color: grade.color }}
              >
                {grade.label}
              </span>
            </div>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex items-center justify-center gap-4">
          {!isRunning ? (
            <button
              onClick={start}
              className="group relative inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-mono text-xs uppercase tracking-widest2 text-white bg-signal-500 hover:bg-signal-600 shadow-[0_0_30px_rgba(61,99,255,0.4)] hover:shadow-[0_0_40px_rgba(61,99,255,0.6)] hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer"
            >
              {phase === 'done' || phase === 'error' ? (
                <>
                  <RotateCcw size={15} className="transition-transform group-hover:rotate-180 duration-500" />
                  <span>Retest Speed</span>
                </>
              ) : (
                <>
                  <Play size={15} className="fill-white" />
                  <span>Start Speed Test</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={togglePause}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-xs font-mono uppercase tracking-widest2 transition-all cursor-pointer"
              >
                {paused ? <Play size={14} /> : <Pause size={14} />}
                <span>{paused ? 'Resume' : 'Pause'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Footer & ESC Indicator */}
      <div className="relative z-10 flex items-center justify-center pt-4">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest2 text-white/40">
          <kbd className="px-2 py-0.5 border border-white/20 rounded text-[10px] text-white/60">esc</kbd>
          <span>close</span>
        </div>
      </div>

      {/* Bottom Glowing Border Line */}
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-signal-500 to-transparent shadow-[0_0_15px_rgba(61,99,255,0.8)]" />
    </div>
  )
}