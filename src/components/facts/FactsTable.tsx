import { CellText } from './CellText'
import type { FactsTableSection } from './types'

// A column is right-aligned (numeric) when every non-empty cell in it is a figure:
// counts, percentages, ratios, naira amounts, ranks, short units like 'kVA'.
const NUMERIC_CELL = /^[#~≈<>]?\s*₦?\s*[\d.,]+(\s*(%|kVA|kWh|Mbps|hrs?))?(\s*:\s*[\d.,]+)?$|^1 : [\d.,]+$|^[\d.,]+ \/ [\d.,]+$/

function numericColumns(columns: string[], rows: { cells?: string[] }[], footerRow?: string[]) {
  return columns.map((_, j) => {
    const cells = [...rows.map((r) => r.cells?.[j] ?? ''), footerRow?.[j] ?? '']
      .map((c) => c.trim())
      .filter((c) => c && c !== '—' && c !== '–')
    return j > 0 && cells.length > 0 && cells.every((c) => NUMERIC_CELL.test(c))
  })
}

export function FactsTable({ section }: { section: FactsTableSection }) {
  const { heading, intro, columns, rows, footerRow } = section
  if (!columns?.length || !rows?.length) return null
  const numeric = numericColumns(columns, rows, footerRow)

  return (
    <div>
      {heading && <h3 className="font-display text-xl font-bold text-navy">{heading}</h3>}
      {intro && <p className="mt-1 text-sm text-ink-muted">{intro}</p>}
      <div className={`${heading || intro ? 'mt-4' : ''} overflow-hidden rounded-card border border-black/5 bg-white shadow-sm`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left">
            <thead className="bg-navy text-white">
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    scope="col"
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide sm:px-5 ${numeric[i] ? 'text-right' : ''}`}
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {rows.map((row, i) => (
                <tr key={i} className={row.emphasis ? 'bg-rose-tint/40 font-semibold' : ''}>
                  {row.cells?.map((cell, j) => (
                    <td
                      key={j}
                      className={`px-4 py-3 align-top text-sm sm:px-5 ${numeric[j] ? 'text-right tabular-nums' : j === 0 ? 'text-navy' : 'text-ink'}`}
                    >
                      {cell ? <CellText text={cell} /> : <span className="text-ink-muted/50">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
            {footerRow && footerRow.length > 0 && (
              <tfoot className="bg-rose-tint/60 font-bold">
                <tr>
                  {footerRow.map((cell, j) => (
                    <td key={j} className={`px-4 py-3 text-sm sm:px-5 ${numeric[j] ? 'text-right tabular-nums' : j === 0 ? 'text-navy' : 'text-ink'}`}>
                      {cell}
                    </td>
                  ))}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  )
}
