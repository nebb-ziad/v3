import { flushSync } from 'react-dom'

/**
 * Runs `applyChange` inside a View Transition that wipes outward as a circle
 * from `originEl`'s center — used for both dark/light toggling and Signature
 * / Minimalist / Legacy mode switching so the whole product feels like one
 * consistent, deliberate motion language rather than a hard cut.
 *
 * The clip-path is driven with the Web Animations API (not CSS keyframes +
 * custom properties) so Chromium actually interpolates the circle instead of
 * snapping or fading.
 */
export function wipeTransition(originEl, applyChange) {
  const supportsViewTransition = typeof document.startViewTransition === 'function'
  const prefersReducedMotion =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (!supportsViewTransition || prefersReducedMotion) {
    applyChange()
    return
  }

  const root = document.documentElement
  const rect = originEl?.getBoundingClientRect()
  const vw = window.visualViewport?.width ?? window.innerWidth
  const vh = window.visualViewport?.height ?? window.innerHeight
  const x = rect ? rect.left + rect.width / 2 : vw / 2
  const y = rect ? rect.top + rect.height / 2 : 0
  const endRadius = Math.max(
    Math.hypot(x, y),
    Math.hypot(vw - x, y),
    Math.hypot(x, vh - y),
    Math.hypot(vw - x, vh - y)
  )
  const duration = vw <= 640 ? 600 : 900

  root.classList.add('vt-active')

  const transition = document.startViewTransition(() => {
    flushSync(applyChange)
  })

  transition.ready
    .then(() => {
      root.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration,
          easing: 'cubic-bezier(0.45, 0, 0.15, 1)',
          fill: 'both',
          pseudoElement: '::view-transition-new(root)',
        }
      )
    })
    .catch(() => {})

  transition.finished.finally(() => {
    root.classList.remove('vt-active')
  })
}
