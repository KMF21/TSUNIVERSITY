import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { sanityFetch } from '@/sanity/live'
import { ACADEMIC_CALENDAR_QUERY } from '@/sanity/queries'
import { AlertTriangle } from 'lucide-react'

type CalendarEntry = {
  _id: string
  title: string
  session: string
  semester: string
  category: string
  startDate: string
  endDate?: string
  isPlaceholder?: boolean
}

const CATEGORY_STYLES: Record<string, string> = {
  resumption: 'bg-navy-50 text-navy',
  registration: 'bg-crimson-50 text-crimson',
  examination: 'bg-crimson-50 text-crimson',
  break: 'bg-rose-tint text-navy',
  convocation: 'bg-navy-50 text-navy',
  other: 'bg-rose-tint text-ink-muted',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
}

function EntryRow({ entry }: { entry: CalendarEntry }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-black/5 py-4 last:border-0">
      <div>
        <p className="font-semibold text-navy">{entry.title}</p>
        <p className="mt-0.5 text-sm text-ink-muted">
          {formatDate(entry.startDate)}
          {entry.endDate ? ` – ${formatDate(entry.endDate)}` : ''}
        </p>
      </div>
      <span
        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold capitalize ${
          CATEGORY_STYLES[entry.category] ?? CATEGORY_STYLES.other
        }`}
      >
        {entry.category}
      </span>
    </div>
  )
}

export default async function AcademicCalendarPage() {
  const entries = (await sanityFetch({ query: ACADEMIC_CALENDAR_QUERY })).data as CalendarEntry[]

  const hasPlaceholders = entries.some((e) => e.isPlaceholder)

  // Group by session, then by semester within each session
  const sessions = Array.from(new Set(entries.map((e) => e.session)))
  const SEMESTER_ORDER = ['First Semester', 'Second Semester', 'General / Whole Session']

  return (
    <Container className="py-16">
      <SectionHeading eyebrow="Plan Ahead" title="Academic Calendar" />

      {hasPlaceholders && (
        <div className="mt-8 flex items-start gap-3 rounded-card border border-amber-300 bg-amber-50 p-4 text-amber-900">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm">
            Some dates below are provisional placeholders and have not yet been confirmed by the
            Registry. They will be updated with official dates as soon as they are available —
            please confirm critical deadlines with your department before making plans.
          </p>
        </div>
      )}

      {entries.length === 0 ? (
        <p className="mt-12 text-center text-ink-muted">
          The academic calendar is being finalized and will be published here soon.
        </p>
      ) : (
        <div className="mt-10 space-y-12">
          {sessions.map((session) => {
            const sessionEntries = entries.filter((e) => e.session === session)
            const semesters = SEMESTER_ORDER.filter((s) => sessionEntries.some((e) => e.semester === s))

            return (
              <div key={session}>
                <h2 className="font-display text-2xl font-bold text-navy">{session} Session</h2>
                <div className="mt-6 grid gap-6 lg:grid-cols-2">
                  {semesters.map((semester) => (
                    <div key={semester} className="rounded-card border border-black/5 bg-white p-6 shadow-sm">
                      <h3 className="font-display text-md font-semibold uppercase tracking-wide text-crimson">
                        {semester}
                      </h3>
                      <div className="mt-3">
                        {sessionEntries
                          .filter((e) => e.semester === semester)
                          .map((entry) => (
                            <EntryRow key={entry._id} entry={entry} />
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Container>
  )
}
