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

const CATEGORY_FILTERS = [
  { label: 'All Events', value: 'all' },
  { label: 'Lectures', value: 'lecture' },
  { label: 'Athletics', value: 'athletics' },
  { label: 'Cultural', value: 'cultural' },
  { label: 'Outreach', value: 'outreach' },
]

function EventCard({ event }: { event: Event }) {
  return (
    <Card
      href={`/events/${event.slug.current}`}
      image={event.image}
      eyebrow={event.eventType}
      title={event.title}
      excerpt={event.summary}
      meta={`${new Date(event.startDateTime).toLocaleDateString('en-NG', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })} · ${event.location ?? 'TBA'}`}
    />
  )
}

export function EventsFilterGrid({ upcoming, past }: { upcoming: Event[]; past: Event[] }) {
  const [timeframe, setTimeframe] = useState<'upcoming' | 'past'>('upcoming')
  const [category, setCategory] = useState('all')

  const source = timeframe === 'upcoming' ? upcoming : past
  const filtered = category === 'all' ? source : source.filter((e) => e.eventType === category)

  return (
    <div>
      {/* Upcoming vs Past — the primary split, since these answer different questions */}
      <div className="flex gap-2">
        <button
          onClick={() => setTimeframe('upcoming')}
          aria-pressed={timeframe === 'upcoming'}
          className={`rounded-full px-5 py-2 text-md font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson ${
            timeframe === 'upcoming' ? 'bg-navy text-white' : 'bg-navy/10 text-navy hover:bg-navy/20'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setTimeframe('past')}
          aria-pressed={timeframe === 'past'}
          className={`rounded-full px-5 py-2 text-md font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson ${
            timeframe === 'past' ? 'bg-navy text-white' : 'bg-navy/10 text-navy hover:bg-navy/20'
          }`}
        >
          Past Highlights
        </button>
      </div>

      {/* Category filter — secondary, applies within whichever timeframe is active */}
      <div className="mt-5 flex flex-wrap gap-2 border-b border-black/10 pb-4">
        {CATEGORY_FILTERS.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setCategory(filter.value)}
            aria-pressed={category === filter.value}
            className={`rounded-full px-4 py-2 text-md font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson ${
              category === filter.value
                ? 'bg-crimson text-white'
                : 'bg-rose-tint text-navy hover:bg-crimson-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-ink-muted">
          {timeframe === 'upcoming'
            ? 'No upcoming events in this category right now — check back soon.'
            : 'No past events in this category yet.'}
        </p>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  )
}
