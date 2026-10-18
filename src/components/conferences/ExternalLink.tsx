import Link from 'next/link'
import { ExternalLink as ExternalIcon } from 'lucide-react'
import { isExternalUrl } from '@/lib/conferences'

/** Anchor that opens off-site links safely in a new tab with a visible icon. */
export function ExternalLink({
  href,
  children,
  className = '',
  showIcon = true,
}: {
  href: string
  children: React.ReactNode
  className?: string
  showIcon?: boolean
}) {
  if (!isExternalUrl(href)) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
      {showIcon && <ExternalIcon aria-hidden="true" className="ml-1.5 inline-block h-[0.9em] w-[0.9em] shrink-0 align-[-0.1em]" />}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  )
}
