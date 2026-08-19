import Image from 'next/image'
import { PortableText } from 'next-sanity'
import { urlFor } from '../../../sanity/image'
import { Container } from './Container'
import { Accordion } from './Accordion'

type Section =
  | { _type: 'contentBlock'; heading?: string; body: any }
  | { _type: 'statBlock'; value: string; label: string }
  | { _type: 'milestone'; year: string; title: string; description?: string }
  | { _type: 'accordionGroup'; groupTitle?: string; items: { heading: string; body?: any }[] }

export function PageBuilder({
  page,
}: {
  page: {
    title: string
    heroHeading?: string
    heroSubheading?: string
    heroImage?: any
    sections?: Section[]
  }
}) {
  return (
    <>
      <section className="bg-[#F7F9FC] py-16 text-center">
        <Container>
          <h1 className="font-display text-3xl font-bold text-navy sm:text-4xl">
            {page.heroHeading || page.title}
          </h1>
          {page.heroSubheading && <p className="mt-4 text-ink-muted">{page.heroSubheading}</p>}
        </Container>
      </section>

      {page.heroImage && (
        <Container className="py-10">
          <div className="relative aspect-video w-full overflow-hidden rounded-card">
            <Image src={urlFor(page.heroImage).width(1400).url()} alt={page.title} fill className="object-cover" />
          </div>
        </Container>
      )}

      <Container className="space-y-12 py-10">
        {page.sections?.map((section, i) => {
          if (section._type === 'contentBlock') {
            return (
              <div key={i} className="prose prose-neutral max-w-none">
                {section.heading && <h2 className="font-display text-navy">{section.heading}</h2>}
                <PortableText value={section.body} />
              </div>
            )
          }
          if (section._type === 'statBlock') {
            return (
              <div key={i} className="inline-block  bg-crimson-50 px-6 py-4 text-center">
                <p className="font-display text-2xl font-bold text-crimson">{section.value}</p>
                <p className="text-xs uppercase text-ink-muted">{section.label}</p>
              </div>
            )
          }
          if (section._type === 'milestone') {
            return (
              <div key={i} className="border-l-2 border-crimson pl-4">
                <p className="font-display text-xl font-bold text-crimson">{section.year}</p>
                <p className="font-semibold text-navy">{section.title}</p>
                {section.description && <p className="text-md text-ink-muted">{section.description}</p>}
              </div>
            )
          }
          if (section._type === 'accordionGroup') {
            return <Accordion key={i} groupTitle={section.groupTitle} items={section.items || []} />
          }
          return null
        })}
      </Container>
    </>
  )
}
