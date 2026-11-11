import { PortableText } from 'next-sanity'
import { FactsTable } from './FactsTable'
import { BarPanel } from './BarPanel'
import { NoteCallout } from './NoteCallout'
import type { IndicatorSection } from './types'

function renderSection(section: IndicatorSection) {
  if (section._type === 'factsTable') return <FactsTable section={section} />
  if (section._type === 'barPanel') return <BarPanel section={section} />
  if (section._type === 'note') return <NoteCallout section={section} />
  if (section._type === 'richText') {
    return (
      <div className="prose prose-neutral max-w-none">
        {section.heading && <h3 className="font-display text-navy">{section.heading}</h3>}
        {section.body && <PortableText value={section.body} />}
      </div>
    )
  }
  return null
}

export function IndicatorSections({ sections }: { sections?: IndicatorSection[] }) {
  if (!sections?.length) return null

  return (
    <div className="space-y-10">
      {sections.map((section, i) => (
        // Each section gets an anchor from its _key so other pages can deep-link to it.
        <div key={section._key || i} id={section._key} className="scroll-mt-28">
          {renderSection(section)}
        </div>
      ))}
    </div>
  )
}
