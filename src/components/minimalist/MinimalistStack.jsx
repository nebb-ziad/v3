import { STACK } from '../../lib/portfolioData.js'

// Maps a stack item's display name to its Simple Icons slug + brand color.
// Rendered via the Simple Icons CDN (cdn.simpleicons.org/<slug>/<hex>), so
// no icon package needs to be installed. Names are matched case/space
// -insensitively; anything not listed here just falls back to the old dot.
const LOGO_MAP = {
  html5: { slug: 'html5', color: 'E34F26' },
  html: { slug: 'html5', color: 'E34F26' },
  css3: { slug: 'css3', color: '1572B6' },
  css: { slug: 'css3', color: '1572B6' },
  javascript: { slug: 'javascript', color: 'F7DF1E' },
  typescript: { slug: 'typescript', color: '3178C6' },
  react: { slug: 'react', color: '61DAFB' },
  'tailwind css': { slug: 'tailwindcss', color: '06B6D4' },
  tailwindcss: { slug: 'tailwindcss', color: '06B6D4' },
  'next.js': { slug: 'nextdotjs', color: 'FFFFFF' },
  nextjs: { slug: 'nextdotjs', color: 'FFFFFF' },
  'node.js': { slug: 'nodedotjs', color: '339933' },
  nodejs: { slug: 'nodedotjs', color: '339933' },
  'express.js': { slug: 'express', color: 'FFFFFF' },
  expressjs: { slug: 'express', color: 'FFFFFF' },
  php: { slug: 'php', color: '777BB4' },
  mysql: { slug: 'mysql', color: '4479A1' },
  mongodb: { slug: 'mongodb', color: '47A248' },
  laravel: { slug: 'laravel', color: 'FF2D20' },
  claude: { slug: 'claude', color: 'DA7756' },
  chatgpt: { slug: 'openai', color: '74AA9C' },
  'chat gpt': { slug: 'openai', color: '74AA9C' },
  gpt: { slug: 'openai', color: '74AA9C' },
  openai: { slug: 'openai', color: '74AA9C' },
  'vs code': { slug: 'visualstudiocode', color: '007ACC' },
  vscode: { slug: 'visualstudiocode', color: '007ACC' },
  'visual studio code': { slug: 'visualstudiocode', color: '007ACC' },
  'git / github': { slug: 'github', color: 'FFFFFF' },
  git: { slug: 'git', color: 'F05032' },
  github: { slug: 'github', color: 'FFFFFF' },
  vite: { slug: 'vite', color: '646CFF' },
  figma: { slug: 'figma', color: 'F24E1E' },
  biome: { slug: 'biome', color: '60A5FA' },
  n8n: { slug: 'n8n', color: 'EA4B71' },
  tensorflow: { slug: 'tensorflow', color: 'FF6F00' },
}

function StackLogo({ name, dimmed }) {
  const entry = LOGO_MAP[name.trim().toLowerCase()]

  // No known logo for this one — keep the original dot so the list still
  // reads cleanly instead of leaving a gap.
  if (!entry) {
    return (
      <span
        className={`h-1.5 w-1.5 rounded-full flex-shrink-0 ${
          dimmed ? 'bg-ink-950/25 dark:bg-paper-100/25' : 'bg-signal-500'
        }`}
      />
    )
  }

  return (
    <img
      src={`https://cdn.simpleicons.org/${entry.slug}/${entry.color}`}
      alt=""
      loading="lazy"
      className={`h-4 w-4 flex-shrink-0 object-contain transition-opacity ${dimmed ? 'opacity-35 grayscale' : 'opacity-100'}`}
    />
  )
}

export default function MinimalistStack() {
  return (
    <section className="py-10 sm:py-14 border-t border-ink-950/10 dark:border-paper-100/12">
      <p className="font-mono text-xs uppercase tracking-widest2 text-ink-950/45 dark:text-paper-100/45 mb-8">Stack</p>

      <div className="flex items-center gap-5 mb-8 text-xs font-mono uppercase tracking-widest2 text-ink-950/45 dark:text-paper-100/45">
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-signal-500" /> Daily Driver</span>
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-ink-950/25 dark:bg-paper-100/25" /> Occasional</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
        {Object.entries(STACK).map(([group, items]) => (
          <div key={group}>
            <p className="text-sm font-medium mb-3">{group}</p>
            <ul className="space-y-2">
              {items.map((it) => (
                <li key={it.name} className="flex items-center gap-2.5 text-sm text-ink-950/70 dark:text-paper-100/70">
                  <StackLogo name={it.name} dimmed={it.usage !== 'daily'} />
                  {it.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}