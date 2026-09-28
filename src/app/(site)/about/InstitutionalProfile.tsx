import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import type { FactRow, InstitutionalFactsData } from '@/components/rankings/types'

function FactCard({ title, rows, note }: { title: string; rows: FactRow[]; note?: string }) {
  return (
    <div className="rounded-card border border-black/5 bg-white p-6 shadow-sm">
      <h3 className="font-display text-lg font-semibold text-navy">{title}</h3>
      <dl className="mt-4 divide-y divide-black/5">
        {rows.map((row, i) => (
          <div key={i} className="flex flex-col gap-1 py-3 sm:flex-row sm:justify-between sm:gap-6">
            <dt className="text-sm text-ink-muted">{row.label}</dt>
            <dd className="font-semibold text-navy sm:text-right">{row.value}</dd>
          </div>
        ))}
      </dl>
      {note && <p className="mt-3 text-xs text-ink-muted">{note}</p>}
    </div>
  )
}

// Key facts + student community, driven by the single "Institutional Facts"
// record so the numbers match everywhere they appear.
export function InstitutionalProfile({ facts }: { facts: InstitutionalFactsData }) {
  const keyFacts = facts?.keyFacts ?? []
  const student = facts?.studentCommunity ?? []
  if (!keyFacts.length && !student.length) return null

  return (
    <section className="py-16">
      <Container>
        <AnimateOnScroll>
          <SectionHeading
            eyebrow="At a Glance"
            title="Institutional Profile"
            subtitle="Key facts about the university and its student community."
          />
        </AnimateOnScroll>
        <AnimateOnScroll className="mt-10">
          <div className="grid gap-6 lg:grid-cols-2">
            {keyFacts.length > 0 && <FactCard title="Key Facts" rows={keyFacts} />}
            {student.length > 0 && (
              <FactCard title="Student Community" rows={student} note={facts?.studentCommunityNote} />
            )}
          </div>
        </AnimateOnScroll>
      </Container>
    </section>
  )
}

export function RankingsCallout() {
  return (
    <section className="pb-16">
      <Container>
        <AnimateOnScroll>
          <div className="flex flex-col items-start justify-between gap-6 rounded-card bg-navy p-8 text-white sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl font-bold">Recognised for research impact</h2>
              <p className="mt-2 max-w-xl text-white/80">
                See how TSU is ranked internationally, along with our awards, funded research and
                recognised scholars.
              </p>
            </div>
            <Link
              href="/rankings"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-crimson px-6 py-3 font-semibold text-white transition hover:bg-crimson-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              Rankings &amp; Recognition
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </AnimateOnScroll>
      </Container>
    </section>
  )
}
