'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, BookOpen, Search } from 'lucide-react'
import { groupByYear } from '@/lib/conferences'
import { hasImage, imageUrl } from './image'
import type { ProceedingsListItem } from './types'

const fieldClass =
  'min-h-[44px] w-full rounded-lg border border-black/15 bg-white px-3 text-sm text-ink transition focus:border-crimson focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson/40'

function VolumeCard({ item }: { item: ProceedingsListItem }) {
  return (
    <Link
      href={`/conferences/${item.conference.slug}/proceedings`}
      className="group flex gap-5 rounded-card border border-black/5 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-crimson/40 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson sm:p-5"
    >
      <div className="relative aspect-[3/4] w-24 shrink-0 overflow-hidden rounded-md bg-navy shadow-md sm:w-28">
        {hasImage(item.coverImage) ? (
          <Image src={imageUrl(item.coverImage, 280, 373)} alt={item.coverImage.alt || ''} fill sizes="112px" className="object-cover" />
        ) : (
          <div aria-hidden="true" className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-navy to-navy-900 p-2 text-center text-white">
            <BookOpen className="h-6 w-6 text-white/70" />
            <span className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-white/70">Proceedings</span>
            <span className="mt-2 h-0.5 w-6 rounded-full bg-crimson" />
          </div>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <h4 className="font-display text-lg font-semibold leading-snug text-navy transition group-hover:text-crimson">{item.title}</h4>
        <p className="mt-1 text-sm text-ink-muted">
          {item.conference.shortName || item.conference.title}
          {item.conference.organiserName ? ` · ${item.conference.organiserName}` : ''}
        </p>
        <p className="mt-2 text-xs text-ink-muted">
          {[item.paperCount > 0 && `${item.paperCount} papers`, item.publisher, item.isbn && `ISBN ${item.isbn}`].filter(Boolean).join(' · ')}
        </p>
        <span className="mt-auto flex items-center gap-1 pt-3 text-sm font-semibold text-crimson">
          {item.hasFullVolume ? 'Read & download' : 'View volume'}
          <ArrowRight aria-hidden="true" className="h-4 w-4 transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  )
}

export function ProceedingsArchive({ items }: { items: ProceedingsListItem[] }) {
  const [q, setQ] = useState('')
  const [org, setOrg] = useState('')

  const organisers = useMemo(
    () => [...new Set(items.map((i) => i.conference.organiserName).filter((n): n is string => Boolean(n)))].sort(),
    [items]
  )
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return items.filter((i) => {
      if (org && i.conference.organiserName !== org) return false
      if (!needle) return true
      return [i.title, i.conference.title, i.conference.shortName, i.conference.organiserName, i.publisher, String(i.year)]
        .filter(Boolean)
        .some((f) => f!.toLowerCase().includes(needle))
    })
  }, [items, q, org])
  const groups = groupByYear(filtered)

  return (
    <>
      <form role="search" aria-label="Filter proceedings" onSubmit={(e) => e.preventDefault()} className="rounded-card bg-white p-5 shadow-lg sm:p-6">
        <div className="grid gap-4 md:grid-cols-[2fr_1.4fr]">
          <div>
            <label htmlFor="proc-search" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Search
            </label>
            <div className="relative">
              <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input id="proc-search" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Title, conference or organiser" className={`${fieldClass} pl-9`} />
            </div>
          </div>
          <div>
            <label htmlFor="proc-org" className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-muted">
              Organising faculty / department
            </label>
            <select id="proc-org" value={org} onChange={(e) => setOrg(e.target.value)} className={fieldClass}>
              <option value="">All organisers</option>
              {organisers.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p aria-live="polite" className="mt-3 text-sm text-ink-muted">
          {filtered.length} {filtered.length === 1 ? 'volume' : 'volumes'}
        </p>
      </form>

      {groups.length === 0 ? (
        <p className="mt-10 rounded-card border border-dashed border-black/15 bg-rose-tint/50 p-8 text-center text-ink-muted">
          {items.length === 0 ? 'Proceedings volumes will be published here after each conference.' : 'No proceedings match these filters.'}
        </p>
      ) : (
        <div className="mt-12 space-y-10">
          {groups.map(([year, volumes]) => (
            <section key={year} aria-labelledby={`proc-year-${year}`} className="grid gap-4 md:grid-cols-[7rem_1fr]">
              <h3 id={`proc-year-${year}`} className="font-display text-3xl font-bold text-navy/80 md:sticky md:top-32 md:self-start">
                {year}
              </h3>
              <div className="grid gap-4 lg:grid-cols-2">
                {volumes.map((v) => (
                  <VolumeCard key={v._id} item={v} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  )
}
