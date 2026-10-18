import { Globe, MapPin, Video } from 'lucide-react'
import { MODE_LABEL, STATUS_LABEL } from '@/lib/conferences'
import type { ConferenceMode, ConferenceStatus } from './types'

const STATUS_STYLE: Record<ConferenceStatus, string> = {
  upcoming: 'bg-navy text-white',
  ongoing: 'bg-crimson text-white',
  past: 'bg-navy/10 text-ink-muted',
}

export function StatusBadge({ status, className = '' }: { status: ConferenceStatus; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${STATUS_STYLE[status]} ${className}`}
    >
      {status === 'ongoing' && <span aria-hidden="true" className="h-1.5 w-1.5 animate-pulse rounded-full bg-white motion-reduce:animate-none" />}
      {STATUS_LABEL[status]}
    </span>
  )
}

const MODE_ICON = { 'in-person': MapPin, virtual: Video, hybrid: Globe } as const

export function ModeBadge({ mode = 'in-person', className = '' }: { mode?: ConferenceMode; className?: string }) {
  const Icon = MODE_ICON[mode]
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-navy/15 bg-white px-3 py-1 text-xs font-semibold text-navy ${className}`}
    >
      <Icon aria-hidden="true" className="h-3.5 w-3.5" />
      {MODE_LABEL[mode]}
    </span>
  )
}
