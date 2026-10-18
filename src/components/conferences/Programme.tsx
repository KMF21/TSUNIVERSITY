'use client'

import { useId, useRef, useState } from 'react'
import { Download, Printer } from 'lucide-react'
import { formatDateOnly, timezoneLabel } from '@/lib/conferences'
import type { ProgrammeDay, Session, SessionType } from './types'

const TYPE_LABEL: Record<SessionType, string> = {
  keynote: 'Keynote',
  plenary: 'Plenary',
  parallel: 'Parallel session',
  break: 'Break',
  social: 'Social',
}

// Colour is never the only signal: every tag also carries its text label.
const TYPE_STYLE: Record<SessionType, string> = {
  keynote: 'bg-crimson text-white',
  plenary: 'bg-navy text-white',
  parallel: 'bg-navy-50 text-navy ring-1 ring-navy/20',
  break: 'bg-neutral-100 text-ink-muted ring-1 ring-black/10',
  social: 'bg-rose-tint text-crimson-600 ring-1 ring-crimson/20',
}

function TypeTag({ type }: { type?: SessionType }) {
  if (!type) return null
  return <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${TYPE_STYLE[type]}`}>{TYPE_LABEL[type]}</span>
}

const timeRange = (s: Session) => (s.endTime ? `${s.startTime}–${s.endTime}` : s.startTime)

function SessionList({ sessions }: { sessions: Session[] }) {
  return (
    <ul className="divide-y divide-black/10 rounded-card border border-black/10 bg-white md:hidden print:hidden">
      {sessions.map((s, i) => (
        <li key={s._key ?? i} className="p-4">
          <p className="font-display text-sm font-semibold text-crimson">{timeRange(s)}</p>
          <p className="mt-1 font-semibold text-ink">{s.title}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-ink-muted">
            <TypeTag type={s.type} />
            {s.room && <span>{s.room}</span>}
            {s.speaker && <span>· {s.speaker}</span>}
          </div>
        </li>
      ))}
    </ul>
  )
}

/** Desktop grid: time down the side, rooms across the top. Sessions without a room span every column. */
function SessionGrid({ sessions }: { sessions: Session[] }) {
  const rooms = [...new Set(sessions.map((s) => s.room).filter((r): r is string => Boolean(r)))]
  const times = [...new Set(sessions.map((s) => s.startTime))].sort()
  const cols = Math.max(rooms.length, 1)
  return (
    <div className="hidden overflow-x-auto rounded-card border border-black/10 bg-white md:block print:block">
      <table className="w-full min-w-[640px] border-collapse text-left text-sm">
        <thead className="bg-navy-50 text-navy">
          <tr>
            <th scope="col" className="w-28 px-4 py-3 font-semibold">Time</th>
            {rooms.length === 0 ? (
              <th scope="col" className="px-4 py-3 font-semibold">Session</th>
            ) : (
              rooms.map((r) => (
                <th key={r} scope="col" className="px-4 py-3 font-semibold">{r}</th>
              ))
            )}
          </tr>
        </thead>
        <tbody className="divide-y divide-black/10">
          {times.map((t) => {
            const row = sessions.filter((s) => s.startTime === t)
            const spanning = row.find((s) => !s.room)
            return (
              <tr key={t} className="align-top">
                <th scope="row" className="whitespace-nowrap px-4 py-3 font-display font-semibold text-crimson">
                  {timeRange(row[0])}
                </th>
                {spanning && rooms.length > 0 ? (
                  <td colSpan={cols} className="px-4 py-3">
                    <Cell s={spanning} />
                  </td>
                ) : rooms.length === 0 ? (
                  <td className="px-4 py-3">
                    {row.map((s, i) => (
                      <Cell key={s._key ?? i} s={s} />
                    ))}
                  </td>
                ) : (
                  rooms.map((r) => {
                    const s = row.find((x) => x.room === r)
                    return (
                      <td key={r} className="px-4 py-3">
                        {s && <Cell s={s} />}
                      </td>
                    )
                  })
                )}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Cell({ s }: { s: Session }) {
  return (
    <div className="space-y-1.5">
      <TypeTag type={s.type} />
      <p className="font-semibold text-ink">{s.title}</p>
      {s.speaker && <p className="text-ink-muted">{s.speaker}</p>}
    </div>
  )
}

export function Programme({
  days,
  timeZone,
  pdfUrl,
}: {
  days: ProgrammeDay[]
  timeZone: string
  pdfUrl?: string
}) {
  const [index, setIndex] = useState(0)
  const baseId = useId()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const day = days[index]

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next = index
    if (e.key === 'ArrowRight') next = (index + 1) % days.length
    else if (e.key === 'ArrowLeft') next = (index - 1 + days.length) % days.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = days.length - 1
    else return
    e.preventDefault()
    setIndex(next)
    tabRefs.current[next]?.focus()
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3" data-no-print>
        <p className="text-sm text-ink-muted">All times are local ({timezoneLabel(timeZone)}).</p>
        <div className="flex flex-wrap gap-2">
          {pdfUrl && (
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-navy/20 px-4 text-sm font-semibold text-navy hover:bg-navy-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
            >
              <Download aria-hidden="true" className="h-4 w-4" />
              Programme PDF
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          <PrintButton />
        </div>
      </div>

      <div role="tablist" aria-label="Programme days" onKeyDown={onKeyDown} className="flex gap-2 overflow-x-auto pb-2 print:hidden">
        {days.map((d, i) => (
          <button
            key={d._key ?? d.date}
            ref={(el) => {
              tabRefs.current[i] = el
            }}
            role="tab"
            id={`${baseId}-tab-${i}`}
            aria-selected={i === index}
            aria-controls={`${baseId}-panel`}
            tabIndex={i === index ? 0 : -1}
            onClick={() => setIndex(i)}
            className={`min-h-[48px] shrink-0 rounded-full px-5 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2 ${
              i === index ? 'bg-navy text-white' : 'bg-navy-50 text-navy hover:bg-navy/10'
            }`}
          >
            {d.label || `Day ${i + 1}`}
            <span className="ml-2 font-normal opacity-80">{formatDateOnly(d.date, { day: 'numeric', month: 'short' })}</span>
          </button>
        ))}
      </div>

      {/* Screen: only the selected day. Print: every day, one after another. */}
      <div role="tabpanel" id={`${baseId}-panel`} aria-labelledby={`${baseId}-tab-${index}`} tabIndex={0} className="mt-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson print:hidden">
        <DayBody day={day} />
      </div>
      <div className="hidden space-y-8 print:block">
        {days.map((d, i) => (
          <div key={d._key ?? d.date}>
            <h3 className="mb-2 font-display text-lg font-bold">
              {d.label || `Day ${i + 1}`} — {formatDateOnly(d.date)}
            </h3>
            <SessionGrid sessions={d.sessions ?? []} />
          </div>
        ))}
      </div>
    </div>
  )
}

function DayBody({ day }: { day: ProgrammeDay }) {
  const sessions = [...(day.sessions ?? [])].sort((a, b) => a.startTime.localeCompare(b.startTime))
  if (sessions.length === 0) return <p className="rounded-card bg-navy-50 p-6 text-ink-muted">Sessions for this day will be announced soon.</p>
  return (
    <>
      <SessionList sessions={sessions} />
      <SessionGrid sessions={sessions} />
    </>
  )
}

function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-navy/20 px-4 text-sm font-semibold text-navy hover:bg-navy-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
    >
      <Printer aria-hidden="true" className="h-4 w-4" />
      Print
    </button>
  )
}
