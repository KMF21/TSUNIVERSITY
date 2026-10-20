import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'
import { sanityFetch } from '@/sanity/live'
import { STATISTIC_INDICATORS_LIST_QUERY } from '@/sanity/queries'
import type { IndicatorListItem } from '@/components/facts/types'

export const metadata: Metadata = {
  title: 'Facts & Figures',
  description:
    'Taraba State University by the numbers — enrolment, staff, gender, research output, international reach and access, drawn from official university records.',
}

export default async function FactsAndFiguresPage() {
  const indicators = (
    (await sanityFetch({ query: STATISTIC_INDICATORS_LIST_QUERY })).data as IndicatorListItem[] | null
  ) || []

  return (
    <>
      <section className="bg-navy pb-24 pt-16 text-center text-white">
        <Container>
          <p className="text-md font-semibold uppercase tracking-wide text-white/60">
            Taraba State University
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-5xl">Facts &amp; Figures</h1>
          <span className="mx-auto mt-5 block h-1 w-16 rounded-full bg-crimson" />
          <p className="mx-auto mt-5 max-w-3xl text-white/80">
            The university by the numbers — enrolment, staff, gender balance, research output,
            international reach and access — drawn from official university records.
          </p>
        </Container>
      </section>

      <Container className="relative z-10 -mt-12 pb-20">
        <div className="rounded-card bg-white p-2 shadow-lg sm:p-3">
          <AnimateHeading />
          {indicators.length === 0 ? (
            <p className="p-8 text-center text-ink-muted">
              Statistics are being compiled and will appear here shortly.
            </p>
          ) : (
            <StaggerGroup className="grid gap-5 p-4 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.05}>
              {indicators.map((ind) => (
                <StaggerItem key={ind._id} className="h-full">
                  <Link
                    href={`/facts-and-figures/${ind.slug}`}
                    className="group flex h-full flex-col rounded-card border border-black/5 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-crimson hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
                  >
                    <h3 className="font-display text-lg font-bold text-navy">{ind.title}</h3>
                    {ind.summary && (
                      <p className="mt-2 flex-1 text-sm leading-6 text-ink-muted">{ind.summary}</p>
                    )}
                    {ind.stats && ind.stats.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 border-t border-black/5 pt-4">
                        {ind.stats.map((s, i) => (
                          <span key={i} className="text-sm">
                            <span className="font-display font-bold text-navy">{s.value || '—'}</span>{' '}
                            <span className="text-ink-muted">{s.label}</span>
                          </span>
                        ))}
                      </div>
                    )}
                    <span className="mt-4 flex items-center gap-1 text-sm font-semibold text-crimson">
                      View details
                      <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </div>
      </Container>
    </>
  )
}

function AnimateHeading() {
  return (
    <div className="p-5 pb-0 sm:p-6 sm:pb-0">
      <SectionHeading eyebrow="University Statistics" title="Explore the Data" />
    </div>
  )
}
