// A single hand-drawn flourish reused across the Signature theme: as the
// preloader's draw-on animation, as a faint watermark behind the hero, and
// as a small confirmation mark in the footer. One motif, three appearances —
// literally "the signature."
export default function SignatureMark({ className = '', animated = true, style }) {
  return (
    <svg
      viewBox="0 0 600 180"
      className={className}
      style={style}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 120 C 55 40, 95 40, 110 100 C 122 145, 150 145, 165 95
           C 178 55, 205 50, 220 90 C 232 122, 255 128, 268 95
           C 278 68, 300 60, 315 85 C 335 118, 365 60, 400 60
           C 440 60, 445 130, 480 130 C 520 130, 535 60, 575 75"
        className={animated ? 'sig-path' : ''}
        style={animated ? { '--sig-len': 1400 } : { fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round' }}
      />
      <circle cx="500" cy="30" r="4" fill="currentColor" className={animated ? 'sig-path' : ''} style={{ '--sig-len': 30, animationDelay: animated ? '1.6s' : undefined }} />
    </svg>
  )
}
