'use client'

import { useEffect, useState } from 'react'

type Parts = { days: number; hours: number; minutes: number; seconds: number }

function diff(target: number, now: number): Parts | null {
  const ms = target - now
  if (ms <= 0) return null
  const total = Math.floor(ms / 1000)
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  }
}

/**
 * Live countdown to a deadline. Rendered empty on the server and first
 * client paint, then filled in on mount — so it can never cause a hydration
 * mismatch between server time and the visitor's clock.
 */
export function DeadlineCountdown({
  target,
  variant = 'inline',
  className = '',
}: {
  /** ISO timestamp of the deadline instant. */
  target: string
  variant?: 'inline' | 'blocks'
  className?: string
}) {
  const [parts, setParts] = useState<Parts | null | undefined>(undefined)

  useEffect(() => {
    const t = new Date(target).getTime()
    const tick = () => setParts(diff(t, Date.now()))
    tick()
    const id = window.setInterval(tick, variant === 'blocks' ? 1000 : 30_000)
    return () => window.clearInterval(id)
  }, [target, variant])

  if (parts === undefined) return <span className={className} aria-hidden="true">&nbsp;</span>
  if (parts === null) return <span className={className}>Closed</span>

  if (variant === 'inline') {
    const text =
      parts.days > 0
        ? `${parts.days} ${parts.days === 1 ? 'day' : 'days'} left`
        : parts.hours > 0
          ? `${parts.hours}h ${parts.minutes}m left`
          : `${parts.minutes}m left`
    return <span className={className}>{text}</span>
  }

  const units: [string, number][] = [
    ['Days', parts.days],
    ['Hours', parts.hours],
    ['Min', parts.minutes],
    ['Sec', parts.seconds],
  ]
  return (
    <div role="timer" aria-label={`${parts.days} days, ${parts.hours} hours and ${parts.minutes} minutes remaining`} className={`flex gap-2 ${className}`}>
      {units.map(([label, value]) => (
        <div key={label} className="min-w-[3.5rem] rounded-lg bg-white/10 px-2 py-2 text-center">
          <div className="font-display text-2xl font-bold tabular-nums leading-none">{String(value).padStart(2, '0')}</div>
          <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">{label}</div>
        </div>
      ))}
    </div>
  )
}
