import { Fragment, useCallback, useEffect, useRef, useState, type ComponentType, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, X, VideoCamera, Eye, CursorClick, ListBullets, FolderOpen, Storefront } from '@/components/slab'
import { FlowIcon, PlanIcon, GlobeIcon, SparkIcon } from './ProjectIcons'
import { AutomationsPanel, PlanPanel, KaBuksuanPanel, BukiFindsPanel, SafeRidePanel, BarrelPanel, AIWindow, AppsWindow, CasePanel } from './ProjectPanels'
import { projectReel } from '@/data/funnels'
import { allShots, work, workById } from '@/data/work'
import { aiStack, type StackNode } from '@/data/ai-stack'
import { useIsPhone } from '@/hooks/useMediaQuery'

/**
 * Projects, as one viewport in Home's bento language: a glass panel of six
 * cards, each previewing its own body of work with a live inner track, each
 * opening the work itself in a near-fullscreen dialog (see ProjectPanels for
 * the first three; the rest are the sections the long page used to stack).
 *
 * The dialog is a portal at z 8000, under the funnel preview (9000) so the
 * barrel's own "open this page" dialog can still stack on top of it.
 */
type Project = {
  id: string
  index: string
  title: string
  desc: string
  Icon: ComponentType<{ size?: number }>
  eyebrow: string
  Section: ComponentType
  span?: 2
  /** Open Builds style: a small orange kicker above the title. */
  kicker?: string
  /** Real marks of what the work was built in; replaces the icon tile. */
  logos?: string[]
  Preview: ComponentType
}

const T = (n: string) => `/icons/tech/${n}.svg`
const logosOf = (id: string) => workById(id)?.logos.slice(0, 1) ?? []
const descOf = (id: string) => workById(id)?.description ?? ''

const WF_SHOTS = allShots.slice(0, 8).map((s) => s.src)

const FUNNEL_SHOTS = projectReel.slice(1, 4)
const thumbSrc = (f: (typeof projectReel)[number]) => f.thumb

const APP_SHOTS = allShots.filter((_, i) => i % 2 === 0).map((s) => s.src)

/** The three featured builds: each its own card in the stack, each its own
 *  pop-up. The column is sized for three; a fourth squashes them. */
const BUILDS: Project[] = [
  { id: 'ka-buksuan', index: '03', kicker: 'Real-time web app · Live', title: 'Ka-Buksuan', desc: descOf('ka-buksuan'), Icon: () => <VideoCamera size={20} weight="duotone" />, logos: logosOf('ka-buksuan'), eyebrow: 'Featured build', Section: KaBuksuanPanel, Preview: () => null },
  { id: 'bukifinds', index: '04', kicker: 'Marketplace web app · Live', title: 'BukiFinds', desc: descOf('bukifinds'), Icon: () => <Storefront size={20} weight="duotone" />, logos: logosOf('bukifinds'), eyebrow: 'Featured build', Section: BukiFindsPanel, Preview: () => null },
  { id: 'saferide', index: '05', kicker: 'AI / Computer vision', title: 'SafeRide', desc: descOf('saferide'), Icon: () => <Eye size={20} weight="duotone" />, logos: logosOf('saferide'), eyebrow: 'Featured build', Section: SafeRidePanel, Preview: () => null },
]

/** Every build as a row for the phone's full list; each opens its case card. */
const ALL_BUILDS: Project[] = work.map((w) => ({
  id: `case-${w.id}`,
  index: '',
  kicker: `${w.category} · ${w.status}`,
  title: w.short,
  desc: w.description,
  Icon: FolderOpen,
  logos: w.logos.slice(0, 1),
  eyebrow: 'Project',
  Section: () => <CasePanel id={w.id} />,
  Preview: () => null,
}))

const leaves = (n: StackNode): StackNode[] => (n.children?.length ? n.children.flatMap(leaves) : [n])
const AI_LEAVES = leaves(aiStack)

/* ---------- Previews ---------- */

function WorkflowsPreview() {
  return (
    <div className="bento__media bento__reel" aria-hidden="true">
      <div className="bento__reel-track">
        {[...WF_SHOTS, ...WF_SHOTS].map((src, i) => (
          <span key={i} className="bento__shot">
            <img src={src} alt="" loading="lazy" decoding="async" />
          </span>
        ))}
      </div>
    </div>
  )
}

/** A paper mock of the plan document, the way SamplePlan previews it. */
function PlanPreview() {
  return (
    <div className="bento__media bento__doc" aria-hidden="true">
      <span className="bento__doc-eyebrow">Curriculum vitae</span>
      <span className="bento__doc-title">Toff Darell Vergara</span>
      <span className="bento__doc-flow">
        <i>PHP</i>
        <i>Laravel</i>
        <i>SaaS</i>
        <i className="is-on">AI</i>
      </span>
      <span className="bento__doc-line" />
      <span className="bento__doc-line bento__doc-line--short" />
    </div>
  )
}

/** The three builds as Open Builds rows: plate, eyebrow, title, arrow. */
function FunnelsPreview() {
  return (
    <div className="bento__media bento__fan" aria-hidden="true">
      {FUNNEL_SHOTS.map((f, i) => (
        <span key={f.file} className="bento__photo bento__photo--page" style={{ ['--i' as string]: i }}>
          <img src={thumbSrc(f)} alt="" loading="lazy" decoding="async" />
        </span>
      ))}
    </div>
  )
}

function AIPreview() {
  const half = Math.ceil(AI_LEAVES.length / 2)
  const rows = [AI_LEAVES.slice(0, half), AI_LEAVES.slice(half)]
  return (
    <div className="bento__media bento__chips" aria-hidden="true">
      {rows.map((row, r) => (
        <div key={r} className="bento__chip-row" data-dir={r ? 'right' : 'left'}>
          <div className="bento__chip-track">
            {[...row, ...row].map((n, i) => (
              <span key={`${n.id}-${i}`} className="bento__chip" data-status={n.status}>
                <n.Icon size={15} weight="duotone" />
                {n.name}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

function AppsPreview() {
  return (
    <div className="bento__media bento__reel bento__reel--row" aria-hidden="true">
      <div className="bento__reel-track">
        {[...APP_SHOTS, ...APP_SHOTS].map((src, i) => (
          <span key={i} className="bento__shot bento__shot--app">
            <img src={src} alt="" loading="lazy" decoding="async" />
          </span>
        ))}
      </div>
    </div>
  )
}

const PROJECTS: Project[] = [
  { id: 'workflows', index: '01', title: 'Screens from real builds', desc: 'From chat rooms to lending ledgers. Open it and click any screen to see it full size.', Icon: FlowIcon, logos: [T('react'), T('laravel'), T('nodejs')], eyebrow: 'Screenshots', Section: AutomationsPanel, span: 2, Preview: WorkflowsPreview },
  { id: 'plan', index: '02', title: 'Résumé', desc: 'My CV on one page. Read it here, or download the PDF.', Icon: PlanIcon, eyebrow: 'Curriculum vitae', Section: PlanPanel, Preview: PlanPreview },
  { id: 'funnels', index: '07', title: 'Spin the reel', desc: 'The builds on a 3D reel. Drag it, then click a card.', Icon: GlobeIcon, eyebrow: 'Every build', Section: BarrelPanel, Preview: FunnelsPreview },
  { id: 'ai', index: '08', title: 'Every build, by stack', desc: 'Twelve systems grouped by what they are, with what each one runs on.', Icon: SparkIcon, logos: [T('python'), T('mysql'), T('mongodb')], eyebrow: 'By stack', Section: AIWindow, Preview: AIPreview },
  { id: 'apps', index: '09', title: 'Case studies', desc: 'Each build written up: what it does, who it is for, and what it runs on.', Icon: ListBullets, eyebrow: 'Case studies', Section: AppsWindow, span: 2, Preview: AppsPreview },
]

/** The icon tile, or the real marks stacked horizontally in its place. */
function Marks({ p, size = 22 }: { p: Project; size?: number }) {
  if (!p.logos?.length) {
    return (
      <span className="bento__icon">
        <p.Icon size={size} />
      </span>
    )
  }
  return (
    <span className="bento__logos" aria-hidden="true">
      {p.logos.map((src) => (
        <span key={src} className="bento__logo">
          <img src={src} alt="" width={22} height={22} decoding="async" />
        </span>
      ))}
    </span>
  )
}

/* ---------- Dialog ----------
   A backdrop, a close button in the corner, and the work. No panel, no
   header: each Section brings its own window (or, for the strip, none). */
function ProjectModal({ project, onClose, children }: { project: Project; onClose: () => void; children: ReactNode }) {
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return createPortal(
    <div
      className="pmodal"
      data-lenis-prevent
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button ref={closeRef} type="button" className="pmodal__close" onClick={onClose} aria-label="Close">
        <X size={18} weight="bold" />
      </button>
      <div className="pmodal__stage">{children}</div>
    </div>,
    document.body,
  )
}

/* ---------- The page ---------- */

export default function ProjectsGrid() {
  const [open, setOpen] = useState<Project | null>(null)
  const phone = useIsPhone()
  const triggerRef = useRef<HTMLElement | null>(null)

  const show = useCallback((p: Project, el: HTMLElement) => {
    triggerRef.current = el
    setOpen(p)
  }, [])
  const close = useCallback(() => {
    setOpen(null)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }, [])

  /** Builds as Open Builds rows: plate, kicker, title, one line, arrow. */
  const stack = (list: Project[]) => (
    <div className="bento__stack">
      {list.map((b) => (
        <button
          key={b.id}
          type="button"
          className="bento__card bento__card--btn bento__card--build"
          onClick={(e) => show(b, e.currentTarget)}
          aria-haspopup="dialog"
        >
          <span className="bento__build-plate">
            {b.logos?.length ? <img src={b.logos[0]} alt="" width={22} height={22} /> : <b.Icon />}
          </span>
          <span className="bento__build-text">
            <span className="bento__kicker">{b.kicker}</span>
            <span className="bento__build-title">{b.title}</span>
            <span className="bento__build-desc">{b.desc}</span>
          </span>
          <span className="bento__build-arrow">
            <ArrowUpRight size={13} weight="bold" aria-hidden="true" />
          </span>
        </button>
      ))}
    </div>
  )

  const card = (p: Project) => (
    <button
      key={p.id}
      type="button"
      className={`bento__card bento__card--btn${p.span === 2 ? ' bento__card--wide' : ''}`}
      data-id={p.id}
      onClick={(e) => show(p, e.currentTarget)}
      aria-haspopup="dialog"
    >
      <span className="bento__head">
        <Marks p={p} />
        <span className="bento__title">{p.title}</span>
        <span className="bento__desc">{p.desc}</span>
        <ArrowUpRight size={15} weight="bold" aria-hidden="true" className="bento__arrow" />
      </span>
      <p.Preview />
    </button>
  )

  const plan = PROJECTS.find((p) => p.id === 'plan')

  return (
    <section className="pgrid" aria-labelledby="projects-title">
      <header className="pgrid__head">
        <span className="pgrid__eyebrow">Projects</span>
        <h1 className="pgrid__title" id="projects-title">
          Systems built like real products.
        </h1>
        <p className="pgrid__lede">Most started as school requirements. I built them like products anyway. Open a card to see the work.</p>
      </header>

      <div className="home__glass pgrid__glass">
        {/* Hung on the sheet's top edge so it reads as a tag on the container,
            not a seventh card. aria-hidden: the lede already says it. */}
        <span className="pgrid__hint" aria-hidden="true">
          <CursorClick size={14} weight="duotone" />
          Click a card to open it
        </span>
        {phone ? (
          /* A phone gets one straight path: the best three, then every
             build, then the CV. The reel, the stack and the screens are
             desk views and stay on the wide layout. */
          <div className="bento bento--projects">
            <h2 className="pgrid__group">Featured</h2>
            {stack(BUILDS)}
            <h2 className="pgrid__group">All {work.length} projects</h2>
            {stack(ALL_BUILDS)}
            {plan && card(plan)}
          </div>
        ) : (
          <div className="bento bento--projects">
            {PROJECTS.map((p) => (
              <Fragment key={p.id}>
                {card(p)}
                {p.id === 'plan' && stack(BUILDS)}
              </Fragment>
            ))}
          </div>
        )}
      </div>

      {open && (
        <ProjectModal project={open} onClose={close}>
          <open.Section />
        </ProjectModal>
      )}
    </section>
  )
}
