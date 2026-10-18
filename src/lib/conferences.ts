// Pure helpers for the Conferences section: status, timezone-correct dates,
// deadlines, calendar (.ics) files, citations and URL checks. No React here,
// so every function is usable from server components, route handlers and
// client components alike.
import type { ConferenceStatus, ImportantDate, Paper, ProceedingsDetail } from '@/components/conferences/types'

export const DEFAULT_TIMEZONE = 'Africa/Lagos'

// ── Status ────────────────────────────────────────────────────────────────

/** Computed from the dates at render time — never stored in Sanity. */
export function getConferenceStatus(startDate: string, endDate: string, now: Date = new Date()): ConferenceStatus {
  const t = now.getTime()
  if (t < new Date(startDate).getTime()) return 'upcoming'
  if (t > new Date(endDate).getTime()) return 'past'
  return 'ongoing'
}

export const STATUS_LABEL: Record<ConferenceStatus, string> = {
  upcoming: 'Upcoming',
  ongoing: 'Ongoing',
  past: 'Past',
}

export const MODE_LABEL = {
  'in-person': 'In person',
  virtual: 'Virtual',
  hybrid: 'Hybrid',
} as const

// ── Timezones & dates ─────────────────────────────────────────────────────

const TZ_ABBREVIATIONS: Record<string, string> = {
  'Africa/Lagos': 'WAT',
  'Africa/Accra': 'GMT',
  'Africa/Nairobi': 'EAT',
  'Africa/Johannesburg': 'SAST',
  UTC: 'UTC',
}

/** Short label for a timezone, e.g. "WAT". */
export function timezoneLabel(timeZone: string = DEFAULT_TIMEZONE): string {
  if (TZ_ABBREVIATIONS[timeZone]) return TZ_ABBREVIATIONS[timeZone]
  const part = new Intl.DateTimeFormat('en-GB', { timeZone, timeZoneName: 'short' })
    .formatToParts(new Date())
    .find((p) => p.type === 'timeZoneName')
  return part?.value ?? timeZone
}

function partsInZone(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hourCycle: 'h23',
  }).formatToParts(date)
  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value)
  return { y: get('year'), m: get('month'), d: get('day'), h: get('hour'), min: get('minute'), s: get('second') }
}

/** Offset (ms) of `timeZone` from UTC at the given instant. */
function zoneOffsetMs(date: Date, timeZone: string): number {
  const p = partsInZone(date, timeZone)
  return Date.UTC(p.y, p.m - 1, p.d, p.h, p.min, p.s) - Math.floor(date.getTime() / 1000) * 1000
}

/** Convert a wall-clock time in `timeZone` to the real instant it refers to. */
export function zonedTimeToInstant(y: number, m: number, d: number, h: number, min: number, s: number, timeZone: string): Date {
  const guess = Date.UTC(y, m - 1, d, h, min, s)
  const first = guess - zoneOffsetMs(new Date(guess), timeZone)
  // Re-check once so dates near a DST change come out right.
  return new Date(guess - zoneOffsetMs(new Date(first), timeZone))
}

/** 'YYYY-MM-DD' → numeric parts. */
function parseDateOnly(value: string) {
  const [y, m, d] = value.slice(0, 10).split('-').map(Number)
  return { y, m, d }
}

/** A date-only string formatted without any timezone shifting. */
export function formatDateOnly(
  value: string,
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }
): string {
  const { y, m, d } = parseDateOnly(value)
  return new Intl.DateTimeFormat('en-GB', { ...options, timeZone: 'UTC' }).format(new Date(Date.UTC(y, m - 1, d)))
}

/**
 * Deadlines are entered as plain dates and mean "until the end of that day"
 * in the conference's timezone.
 */
export function deadlineInstant(value: string, timeZone: string = DEFAULT_TIMEZONE): Date {
  const { y, m, d } = parseDateOnly(value)
  return zonedTimeToInstant(y, m, d, 23, 59, 59, timeZone)
}

/** "9–10 December 2025", "30 Nov – 2 Dec 2025", "30 Dec 2025 – 2 Jan 2026". */
export function formatDateRange(startIso: string, endIso: string, timeZone: string = DEFAULT_TIMEZONE): string {
  const s = partsInZone(new Date(startIso), timeZone)
  const e = partsInZone(new Date(endIso), timeZone)
  const fmt = (p: typeof s, opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-GB', { ...opts, timeZone: 'UTC' }).format(new Date(Date.UTC(p.y, p.m - 1, p.d)))

  if (s.y === e.y && s.m === e.m && s.d === e.d) return fmt(s, { day: 'numeric', month: 'long', year: 'numeric' })
  if (s.y === e.y && s.m === e.m) return `${s.d}–${fmt(e, { day: 'numeric', month: 'long', year: 'numeric' })}`
  if (s.y === e.y) return `${fmt(s, { day: 'numeric', month: 'short' })} – ${fmt(e, { day: 'numeric', month: 'short', year: 'numeric' })}`
  return `${fmt(s, { day: 'numeric', month: 'short', year: 'numeric' })} – ${fmt(e, { day: 'numeric', month: 'short', year: 'numeric' })}`
}

/** "Tue, 9 Dec 2025, 09:00 WAT" */
export function formatDateTime(iso: string, timeZone: string = DEFAULT_TIMEZONE): string {
  const text = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).format(new Date(iso))
  return `${text} ${timezoneLabel(timeZone)}`
}

// ── Deadlines ─────────────────────────────────────────────────────────────

export type DatedMilestone = ImportantDate & { instant: Date; passed: boolean }

/** Important dates, soonest first, each flagged as passed or not. */
export function resolveImportantDates(
  dates: ImportantDate[] | undefined,
  timeZone: string = DEFAULT_TIMEZONE,
  now: Date = new Date()
): DatedMilestone[] {
  return (dates ?? [])
    .filter((d) => d.date)
    .map((d) => {
      const instant = deadlineInstant(d.date, timeZone)
      return { ...d, instant, passed: instant.getTime() < now.getTime() }
    })
    .sort((a, b) => a.instant.getTime() - b.instant.getTime())
}

export function nextDeadline(
  dates: ImportantDate[] | undefined,
  timeZone: string = DEFAULT_TIMEZONE,
  now: Date = new Date()
): DatedMilestone | undefined {
  return resolveImportantDates(dates, timeZone, now).find((d) => !d.passed)
}

// ── URLs ──────────────────────────────────────────────────────────────────

export function isExternalUrl(href: string): boolean {
  return /^https?:\/\//i.test(href)
}

/**
 * Only well-known map providers are allowed inside an <iframe>, so an editor
 * can't accidentally (or maliciously) embed an arbitrary page.
 */
export function safeMapEmbedSrc(
  mapEmbedUrl?: string,
  latitude?: number,
  longitude?: number
): string | null {
  if (mapEmbedUrl) {
    try {
      const url = new URL(mapEmbedUrl)
      const okHost = ['www.google.com', 'maps.google.com', 'www.openstreetmap.org'].includes(url.hostname)
      const okPath = url.pathname.startsWith('/maps') || url.pathname.startsWith('/export/embed')
      if (url.protocol === 'https:' && okHost && okPath) return url.toString()
    } catch {
      /* fall through to coordinates */
    }
  }
  if (typeof latitude === 'number' && typeof longitude === 'number') {
    const pad = 0.006
    const bbox = [longitude - pad, latitude - pad, longitude + pad, latitude + pad].join(',')
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude},${longitude}`
  }
  return null
}

export function mapDirectionsHref(name?: string, address?: string, city?: string, latitude?: number, longitude?: number): string | null {
  if (typeof latitude === 'number' && typeof longitude === 'number') {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
  }
  const query = [name, address, city].filter(Boolean).join(', ')
  return query ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}` : null
}

// ── Calendar (.ics) ───────────────────────────────────────────────────────

const icsEscape = (text: string) =>
  text.replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;')

/** Fold long lines at 75 characters as RFC 5545 requires. */
function icsFold(line: string): string {
  if (line.length <= 75) return line
  const chunks: string[] = [line.slice(0, 75)]
  for (let i = 75; i < line.length; i += 74) chunks.push(` ${line.slice(i, i + 74)}`)
  return chunks.join('\r\n')
}

const icsStamp = (date: Date) => date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
const icsDay = (value: string) => value.slice(0, 10).replace(/-/g, '')

type IcsEvent =
  | { uid: string; title: string; description?: string; url?: string; location?: string; allDay: string; lastDay?: string }
  | { uid: string; title: string; description?: string; url?: string; location?: string; start: string; end: string }

export function buildIcs(event: IcsEvent): string {
  const lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Taraba State University//Conferences//EN', 'CALSCALE:GREGORIAN', 'BEGIN:VEVENT']
  lines.push(`UID:${event.uid}`, `DTSTAMP:${icsStamp(new Date())}`)
  if ('allDay' in event) {
    const { y, m, d } = parseDateOnly(event.lastDay ?? event.allDay)
    const next = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10)
    lines.push(`DTSTART;VALUE=DATE:${icsDay(event.allDay)}`, `DTEND;VALUE=DATE:${icsDay(next)}`)
  } else {
    lines.push(`DTSTART:${icsStamp(new Date(event.start))}`, `DTEND:${icsStamp(new Date(event.end))}`)
  }
  lines.push(`SUMMARY:${icsEscape(event.title)}`)
  if (event.description) lines.push(`DESCRIPTION:${icsEscape(event.description)}`)
  if (event.location) lines.push(`LOCATION:${icsEscape(event.location)}`)
  if (event.url) lines.push(`URL:${event.url}`)
  lines.push('END:VEVENT', 'END:VCALENDAR')
  return lines.map(icsFold).join('\r\n') + '\r\n'
}

// ── Citations ─────────────────────────────────────────────────────────────

const HONORIFICS = /^(prof\.?|professor|dr\.?|mr\.?|mrs\.?|ms\.?|engr\.?|rev\.?|fr\.?|bishop|assoc\.?|associate)$/i

/** Split "Dr. Jane Mary Doe" into { given: ['Jane','Mary'], family: 'Doe' }. */
function splitName(name: string) {
  const tokens = name
    .replace(/[\d*†‡]+/g, '')
    .split(/\s+/)
    .filter((t) => t && !HONORIFICS.test(t))
  const family = tokens.pop() ?? ''
  return { given: tokens, family }
}

const initials = (given: string[]) => given.map((g) => `${g.charAt(0).toUpperCase()}.`).join(' ')

function apaAuthors(authors: string[]): string {
  const formatted = authors.map((a) => {
    const { given, family } = splitName(a)
    return given.length ? `${family}, ${initials(given)}` : family
  })
  if (formatted.length === 1) return formatted[0]
  if (formatted.length <= 20) return `${formatted.slice(0, -1).join(', ')}, & ${formatted[formatted.length - 1]}`
  return `${formatted.slice(0, 19).join(', ')}, … ${formatted[formatted.length - 1]}`
}

const doiUrl = (doi: string) => (doi.startsWith('http') ? doi : `https://doi.org/${doi}`)

export function citeApa(paper: Paper, proceedings: Pick<ProceedingsDetail, 'title' | 'year' | 'editors' | 'publisher'>): string {
  const editors = proceedings.editors?.length
    ? `In ${proceedings.editors.map((e) => { const { given, family } = splitName(e); return `${initials(given)} ${family}`.trim() }).join(' & ')} (${proceedings.editors.length > 1 ? 'Eds.' : 'Ed.'}), `
    : 'In '
  const pages = paper.pages ? ` (pp. ${paper.pages.replace(/-/g, '–')})` : ''
  const parts = [
    `${apaAuthors(paper.authors)} (${proceedings.year}).`,
    `${paper.title.replace(/\.$/, '')}.`,
    `${editors}${proceedings.title}${pages}.`,
    proceedings.publisher ? `${proceedings.publisher}.` : '',
    paper.doi ? doiUrl(paper.doi) : '',
  ]
  return parts.filter(Boolean).join(' ')
}

export function citeBibtex(paper: Paper, proceedings: Pick<ProceedingsDetail, 'title' | 'year' | 'editors' | 'publisher' | 'isbn'>): string {
  const first = splitName(paper.authors[0] ?? 'anon').family.toLowerCase().replace(/[^a-z0-9]/g, '') || 'anon'
  const titleWord = (paper.title.match(/[A-Za-z]{4,}/)?.[0] ?? 'paper').toLowerCase()
  const key = `${first}${proceedings.year}${titleWord}`
  const field = (name: string, value?: string) => (value ? `  ${name} = {${value.replace(/[{}]/g, '')}},` : '')
  return [
    `@inproceedings{${key},`,
    field('author', paper.authors.map((a) => { const { given, family } = splitName(a); return `${family}, ${given.join(' ')}`.replace(/,\s*$/, '') }).join(' and ')),
    field('title', paper.title),
    field('booktitle', proceedings.title),
    field('year', String(proceedings.year)),
    field('editor', proceedings.editors?.join(' and ')),
    field('pages', paper.pages?.replace(/[–—-]+/g, '--')),
    field('publisher', proceedings.publisher),
    field('isbn', proceedings.isbn),
    field('doi', paper.doi?.replace(/^https?:\/\/(dx\.)?doi\.org\//, '')),
    '}',
  ]
    .filter(Boolean)
    .join('\n')
}

// ── Grouping ──────────────────────────────────────────────────────────────

export function groupByYear<T extends { year: number }>(items: T[]): [number, T[]][] {
  const map = new Map<number, T[]>()
  for (const item of items) map.set(item.year, [...(map.get(item.year) ?? []), item])
  return [...map.entries()].sort((a, b) => b[0] - a[0])
}

export function conferenceDisplayName(c: { title: string; shortName?: string; edition?: string }): string {
  return [c.edition && `${c.edition}`, c.title].filter(Boolean).join(' ')
}
