import { PortableText } from 'next-sanity'
import { FactsTable } from './FactsTable'
import { BarPanel } from './BarPanel'
import { NoteCallout } from './NoteCallout'
import type { IndicatorSection } from './types'

export function IndicatorSections({ sections }: { sections?: IndicatorSection[] }) {
  if (!sections?.length) return null

  return (
    <div className="space-y-10">
      {sections.map((section, i) => {
        if (section._type === 'factsTable') return <FactsTable key={i} section={section} />
        if (section._type === 'barPanel') return <BarPanel key={i} section={section} />
        if (section._type === 'note') return <NoteCallout key={i} section={section} />
        if (section._type === 'richText') {
          return (
            <div key={i} className="prose prose-neutral max-w-none">
              {section.heading && <h3 className="font-display text-navy">{section.heading}</h3>}
              {section.body && <PortableText value={section.body} />}
            </div>
          )
        }
        return null
      })}
    </div>
  )
}
