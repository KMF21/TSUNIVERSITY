import Link from 'next/link'
import { client } from '../../../sanity/client'
import { UPCOMING_EVENTS_QUERY } from '../../../sanity/queries'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Card } from '../ui/Card'
import { AnimateOnScroll } from '../motion/AnimateOnScroll'
import { StaggerGroup, StaggerItem } from '../motion/StaggerGroup'

type Event = {
  _id: string
  title: string
  slug: { current: string }
  eventType: string
  startDateTime: string
  location?: string
  summary?: string
  image?: any
}

export async function EventsPreview() {
  const events: Event[] = await client.fetch(UPCOMING_EVENTS_QUERY)

  return (
    <section className="bg-rose-tint py-16">
      <Container>
        <AnimateOnScroll className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="What's On" title="Upcoming Events" align="left" />
          <Link href="/events" className="text-md font-semibold text-crimson">
            View All Events →
          </Link>
        </AnimateOnScroll>

        <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-3">
          {events.map((event) => (
            <StaggerItem key={event._id}>
              <Card
                href={`/events/${event.slug.current}`}
                image={event.image}
                eyebrow={event.eventType}
                title={event.title}
                excerpt={event.summary}
                meta={`${new Date(event.startDateTime).toLocaleDateString('en-NG', {
                  month: 'short',
                  day: 'numeric',
                })} · ${event.location ?? 'TBA'}`}
              />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  )
}
