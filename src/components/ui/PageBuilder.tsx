import Image from 'next/image'
import { PortableText } from 'next-sanity'
import { CheckCircle2 } from 'lucide-react'

import { urlFor } from '../../../sanity/image'
import { Accordion } from './Accordion'
import { Container } from './Container'

type Section =
  | {
      _type: 'contentBlock'
      heading?: string
      body: any
    }
  | {
      _type: 'statBlock'
      value: string
      label: string
    }
  | {
      _type: 'milestone'
      year: string
      title: string
      description?: string
    }
  | {
      _type: 'accordionGroup'
      groupTitle?: string
      items: {
        heading: string
        body?: any
      }[]
    }
  | {
      _type: 'stepList'
      groupTitle?: string
      steps?: {
        title: string
        description?: string
      }[]
    }
  | {
      _type: 'checklist'
      groupTitle?: string
      items?: string[]
    }

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
      {/* Hero */}
      <section className="bg-[#F7F9FC] py-16 text-center">
        <Container>
          <h1 className="font-display text-3xl font-bold text-navy sm:text-4xl">
            {page.heroHeading || page.title}
          </h1>

          {page.heroSubheading && (
            <p className="mt-4 text-ink-muted">
              {page.heroSubheading}
            </p>
          )}
        </Container>
      </section>

      {/* Hero Image */}
      {page.heroImage && (
        <Container className="py-10">
          <div className="relative aspect-video w-full overflow-hidden rounded-card">
            <Image
              src={urlFor(page.heroImage).width(1400).url()}
              alt={page.title}
              fill
              className="object-cover"
            />
          </div>
        </Container>
      )}

      {/* Page Sections */}
      <Container className="space-y-12 py-10">
        {page.sections?.map((section, i) => {
          /* Content Block */
          if (section._type === 'contentBlock') {
            return (
              <div key={i} className="prose prose-neutral max-w-none">
                {section.heading && (
                  <h2 className="font-display text-navy">
                    {section.heading}
                  </h2>
                )}

                <PortableText value={section.body} />
              </div>
            )
          }

          /* Stat Block */
          if (section._type === 'statBlock') {
            return (
              <div
                key={i}
                className="inline-block bg-crimson-50 px-6 py-4 text-center"
              >
                <p className="font-display text-2xl font-bold text-crimson">
                  {section.value}
                </p>

                <p className="text-xs uppercase text-ink-muted">
                  {section.label}
                </p>
              </div>
            )
          }

          /* Milestone */
          if (section._type === 'milestone') {
            return (
              <div
                key={i}
                className="border-l-2 border-crimson pl-4"
              >
                <p className="font-display text-xl font-bold text-crimson">
                  {section.year}
                </p>

                <p className="font-semibold text-navy">
                  {section.title}
                </p>

                {section.description && (
                  <p className="text-md text-ink-muted">
                    {section.description}
                  </p>
                )}
              </div>
            )
          }

          /* Accordion Group */
          if (section._type === 'accordionGroup') {
            return (
              <Accordion
                key={i}
                groupTitle={section.groupTitle}
                items={section.items || []}
              />
            )
          }

          /* Step List */
          if (section._type === 'stepList') {
            return (
              <div key={i}>
                {section.groupTitle && (
                  <h2 className="font-display text-2xl font-bold text-navy">
                    {section.groupTitle}
                  </h2>
                )}

                <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {section.steps?.map((step, j) => (
                    <div
                      key={j}
                      className="rounded-2xl bg-rose-tint p-6"
                    >
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-crimson font-display text-sm font-bold text-white">
                        {j + 1}
                      </span>

                      <p className="mt-4 font-semibold text-navy">
                        {step.title}
                      </p>

                      {step.description && (
                        <p className="mt-1 text-sm leading-6 text-ink-muted">
                          {step.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          }

          /* Checklist */
          if (section._type === 'checklist') {
            return (
              <div key={i}>
                {section.groupTitle && (
                  <h2 className="font-display text-2xl font-bold text-navy">
                    {section.groupTitle}
                  </h2>
                )}

                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {section.items?.map((item, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2 text-md text-ink-muted"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-crimson" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )
          }

          return null
        })}
      </Container>
    </>
  )
}