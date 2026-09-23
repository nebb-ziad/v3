// Decorative dot-grid confined to the upper-right corner of the page.
// Fixed to the viewport so it stays put regardless of scrolling, masked
// with a radial fade so it blends into the background. Width AND height
// are set inline (not just via Tailwind width classes) so nothing in the
// project's global CSS can stretch it into a tall rectangle.
export default function MinimalistPolkaDots() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none fixed -top-8 -right-8 z-0 text-signal-500 opacity-[0.4] dark:opacity-[0.3]"
      style={{ width: 'clamp(240px, 27vw, 390px)', height: 'clamp(240px, 27vw, 390px)' }}
      viewBox="0 0 400 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="mdots" width="18" height="18" patternUnits="userSpaceOnUse">
          <circle cx="2.2" cy="2.2" r="2.2" fill="currentColor" />
        </pattern>
        <radialGradient id="mdotsFade" cx="68%" cy="28%" r="70%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="65%" stopColor="white" stopOpacity="0.55" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id="mdotsMask">
          <rect width="400" height="400" fill="url(#mdotsFade)" />
        </mask>
      </defs>
      <rect width="400" height="400" fill="url(#mdots)" mask="url(#mdotsMask)" />
    </svg>
  )
}