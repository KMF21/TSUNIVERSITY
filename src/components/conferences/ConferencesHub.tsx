'use client'

import { useEffect, useMemo, useState } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { Search, X } from 'lucide-react'
import { SectionHeading } from '../ui/SectionHeading'
import { StaggerGroup, StaggerItem } from '../motion/StaggerGroup'
import { ConferenceCard, ConferenceRow } from './ConferenceCard'
import { getConferenceStatus, groupByYear } from '@/lib/conferences'
import type { ConferenceStatus, ConferenceSummary } from './types'

type StatusFilter = 'all' | 'active' | 'past'

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Upcoming & ongoing' },
  { value: 'past', label: 'Past' },
]

const fieldClass =
  'min-h-[44px] w-full rounded-lg border border-black/15 bg-white px-3 text-sm text-ink transition focus:border-crimson focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson/40'

export function ConferencesHub({ conferences, nowIso }: { conferences: ConferenceSummary[]; nowIso: string }) {
  const params = useSearchParams()
  const pathname = usePathname()

  const [q, setQ] = useState(params.get('q') ?? '')
  const [org, setOrg] = useState(params.get('org') ?? '')
  const [year, setYear] = useState(params.get('year') ?? '')
  const [status, setStatus] = useState<StatusFilter>((params.get('status') as StatusFilter) || 'all')
  // Start from the server's clock so the first client render matches the HTML.
  const [now, setNow] = useState(() => new Date(nowIso))
  useEffect(() => setNow(new Date()), [])

  // Keep the URL shareable without triggering a navigation.
  useEffect(() => {
    const next = new URLSearchParams()
    if (q.trim()) next.set('q', q.trim())
    if (org) next.set('org', org)
    if (year) next.set('year', year)
    if (status !== 'all') next.set('status', status)
    const qs = next.toString()
    window.history.replaceState(null, '', qs ? `${pathname}?${qs}` : pathname)
  }, [q, org, year, status, pathname])

  const organisers = useMemo(
    () => [...new Set(conferences.map((c) => c.organiserName).filter((n): n is string => Boolean(n)))].sort(),
    [conferences]
  )
  const years = useMemo(() => [...new Set(conferences.map((c) => c.year))].sort((a, b) => b - a), [conferences])

  const withStatus = useMemo(
    () => conferences.map((c) => ({ c, status: getConferenceStatus(c.startDate, c.endDate, now) as ConferenceStatus })),
    [conferences, now]
  )

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return withStatus.filter(({ c, status: s }) => {
      if (status === 'active' && s === 'past') return false
      if (status === 'past' && s !== 'past') return false
      if (org && c.organiserName !== org) return false
      if (year && String(c.year) !== year) return false
      if (!needle) return true
      return [c.title, c.shortName, c.theme, c.organiserName, c.series, c.edition, String(c.year)]
        .filter(Boolean)
        .some((field) => field!.toLowerCase().includes(needle))
    })
  }, [withStatus, q, org, year, status])

  const active = filtered.filter((x) => x.status !== 'past').sort((a, b) => a.c.startDate.localeCompare(b.c.startDate))
  const past = groupByYear(filtered.filter((x) => x.status === 'past').map((x) => x.c))
  const hasFilters = Boolean(q.trim() || org || year || status !== 'all')
  const total = filtered.length

  const clear = () => {
    setQ('')
    setOrg('')
    setYear('')
    setStatus('all')
  }

  return (
    <>
      <form
        role="search"
        aria-label="Filter conferences"
        onSubmit={(e) => e.preventDefault()}
        className="rounded-card bg-white p-5 shadow-lg sm:p-6"
      >
        <div className="grid gap-4 md:grid-cols-[2fr_1.4fr_1fr]">
          <div>
            <label htmlFor="conf-search" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Search
            </label>
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                id="conf-search"
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Title, theme or organiser"
                className={`${fieldClass} pl-9`}
              />
            </div>
          </div>
          <div>
            <label htmlFor="conf-org" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Organising faculty / department
            </label>
            <select id="conf-org" value={org} onChange={(e) => setOrg(e.target.value)} className={fieldClass}>
              <option value="">All organisers</option>
              {organisers.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="conf-year" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Year
            </label>
            <select id="conf-year" value={year} onChange={(e) => setYear(e.target.value)} className={fieldClass}>
              <option value="">All years</option>
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <fieldset className="flex flex-wrap gap-2">
            <legend className="sr-only">Status</legend>
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setStatus(opt.value)}
                aria-pressed={status === opt.value}
                className={`min-h-[44px] rounded-full px-5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson ${
                  status === opt.value ? 'bg-navy text-white' : 'bg-navy/10 text-navy hover:bg-navy/20'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </fieldset>
          <div className="flex items-center gap-4">
            <p aria-live="polite" className="text-sm text-ink-muted">
              {total} {total === 1 ? 'conference' : 'conferences'}
            </p>
            {hasFilters && (
              <button
                type="button"
                onClick={clear}
                className="inline-flex min-h-[44px] items-center gap-1 rounded-full px-3 text-sm font-semibold text-crimson transition hover:bg-crimson-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
              >
                <X aria-hidden="true" className="h-4 w-4" />
                Clear filters
              </button>
            )}
          </div>
        </div>
      </form>

      {status !== 'past' && (
        <section id="upcoming" aria-label="Upcoming and ongoing conferences" className="mt-16">
          <SectionHeading eyebrow="Mark your calendar" title="Upcoming & Ongoing" align="left" />
          {active.length === 0 ? (
            <p className="mt-8 rounded-card border border-dashed border-black/15 bg-rose-tint/50 p-8 text-center text-ink-muted">
              {hasFilters
                ? 'No upcoming conferences match these filters.'
                : 'No conferences are scheduled right now — new announcements will appear here. Browse past editions below.'}
            </p>
          ) : (
            <StaggerGroup className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {active.map(({ c, status: s }) => (
                <StaggerItem key={c._id} className="h-full">
                  <ConferenceCard conference={c} status={s} now={now} />
                </StaggerItem>
              ))}
            </StaggerGroup>
          )}
        </section>
      )}

      {status !== 'active' && (
        <section id="past" aria-label="Past conferences" className="mt-16">
          <SectionHeading eyebrow="Archive" title="Past Conferences" align="left" />
          {past.length === 0 ? (
            <p className="mt-8 rounded-card border border-dashed border-black/15 bg-rose-tint/50 p-8 text-center text-ink-muted">
              {hasFilters ? 'No past conferences match these filters.' : 'Past conferences will be archived here.'}
            </p>
          ) : (
            <div className="mt-8 space-y-10">
              {past.map(([y, items]) => (
                <section key={y} aria-labelledby={`year-${y}`} className="grid gap-4 md:grid-cols-[7rem_1fr]">
                  <h3 id={`year-${y}`} className="font-display text-3xl font-bold text-navy/80 md:sticky md:top-32 md:self-start">
                    {y}
                  </h3>
                  <div className="space-y-3">
                    {items.map((c) => (
                      <ConferenceRow key={c._id} conference={c} />
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </section>
      )}
    </>
  )
}
