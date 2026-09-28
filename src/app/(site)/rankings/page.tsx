import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowRight, Info } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SmartLink } from '@/components/ui/SmartLink'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'
import { StatStrip } from '@/components/rankings/StatStrip'
import { RankingsTable } from '@/components/rankings/RankingsTable'
import { AwardsTimeline } from '@/components/rankings/AwardsTimeline'
import { ScholarCards } from '@/components/rankings/ScholarCards'
import type { InstitutionalFactsData, RankingsPageData } from '@/components/rankings/types'
import { sanityFetch } from '@/sanity/live'
import { INSTITUTIONAL_FACTS_QUERY, RANKINGS_PAGE_QUERY } from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Rankings & Recognition',
  description:
    "How Taraba State University's research is ranked internationally, with awards, funded research and recognised scholars.",
}

const EXPLORE = [
  { href: '/research', title: 'Research', text: 'Research at Taraba State University' },
  { href: '/tetfund', title: 'TETFund', text: 'TETFund-supported projects and interventions' },
  { href: '/academics', title: 'Academics', text: 'Faculties, departments and programmes' },
]

export default async function RankingsPage() {
  const [page, facts] = await Promise.all([
    sanityFetch({ query: RANKINGS_PAGE_QUERY }).then((r) => r.data as RankingsPageData | null),
    sanityFetch({ query: INSTITUTIONAL_FACTS_QUERY }).then((r) => r.data as InstitutionalFactsData),
  ])
  if (!page) notFound()

  return (
    <>
      {/* Hero */}
      <section className="bg-navy pb-24 pt-16 text-center text-white">
        <Container>
          <p className="text-md font-semibold uppercase tracking-wide text-white/60">
            Taraba State University
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold sm:text-5xl">
            {page.heroHeading || page.title}
          </h1>
          <span className="mx-auto mt-5 block h-1 w-16 rounded-full bg-crimson" />
          {page.heroSubheading && (
            <p className="mx-auto mt-5 max-w-3xl text-white/80">{page.heroSubheading}</p>
          )}
        </Container>
      </section>

      {/* Headline facts, overlapping the hero */}
      {facts?.stats && facts.stats.length > 0 && (
        <Container className="relative z-10 -mt-12">
          <StatStrip stats={facts.stats} />
        </Container>
      )}

      <Container className="py-16">
        {/* Rankings */}
        {page.rankings && page.rankings.length > 0 && (
          <section>
            <AnimateOnScroll>
              <SectionHeading
                eyebrow="Research Impact"
                title="Rankings at a Glance"
                subtitle={page.rankingsIntro}
              />
            </AnimateOnScroll>
            <div className="mt-10">
              <RankingsTable rankings={page.rankings} />
            </div>
            {page.rankingsMethodNote && (
              <p className="mt-4 flex items-start gap-2 text-sm text-ink-muted">
                <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-crimson" />
                {page.rankingsMethodNote}
              </p>
            )}
            {page.highlights && page.highlights.length > 0 && (
              <StaggerGroup className="mt-10 grid gap-5 md:grid-cols-3" staggerDelay={0.08}>
                {page.highlights.map((h, i) => (
                  <StaggerItem key={i} className="h-full">
                    <div className="h-full rounded-card bg-rose-tint p-6">
                      <h3 className="font-display text-base font-semibold text-navy">{h.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-ink-muted">{h.text}</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerGroup>
            )}
          </section>
        )}

        {/* Research strengths */}
        {page.researchStrengths && page.researchStrengths.length > 0 && (
          <section className="mt-20">
            <AnimateOnScroll>
              <SectionHeading
                eyebrow="Where We Lead"
                title="Research Strengths"
                subtitle={page.strengthsIntro}
              />
            </AnimateOnScroll>
            <StaggerGroup className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.07}>
              {page.researchStrengths.map((s, i) => (
                <StaggerItem key={i} className="h-full">
                  <article className="flex h-full flex-col rounded-card border border-black/5 border-t-4 border-t-crimson bg-white p-6 shadow-sm">
                    <h3 className="font-display text-base font-semibold text-navy">{s.title}</h3>
                    {s.description && (
                      <p className="mt-2 flex-1 text-sm leading-6 text-ink-muted">{s.description}</p>
                    )}
                    {s.linkUrl && (
                      <SmartLink
                        href={s.linkUrl}
                        className="mt-4 text-sm font-semibold text-crimson hover:underline"
                      >
                        {s.linkLabel || 'Learn more'}
                      </SmartLink>
                    )}
                  </article>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </section>
        )}

        {/* Awards & recognition */}
        {page.awards && page.awards.length > 0 && (
          <section className="mt-20">
            <AnimateOnScroll>
              <SectionHeading
                eyebrow="Milestones"
                title="Awards, Distinctions & Recognition"
                subtitle={page.awardsIntro}
              />
            </AnimateOnScroll>
            <div className="mx-auto mt-10 max-w-3xl">
              <AwardsTimeline awards={page.awards} />
            </div>
          </section>
        )}

        {/* Scholars */}
        {page.scholars && page.scholars.length > 0 && (
          <section className="mt-20">
            <AnimateOnScroll>
              <SectionHeading
                eyebrow="Our Scholars"
                title="Recognised Scholars"
                subtitle={page.scholarsIntro}
              />
            </AnimateOnScroll>
            <div className="mt-10">
              <ScholarCards scholars={page.scholars} />
            </div>
          </section>
        )}

        {/* Explore more */}
        <section className="mt-20">
          <div className="grid gap-4 sm:grid-cols-3">
            {EXPLORE.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center justify-between rounded-card border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-crimson hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
              >
                <span>
                  <span className="block font-display font-semibold text-navy">{item.title}</span>
                  <span className="mt-0.5 block text-sm text-ink-muted">{item.text}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-crimson transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>

        {/* Sources */}
        {page.sources && page.sources.length > 0 && (
          <section className="mt-20 rounded-card bg-rose-tint p-6 sm:p-8">
            <h2 className="font-display text-lg font-semibold text-navy">Sources &amp; Notes</h2>
            <ul className="mt-4 space-y-2 text-sm text-ink-muted">
              {page.sources.map((src, i) => (
                <li key={i}>
                  <span className="font-semibold text-navy">{src.label}: </span>
                  {src.url ? (
                    <SmartLink href={src.url} className="text-crimson hover:underline">
                      {src.detail}
                    </SmartLink>
                  ) : (
                    src.detail
                  )}
                </li>
              ))}
            </ul>
            {page.lastUpdatedNote && (
              <p className="mt-4 text-xs text-ink-muted">
                Rankings are updated regularly; figures on this page reflect the dates shown. Page last
                updated: {page.lastUpdatedNote}.
              </p>
            )}
          </section>
        )}
      </Container>
    </>
  )
}
