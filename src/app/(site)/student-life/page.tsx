import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { urlFor } from '@/sanity/image'
import { sanityFetch } from '@/sanity/live'
import { STUDENT_LIFE_QUERY, PAST_EVENTS_QUERY } from '@/sanity/queries'
import { Card } from '@/components/ui/Card'

type StudentLifeItem = {
  _id: string
  name: string
  slug: { current: string }
  category: 'sports' | 'clubs'
  coverImage?: any
  summary?: string
}

type PastEvent = {
  _id: string
  title: string
  slug: { current: string }
  eventType: string
  startDateTime: string
  location?: string
  summary?: string
  image?: any
}

function LifeCard({ item }: { item: StudentLifeItem }) {
  return (
    <div className="overflow-hidden rounded-card border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full bg-navy/10">
        {item.coverImage ? (
          <Image
            src={urlFor(item.coverImage).width(500).height(375).url()}
            alt={item.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-2xl font-bold text-navy/30">
            {item.name}
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="font-display text-base font-semibold text-navy">{item.name}</p>
        {item.summary && <p className="mt-1 text-sm text-ink-muted">{item.summary}</p>}
      </div>
    </div>
  )
}

export default async function StudentLifePage() {
  const [lifeItems, pastEvents] = await Promise.all([
    sanityFetch({ query: STUDENT_LIFE_QUERY }),
    sanityFetch({ query: PAST_EVENTS_QUERY }),
  ])

  const sports = (lifeItems.data as StudentLifeItem[]).filter((i) => i.category === 'sports')
  const clubs = (lifeItems.data as StudentLifeItem[]).filter((i) => i.category === 'clubs')
  const highlights = (pastEvents.data as PastEvent[]).slice(0, 6)

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Beyond the Classroom"
        title="Student Life"
        subtitle="Sports, clubs, societies, and the moments that make TSU more than a place to study."
      />

      {sports.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold text-navy">Sports &amp; Recreation</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {sports.map((item) => (
              <LifeCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      )}

      {clubs.length > 0 && (
        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold text-navy">Clubs &amp; Societies</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {clubs.map((item) => (
              <LifeCard key={item._id} item={item} />
            ))}
          </div>
        </div>
      )}

      {highlights.length > 0 && (
        <div className="mt-12">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl font-bold text-navy">Recent Highlights</h2>
            <Link href="/events" className="text-md font-semibold text-crimson hover:underline">
              View All Events →
            </Link>
          </div>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {highlights.map((event) => (
              <Card
                key={event._id}
                href={`/events/${event.slug.current}`}
                image={event.image}
                eyebrow={event.eventType}
                title={event.title}
                excerpt={event.summary}
                meta={new Date(event.startDateTime).toLocaleDateString('en-NG', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              />
            ))}
          </div>
        </div>
      )}

      {sports.length === 0 && clubs.length === 0 && highlights.length === 0 && (
        <p className="mt-12 text-center text-ink-muted">
          Student life content is being added — check back soon.
        </p>
      )}
    </Container>
  )
}
