import Link from 'next/link'
import { ArrowRight, CalendarDays, MapPin } from 'lucide-react'
import { conferenceDisplayName, DEFAULT_TIMEZONE, formatDateRange, nextDeadline, timezoneLabel } from '@/lib/conferences'
import { ConferenceCover } from './ConferenceCover'
import { DeadlineCountdown } from './DeadlineCountdown'
import { ModeBadge, StatusBadge } from './Badges'
import type { ConferenceStatus, ConferenceSummary } from './types'

/** Featured card for upcoming and ongoing conferences. */
export function ConferenceCard({ conference: c, status, now }: { conference: ConferenceSummary; status: ConferenceStatus; now: Date }) {
  const tz = c.timezone || DEFAULT_TIMEZONE
  const deadline = status === 'upcoming' ? nextDeadline(c.importantDates, tz, now) : undefined

  return (
    <Link
      href={`/conferences/${c.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2"
    >
      <div className="relative h-48 w-full overflow-hidden bg-navy">
        <div className="absolute inset-0 transition duration-500 group-hover:scale-105">
          <ConferenceCover image={c.heroImage} title={c.title} shortName={c.shortName} year={c.year} />
        </div>
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <StatusBadge status={status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2">
          <ModeBadge mode={c.mode} />
          {c.edition && <span className="text-xs font-semibold uppercase tracking-wide text-crimson">{c.edition} edition</span>}
        </div>

        <h3 className="font-display text-xl font-semibold leading-snug text-navy transition group-hover:text-crimson">{c.title}</h3>
        {c.theme && <p className="line-clamp-3 text-sm leading-6 text-ink-muted">{c.theme}</p>}

        <dl className="mt-1 space-y-1.5 text-sm text-ink">
          <div className="flex items-start gap-2">
            <dt className="sr-only">Dates</dt>
            <CalendarDays aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-crimson" />
            <dd>
              {formatDateRange(c.startDate, c.endDate, tz)} <span className="text-ink-muted">({timezoneLabel(tz)})</span>
            </dd>
          </div>
          {(c.venueCity || c.mode === 'virtual') && (
            <div className="flex items-start gap-2">
              <dt className="sr-only">Location</dt>
              <MapPin aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-crimson" />
              <dd>{c.mode === 'virtual' ? 'Online' : [c.venueName, c.venueCity].filter(Boolean).join(', ')}</dd>
            </div>
          )}
        </dl>

        {c.organiserName && <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{c.organiserName}</p>}

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-black/5 pt-4">
          {deadline ? (
            <p className="text-sm">
              <span className="text-ink-muted">{deadline.label}: </span>
              <DeadlineCountdown target={deadline.instant.toISOString()} className="font-semibold text-crimson" />
            </p>
          ) : (
            <span className="text-sm text-ink-muted">{status === 'ongoing' ? 'Happening now' : 'Details inside'}</span>
          )}
          <span className="flex shrink-0 items-center gap-1 text-sm font-semibold text-crimson">
            View
            <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  )
}

/** Compact archive row for past conferences. The whole row links to the conference; the proceedings link sits above it. */
export function ConferenceRow({ conference: c }: { conference: ConferenceSummary }) {
  const tz = c.timezone || DEFAULT_TIMEZONE
  return (
    <article className="group relative flex flex-col gap-3 rounded-card border border-black/5 bg-white p-5 shadow-sm transition hover:border-crimson/40 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <h4 className="font-display text-lg font-semibold leading-snug text-navy">
          <Link
            href={`/conferences/${c.slug}`}
            className="after:absolute after:inset-0 after:content-[''] focus:outline-none focus-visible:after:ring-2 focus-visible:after:ring-crimson focus-visible:after:rounded-card"
          >
            {conferenceDisplayName(c)}
          </Link>
        </h4>
        <p className="mt-1 text-sm text-ink-muted">
          {formatDateRange(c.startDate, c.endDate, tz)}
          {c.venueCity ? ` · ${c.venueCity}` : ''}
          {c.organiserName ? ` · ${c.organiserName}` : ''}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <ModeBadge mode={c.mode} />
        {c.hasProceedings && (
          <Link
            href={`/conferences/${c.slug}/proceedings`}
            className="relative z-10 inline-flex min-h-[44px] items-center gap-1 rounded-full bg-crimson-50 px-4 text-sm font-semibold text-crimson transition hover:bg-crimson hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
          >
            Proceedings
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        )}
      </div>
    </article>
  )
}
