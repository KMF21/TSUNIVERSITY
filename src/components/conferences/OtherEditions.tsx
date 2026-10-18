import Link from 'next/link'
import { ConferenceCover } from './ConferenceCover'
import { formatDateRange } from '@/lib/conferences'
import type { ConferenceDetail } from './types'

export function OtherEditions({ editions }: { editions: NonNullable<ConferenceDetail['otherEditions']> }) {
  return (
    <ul className="flex snap-x gap-4 overflow-x-auto pb-2 [scrollbar-width:thin]">
      {editions.map((e) => (
        <li key={e._id} className="w-64 shrink-0 snap-start">
          <Link
            href={`/conferences/${e.slug}`}
            className="group block overflow-hidden rounded-card border border-black/10 bg-white transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
          >
            <div className="relative h-28">
              <ConferenceCover image={e.heroImage} title={e.title} shortName={e.shortName} year={e.year} sizes="256px" />
            </div>
            <div className="p-4">
              <p className="font-display font-semibold text-navy group-hover:text-crimson">{e.edition ? `${e.edition} Edition` : e.year}</p>
              <p className="text-sm text-ink-muted">{formatDateRange(e.startDate, e.endDate)}</p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  )
}
