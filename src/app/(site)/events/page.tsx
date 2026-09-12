import { EventsFilterGrid } from "@/components/events/EventsFilterGrid"
import { Container } from "@/components/ui/Container"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { sanityFetch } from "@/sanity/live"
import { ALL_UPCOMING_EVENTS_QUERY, PAST_EVENTS_QUERY } from "@/sanity/queries"


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

// Data fetch stays server-side (fast, cached); only the tab filtering
// itself needs to be client-side, so we hand the fetched lists off to
// EventsFilterGrid rather than making the whole page a client component.
//
// Upcoming and past are fetched as two separate queries (rather than one
// list split client-side) so each can use the sort order that actually
// makes sense for it: soonest-first for what's coming up, most-recent-first
// for what already happened.
export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    sanityFetch({ query: ALL_UPCOMING_EVENTS_QUERY }),
    sanityFetch({ query: PAST_EVENTS_QUERY }),
  ])

  return (
    <Container className="py-16">
      <SectionHeading eyebrow="What's On" title="Events Calendar" />
      <div className="mt-10">
        <EventsFilterGrid upcoming={upcoming.data} past={past.data} />
      </div>
    </Container>
  )
}
