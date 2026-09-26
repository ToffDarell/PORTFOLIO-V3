import { useEffect, useState, type ReactNode } from 'react'
import { lazy, Suspense } from 'react'
import WorkflowSamples from './WorkflowSamples'
import AIStackGrid from './AIStackGrid'
import { AppsSection } from './Projects'
import { useFunnelModal } from './FunnelModal'
import { projectReel } from '@/data/funnels'
import { workById } from '@/data/work'
import CaseCard from './CaseCard'

const FunnelBarrel = lazy(() => import('./FunnelBarrel'))

/**
 * What the Projects dialogs show. Each panel is the work itself, on screen
 * the moment the dialog opens - no section chrome to read past and no second
 * dialog to click into.
 */

/** Only the strip of macOS windows, drifting on the backdrop. No window. */
export function AutomationsPanel() {
  return (
    <div className="ppanel ppanel--strip">
      <WorkflowSamples />
    </div>
  )
}

/** A plain mac window with a scrolling body, for the sections that are
 *  pages rather than frames. */
function SectionWindow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="ppanel ppanel--window">
      <div className="ppanel__bar">
        <span className="ppanel__dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <span className="ppanel__url">
          <span className="ppanel__url-host">{label}</span>
        </span>
      </div>
      <div className="ppanel__scroll">{children}</div>
    </div>
  )
}

/** Only the barrel, spinning on the backdrop. Its own page preview still
 *  stacks above (z 9000). */
export function BarrelPanel() {
  const { openFull, modal } = useFunnelModal()
  return (
    <div className="ppanel ppanel--barrel">
      <Suspense fallback={<div className="funnels__barrel-skeleton" aria-hidden="true" />}>
        <FunnelBarrel funnels={projectReel} onOpen={openFull} />
      </Suspense>
      {modal}
    </div>
  )
}

/** The systems as a logo-first grid, in a scrolling window. */
export function AIWindow() {
  return (
    <SectionWindow label="Every build">
      <AIStackGrid />
    </SectionWindow>
  )
}
export function AppsWindow() {
  return (
    <SectionWindow label="Case studies">
      <AppsSection />
    </SectionWindow>
  )
}

/** The CV, full height, straight away. */
export function PlanPanel() {
  return (
    <div className="ppanel ppanel--frame">
      <FrameBar host="toffdarell.dev" path="/resume.pdf" />
      <LiveFrame src="/resume.pdf" title="Toff Darell Vergara - Resume" />
    </div>
  )
}

/** Ka-Buksuan is deployed, so its dialog is the live app itself. */
export function KaBuksuanPanel() {
  return (
    <div className="ppanel ppanel--frame">
      <FrameBar host="ka-buksuans.onrender.com" path="/" />
      <LiveFrame src="https://ka-buksuans.onrender.com/" title="Ka-Buksuan live demo" />
    </div>
  )
}

/** The other featured builds have no public deploy: their case card. */
function CasePanel({ id }: { id: string }) {
  const work = workById(id)
  if (!work) return null
  return (
    <div className="ppanel ppanel--frame">
      <FrameBar host="github.com" path={work.github?.replace('https://github.com', '') ?? '/ToffDarell'} />
      <div className="ppanel__stage">
        <CaseCard work={work} />
      </div>
    </div>
  )
}
export const PayMonitorPanel = () => <CasePanel id="paymonitor" />
export const SafeRidePanel = () => <CasePanel id="saferide" />

function FrameBar({ host, path }: { host: string; path: string }) {
  return (
    <div className="ppanel__bar">
      <span className="ppanel__dots" aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
      <span className="ppanel__url">
        <span className="ppanel__url-host">{host}</span>
        <span className="ppanel__url-path">{path}</span>
      </span>
    </div>
  )
}

/** Matches `pmodal-panel` (420ms). Same-site frames share the portfolio's
 *  main thread, so loading one mid-animation stalled the open by 100ms+. */
const FRAME_DELAY_MS = 440

function LiveFrame({ src, title }: { src: string; title: string }) {
  const [ready, setReady] = useState(false)
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), FRAME_DELAY_MS)
    return () => window.clearTimeout(id)
  }, [])
  return (
    <div className="ppanel__stage">
      {!ready && <div className="ppanel__skeleton" aria-hidden="true" />}
      {mounted && <iframe
        className="ppanel__iframe"
        src={src}
        title={title}
        loading="eager"
        onLoad={() => setReady(true)}
        data-ready={ready ? 'true' : 'false'}
      />}
    </div>
  )
}
