import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'
import type { IndicatorStat } from './types'

const COLS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
}

// Same visual language as rankings/StatStrip, but tolerates a stat whose
// value hasn't been compiled yet — it shows "Pending" instead of blank space.
export function IndicatorStatStrip({ stats }: { stats?: IndicatorStat[] }) {
  if (!stats?.length) return null
  const cols = COLS[Math.min(stats.length, 5)]

  return (
    <StaggerGroup
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-card bg-black/10 shadow-lg ${cols}`}
      staggerDelay={0.06}
    >
      {stats.map((stat, i) => (
        <StaggerItem key={i} className="bg-white px-4 py-6 text-center last:odd:col-span-2 lg:last:odd:col-span-1">
          <p className="font-display text-3xl font-bold text-navy sm:text-4xl">
            {stat.value || <span className="text-ink-muted/50">Pending</span>}
          </p>
          <p className="mt-1 text-sm font-semibold text-crimson">{stat.label}</p>
        </StaggerItem>
      ))}
    </StaggerGroup>
  )
}
