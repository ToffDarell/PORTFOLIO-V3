import type { CSSProperties } from 'react'
import { ArrowUpRight, MapPin, GithubLogo } from '@/components/slab'
import { profile } from '@/data/profile'

/**
 * AboutGrid - the About view as a fixed viewport.
 *
 * One glass sheet, two columns: who you are on the left, the illustration
 * on the right. Sized to the panel, so nothing here scrolls.
 *
 * The left column is a ladder, not a paragraph block: one display statement,
 * one line of context, then the four things you do - each carrying the marks
 * of the tools it is built with. The tools are the proof, so they are the
 * visual. Swap the marks below for your own (any square SVG/PNG in public/).
 */

const T = (n: string) => ({ src: `/icons/tech/${n}.svg`, name: n })
const AI = (n: string, name: string) => ({ src: `/icons/ai/${n}.svg`, name })

type Capability = {
  index: string
  title: string
  marks: { src: string; name: string }[]
}

const CAPABILITIES: Capability[] = [
  { index: '01', title: 'Full stack web apps', marks: [T('laravel'), T('react'), T('nodejs'), T('mysql')] },
  { index: '02', title: 'SaaS platforms', marks: [T('laravel'), T('tailwindcss'), T('alpinejs')] },
  { index: '03', title: 'AI & computer vision', marks: [T('python'), T('pytorch'), T('opencv')] },
  { index: '04', title: 'AI-assisted development', marks: [AI('claude-color', 'Claude'), AI('codex', 'Codex'), AI('opencode', 'OpenCode'), AI('antigravity', 'Antigravity')] },
]

export default function AboutGrid() {
  return (
    <section className="pgrid agrid" aria-labelledby="about-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">About</span>
        <h1 className="pgrid__title" id="about-title">
          {`Hi, I’m ${profile.firstName}.`}
        </h1>
        <p className="pgrid__lede">
          A fourth-year IT student from Bukidnon who loves building things that actually work.
        </p>
      </header>

      <div className="home__glass agrid__glass">
        <div className="agrid__copy">
          <p className="agrid__lead">
            I started coding out of curiosity.
            <span> It turned into something I genuinely enjoy.</span>
          </p>

          <p className="agrid__note">
            <strong>BS Information Technology, Bukidnon State University</strong>. I work
            mostly with web technologies and explore AI and computer vision on the side. I
            use AI tools to work smarter and faster, not to replace thinking.{' '}
            <a className="agrid__link" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
              Read my CV
            </a>
            .
          </p>

          <ul className="agrid__caps" role="list">
            {CAPABILITIES.map((c) => (
              <li key={c.index} className="agrid__cap">
                <span className="agrid__cap-marks">
                  {c.marks.map((m, i) => (
                    <span
                      key={m.name}
                      className="agrid__mark"
                      style={{ '--i': c.marks.length - i } as CSSProperties}
                    >
                      <img src={m.src} alt={m.name} loading="lazy" decoding="async" />
                    </span>
                  ))}
                </span>
                <span className="agrid__cap-title">{c.title}</span>
                <span className="agrid__cap-index" aria-hidden="true">
                  {c.index}
                </span>
              </li>
            ))}
          </ul>

          {/* One plate, two cells sharing a mark / title / meta anatomy. */}
          <div className="agrid__bar">
            <span className="agrid__cell">
              <span className="agrid__cell-mark agrid__cell-mark--img">
                <img src="/icons/tech/cisco.svg" alt="" loading="lazy" decoding="async" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">CCNA certified</span>
                <span className="agrid__cell-meta">Cisco Networking Academy · Dec 2025</span>
              </span>
            </span>

            <span className="agrid__cell">
              <span className="agrid__cell-mark">
                <MapPin size={16} weight="fill" aria-hidden="true" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">Maramag, Bukidnon</span>
                <span className="agrid__cell-meta">Philippines · GMT+8</span>
              </span>
            </span>

            <a className="agrid__cell agrid__cell--wide" href="https://github.com/ToffDarell" target="_blank" rel="noopener noreferrer">
              <span className="agrid__cell-mark">
                <GithubLogo size={16} weight="fill" aria-hidden="true" />
              </span>
              <span className="agrid__cell-copy">
                <span className="agrid__cell-title">github.com/ToffDarell</span>
                <span className="agrid__cell-meta">The code behind every build</span>
              </span>
              <ArrowUpRight className="agrid__cell-go" size={15} weight="bold" aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="agrid__portrait">
          <img
            src={profile.hero.portraitSrc}
            alt={profile.hero.portraitAlt}
            loading="eager"
            decoding="async"
            width={400}
            height={400}
          />
        </div>
      </div>
    </section>
  )
}
