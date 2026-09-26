import { work, type Work } from '@/data/work'

/**
 * The 3D reel on Projects. Every card is a build from work.ts: the face is
 * its screenshot, and clicking it opens the case card (FunnelModal) with the
 * write-up, the stack and the links.
 */
export type Funnel = {
  file: string
  label: string
  tag: string
  desc: string
  /** Card face. */
  thumb: string
  work: Work
}

export const projectReel: Funnel[] = work.map((w) => ({
  file: w.id,
  label: w.short,
  tag: w.category,
  desc: w.description,
  thumb: w.image,
  work: w,
}))
