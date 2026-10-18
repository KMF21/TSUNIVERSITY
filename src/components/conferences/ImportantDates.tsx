import { CalendarPlus, Check } from 'lucide-react'
import { DeadlineCountdown } from './DeadlineCountdown'
import { formatDateOnly, resolveImportantDates, timezoneLabel } from '@/lib/conferences'
import type { ImportantDate } from './types'

/** Timeline of deadlines: passed ones are marked closed, the next one gets a live countdown. */
export function ImportantDates({ dates, timeZone, slug, now }: { dates: ImportantDate[]; timeZone: string; slug: string; now: Date }) {
  const milestones = resolveImportantDates(dates, timeZone, now)
  const nextIndex = milestones.findIndex((m) => !m.passed)
  const next = nextIndex >= 0 ? milestones[nextIndex] : undefined

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
      <ol className="relative space-y-6 border-l-2 border-navy/10 pl-8">
        {milestones.map((m, i) => {
          const isNext = i === nextIndex
          return (
            <li key={m._key ?? `${m.label}-${m.date}`} className="relative">
              <span
                aria-hidden="true"
                className={`absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  m.passed ? 'border-navy/30 bg-navy/30 text-white' : isNext ? 'border-crimson bg-crimson' : 'border-navy bg-white'
                }`}
              >
                {m.passed && <Check className="h-3 w-3" />}
              </span>
              <div className={m.passed ? 'opacity-70' : ''}>
                <p className="flex flex-wrap items-center gap-2">
                  <span className={`font-display text-lg font-semibold text-navy ${m.passed ? 'line-through decoration-navy/40' : ''}`}>{m.label}</span>
                  {m.passed && <span className="rounded-full bg-navy/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">Closed</span>}
                  {isNext && <span className="rounded-full bg-crimson px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">Next</span>}
                </p>
                <p className="mt-1 text-base text-ink">
                  <time dateTime={m.date}>{formatDateOnly(m.date)}</time>
                  <span className="text-ink-muted"> · end of day {timezoneLabel(timeZone)}</span>
                </p>
                {m.note && <p className="mt-1 text-sm text-ink-muted">{m.note}</p>}
                {!m.passed && (
                  <a
                    href={`/conferences/${slug}/calendar.ics?date=${encodeURIComponent(m._key ?? m.date)}`}
                    className="mt-2 inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-crimson hover:text-crimson-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
                    data-no-print
                  >
                    <CalendarPlus aria-hidden="true" className="h-4 w-4" />
                    Add to calendar
                    <span className="sr-only"> — {m.label}</span>
                  </a>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      {next && (
        <aside aria-label="Countdown to next deadline" className="h-fit rounded-card bg-navy p-6 text-white" data-no-print>
          <p className="text-xs font-semibold uppercase tracking-wide text-white/60">Next deadline</p>
          <p className="mt-1 font-display text-lg font-semibold">{next.label}</p>
          <DeadlineCountdown target={next.instant.toISOString()} variant="blocks" className="mt-4" />
        </aside>
      )}
    </div>
  )
}
