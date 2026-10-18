import { PortableText, type PortableTextComponents } from 'next-sanity'
import { ExternalLink } from './ExternalLink'
import type { RichTextValue } from './types'

// Same prose styling as the rest of the site, plus link marks (the news
// renderer has none) so editors can link to submission pages, PDFs, etc.
const components: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => {
      const href: string | undefined = value?.href
      if (!href) return <>{children}</>
      return (
        <ExternalLink href={href} className="font-medium text-crimson underline underline-offset-2 hover:text-crimson-600">
          {children}
        </ExternalLink>
      )
    },
  },
}

export function RichText({ value, className = '' }: { value?: RichTextValue; className?: string }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null
  return (
    <div className={`prose prose-neutral max-w-none prose-headings:font-display prose-headings:text-navy ${className}`}>
      <PortableText value={value} components={components} />
    </div>
  )
}

/** True when a Portable Text field has anything in it. */
export function hasRichText(value?: RichTextValue): boolean {
  return Array.isArray(value) && value.length > 0
}
