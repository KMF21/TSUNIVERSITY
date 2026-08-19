import { EventsFilterGrid } from "@/components/events/EventsFilterGrid"
import { Container } from "@/components/ui/Container"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { client } from "@/sanity/client"
import { ALL_EVENTS_QUERY } from "@/sanity/queries"


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
// itself needs to be client-side, so we hand the fetched list off to
// EventsFilterGrid rather than making the whole page a client component.
export default async function EventsPage() {
  const events: Event[] = await client.fetch(ALL_EVENTS_QUERY)

  return (
    <Container className="py-16">
      <SectionHeading eyebrow="What's On" title="Events Calendar" />
      <div className="mt-10">
        <EventsFilterGrid events={events} />
      </div>
    </Container>
  )
}
