'use client'

import { useState } from 'react'
import { PortableText } from 'next-sanity'

type AccordionItem = {
  heading: string
  body?: any
}

export function Accordion({ groupTitle, items }: { groupTitle?: string; items: AccordionItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div>
      {groupTitle && <h2 className="font-display text-xl font-bold text-navy">{groupTitle}</h2>}
      <div className="mt-4 divide-y divide-black/10 rounded-card border border-black/10">
        {items.map((item, i) => {
          const isOpen = openIndex === i
          return (
            <div key={i}>
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between px-5 py-4 text-left font-medium text-navy transition hover:bg-rose-tint focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
              >
                <span>{item.heading}</span>
                <span className={`text-crimson transition-transform ${isOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              {isOpen && (
                <div className="px-5 pb-5 text-md text-ink-muted">
                  {item.body ? (
                    <PortableText value={item.body} />
                  ) : (
                    <p className="italic">Content coming soon.</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
