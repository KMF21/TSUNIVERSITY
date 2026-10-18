import type { Metadata } from 'next'
import { Container } from '@/components/ui/Container'
import { ProceedingsArchive } from '@/components/conferences/ProceedingsArchive'
import type { ProceedingsListItem } from '@/components/conferences/types'
import { sanityFetch } from '@/sanity/live'
import { PROCEEDINGS_ARCHIVE_QUERY } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Conference Proceedings',
  description:
    'The published proceedings of research conferences hosted at Taraba State University — full volumes and individual papers, organised by year and host unit.',
  alternates: { canonical: '/proceedings' },
  openGraph: {
    title: 'Conference Proceedings | Taraba State University',
    description: 'Published proceedings of Taraba State University research conferences.',
    url: '/proceedings',
  },
}

export default async function ProceedingsArchivePage() {
  const items = ((await sanityFetch({ query: PROCEEDINGS_ARCHIVE_QUERY })).data as ProceedingsListItem[] | null) ?? []

  return (
    <>
      <section className="bg-navy pb-28 pt-16 text-center text-white">
        <Container>
          <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Taraba State University</p>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-5xl">Conference Proceedings</h1>
          <span className="mx-auto mt-5 block h-1 w-16 rounded-full bg-crimson" />
          <p className="mx-auto mt-5 max-w-3xl text-white/80">
            The scholarly record of conferences hosted at the university. Download full volumes, browse papers and cite them in your own work.
          </p>
        </Container>
      </section>
      <Container className="relative z-10 -mt-14 pb-20">
        <ProceedingsArchive items={items} />
      </Container>
    </>
  )
}
