import { ExternalLink as ExternalIcon, MapPin } from 'lucide-react'
import { mapDirectionsHref, safeMapEmbedSrc } from '@/lib/conferences'
import { RichText } from './RichText'
import type { ConferenceDetail } from './types'

export function VenueMap({ venue, title }: { venue: NonNullable<ConferenceDetail['venue']>; title: string }) {
  const src = safeMapEmbedSrc(venue.mapEmbedUrl, venue.latitude, venue.longitude)
  const directions = mapDirectionsHref(venue.name, venue.address, venue.city, venue.latitude, venue.longitude)
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <p className="flex items-start gap-2 text-lg font-semibold text-navy">
          <MapPin aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-crimson" />
          <span>
            {venue.name}
            {(venue.address || venue.city) && (
              <span className="block text-base font-normal text-ink-muted">{[venue.address, venue.city].filter(Boolean).join(', ')}</span>
            )}
          </span>
        </p>
        {directions && (
          <a
            href={directions}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-crimson hover:text-crimson-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
          >
            Get directions
            <ExternalIcon aria-hidden="true" className="h-4 w-4" />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        )}
        <RichText value={venue.directions} className="mt-4" />
      </div>
      {src && (
        <div className="aspect-[4/3] overflow-hidden rounded-card border border-black/10 bg-navy-50" data-no-print>
          <iframe
            src={src}
            title={`Map showing ${venue.name || title}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-full w-full border-0"
          />
        </div>
      )}
    </div>
  )
}
