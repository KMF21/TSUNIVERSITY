import Image from 'next/image'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'
import { SmartLink } from '@/components/ui/SmartLink'
import { urlFor } from '@/sanity/image'
import type { Scholar } from './types'

// "Prof. Sunday Paul Bako" -> "SB": skips titles, uses first + last name.
function initialsOf(name: string) {
  const parts = name
    .replace(/\b(prof|dr|mr|mrs|ms|engr|rev)\b\.?/gi, '')
    .split(/\s+/)
    .filter(Boolean)
  if (!parts.length) return ''
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function ScholarCards({ scholars }: { scholars?: Scholar[] }) {
  if (!scholars?.length) return null

  return (
    <StaggerGroup className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.07}>
      {scholars.map((s, i) => (
        <StaggerItem key={i} className="h-full">
          <article className="flex h-full flex-col rounded-card border border-black/5 bg-white p-6 shadow-sm">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-navy">
              {s.photo ? (
                <Image
                  src={urlFor(s.photo).width(128).height(128).url()}
                  alt={s.photo.alt || s.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex h-full w-full items-center justify-center font-display text-lg font-bold text-white"
                >
                  {initialsOf(s.name)}
                </span>
              )}
            </div>
            <h3 className="mt-4 font-display text-base font-semibold text-navy">{s.name}</h3>
            {s.role && <p className="mt-0.5 text-sm font-medium text-crimson">{s.role}</p>}
            {s.summary && <p className="mt-3 flex-1 text-sm leading-6 text-ink-muted">{s.summary}</p>}
            {s.linkUrl && (
              <SmartLink
                href={s.linkUrl}
                className="mt-4 text-sm font-semibold text-crimson hover:underline"
              >
                {s.linkLabel || 'Profile'}
              </SmartLink>
            )}
          </article>
        </StaggerItem>
      ))}
    </StaggerGroup>
  )
}
