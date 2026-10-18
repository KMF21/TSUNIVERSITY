import type { Metadata } from 'next'
import { Suspense } from 'react'
import { Container } from '@/components/ui/Container'
import { ConferencesHub } from '@/components/conferences/ConferencesHub'
import type { ConferenceSummary } from '@/components/conferences/types'
import { sanityFetch } from '@/sanity/live'
import { CONFERENCES_LIST_QUERY } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Conferences',
  description:
    'Research conferences hosted by the faculties, departments and centres of Taraba State University — upcoming calls for papers, programmes and published proceedings.',
  alternates: { canonical: '/conferences' },
  openGraph: {
    title: 'Conferences | Taraba State University',
    description: 'Upcoming and past research conferences hosted at Taraba State University, with published proceedings.',
    url: '/conferences',
  },
}

export default async function ConferencesPage() {
  const conferences = ((await sanityFetch({ query: CONFERENCES_LIST_QUERY })).data as ConferenceSummary[] | null) ?? []
  const hosts = new Set(conferences.map((c) => c.organiserName).filter(Boolean)).size
  const withProceedings = conferences.filter((c) => c.hasProceedings).length

  return (
    <>
      <section className="bg-navy pb-28 pt-16 text-center text-white">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Taraba State University</p>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-5xl">Conferences</h1>
          <span className="mx-auto mt-5 block h-1 w-16 rounded-full bg-crimson" />
          <p className="mx-auto mt-5 max-w-3xl text-white/80">
            Scholars, practitioners and policy-makers gather at Taraba State University to share research and shape ideas.
            Find calls for papers, programmes and speakers for upcoming conferences, and read the published proceedings of past ones.
          </p>
          {conferences.length > 0 && (
            <ul className="mx-auto mt-8 flex max-w-xl flex-wrap justify-center gap-x-10 gap-y-3 text-center">
              {[
                [conferences.length, conferences.length === 1 ? 'Conference' : 'Conferences'],
                [hosts, hosts === 1 ? 'Host unit' : 'Host units'],
                [withProceedings, withProceedings === 1 ? 'Proceedings volume' : 'Proceedings volumes'],
              ].map(([n, label]) => (
                <li key={label as string}>
                  <span className="block font-display text-3xl font-bold">{n}</span>
                  <span className="text-xs font-semibold uppercase tracking-wide text-white/60">{label}</span>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <Container className="relative z-10 -mt-14 pb-20">
        <Suspense fallback={<div className="h-40 rounded-card bg-white shadow-lg" aria-hidden="true" />}>
          <ConferencesHub conferences={conferences} nowIso={new Date().toISOString()} />
        </Suspense>
      </Container>
    </>
  )
}
