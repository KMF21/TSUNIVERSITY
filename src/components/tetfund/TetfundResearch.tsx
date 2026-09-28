'use client'

import { useMemo, useState } from 'react'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SmartLink } from '@/components/ui/SmartLink'

type FundingType = 'ibr' | 'nrf' | 'research-grant' | 'study-fellowship' | 'other'

type ResearchItem = {
  _id: string
  title: string
  fundingType: FundingType
  fundingNote?: string
  researchers?: string
  year?: number
  publication?: string
  paperUrl?: string
  featured?: boolean
  summary?: string
  links?: { _key?: string; label: string; url: string }[]
  order?: number
}

const FUNDING_ORDER: FundingType[] = ['ibr', 'nrf', 'research-grant', 'study-fellowship', 'other']

const FUNDING_LABELS: Record<FundingType, string> = {
  ibr: 'TETFund IBR',
  nrf: 'TETFund NRF',
  'research-grant': 'TETFund Research Grant',
  'study-fellowship': 'TETFund Study Fellowship',
  other: 'TETFund',
}

const FUNDING_STYLES: Record<FundingType, string> = {
  ibr: 'bg-navy-50 text-navy',
  nrf: 'bg-crimson-50 text-crimson',
  'research-grant': 'bg-navy-50 text-navy',
  'study-fellowship': 'bg-rose-tint text-navy',
  other: 'bg-rose-tint text-ink-muted',
}

const FEATURED_EYEBROW: Record<FundingType, string> = {
  nrf: 'National Research Fund award',
  ibr: 'Institution-Based Research',
  'research-grant': 'Research grant',
  'study-fellowship': 'Study fellowship',
  other: 'TETFund support',
}

// Newest first; items with no year go last; `order` breaks ties.
function byNewest(a: ResearchItem, b: ResearchItem) {
  return (b.year ?? -1) - (a.year ?? -1) || (a.order ?? 0) - (b.order ?? 0)
}

function FundingBadge({ type }: { type: FundingType }) {
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${FUNDING_STYLES[type]}`}>
      {FUNDING_LABELS[type]}
    </span>
  )
}

function ResearchTitle({ item }: { item: ResearchItem }) {
  return item.paperUrl ? (
    <SmartLink href={item.paperUrl} className="font-semibold text-navy hover:text-crimson hover:underline">
      {item.title}
    </SmartLink>
  ) : (
    <span className="font-semibold text-navy">{item.title}</span>
  )
}

function ResearchMeta({ item }: { item: ResearchItem }) {
  const parts = [item.publication, item.year].filter(Boolean)
  if (!parts.length) return null
  return <p className="mt-1 text-xs text-ink-muted">{parts.join(', ')}</p>
}

export function TetfundResearch({ items }: { items: ResearchItem[] }) {
  const [filter, setFilter] = useState<'all' | FundingType>('all')

  const featured = useMemo(() => items.filter((i) => i.featured).sort(byNewest), [items])
  const rows = useMemo(() => items.filter((i) => !i.featured).sort(byNewest), [items])
  const types = FUNDING_ORDER.filter((t) => rows.some((r) => r.fundingType === t))
  const visible = filter === 'all' ? rows : rows.filter((r) => r.fundingType === filter)

  if (!items.length) return null

  return (
    <section id="research" className="mt-20 scroll-mt-24">
      <AnimateOnScroll>
        <SectionHeading
          eyebrow="Research"
          title="TETFund-Supported Research"
          subtitle="TSU academics win competitive research funding from the Tertiary Education Trust Fund (TETFund), including Institution-Based Research (IBR) grants and awards from the nationally competitive National Research Fund (NRF). The projects below are documented in published research that acknowledges TETFund support."
        />
      </AnimateOnScroll>

      {featured.map((f) => (
        <AnimateOnScroll key={f._id} className="mt-10">
          <div className="rounded-card border border-black/5 border-l-4 border-l-crimson bg-rose-tint p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-wide text-crimson">
              {FEATURED_EYEBROW[f.fundingType]}
            </p>
            <h3 className="mt-2 font-display text-lg font-semibold text-navy sm:text-xl">{f.title}</h3>
            {f.summary && <p className="mt-3 max-w-3xl text-md leading-7 text-ink-muted">{f.summary}</p>}
            {f.links && f.links.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1">
                {f.links.map((l, i) => (
                  <SmartLink
                    key={l._key ?? i}
                    href={l.url}
                    className="text-sm font-semibold text-crimson hover:underline"
                  >
                    {l.label}
                  </SmartLink>
                ))}
              </div>
            )}
          </div>
        </AnimateOnScroll>
      ))}

      {rows.length > 0 && (
        <div className="mt-10">
          {types.length > 1 && (
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by funding type">
              {(['all', ...types] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilter(t)}
                  aria-pressed={filter === t}
                  className={`rounded-full px-4 py-2 text-md font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson ${
                    filter === t ? 'bg-crimson text-white' : 'bg-rose-tint text-navy hover:bg-crimson-50'
                  }`}
                >
                  {t === 'all' ? 'All' : FUNDING_LABELS[t]}
                </button>
              ))}
            </div>
          )}

          <p className="mt-4 text-sm text-ink-muted">
            {visible.length} documented project{visible.length === 1 ? '' : 's'}
          </p>

          {/* Desktop / tablet: table */}
          <div className="mt-3 hidden overflow-hidden rounded-card border border-black/5 bg-white shadow-sm md:block">
            <table className="w-full text-left">
              <caption className="sr-only">TETFund-supported research by Taraba State University researchers</caption>
              <thead className="bg-navy text-white">
                <tr>
                  <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wide">Research</th>
                  <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wide">TSU researchers</th>
                  <th scope="col" className="px-5 py-3 text-xs font-semibold uppercase tracking-wide">Funding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5">
                {visible.map((item) => (
                  <tr key={item._id}>
                    <th scope="row" className="w-[42%] px-5 py-4 align-top font-normal">
                      <ResearchTitle item={item} />
                      <ResearchMeta item={item} />
                    </th>
                    <td className="px-5 py-4 align-top text-sm leading-6 text-ink-muted">{item.researchers}</td>
                    <td className="px-5 py-4 align-top">
                      <FundingBadge type={item.fundingType} />
                      {item.fundingNote && <p className="mt-1.5 break-words text-xs text-ink-muted">{item.fundingNote}</p>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Phones: stacked cards, no sideways scrolling */}
          <ul className="mt-3 space-y-4 md:hidden">
            {visible.map((item) => (
              <li key={item._id} className="rounded-card border border-black/5 bg-white p-5 shadow-sm">
                <ResearchTitle item={item} />
                <ResearchMeta item={item} />
                {item.researchers && (
                  <p className="mt-3 text-sm leading-6 text-ink-muted">
                    <span className="font-semibold text-navy">TSU researchers: </span>
                    {item.researchers}
                  </p>
                )}
                <div className="mt-3">
                  <FundingBadge type={item.fundingType} />
                  {item.fundingNote && <p className="mt-1.5 break-words text-xs text-ink-muted">{item.fundingNote}</p>}
                </div>
              </li>
            ))}
          </ul>

          <p className="mt-4 text-xs text-ink-muted">
            This is a selection of publicly documented examples, not a complete list of TSU’s TETFund awards.
          </p>
        </div>
      )}
    </section>
  )
}
