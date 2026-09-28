import { SmartLink } from '@/components/ui/SmartLink'
import type { Ranking } from './types'

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export function RankingsTable({ rankings }: { rankings?: Ranking[] }) {
  if (!rankings?.length) return null

  return (
    <div className="overflow-hidden rounded-card border border-black/5 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[420px] text-left">
          <caption className="sr-only">
            Taraba State University in international and national university rankings
          </caption>
          <thead className="bg-navy text-white">
            <tr>
              <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide sm:px-5">
                Ranking
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide sm:px-5">
                Position
              </th>
              <th scope="col" className="px-4 py-3 text-xs font-semibold uppercase tracking-wide sm:px-5">
                Edition
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {rankings.map((r, i) => (
              <tr key={i}>
                <th scope="row" className="px-4 py-4 align-top font-normal sm:px-5">
                  <p className="font-semibold text-navy">
                    {r.url ? (
                      <SmartLink href={r.url} className="hover:text-crimson hover:underline">
                        {r.source}
                      </SmartLink>
                    ) : (
                      r.source
                    )}
                  </p>
                  <p className="text-sm text-ink-muted">{r.metric}</p>
                  {r.note && <p className="mt-1 text-xs text-ink-muted">{r.note}</p>}
                </th>
                <td className="px-4 py-4 align-top sm:px-5">
                  <span className="font-display text-2xl font-bold text-crimson">{r.position}</span>
                </td>
                <td className="px-4 py-4 align-top text-sm text-ink-muted sm:px-5">
                  {r.edition}
                  {r.asOf && <span className="block text-xs">Data as of {formatDate(r.asOf)}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
