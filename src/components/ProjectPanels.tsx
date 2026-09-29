import { useEffect, useState, type ReactNode } from 'react'
import { lazy, Suspense } from 'react'
import WorkflowSamples from './WorkflowSamples'
import AIStackGrid from './AIStackGrid'
import { AppsSection } from './Projects'
import { useFunnelModal } from './FunnelModal'
import { projectReel } from '@/data/funnels'
import { workById } from '@/data/work'
import CaseCard from './CaseCard'
import { ArrowUpRight, DownloadSimple, FilePdf } from '@/components/slab'

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

/** Phones cannot show a PDF inside a frame: Android Chrome has no inline
 *  viewer and answers with "This content is blocked", iOS shows page one. */
const canFramePdf = () =>
  navigator.pdfViewerEnabled !== false && !window.matchMedia('(pointer: coarse) and (hover: none)').matches

/** The CV, full height, straight away - or, where the browser cannot frame
 *  a PDF, a card that opens or downloads it. */
export function PlanPanel() {
  const [inline] = useState(canFramePdf)
  return (
    <div className="ppanel ppanel--frame">
      <FrameBar host="toffdarell.dev" path="/resume.pdf" />
      {inline ? (
        <LiveFrame src="/resume.pdf" title="Toff Darell Vergara - Resume" />
      ) : (
        <div className="ppanel__stage">
          <div className="ppanel__pdf">
            <FilePdf size={44} weight="duotone" aria-hidden="true" />
            <span className="ppanel__pdf-title">Toff Darell Vergara - Résumé</span>
            <span className="ppanel__pdf-note">PDF · opens in your phone's viewer</span>
            <div className="ppanel__pdf-actions">
              <a className="case__link case__link--primary" href="/resume.pdf" target="_blank" rel="noopener noreferrer">
                Open résumé
                <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
              </a>
              <a className="case__link" href="/resume.pdf" download="Toff_Darell_Vergara_Resume.pdf">
                <DownloadSimple size={16} weight="bold" aria-hidden="true" />
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/** Ka-Buksuan and BukiFinds are deployed, so their dialogs are the live apps
 *  themselves. Each origin must also be in vercel.json's frame-src. */
export function KaBuksuanPanel() {
  return (
    <div className="ppanel ppanel--frame">
      <FrameBar host="ka-buksuans.onrender.com" path="/" />
      <LiveFrame src="https://ka-buksuans.onrender.com/" title="Ka-Buksuan live demo" allow="camera; microphone" />
    </div>
  )
}

export function BukiFindsPanel() {
  return (
    <div className="ppanel ppanel--frame">
      <FrameBar host="www.bukifinds.online" path="/" />
      <LiveFrame src="https://www.bukifinds.online/" title="BukiFinds live site" />
    </div>
  )
}

/** A build's case card in a window. The featured builds with no public
 *  deploy open this, and so does every row of the phone's full list. */
export function CasePanel({ id }: { id: string }) {
  const work = workById(id)
  if (!work) return null
  return (
    <div className="ppanel ppanel--frame">
      {work.github ? (
        <FrameBar host="github.com" path={work.github.replace('https://github.com', '')} />
      ) : (
        <FrameBar host="toffdarell.dev" path={`/projects/${work.id}`} />
      )}
      <div className="ppanel__stage">
        <CaseCard work={work} />
      </div>
    </div>
  )
}
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

/** `allow` delegates browser features (camera, mic) to the framed page; the
 *  site's Permissions-Policy in vercel.json must name that origin too. */
function LiveFrame({ src, title, allow }: { src: string; title: string; allow?: string }) {
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
        allow={allow}
        loading="eager"
        onLoad={() => setReady(true)}
        data-ready={ready ? 'true' : 'false'}
      />}
    </div>
  )
}
