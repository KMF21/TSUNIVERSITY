import Link from 'next/link'
import { Search } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { sanityFetch } from '@/sanity/live'
import { SEARCH_QUERY } from '@/sanity/queries'

type SearchResult = {
  _type: 'page' | 'post' | 'event' | 'faculty' | 'department' | 'studentLifeCategory'
  title: string
  slug: string
  excerpt?: string
  facultySlug?: string
}

const TYPE_LABELS: Record<SearchResult['_type'], string> = {
  page: 'Page',
  post: 'News',
  event: 'Event',
  faculty: 'Faculty',
  department: 'Department',
  studentLifeCategory: 'Student Life',
}

function hrefFor(result: SearchResult): string {
  switch (result._type) {
    case 'page':
      return `/${result.slug}`
    case 'post':
      return `/news/${result.slug}`
    case 'event':
      return `/events/${result.slug}`
    case 'faculty':
      return `/academics/${result.slug}`
    case 'department':
      return `/academics/${result.facultySlug}/${result.slug}`
    case 'studentLifeCategory':
      // No individual detail route exists yet — link through to the hub.
      return `/student-life`
    default:
      return '/'
  }
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  const query = q?.trim() ?? ''

  const results = query
    ? ((await sanityFetch({ query: SEARCH_QUERY, params: { q: query } })).data as SearchResult[])
    : []

  return (
    <Container className="py-16">
      <SectionHeading eyebrow="Search" title="Search TSU" />

      <form action="/search" method="GET" className="mt-8 flex max-w-xl gap-2">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search pages, news, events, faculties..."
          className="w-full rounded-full border border-black/10 px-5 py-3 text-md text-ink focus:outline-none focus:ring-2 focus:ring-crimson"
        />
        <button
          type="submit"
          className="flex items-center gap-2 rounded-full bg-crimson px-5 py-3 font-semibold text-white transition hover:bg-crimson-600"
        >
          <Search className="h-4 w-4" />
          Search
        </button>
      </form>

      {query && (
        <p className="mt-6 text-sm text-ink-muted">
          {results.length} result{results.length === 1 ? '' : 's'} for &ldquo;{query}&rdquo;
        </p>
      )}

      {query && results.length === 0 && (
        <p className="mt-10 text-center text-ink-muted">
          No results found. Try a different search term, or browse using the menu above.
        </p>
      )}

      {results.length > 0 && (
        <div className="mt-8 space-y-4">
          {results.map((result, i) => (
            <Link
              key={i}
              href={hrefFor(result)}
              className="block rounded-card border border-black/5 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="w-fit rounded-full bg-crimson-50 px-3 py-1 text-xs font-semibold uppercase text-crimson">
                {TYPE_LABELS[result._type]}
              </span>
              <p className="mt-2 font-display text-lg font-semibold text-navy">{result.title}</p>
              {result.excerpt && (
                <p className="mt-1 line-clamp-2 text-md text-ink-muted">{result.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </Container>
  )
}
