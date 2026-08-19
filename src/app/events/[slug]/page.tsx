import Image from 'next/image'
import { notFound } from 'next/navigation'
import { client } from '../../../../sanity/client'
import { EVENT_BY_SLUG_QUERY } from '../../../../sanity/queries'
import { urlFor } from '../../../../sanity/image'
import { Container } from '../../../components/ui/Container'

type EventPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function EventPage({
  params,
}: EventPageProps) {
  const { slug } = await params

  const event = await client.fetch(EVENT_BY_SLUG_QUERY, {
    slug,
  })

  if (!event) {
    notFound()
  }

  return (
    <Container className="max-w-3xl py-16">
      <span className="text-md font-semibold uppercase text-crimson">
        {event.eventType}
      </span>

      <h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">
        {event.title}
      </h1>

      <p className="mt-3 text-md text-ink-muted">
        {new Date(event.startDateTime).toLocaleString('en-NG', {
          dateStyle: 'long',
          timeStyle: 'short',
        })}
        {event.location ? ` · ${event.location}` : ''}
        {event.capacity ? ` · ${event.capacity}` : ''}
      </p>

      {event.image && (
        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-card">
          <Image
            src={urlFor(event.image).width(1200).url()}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {event.summary && (
        <p className="mt-8 text-ink-muted">
          {event.summary}
        </p>
      )}

      {event.registrationUrl && (
        <a
          href={event.registrationUrl}
          className="mt-8 inline-block rounded-full bg-crimson px-6 py-3 font-semibold text-white transition hover:bg-crimson-600"
        >
          Enroll Today
        </a>
      )}
    </Container>
  )
}