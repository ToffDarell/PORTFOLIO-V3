import { useState } from 'react'
import { ArrowUpRight, GithubLogo, Globe } from '@/components/slab'
import { shotsOf, type Work } from '@/data/work'

/**
 * One build, written up: the screenshots with a thumbnail picker, then the
 * category, title, write-up, stack and links. Opened from the 3D reel and
 * from the featured builds on Projects, so both surfaces show the same card.
 */
export default function CaseCard({ work }: { work: Work }) {
  const shots = shotsOf(work)
  const [i, setI] = useState(0)

  return (
    <article className={shots.length ? 'case' : 'case case--text'} style={{ ['--case-color' as string]: work.accent }}>
      {shots.length > 0 && (
        <div className="case__media">
          <img className="case__shot" src={shots[i]} alt={`${work.short} screenshot ${i + 1}`} decoding="async" />
          {shots.length > 1 && (
            <div className="case__thumbs" role="group" aria-label="Screenshots">
              {shots.map((src, n) => (
                <button
                  key={src}
                  type="button"
                  className="case__thumb"
                  aria-pressed={n === i}
                  aria-label={`Show screenshot ${n + 1}`}
                  onClick={() => setI(n)}
                >
                  <img src={src} alt="" loading="lazy" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="case__body">
        <span className="case__kicker">
          {work.category}
          <span className="case__status" data-status={work.status}>{work.status}</span>
        </span>
        <h2 className="case__title">{work.title}</h2>
        <p className="case__desc">{work.description}</p>

        {(work.role || work.team) && (
          <dl className="case__credits">
            {work.role && (
              <div>
                <dt>Role</dt>
                <dd>{work.role}</dd>
              </div>
            )}
            {work.team && (
              <div>
                <dt>Team</dt>
                <dd>{work.team}</dd>
              </div>
            )}
          </dl>
        )}

        {work.highlights?.length ? (
          <div className="case__built">
            <span className="case__built-title">What I built</span>
            <ul className="case__built-list">
              {work.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <ul className="case__tags" role="list">
          {work.tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <div className="case__links">
          {work.live && (
            <a className="case__link case__link--primary" href={work.live} target="_blank" rel="noopener noreferrer">
              <Globe size={16} weight="bold" aria-hidden="true" />
              Live demo
              <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
            </a>
          )}
          {work.github && (
            <a className="case__link" href={work.github} target="_blank" rel="noopener noreferrer">
              <GithubLogo size={16} weight="bold" aria-hidden="true" />
              Source on GitHub
              <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  )
}
