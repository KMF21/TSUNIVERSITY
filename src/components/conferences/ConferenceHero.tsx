import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, BookOpen, CalendarDays, MapPin, Send, UserPlus } from 'lucide-react'
import { Container } from '../ui/Container'
import { ExternalLink } from './ExternalLink'
import { ModeBadge, StatusBadge } from './Badges'
import { ShareButtons } from './ShareButtons'
import { DeadlineCountdown } from './DeadlineCountdown'
import { hasImage, imageUrl } from './image'
import { DEFAULT_TIMEZONE, formatDateRange, nextDeadline, timezoneLabel } from '@/lib/conferences'
import type { ConferenceDetail, ConferenceStatus } from './types'

const primaryCta =
  'inline-flex min-h-[48px] items-center justify-center rounded-full bg-crimson px-7 text-base font-semibold text-white transition hover:bg-crimson-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy'
const secondaryCta =
  'inline-flex min-h-[48px] items-center justify-center rounded-full border border-white/40 px-7 text-base font-semibold text-white transition hover:bg-white hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy'

export function ConferenceHero({
  conference: c,
  status,
  now,
  url,
}: {
  conference: ConferenceDetail
  status: ConferenceStatus
  now: Date
  url: string
}) {
  const tz = c.timezone || DEFAULT_TIMEZONE
  const isPast = status === 'past'
  const deadline = !isPast ? nextDeadline(c.importantDates, tz, now) : undefined
  const venueLine = c.mode === 'virtual' ? 'Online' : [c.venue?.name, c.venue?.city].filter(Boolean).join(', ')

  return (
    <header className="relative isolate overflow-hidden bg-navy text-white">
      {hasImage(c.heroImage) && (
        <>
          <Image src={imageUrl(c.heroImage, 1800, 900)} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-navy-900/95 via-navy/85 to-navy/60" />
        </>
      )}
      <Container className="py-12 sm:py-16 lg:py-20">
        <Link
          href="/conferences"
          className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-white/70 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          All conferences
        </Link>

        <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-10">
          {hasImage(c.logo) && (
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-card bg-white p-2 shadow-lg sm:h-28 sm:w-28">
              <Image src={imageUrl(c.logo, 224)} alt={c.logo.alt || `${c.shortName || c.title} logo`} fill sizes="112px" className="object-contain p-2" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={status} className="!bg-crimson !text-white" />
              <ModeBadge mode={c.mode} className="!border-white/30 !bg-white/10 !text-white" />
              {c.series && <span className="text-xs font-semibold uppercase tracking-wide text-white/70">{c.series}</span>}
            </div>

            <h1 className="mt-4 font-display text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
              {c.edition && <span className="mb-1 block text-lg font-semibold text-white/70 sm:text-xl">{c.edition} Edition</span>}
              {c.title}
              {c.shortName && <span className="ml-3 whitespace-nowrap text-white/60">({c.shortName})</span>}
            </h1>

            {c.theme && (
              <p className="mt-4 max-w-3xl text-lg leading-relaxed text-white/85">
                <span className="font-semibold text-white">Theme: </span>
                {c.theme}
              </p>
            )}

            <ul className="mt-6 flex flex-col gap-3 text-base text-white/90 sm:flex-row sm:flex-wrap sm:gap-x-8">
              <li className="flex items-center gap-2">
                <CalendarDays aria-hidden="true" className="h-5 w-5 shrink-0 text-crimson" />
                <span>
                  {formatDateRange(c.startDate, c.endDate, tz)} <span className="text-white/60">({timezoneLabel(tz)})</span>
                </span>
              </li>
              {venueLine && (
                <li className="flex items-center gap-2">
                  <MapPin aria-hidden="true" className="h-5 w-5 shrink-0 text-crimson" />
                  <span>{venueLine}</span>
                </li>
              )}
            </ul>
            {c.organiserName && <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-white/60">Organised by {c.organiserName}</p>}

            <div className="mt-8 flex flex-wrap gap-3" data-no-print>
              {!isPast && c.submissionUrl && (
                <ExternalLink href={c.submissionUrl} className={primaryCta}>
                  <Send aria-hidden="true" className="mr-2 h-4 w-4" />
                  Submit Paper
                </ExternalLink>
              )}
              {!isPast && c.registration?.registrationUrl && (
                <ExternalLink href={c.registration.registrationUrl} className={c.submissionUrl ? secondaryCta : primaryCta}>
                  <UserPlus aria-hidden="true" className="mr-2 h-4 w-4" />
                  Register
                </ExternalLink>
              )}
              {c.proceedingsTitle && (
                <Link href={`/conferences/${c.slug}/proceedings`} className={isPast ? primaryCta : secondaryCta}>
                  <BookOpen aria-hidden="true" className="mr-2 h-4 w-4" />
                  Read the Proceedings
                </Link>
              )}
            </div>

            {deadline && (
              <p className="mt-5 text-sm text-white/80" data-no-print>
                <span className="font-semibold text-white">Next deadline:</span> {deadline.label} —{' '}
                <DeadlineCountdown target={deadline.instant.toISOString()} className="font-semibold text-white" />
              </p>
            )}
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6">
          <ShareButtons url={url} title={`${c.shortName || c.title} — Taraba State University`} />
        </div>
      </Container>
    </header>
  )
}
