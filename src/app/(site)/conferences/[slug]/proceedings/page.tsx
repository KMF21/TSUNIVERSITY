import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Download } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { sanityFetch } from '@/sanity/live'
import { PROCEEDINGS_BY_CONFERENCE_SLUG_QUERY } from '@/sanity/queries'
import { formatDateRange, conferenceDisplayName } from '@/lib/conferences'
import { proceedingsJsonLd } from '@/lib/conference-jsonld'
import { JsonLd } from '@/components/conferences/JsonLd'
import { PaperList } from '@/components/conferences/PaperList'
import { hasImage, imageUrl } from '@/components/conferences/image'
import type { ProceedingsDetail } from '@/components/conferences/types'

type Props = { params: Promise<{ slug: string }> }

async function getProceedings(slug: string) {
  return ((await sanityFetch({ query: PROCEEDINGS_BY_CONFERENCE_SLUG_QUERY, params: { slug } })).data as ProceedingsDetail | null) ?? null
}

const formatBytes = (n?: number) => (n ? (n >= 1_048_576 ? `${(n / 1_048_576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`) : '')

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const p = await getProceedings(slug)
  if (!p) return { title: 'Proceedings not found' }
  const description = `${p.title} — ${p.papers?.length ?? 0} papers from ${conferenceDisplayName(p.conference)}, Taraba State University.`
  const canonical = `/conferences/${p.conference.slug}/proceedings`
  const images = hasImage(p.coverImage) ? [{ url: imageUrl(p.coverImage, 1200, 630), alt: p.title }] : undefined
  return {
    title: p.title,
    description,
    alternates: { canonical },
    openGraph: { title: p.title, description, url: canonical, type: 'book', images },
    twitter: { card: images ? 'summary_large_image' : 'summary', title: p.title, description },
  }
}

export default async function ProceedingsPage({ params }: Props) {
  const { slug } = await params
  const p = await getProceedings(slug)
  if (!p) notFound()

  const papers = p.papers ?? []
  const meta: [string, string | undefined][] = [
    ['Editors', p.editors?.join(', ')],
    ['Publisher', p.publisher],
    ['ISBN', p.isbn],
    ['ISSN', p.issn],
    ['DOI', p.doi],
    ['Published', p.publishedDate ? new Date(p.publishedDate + 'T00:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : String(p.year)],
    ['Papers', papers.length ? String(papers.length) : undefined],
  ]

  return (
    <>
      <JsonLd data={proceedingsJsonLd(p)} />
      <header className="bg-navy text-white">
        <Container className="py-12 sm:py-16">
          <Link href={`/conferences/${p.conference.slug}`} className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            {p.conference.shortName || p.conference.title}
          </Link>
          <div className="mt-4 grid gap-8 md:grid-cols-[200px_1fr] md:items-start lg:grid-cols-[240px_1fr]">
            <div className="relative mx-auto aspect-[3/4] w-44 overflow-hidden rounded-card bg-navy-700 shadow-xl md:w-full">
              {hasImage(p.coverImage) ? (
                <Image src={imageUrl(p.coverImage, 480, 640)} alt={p.coverImage.alt || `Cover of ${p.title}`} fill priority sizes="240px" className="object-cover" />
              ) : (
                <div className="flex h-full flex-col items-center justify-center p-4 text-center">
                  <span className="font-display text-lg font-bold">{p.conference.shortName || 'TSU'}</span>
                  <span className="mt-1 text-sm text-white/60">Proceedings {p.year}</span>
                </div>
              )}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-white/60">Conference Proceedings</p>
              <h1 className="mt-2 font-display text-3xl font-bold leading-tight sm:text-4xl">{p.title}</h1>
              <p className="mt-3 text-white/80">
                {conferenceDisplayName(p.conference)} · {formatDateRange(p.conference.startDate, p.conference.endDate)}
                {p.conference.venueCity && ` · ${p.conference.venueCity}`}
              </p>
              <dl className="mt-6 grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
                {meta.filter(([, v]) => v).map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs font-semibold uppercase tracking-wide text-white/60">{k}</dt>
                    <dd className="mt-0.5 text-white">{v}</dd>
                  </div>
                ))}
              </dl>
              {p.fullVolumeUrl && (
                <a
                  href={p.fullVolumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-8 inline-flex min-h-[48px] items-center gap-2 rounded-full bg-crimson px-7 font-semibold text-white transition hover:bg-crimson-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                >
                  <Download aria-hidden="true" className="h-4 w-4" />
                  Download full volume (PDF{p.fullVolumeSize ? `, ${formatBytes(p.fullVolumeSize)}` : ''})
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              )}
            </div>
          </div>
        </Container>
      </header>

      <Container className="py-12 sm:py-16">
        <h2 className="mb-6 font-display text-2xl font-bold text-navy">Papers</h2>
        {papers.length > 0 ? (
          <PaperList papers={papers} meta={p} />
        ) : (
          <p className="rounded-card bg-navy-50 p-8 text-center text-ink-muted">
            The paper listing is not available online yet.{p.fullVolumeUrl ? ' You can read the complete volume using the download button above.' : ''}
          </p>
        )}
      </Container>
    </>
  )
}
