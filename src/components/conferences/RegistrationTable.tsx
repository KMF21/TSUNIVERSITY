import { RichText } from './RichText'
import { ExternalLink } from './ExternalLink'
import type { ConferenceDetail } from './types'

function money(amount?: number, currency = 'NGN') {
  if (amount === undefined || amount === null) return '—'
  if (amount === 0) return 'Free'
  try {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount)
  } catch {
    return `${currency} ${amount.toLocaleString('en-NG')}`
  }
}

export function RegistrationTable({ registration }: { registration: NonNullable<ConferenceDetail['registration']> }) {
  const fees = registration.fees ?? []
  return (
    <div className="space-y-8">
      {fees.length > 0 && (
        <div className="overflow-x-auto rounded-card border border-black/10">
          <table className="w-full min-w-[420px] text-left text-base">
            <caption className="sr-only">Registration fees</caption>
            <thead className="bg-navy-50 text-sm text-navy">
              <tr>
                <th scope="col" className="px-4 py-3 font-semibold">Category</th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">Fee</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              {fees.map((f) => (
                <tr key={f._key ?? f.category}>
                  <th scope="row" className="px-4 py-3 font-medium text-ink">
                    {f.category}
                    {f.note && <span className="block text-sm font-normal text-ink-muted">{f.note}</span>}
                  </th>
                  <td className="whitespace-nowrap px-4 py-3 text-right font-display font-semibold text-navy">{money(f.amount, f.currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <RichText value={registration.instructions} />
      {registration.registrationUrl && (
        <ExternalLink
          href={registration.registrationUrl}
          className="inline-flex min-h-[48px] items-center rounded-full bg-crimson px-7 font-semibold text-white transition hover:bg-crimson-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2"
        >
          Register now
        </ExternalLink>
      )}
    </div>
  )
}
