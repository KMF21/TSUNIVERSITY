'use client'

import { useState } from 'react'
import { Card } from '../ui/Card'

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

const FILTERS = [
  { label: 'All Events', value: 'all' },
  { label: 'Lectures', value: 'lecture' },
  { label: 'Athletics', value: 'athletics' },
  { label: 'Cultural', value: 'cultural' },
  { label: 'Outreach', value: 'outreach' },
]

export function EventsFilterGrid({ events }: { events: Event[] }) {
  const [active, setActive] = useState('all')

  const filtered = active === 'all' ? events : events.filter((e) => e.eventType === active)

  return (
    <div>
      <div className="flex flex-wrap gap-2 border-b border-black/10 pb-4">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActive(filter.value)}
            aria-pressed={active === filter.value}
            className={`rounded-full px-4 py-2 text-md font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson ${
              active === filter.value
                ? 'bg-crimson text-white'
                : 'bg-rose-tint text-navy hover:bg-crimson-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-ink-muted">No events in this category right now.</p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <Card
              key={event._id}
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
          ))}
        </div>
      )}
    </div>
  )
}
