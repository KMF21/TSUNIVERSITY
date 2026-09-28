import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { SmartLink } from '@/components/ui/SmartLink'
import type { Award } from './types'

export function AwardsTimeline({ awards }: { awards?: Award[] }) {
  if (!awards?.length) return null

  return (
    <ol className="relative ml-2 space-y-8 border-l-2 border-crimson/20 pl-8">
      {awards.map((award, i) => (
        <li key={i} className="relative">
          <span
            aria-hidden="true"
            className="absolute -left-[43px] top-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-crimson bg-white"
          >
            <span className="h-2 w-2 rounded-full bg-crimson" />
          </span>
          <AnimateOnScroll>
            <p className="font-display text-sm font-bold uppercase tracking-wide text-crimson">{award.date}</p>
            <div className="mt-2 rounded-card border border-black/5 bg-white p-5 shadow-sm">
              <h3 className="font-semibold text-navy">{award.title}</h3>
              {award.description && <p className="mt-1 text-md text-ink-muted">{award.description}</p>}
              {award.links && award.links.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                  {award.links.map((link, j) => (
                    <SmartLink
                      key={j}
                      href={link.url}
                      className="text-sm font-semibold text-crimson hover:underline"
                    >
                      {link.label}
                    </SmartLink>
                  ))}
                </div>
              )}
            </div>
          </AnimateOnScroll>
        </li>
      ))}
    </ol>
  )
}
