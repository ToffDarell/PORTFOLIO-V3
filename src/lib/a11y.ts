/**
 * Accessibility preferences. Five switches a visitor with low vision can flip
 * from the AccessMenu, each written as a `data-a11y-*` attribute on <html> so
 * a11y.css can act on it, and remembered in localStorage across visits.
 *
 * `motion` also feeds App.tsx: the shader is never mounted while it is on,
 * the same path prefers-reduced-motion already takes. `plainBg` unmounts the
 * shader alone and leaves every other animation running.
 */
export type TextSize = 'md' | 'lg' | 'xl'
export type A11yPrefs = {
  text: TextSize
  contrast: boolean
  motion: boolean
  links: boolean
  plainBg: boolean
}

const KEY = 'kv-a11y'
export const A11Y_EVENT = 'a11ychange'
export const DEFAULT_PREFS: A11yPrefs = { text: 'md', contrast: false, motion: false, links: false, plainBg: false }

export function readPrefs(): A11yPrefs {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_PREFS
    const p = JSON.parse(raw) as Partial<A11yPrefs>
    return {
      text: p.text === 'lg' || p.text === 'xl' ? p.text : 'md',
      contrast: !!p.contrast,
      motion: !!p.motion,
      links: !!p.links,
      plainBg: !!p.plainBg,
    }
  } catch {
    return DEFAULT_PREFS
  }
}

export function applyPrefs(p: A11yPrefs) {
  const d = document.documentElement.dataset
  if (p.text === 'md') delete d.a11yText
  else d.a11yText = p.text
  if (p.contrast) d.a11yContrast = 'true'
  else delete d.a11yContrast
  if (p.motion) d.a11yMotion = 'true'
  else delete d.a11yMotion
  if (p.links) d.a11yLinks = 'true'
  else delete d.a11yLinks
  if (p.plainBg) d.a11yPlainBg = 'true'
  else delete d.a11yPlainBg
}

export function savePrefs(p: A11yPrefs) {
  applyPrefs(p)
  try {
    localStorage.setItem(KEY, JSON.stringify(p))
  } catch {
    /* private mode: the choice lasts for the tab */
  }
  window.dispatchEvent(new CustomEvent<A11yPrefs>(A11Y_EVENT, { detail: p }))
}

/** Re-apply the saved switches before the first paint. */
export function restorePrefs() {
  applyPrefs(readPrefs())
}

export function motionReduced(): boolean {
  return document.documentElement.dataset.a11yMotion === 'true'
}

/** The visitor turned the background lines off (or all motion). */
export function backgroundHidden(): boolean {
  const d = document.documentElement.dataset
  return d.a11yPlainBg === 'true' || d.a11yMotion === 'true'
}
