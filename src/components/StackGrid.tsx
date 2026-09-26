import { useState } from 'react'
import { ArrowUpRight, SealCheck } from '@/components/slab'
import { certs, techGroups, techCount } from '@/data/stack'

/**
 * StackGrid - the Stack & Certs view on one glass sheet.
 *
 * Two bands. The credentials first: one certificate large, the rest as a
 * picker beside it, so the proof is the first thing on the sheet. Then the
 * stack, grouped the way the work uses it, each tool a logo tile with its
 * one-line description. This view scrolls; the others are sized to the box.
 */
export default function StackGrid() {
  const [active, setActive] = useState(0)
  const cert = certs[active]

  return (
    <section className="pgrid stackv" aria-labelledby="stack-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Stack &amp; Certs</span>
        <h1 className="pgrid__title" id="stack-title">
          The tools I build with, and the proof.
        </h1>
        <p className="pgrid__lede">
          {techCount} technologies across web, data and AI, and {certs.length} verified certifications.
        </p>
      </header>

      <div className="home__glass stackv__glass">
        <section className="stackv__certs" aria-labelledby="certs-title">
          <div className="stackv__band-head">
            <h2 className="stackv__band-title" id="certs-title">Certifications</h2>
            <p className="stackv__band-sub">Professional milestones, industry certifications, and verified skills.</p>
          </div>

          <div className="stackv__cert">
            <figure className="stackv__cert-media">
              <img key={cert.id} src={cert.image} alt={cert.title} decoding="async" />
            </figure>
            <div className="stackv__cert-body">
              <span className="stackv__cert-kicker">
                {cert.category} · {cert.issuer} ({cert.date})
              </span>
              <h3 className="stackv__cert-title">{cert.title}</h3>
              <p className="stackv__cert-desc">{cert.description}</p>
              <ul className="stackv__cert-tags" role="list">
                {cert.tags.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              {cert.link ? (
                <a className="stackv__verify" href={cert.link} target="_blank" rel="noopener noreferrer">
                  <SealCheck size={16} weight="fill" aria-hidden="true" />
                  Verify credential
                  <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
                </a>
              ) : (
                <span className="stackv__verify stackv__verify--static">
                  <SealCheck size={16} weight="fill" aria-hidden="true" />
                  Verified academic credential
                </span>
              )}
            </div>

            <div className="stackv__picker" role="group" aria-label="Choose a certificate">
              {certs.map((c, i) => (
                <button
                  key={c.id}
                  type="button"
                  className="stackv__pick"
                  aria-pressed={i === active}
                  onClick={() => setActive(i)}
                >
                  <img src={c.image} alt="" loading="lazy" decoding="async" />
                  <span className="stackv__pick-copy">
                    <span className="stackv__pick-title">{c.title}</span>
                    <span className="stackv__pick-meta">
                      {c.issuer} · {c.date}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="stackv__stack" aria-labelledby="tech-title">
          <div className="stackv__band-head">
            <h2 className="stackv__band-title" id="tech-title">My stack</h2>
            <p className="stackv__band-sub">{techCount} technologies, grouped by where they show up in the work.</p>
          </div>

          <div className="stackv__groups">
            {techGroups.map((g) => (
              <section key={g.name} className="stackv__group" aria-label={g.name}>
                <h3 className="stackv__group-title">
                  {g.name}
                  <span>{g.items.length}</span>
                </h3>
                <ul className="stackv__techs" role="list">
                  {g.items.map((t) => (
                    <li key={t.name} className="stackv__tech" title={t.description}>
                      <span className="stackv__tech-mark">
                        <img src={t.icon} alt="" width={26} height={26} loading="lazy" decoding="async" />
                      </span>
                      <span className="stackv__tech-copy">
                        <span className="stackv__tech-name">{t.name}</span>
                        <span className="stackv__tech-desc">{t.description}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
