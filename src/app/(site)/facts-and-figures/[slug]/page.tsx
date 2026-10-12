import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { IndicatorStatStrip } from '@/components/facts/IndicatorStatStrip'
import { IndicatorSections } from '@/components/facts/IndicatorSections'
import { sanityFetch } from '@/sanity/live'
import { STATISTIC_INDICATOR_BY_SLUG_QUERY } from '@/sanity/queries'
import type { IndicatorDetail } from '@/components/facts/types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const indicator = (
    (await sanityFetch({ query: STATISTIC_INDICATOR_BY_SLUG_QUERY, params: { slug } })).data as IndicatorDetail | null
  )
  if (!indicator) return {}
  return {
    title: indicator.title,
    description: indicator.summary,
  }
}

export default async function IndicatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const indicator = (
    (await sanityFetch({ query: STATISTIC_INDICATOR_BY_SLUG_QUERY, params: { slug } })).data as IndicatorDetail | null
  )
  if (!indicator) notFound()

  return (
    <>
      <section className="bg-navy pb-24 pt-16 text-center text-white">
        <Container>
          <Link
            href="/facts-and-figures"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Facts &amp; Figures
          </Link>
          {typeof indicator.indicatorNumber === 'number' && (
            <p className="mt-4 text-md font-semibold uppercase tracking-wide text-white/60">
              Indicator {indicator.indicatorNumber}
            </p>
          )}
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-5xl">{indicator.title}</h1>
          <span className="mx-auto mt-5 block h-1 w-16 rounded-full bg-crimson" />
          {indicator.summary && (
            <p className="mx-auto mt-5 max-w-3xl text-white/80">{indicator.summary}</p>
          )}
        </Container>
      </section>

      {indicator.stats && indicator.stats.length > 0 && (
        <Container className="relative z-10 -mt-12">
          <IndicatorStatStrip stats={indicator.stats} />
        </Container>
      )}

      <Container className="py-16">
        <IndicatorSections sections={indicator.sections} />

        {indicator.sourceNotes && indicator.sourceNotes.length > 0 && (
          <section className="mt-16 rounded-card bg-rose-tint p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-navy">Sources &amp; Notes</h2>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              {indicator.sourceNotes.map((note, i) => (
                <li key={i}>{note}</li>
              ))}
            </ul>
            {indicator.lastUpdatedNote && (
              <p className="mt-4 text-xs text-ink-muted">
                Page last updated: {indicator.lastUpdatedNote}.
              </p>
            )}
          </section>
        )}
      </Container>
    </>
  )
}
