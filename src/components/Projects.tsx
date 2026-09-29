import { work } from '@/data/work'
import CaseCard from '@/components/CaseCard'
import AIStack from '@/components/AIStack'
import Flagship from '@/components/Flagship'

/* ── Sections ───────────────────────────────────────────────
   Two exports so the Projects dialog can open each body of work on its own;
   the default still composes them (with Flagship) for anything that wants
   the whole section. */
export function AIStackSection() {
  return (
    <section
      className="projects projects--ai"
      id="projects"
      aria-labelledby="projects-heading"
      data-reveal
    >
      <header className="projects__header">
        <span className="projects__eyebrow">Every build</span>
        <h2 className="projects__headline" id="projects-heading">
          Twelve systems, grouped by what they are.
        </h2>
        <p className="projects__subhead">
          Open a branch to see what sits under it.
        </p>
      </header>
      <div className="projects__panel" id="projects-panel">
        <AIStack />
      </div>
    </section>
  )
}

export function AppsSection() {
  return (
    <section className="projects projects--apps" aria-label="Case studies" data-reveal>
      <div className="projects__panel">
        <span className="projects__ext-eyebrow">Twelve builds, written up</span>
        <ul className="projects__cases" role="list">
          {work.map((w) => (
            <li key={w.id}>
              <CaseCard work={w} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default function Projects() {
  return (
    <>
      <AIStackSection />
      <AppsSection />
      <Flagship />
    </>
  )
}
