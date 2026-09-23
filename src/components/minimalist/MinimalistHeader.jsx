import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { PROFILE } from '../../lib/portfolioData.js'

// Top block of the sidebar: avatar, name, role, location. Falls back to
// initials in a plain circle if PROFILE.avatar isn't set yet or fails to
// load, so the layout doesn't show a broken image while the photo is
// still being added.
export default function MinimalistHeader() {
  const [imgError, setImgError] = useState(false)
  const initials = (PROFILE.name || '')
    .split(' ')
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')

  const showImage = Boolean(PROFILE.avatar) && !imgError

  return (
    <div className="flex items-center gap-4">
      {showImage ? (
        <img
          src={PROFILE.avatar}
          alt={PROFILE.name}
          onError={() => setImgError(true)}
          className="h-14 w-14 rounded-full object-cover border border-ink-950/10 dark:border-paper-100/12"
        />
      ) : (
        <div className="h-14 w-14 rounded-full flex items-center justify-center border border-ink-950/10 dark:border-paper-100/12 bg-ink-950/5 dark:bg-paper-100/5 font-mono text-sm text-ink-950/50 dark:text-paper-100/50">
          {initials}
        </div>
      )}
      <div>
        <h1 className="font-display text-lg font-semibold tracking-tight">{PROFILE.name}</h1>
        {PROFILE.role && (
          <p className="text-sm text-ink-950/50 dark:text-paper-100/50">{PROFILE.role}</p>
        )}
        {PROFILE.location && (
          <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-950/40 dark:text-paper-100/40">
            <MapPin size={11} /> {PROFILE.location}
          </p>
        )}
      </div>
    </div>
  )
}