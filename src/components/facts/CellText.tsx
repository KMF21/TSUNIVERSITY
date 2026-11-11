import Link from 'next/link'

// Table cells are plain strings in Sanity. A cell may embed links written as
// [label](url): internal paths ("/…" or "#…") use next/link, anything else
// opens in a new tab.
const LINK_RE = /\[([^\]]+)\]\(([^)\s]+)\)/g

export function CellText({ text }: { text: string }) {
  const parts: React.ReactNode[] = []
  let last = 0
  for (const match of text.matchAll(LINK_RE)) {
    const [whole, label, href] = match
    const start = match.index ?? 0
    if (start > last) parts.push(text.slice(last, start))
    const className = 'font-semibold text-crimson hover:underline'
    parts.push(
      href.startsWith('/') || href.startsWith('#') ? (
        <Link key={start} href={href} className={className}>
          {label}
        </Link>
      ) : (
        <a key={start} href={href} target="_blank" rel="noopener noreferrer" className={className}>
          {label}
        </a>
      )
    )
    last = start + whole.length
  }
  if (last < text.length) parts.push(text.slice(last))
  return <>{parts}</>
}
