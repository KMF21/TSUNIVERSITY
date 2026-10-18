import Link from 'next/link'
import { sanityFetch } from '../../../sanity/live'
import { FEATURED_CONFERENCES_QUERY } from '../../../sanity/queries'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { AnimateOnScroll } from '../motion/AnimateOnScroll'
import { StaggerGroup, StaggerItem } from '../motion/StaggerGroup'
import { ConferenceCard } from '../conferences/ConferenceCard'
import { getConferenceStatus } from '@/lib/conferences'
import type { ConferenceSummary } from '../conferences/types'

/** Homepage strip for featured upcoming conferences. Renders nothing when there are none. */
export async function ConferencesPreview() {
  const conferences = ((await sanityFetch({ query: FEATURED_CONFERENCES_QUERY })).data as ConferenceSummary[] | null) ?? []
  if (conferences.length === 0) return null
  const now = new Date()

  return (
    <section className="py-16">
      <Container>
        <AnimateOnScroll className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Research" title="Featured Conferences" align="left" />
          <Link href="/conferences" className="inline-flex min-h-[44px] items-center text-md font-semibold text-crimson">
            All Conferences →
          </Link>
        </AnimateOnScroll>
        <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {conferences.map((c) => (
            <StaggerItem key={c._id}>
              <ConferenceCard conference={c} status={getConferenceStatus(c.startDate, c.endDate, now)} now={now} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  )
}
