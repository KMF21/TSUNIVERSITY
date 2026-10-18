'use client'

import { useEffect, useState } from 'react'

export type NavSection = { id: string; label: string }

/**
 * Sticky in-page navigation with scroll-spy. Sections are filtered on the
 * server so empty ones never appear. Sits below the 80px site header.
 */
export function SectionNav({ sections }: { sections: NavSection[] }) {
  const [active, setActive] = useState(sections[0]?.id ?? '')

  // Scroll-spy: the active section is the last one whose top has passed the
  // sticky header + nav (about 200px from the viewport top).
  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter((el): el is HTMLElement => Boolean(el))
    if (els.length === 0) return
    let frame = 0
    const update = () => {
      frame = 0
      let current = els[0].id
      for (const el of els) {
        if (el.getBoundingClientRect().top <= 210) current = el.id
      }
      setActive(current)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [sections])

  // Keep the active pill visible in the horizontally scrolling mobile bar.
  useEffect(() => {
    document.querySelector<HTMLElement>(`[data-nav-id="${active}"]`)?.scrollIntoView({ block: 'nearest', inline: 'center' })
  }, [active])

  if (sections.length < 2) return null

  return (
    <nav aria-label="Conference sections" className="sticky top-16 z-30 border-b border-black/10 bg-white/95 backdrop-blur lg:top-20" data-no-print>
      <ul className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-6 lg:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((s) => (
          <li key={s.id} className="shrink-0">
            <a
              href={`#${s.id}`}
              data-nav-id={s.id}
              aria-current={active === s.id ? 'true' : undefined}
              className={`flex min-h-[48px] items-center border-b-2 px-3 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson ${
                active === s.id ? 'border-crimson text-crimson' : 'border-transparent text-ink-muted hover:text-navy'
              }`}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
