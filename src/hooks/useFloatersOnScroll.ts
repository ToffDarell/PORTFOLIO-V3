import { useEffect } from 'react'

/**
 * On phones the chat and accessibility buttons float over the page. While
 * the visitor scrolls down to read, they slide away; scrolling up, stopping
 * near the bottom, or reaching the top brings them back. Written to
 * <html data-floaters>, styled in mobile-app.css.
 *
 * Listens in the capture phase so it hears whichever element scrolls (the
 * shell panel or the document).
 */
export function useFloatersOnScroll(enabled: boolean) {
  useEffect(() => {
    const root = document.documentElement
    if (!enabled) {
      delete root.dataset.floaters
      return
    }
    let last = new WeakMap<EventTarget, number>()
    const onScroll = (e: Event) => {
      const el = e.target === document ? document.scrollingElement : (e.target as Element)
      if (!el) return
      const y = el.scrollTop
      const prev = last.get(el) ?? y
      last.set(el, y)
      const nearEnd = el.scrollHeight - el.clientHeight - y < 80
      if (y < 40 || nearEnd || y < prev - 6) delete root.dataset.floaters
      else if (y > prev + 6) root.dataset.floaters = 'hidden'
    }
    document.addEventListener('scroll', onScroll, { capture: true, passive: true })
    return () => {
      document.removeEventListener('scroll', onScroll, { capture: true })
      delete root.dataset.floaters
      last = new WeakMap()
    }
  }, [enabled])
}
