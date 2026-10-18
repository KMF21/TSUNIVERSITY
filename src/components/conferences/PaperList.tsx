'use client'

import { useId, useMemo, useState } from 'react'
import { Check, ChevronDown, Copy, FileText, Quote, Search } from 'lucide-react'
import { citeApa, citeBibtex } from '@/lib/conferences'
import type { Paper, ProceedingsDetail } from './types'

type Meta = Pick<ProceedingsDetail, 'title' | 'year' | 'editors' | 'publisher' | 'isbn'>

function CopyButton({ text, label }: { text: string; label: string }) {
  const [done, setDone] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setDone(true)
      window.setTimeout(() => setDone(false), 2000)
    } catch {
      /* clipboard unavailable: the citation text stays selectable */
    }
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-navy/20 px-4 text-sm font-semibold text-navy hover:bg-navy-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
    >
      {done ? <Check aria-hidden="true" className="h-4 w-4" /> : <Copy aria-hidden="true" className="h-4 w-4" />}
      {done ? 'Copied' : label}
      <span role="status" className="sr-only">{done ? `${label} copied` : ''}</span>
    </button>
  )
}

function PaperItem({ paper, meta, index }: { paper: Paper; meta: Meta; index: number }) {
  const id = useId()
  const [openAbstract, setOpenAbstract] = useState(false)
  const [openCite, setOpenCite] = useState(false)
  const apa = useMemo(() => (openCite ? citeApa(paper, meta) : ''), [openCite, paper, meta])
  const bib = useMemo(() => (openCite ? citeBibtex(paper, meta) : ''), [openCite, paper, meta])

  return (
    <li className="rounded-card border border-black/10 bg-white p-5 sm:p-6">
      <div className="flex gap-4">
        <span aria-hidden="true" className="w-8 shrink-0 pt-0.5 font-display text-sm font-semibold text-ink-muted">{index}</span>
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-base font-semibold leading-snug text-navy sm:text-lg">{paper.title}</h3>
          <p className="mt-1 text-sm text-ink">{paper.authors.join(', ')}</p>
          {paper.affiliations && <p className="text-sm text-ink-muted">{paper.affiliations}</p>}
          <p className="mt-1 text-sm text-ink-muted">
            {paper.pages && <>pp. {paper.pages}</>}
            {paper.pages && paper.doi && ' · '}
            {paper.doi && (
              <a href={paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi}`} target="_blank" rel="noopener noreferrer" className="text-crimson underline">
                DOI<span className="sr-only"> (opens in a new tab)</span>
              </a>
            )}
          </p>
          {(paper.keywords?.length ?? 0) > 0 && <p className="mt-2 text-xs text-ink-muted">Keywords: {paper.keywords?.join(', ')}</p>}

          <div className="mt-3 flex flex-wrap gap-2">
            {paper.abstract && (
              <button
                type="button"
                aria-expanded={openAbstract}
                aria-controls={`${id}-abstract`}
                onClick={() => setOpenAbstract((v) => !v)}
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-navy hover:bg-navy-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
              >
                <ChevronDown aria-hidden="true" className={`h-4 w-4 transition-transform motion-reduce:transition-none ${openAbstract ? 'rotate-180' : ''}`} />
                Abstract
              </button>
            )}
            {paper.pdfUrl && (
              <a
                href={paper.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-crimson hover:bg-rose-tint focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
              >
                <FileText aria-hidden="true" className="h-4 w-4" />
                PDF<span className="sr-only"> for {paper.title} (opens in a new tab)</span>
              </a>
            )}
            <button
              type="button"
              aria-expanded={openCite}
              aria-controls={`${id}-cite`}
              onClick={() => setOpenCite((v) => !v)}
              className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-navy hover:bg-navy-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
            >
              <Quote aria-hidden="true" className="h-4 w-4" />
              Cite
            </button>
          </div>

          {paper.abstract && openAbstract && (
            <p id={`${id}-abstract`} className="mt-3 whitespace-pre-line rounded-card bg-navy-50 p-4 text-sm leading-relaxed text-ink">{paper.abstract}</p>
          )}
          {openCite && (
            <div id={`${id}-cite`} className="mt-3 space-y-4 rounded-card bg-navy-50 p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">APA</p>
                <p className="mt-1 select-all text-sm text-ink">{apa}</p>
                <CopyButton text={apa} label="Copy APA" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">BibTeX</p>
                <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-words text-xs text-ink">{bib}</pre>
                <CopyButton text={bib} label="Copy BibTeX" />
              </div>
            </div>
          )}
        </div>
      </div>
    </li>
  )
}

export function PaperList({ papers, meta }: { papers: Paper[]; meta: Meta }) {
  const [query, setQuery] = useState('')
  const q = query.trim().toLowerCase()
  const shown = useMemo(
    () =>
      papers
        .map((p, i) => ({ p, n: i + 1 }))
        .filter(({ p }) => !q || [p.title, p.authors.join(' '), p.keywords?.join(' ') ?? '', p.abstract ?? ''].join(' ').toLowerCase().includes(q)),
    [papers, q]
  )

  return (
    <div>
      <div className="relative">
        <Search aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search papers by title, author or keyword"
          placeholder="Search papers by title, author or keyword"
          className="h-12 w-full rounded-full border border-black/15 bg-white pl-12 pr-4 text-base focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
        />
      </div>
      <p role="status" className="mt-3 text-sm text-ink-muted">
        {q ? `${shown.length} of ${papers.length} papers` : `${papers.length} papers`}
      </p>
      {shown.length === 0 ? (
        <p className="mt-6 rounded-card bg-navy-50 p-8 text-center text-ink-muted">No papers match “{query}”. Try a different title, author or keyword.</p>
      ) : (
        <ol className="mt-4 space-y-4" aria-label="Papers">
          {shown.map(({ p, n }) => (
            <PaperItem key={p._key ?? n} paper={p} meta={meta} index={n} />
          ))}
        </ol>
      )}
    </div>
  )
}
