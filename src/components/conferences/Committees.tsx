import type { Committee } from './types'

export function Committees({ committees }: { committees: Committee[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {committees
        .filter((c) => (c.members?.length ?? 0) > 0)
        .map((c) => (
          <section key={c._key ?? c.committeeName} aria-label={c.committeeName} className="rounded-card border border-black/10 bg-white p-6">
            <h3 className="font-display text-lg font-semibold text-navy">{c.committeeName}</h3>
            <ul className="mt-4 space-y-3">
              {c.members?.map((m) => (
                <li key={m._key ?? m.name} className="text-base">
                  <span className="font-semibold text-ink">{m.name}</span>
                  {m.role && <span className="text-crimson"> · {m.role}</span>}
                  {m.affiliation && <span className="block text-sm text-ink-muted">{m.affiliation}</span>}
                </li>
              ))}
            </ul>
          </section>
        ))}
    </div>
  )
}
