import type { BarPanelSection } from './types'

export function BarPanel({ section }: { section: BarPanelSection }) {
  const { heading, bars } = section
  if (!bars?.length) return null

  return (
    <div className="rounded-card border border-black/5 bg-white p-6 shadow-sm">
      {heading && <h3 className="font-display text-lg font-bold text-navy">{heading}</h3>}
      <div className={`${heading ? 'mt-4' : ''} grid gap-2.5`}>
        {bars.map((bar, i) => (
          <div key={i} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 text-sm sm:grid-cols-[160px_1fr_64px]">
            <span className="truncate text-ink-muted sm:order-1">{bar.label}</span>
            <span className="order-3 hidden h-5 overflow-hidden rounded-full bg-rose-tint sm:order-2 sm:block">
              <span
                className="block h-full rounded-full bg-crimson"
                style={{ width: `${Math.min(Math.max(bar.percent ?? 0, 0), 100)}%` }}
              />
            </span>
            <span className="order-2 text-right font-semibold tabular-nums text-navy sm:order-3">
              {bar.displayValue || '—'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
