import { work } from '@/data/work'

export type AppStat = { value: string; label: string }

export type AppProject = {
  name: string
  tagline: string
  description: string
  /** Optional - omit for gradient placeholder cards */
  imageSrc?: string
  /** CSS object-position override. Defaults to 'top center'. */
  imagePosition?: string
  /** External brand color - not a site token. Passed via --app-color inline prop. */
  accentColor: string
  stats: AppStat[]
  badge: string
}

/** @deprecated use AppProject */
export type MobileApp = AppProject

/**
 * The case-study cards in the Projects "Case studies" pop-up: one per build
 * in work.ts, so the write-up lives in one place.
 */
export const mobileApps: AppProject[] = work.map((w) => ({
  name: w.short,
  tagline: w.category,
  description: w.description,
  imageSrc: w.image,
  accentColor: w.accent,
  stats: [
    { value: w.status, label: 'Status' },
    { value: w.tags[0], label: 'Built with' },
    { value: String(w.tags.length), label: 'Technologies' },
  ],
  badge: w.category,
}))
