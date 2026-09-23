import { useEffect, useRef, useState } from 'react'

const TOPIC = 'benmark-portfolio-presence-v3'
const LOCAL_STORAGE_KEY = 'markineb_active_viewers'
const CHANNEL_NAME = 'markineb_viewing_now_channel'
const HEARTBEAT_INTERVAL = 3000
const STALE_TIMEOUT = 8000
const REMOTE_STALE_TIMEOUT = 25000

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return 'v_' + Math.random().toString(36).slice(2, 9) + Date.now().toString(36)
}

export function useViewingNow() {
  const [viewerCount, setViewerCount] = useState(1)
  const clientId = useRef(generateId()).current
  const remoteClientsRef = useRef(new Map())
  const channelRef = useRef(null)
  const wsRef = useRef(null)

  useEffect(() => {
    // 1. Setup Local Multi-tab Coordination via localStorage & BroadcastChannel
    const updateLocalPresence = () => {
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
        const now = Date.now()
        let map = raw ? JSON.parse(raw) : {}

        // Set own heartbeat
        map[clientId] = now

        // Prune stale tabs
        const fresh = {}
        for (const [id, time] of Object.entries(map)) {
          if (now - time < STALE_TIMEOUT) {
            fresh[id] = time
          }
        }
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fresh))
        return Object.keys(fresh)
      } catch {
        return [clientId]
      }
    }

    const computeTotalCount = () => {
      const now = Date.now()
      // Clean stale remote clients
      for (const [id, time] of remoteClientsRef.current.entries()) {
        if (now - time > REMOTE_STALE_TIMEOUT) {
          remoteClientsRef.current.delete(id)
        }
      }

      // Local tabs
      const localIds = updateLocalPresence()
      const allUnique = new Set(localIds)

      // Add remote clients
      for (const id of remoteClientsRef.current.keys()) {
        allUnique.add(id)
      }

      setViewerCount(Math.max(1, allUnique.size))
    }

    // Initialize local tab
    computeTotalCount()

    // Setup BroadcastChannel for 0-latency multi-tab updates
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        const bc = new BroadcastChannel(CHANNEL_NAME)
        channelRef.current = bc

        bc.onmessage = (event) => {
          const data = event.data
          if (data?.type === 'leave') {
            try {
              const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
              if (raw) {
                const map = JSON.parse(raw)
                delete map[data.id]
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(map))
              }
            } catch {
              // ignore
            }
          }
          computeTotalCount()
        }

        bc.postMessage({ type: 'join', id: clientId })
      } catch (err) {
        console.warn('BroadcastChannel error:', err)
      }
    }

    // Local storage event listener (cross-tab sync)
    const onStorage = (e) => {
      if (e.key === LOCAL_STORAGE_KEY) {
        computeTotalCount()
      }
    }
    window.addEventListener('storage', onStorage)

    // Local heartbeat interval
    const localHeartbeatTimer = setInterval(() => {
      computeTotalCount()
    }, HEARTBEAT_INTERVAL)

    // 2. Setup Global Real-Time Presence (across devices) via WebSockets
    const publishRemoteHeartbeat = (type = 'heartbeat') => {
      try {
        fetch(`https://ntfy.sh/${TOPIC}/publish`, {
          method: 'POST',
          body: JSON.stringify({ type, id: clientId, time: Date.now() }),
        }).catch(() => {})
      } catch {
        // ignore
      }
    }

    let remoteHeartbeatTimer = null
    let reconnectTimeout = null

    const connectWebSocket = () => {
      try {
        const ws = new WebSocket(`wss://ntfy.sh/${TOPIC}/ws`)
        wsRef.current = ws

        ws.onopen = () => {
          publishRemoteHeartbeat('join')
          remoteHeartbeatTimer = setInterval(() => {
            publishRemoteHeartbeat('heartbeat')
          }, 10000)
        }

        ws.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data)
            if (data.event === 'message' && data.message) {
              const payload = typeof data.message === 'string' ? JSON.parse(data.message) : data.message
              if (payload.id && payload.id !== clientId) {
                if (payload.type === 'leave') {
                  remoteClientsRef.current.delete(payload.id)
                } else {
                  remoteClientsRef.current.set(payload.id, Date.now())
                }
                computeTotalCount()
              }
            }
          } catch {
            // ignore non-json messages
          }
        }

        ws.onerror = () => {
          ws.close()
        }

        ws.onclose = () => {
          if (remoteHeartbeatTimer) clearInterval(remoteHeartbeatTimer)
          // Reconnect after 6 seconds
          reconnectTimeout = setTimeout(connectWebSocket, 6000)
        }
      } catch {
        // network offline, will use local presence
      }
    }

    connectWebSocket()

    // 3. Clean Disconnect / Teardown
    const handleLeave = () => {
      // Local clean up
      try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
        if (raw) {
          const map = JSON.parse(raw)
          delete map[clientId]
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(map))
        }
      } catch {
        // ignore
      }

      channelRef.current?.postMessage({ type: 'leave', id: clientId })

      // Remote clean up
      try {
        if (navigator.sendBeacon) {
          navigator.sendBeacon(
            `https://ntfy.sh/${TOPIC}/publish`,
            JSON.stringify({ type: 'leave', id: clientId })
          )
        } else {
          publishRemoteHeartbeat('leave')
        }
      } catch {
        // ignore
      }
    }

    window.addEventListener('beforeunload', handleLeave)
    window.addEventListener('pagehide', handleLeave)

    return () => {
      clearInterval(localHeartbeatTimer)
      if (remoteHeartbeatTimer) clearInterval(remoteHeartbeatTimer)
      if (reconnectTimeout) clearTimeout(reconnectTimeout)
      window.removeEventListener('storage', onStorage)
      window.removeEventListener('beforeunload', handleLeave)
      window.removeEventListener('pagehide', handleLeave)

      handleLeave()

      channelRef.current?.close()
      if (wsRef.current) {
        wsRef.current.onclose = null
        wsRef.current.close()
      }
    }
  }, [clientId])

  return viewerCount
}
