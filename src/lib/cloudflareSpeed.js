// Optimized wrapper around @cloudflare/speedtest
// Lightweight, responsive measurements with pause and abort support.
import SpeedTest from '@cloudflare/speedtest'

export function runSpeedTest({ onPhase, onProgress } = {}) {
  let isAborted = false
  let engine = null

  const promise = new Promise((resolve, reject) => {
    onPhase?.('locating')

    try {
      engine = new SpeedTest({
        autoStart: true,
        measureDownloadLoadedLatency: false,
        measureUploadLoadedLatency: false,
        bandwidthFinishRequestDuration: 1000,
        measurements: [
          { type: 'latency', numPackets: 2 },
          { type: 'download', bytes: 1e5, count: 1, bypassMinDuration: true },
          { type: 'latency', numPackets: 12 },
          { type: 'download', bytes: 5e5, count: 5 },
          { type: 'download', bytes: 2e6, count: 4 },
          { type: 'download', bytes: 6e6, count: 3 },
          { type: 'upload', bytes: 2e5, count: 5 },
          { type: 'upload', bytes: 1e6, count: 4 },
          { type: 'upload', bytes: 3e6, count: 3 },
          { type: 'packetLoss', numPackets: 50, batchSize: 10, batchWaitTime: 15, responsesWaitTime: 1000 },
        ],
      })
    } catch (err) {
      return reject(err)
    }

    let currentPhase = 'locating'

    engine.onResultsChange = ({ type }) => {
      if (isAborted) return
      const summary = engine.results.getSummary()

      let nextPhase = currentPhase
      if (type === 'latency' && currentPhase === 'locating') {
        nextPhase = 'latency'
      } else if (type === 'download' && currentPhase !== 'download') {
        nextPhase = 'download'
      } else if (type === 'upload' && currentPhase !== 'upload') {
        nextPhase = 'upload'
      } else if (type === 'packetLoss' && currentPhase !== 'packetloss') {
        nextPhase = 'packetloss'
      }

      if (nextPhase !== currentPhase) {
        currentPhase = nextPhase
        onPhase?.(currentPhase)
      }

      onProgress?.({
        phase: currentPhase,
        downloadMbps: summary.download ? summary.download / 1e6 : 0,
        uploadMbps: summary.upload ? summary.upload / 1e6 : 0,
        pingMs: summary.latency ?? null,
        jitterMs: summary.jitter ?? null,
        packetLossPct: summary.packetLoss != null ? Math.round(summary.packetLoss * 100) : null,
      })
    }

    engine.onFinish = (results) => {
      if (isAborted) return
      const summary = results.getSummary()
      onPhase?.('done')
      resolve({
        downloadMbps: summary.download ? summary.download / 1e6 : 0,
        uploadMbps: summary.upload ? summary.upload / 1e6 : 0,
        pingMs: summary.latency != null ? Number(summary.latency.toFixed(1)) : null,
        jitterMs: summary.jitter != null ? Number(summary.jitter.toFixed(2)) : null,
        packetLossPct: summary.packetLoss != null ? Math.round(summary.packetLoss * 100) : 0,
      })
    }

    engine.onError = (err) => {
      if (isAborted) return
      const errStr = typeof err === 'string' ? err : err?.message || ''

      // If packet loss or TURN server credentials error occurs, don't crash the test if we have results
      const summary = engine?.results?.getSummary() || {}
      if (errStr.includes('packet loss') || errStr.includes('turn server') || summary.download || summary.latency) {
        console.warn('SpeedTest finished with non-fatal warning:', errStr)
        onPhase?.('done')
        return resolve({
          downloadMbps: summary.download ? summary.download / 1e6 : 0,
          uploadMbps: summary.upload ? summary.upload / 1e6 : 0,
          pingMs: summary.latency != null ? Number(summary.latency.toFixed(1)) : null,
          jitterMs: summary.jitter != null ? Number(summary.jitter.toFixed(2)) : null,
          packetLossPct: summary.packetLoss != null ? Math.round(summary.packetLoss * 100) : null,
        })
      }

      reject(new Error('Unable to connect to Cloudflare edge server. Please check your internet connection and try again.'))
    }
  })

  promise.pause = () => {
    try {
      engine?.pause()
    } catch (e) {
      console.warn('SpeedTest pause error:', e)
    }
  }

  promise.play = () => {
    try {
      engine?.play()
    } catch (e) {
      console.warn('SpeedTest play error:', e)
    }
  }

  promise.abort = () => {
    isAborted = true
    try {
      engine?.pause()
    } catch (e) {
      // ignore
    }
  }

  return promise
}