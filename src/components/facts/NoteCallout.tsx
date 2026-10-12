import Link from 'next/link'
import { AlertCircle, ArrowRight, Calculator, Info } from 'lucide-react'
import type { NoteSection } from './types'

const TONE_STYLES: Record<string, { wrap: string; icon: typeof Info }> = {
  pending: { wrap: 'border-crimson/30 bg-rose-tint/60 text-navy', icon: AlertCircle },
  formula: { wrap: 'border-black/10 bg-soft text-ink-muted', icon: Calculator },
  info: { wrap: 'border-black/10 bg-rose-tint/40 text-navy', icon: Info },
}

export function NoteCallout({ section }: { section: NoteSection }) {
  if (!section.text) return null
  const style = TONE_STYLES[section.tone || 'info']
  const Icon = style.icon

  return (
    <div className={`flex items-start gap-3 rounded-card border-l-4 px-5 py-4 text-sm leading-6 ${style.wrap}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div>
        <p>{section.text}</p>
        {section.linkHref && (
          <Link
            href={section.linkHref}
            className="mt-2 inline-flex items-center gap-1 font-semibold text-crimson hover:underline"
          >
            {section.linkLabel || 'Learn more'}
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </div>
    </div>
  )
}
