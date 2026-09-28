import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'
import type { Stat } from './types'

const COLS: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
}

export function StatStrip({ stats }: { stats?: Stat[] }) {
  if (!stats?.length) return null
  const cols = COLS[Math.min(stats.length, 4)]

  return (
    <StaggerGroup
      className={`grid grid-cols-2 gap-px overflow-hidden rounded-card bg-black/10 shadow-lg ${cols}`}
      staggerDelay={0.08}
    >
      {stats.map((stat, i) => (
        <StaggerItem
          key={i}
          className="bg-white px-4 py-6 text-center last:odd:col-span-2 lg:last:odd:col-span-1"
        >
          <p className="font-display text-3xl font-bold text-navy sm:text-4xl">{stat.value}</p>
          <p className="mt-1 text-sm font-semibold text-crimson">{stat.label}</p>
          {stat.note && <p className="mt-0.5 text-xs text-ink-muted">{stat.note}</p>}
        </StaggerItem>
      ))}
    </StaggerGroup>
  )
}
