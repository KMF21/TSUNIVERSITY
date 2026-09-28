import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

// One link component for content that comes from the CMS: paths that start
// with "/" are pages on this site (client-side navigation); anything else is
// an external source, opened safely in a new tab and announced to screen
// readers as such.
export function SmartLink({
  href,
  children,
  className,
  showIcon = true,
}: {
  href: string
  children: React.ReactNode
  className?: string
  showIcon?: boolean
}) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      {showIcon && <ExternalLink aria-hidden="true" className="ml-1 inline h-3.5 w-3.5 align-[-1px]" />}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
