import { aiStack, type StackNode } from '@/data/ai-stack'
import { workById } from '@/data/work'

/**
 * Every build as a logo-first grid, for the Projects pop-up.
 *
 * The tree (ai-stack.ts) groups the builds; this view answers the question a
 * hiring reader actually has: what is each thing built ON. Every card leads
 * with the marks of its stack, then the plain-English line, then the tags.
 * Names, copy, status and marks all come from work.ts.
 */

type Tool = { name: string; src: string }

/** The marks for a build, named from its tags where they line up. */
function toolsOf(id: string): Tool[] {
  const w = workById(id)
  if (!w) return []
  return w.logos.map((src) => ({ src, name: src.split('/').pop()!.replace('.svg', '') }))
}

/** The AI tools the builds are made with. */
const HARNESS: Tool[] = [
  { name: 'Claude Code', src: '/icons/ai/claude-color.svg' },
  { name: 'Codex', src: '/icons/ai/codex.svg' },
  { name: 'OpenCode', src: '/icons/ai/opencode.svg' },
  { name: 'Antigravity', src: '/icons/ai/antigravity.svg' },
]

type Group = { title: string; what: string; systems: StackNode[] }

/** Flatten the tree into groups: a branch with children is a group, a leaf
 *  branch (one with a status) is a group of itself plus any children. */
function groups(root: StackNode): Group[] {
  return (root.children ?? []).map((branch) => ({
    title: branch.name,
    what: branch.what,
    systems: branch.status ? [branch, ...(branch.children ?? [])] : (branch.children ?? []),
  }))
}

function Card({ n }: { n: StackNode }) {
  const tools = toolsOf(n.id)
  return (
    <li className="aig__card">
      <div className="aig__marks" aria-label={`Built with ${tools.map((t) => t.name).join(', ')}`}>
        {tools.map((t) => (
          <span key={t.name} className="aig__mark" title={t.name}>
            <img src={t.src} alt="" width={22} height={22} loading="lazy" decoding="async" />
          </span>
        ))}
        {n.status && (
          <span className="aig__status" data-status={n.status}>
            {n.status}
          </span>
        )}
      </div>
      <h4 className="aig__name">
        <n.Icon size={16} weight="duotone" aria-hidden="true" />
        {n.name}
      </h4>
      <p className="aig__what">{n.what}</p>
      {n.stack && <p className="aig__stack">{n.stack}</p>}
    </li>
  )
}

export default function AIStackGrid() {
  return (
    <div className="aig">
      <header className="aig__head">
        <div className="aig__head-text">
          <span className="aig__eyebrow">Every build</span>
          <h3 className="aig__title">{aiStack.what}</h3>
        </div>
        <div className="aig__harness" aria-label="Built with">
          <span className="aig__harness-label">Built with</span>
          {HARNESS.map((t) => (
            <span key={t.name} className="aig__harness-item">
              <img src={t.src} alt="" width={20} height={20} />
              {t.name}
            </span>
          ))}
        </div>
      </header>

      {groups(aiStack).map((g) => (
        <section key={g.title} className="aig__group" aria-label={g.title}>
          <div className="aig__group-head">
            <h3 className="aig__group-title">{g.title}</h3>
            <p className="aig__group-what">{g.what}</p>
          </div>
          <ul className="aig__cards" role="list">
            {g.systems.map((n) => (
              <Card key={n.id} n={n} />
            ))}
          </ul>
        </section>
      ))}
    </div>
  )
}
