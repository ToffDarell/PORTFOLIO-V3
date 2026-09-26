import { useState } from 'react'
import { Play, Gauge, Code } from '@/components/slab'
import type { Icon } from '@/components/slab'

/**
 * TestimonialsGrid - the Testimonials view as a fixed viewport.
 *
 * Two columns inside one glass sheet: the video proof on the left, the client
 * ledger on the right. The page is sized to the panel and does not scroll, so
 * both clips share ONE stage and a picker switches between them rather than
 * stacking two players down a column that would never fit.
 *
 * Clips can disagree about orientation, so the stage is ONE fixed plate that
 * each is contained inside. Letting the frame take each clip's own ratio made
 * it jump size on every switch; a single plate keeps the card the same object
 * whichever is playing.
 *
 * To add a video: drop the .mp4 in public/testimonials/, set its `src` below
 * (e.g. '/testimonials/client-1.mp4'), and swap the poster for a still from
 * the clip. With `src` empty the cover stays up and play is disabled.
 */

type Clip = {
  id: string
  index: string
  /** Leave empty until you have the video file. */
  src: string
  poster: string
  duration: string
  kicker: string
  width: number
  height: number
}

const CLIPS: Clip[] = [
  {
    id: 'clip-1',
    index: '01',
    src: '',
    poster: '/testimonies/testimony-1.webp',
    duration: 'Carl L. Pelaez',
    kicker: 'Geodetic Engineering Student',
    width: 240,
    height: 320,
  },
  {
    id: 'clip-2',
    index: '02',
    src: '',
    poster: '/testimonies/testimony-2.webp',
    duration: 'Daphne A. Dulfo',
    kicker: 'BSIT Student',
    width: 240,
    height: 320,
  },
]

/* The client ledger. `logoSrc` is optional - without it the medallion falls
   back to the icon. */

type Client = {
  index: string
  name: string
  role: string
  daily: string
  work: string[]
  logoSrc?: string
  Icon: Icon
}

const CLIENTS: Client[] = [
  {
    index: '01',
    name: 'Carl L. Pelaez',
    role: 'Geodetic Engineering Student',
    daily:
      '"I, Carl L. Pelaez, sincerely thank Toff for his dedication and expertise as the System Developer of our project. His programming skills, technical guidance, and commitment were instrumental in the successful development of our system, and I truly appreciate his support throughout the project."',
    work: ['System Developer', 'Capstone', 'Technical guidance'],
    logoSrc: '/testimonies/testimony-1.webp',
    Icon: Gauge,
  },
  {
    index: '02',
    name: 'Daphne A. Dulfo',
    role: 'BSIT Student',
    daily:
      '"Toff demonstrated exceptional dedication and expertise as the System Developer of our project. He consistently provided valuable guidance, solved technical challenges efficiently, and turned our ideas into a functional system. I truly appreciate his hard work, professionalism, and contributions to our project’s success."',
    work: ['System Developer', 'Capstone', 'Problem solving'],
    logoSrc: '/testimonies/testimony-2.webp',
    Icon: Code,
  },
]

export default function TestimonialsGrid() {
  const [active, setActive] = useState(0)
  // The stage shows the clip's poster as cover art until it is asked to
  // play. A poster can fill the frame edge to edge whichever way the clip is
  // shot; a paused <video> cannot, and letterboxing one orientation into a
  // fixed frame left a third of the plate as dead margin.
  const [playing, setPlaying] = useState(false)
  const clip = CLIPS[active]
  const hasVideo = clip.src !== ''
  const pick = (i: number) => {
    setActive(i)
    setPlaying(false)
  }

  return (
    <section className="pgrid tgrid" aria-labelledby="testimonials-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Testimonials</span>
        <h1 className="pgrid__title" id="testimonials-title">
          What the people I build with say.
        </h1>
        <p className="pgrid__lede">
          Teammates and clients from the capstone systems I developed, in their own words.
        </p>
      </header>

      <div className="home__glass tgrid__glass">
        {/* Left: one stage, two clips. */}
        <div className="tgrid__reel">
          <div className="tgrid__stage">
            {playing && hasVideo ? (
              // Re-keyed so switching clips mounts a fresh element instead of
              // swapping src on a player that is already mid-playback.
              <video
                key={clip.id}
                className="tgrid__video"
                src={clip.src}
                poster={clip.poster}
                width={clip.width}
                height={clip.height}
                controls
                autoPlay
                playsInline
                aria-label={`Video testimonial ${clip.index} from a client`}
              />
            ) : (
              <button
                type="button"
                className="tgrid__cover"
                onClick={() => hasVideo && setPlaying(true)}
                disabled={!hasVideo}
                aria-label={
                  hasVideo
                    ? `Play client testimonial ${clip.index}, ${clip.duration}`
                    : `Testimonial from ${clip.duration}, ${clip.kicker}`
                }
              >
                <img
                  key={clip.id}
                  className="tgrid__cover-img"
                  src={clip.poster}
                  alt=""
                  decoding="async"
                />
                <span className="tgrid__cover-shade" aria-hidden="true" />
                {hasVideo && (
                  <span className="tgrid__cover-play" aria-hidden="true">
                    <Play size={26} weight="fill" />
                  </span>
                )}
                <span className="tgrid__cover-meta" aria-hidden="true">
                  <span className="tgrid__cover-kicker">{clip.duration}</span>
                  <span className="tgrid__cover-sub">
                    {hasVideo ? 'Tap to play' : clip.kicker}
                  </span>
                </span>
              </button>
            )}
          </div>

          {/* The picker is one segmented control, not two loose chips: two
              cells on a shared plate, the active one lit. */}
          <div className="tgrid__picker" role="group" aria-label="Choose a testimonial">
            {CLIPS.map((c, i) => (
              <button
                key={c.id}
                type="button"
                className={`tgrid__pick${i === active ? ' is-active' : ''}`}
                onClick={() => pick(i)}
                aria-pressed={i === active}
              >
                <span className="tgrid__pick-thumb" aria-hidden="true">
                  <img src={c.poster} alt="" loading="lazy" decoding="async" />
                </span>
                <span className="tgrid__pick-copy">
                  <span className="tgrid__pick-kicker">{c.duration}</span>
                  <span className="tgrid__pick-meta">{c.kicker}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Right: the client ledger, one row per client. */}
        <div className="tgrid__ledger">
          <div className="tgrid__ledger-head">
            <h2 className="tgrid__ledger-title">Kind words from clients.</h2>
            <p className="tgrid__ledger-sub">Word for word, from the projects I was System Developer on.</p>
          </div>

          {/* One plate, three rows split by hairlines. Three boxed cards each
              carrying their own border read as three separate widgets; a
              single ledger reads as one record. */}
          <ul className="tgrid__clients" role="list">
            {CLIENTS.map((c) => {
              const FallbackIcon = c.Icon
              return (
                <li key={c.index} className="tgrid__client">
                  <span className="tgrid__client-ghost" aria-hidden="true">{c.index}</span>
                  <span className="tgrid__client-mark" aria-hidden="true">
                    {c.logoSrc ? (
                      <img src={c.logoSrc} alt="" loading="lazy" decoding="async" />
                    ) : (
                      <FallbackIcon size={22} weight="duotone" />
                    )}
                  </span>

                  <span className="tgrid__client-body">
                    <span className="tgrid__client-head">
                      <span className="tgrid__client-name">{c.name}</span>
                      <span className="tgrid__client-role">{c.role}</span>
                    </span>
                    <span className="tgrid__client-daily">{c.daily}</span>
                    <ul className="tgrid__client-tags" role="list">
                      {c.work.map((w, i) => (
                        <li key={`${w}-${i}`} className="tgrid__client-tag">
                          {w}
                        </li>
                      ))}
                    </ul>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
