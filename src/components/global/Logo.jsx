export default function Logo({ className = '', style }) {
  return (
    <span className={`inline-flex items-center gap-2 font-brand tracking-tight ${className}`} style={style}>
      <img src="/favicon.png" alt="markineb logo" className="h-5 w-5 rounded-md object-contain" />
      <span className="font-bold">
        m<span className="text-signal-500 font-mono italic">ark</span>ineb
      </span>
    </span>
  )
}
