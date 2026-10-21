import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/ContactForm'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { sanityFetch } from '@/sanity/live'
import { CONTACT_PAGE_QUERY } from '@/sanity/queries'
import { safeMapEmbedSrc } from '@/lib/conferences'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Taraba State University, Jalingo — campus address, email, admissions and ICT support contacts.',
  alternates: { canonical: '/contact' },
}

type Line = { _key?: string; kind: 'text' | 'email' | 'phone' | 'whatsapp'; value: string }
type Card = { _key?: string; label: string; lines?: Line[] }
type ContactData = { cards?: Card[]; map?: { embedUrl?: string; latitude?: number; longitude?: number } }

const linkClass = 'underline-offset-2 hover:text-crimson hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson'

function LineItem({ line }: { line: Line }) {
  const digits = line.value.replace(/[^\d+]/g, '')
  switch (line.kind) {
    case 'email':
      return <a href={`mailto:${line.value}`} className={`break-all ${linkClass}`}>{line.value}</a>
    case 'phone':
      return <a href={`tel:${digits}`} className={linkClass}>{line.value}</a>
    case 'whatsapp':
      return (
        <a href={`https://wa.me/${digits.replace(/^\+/, '')}`} target="_blank" rel="noopener noreferrer" className={linkClass}>
          WhatsApp: {line.value}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      )
    default:
      return <span>{line.value}</span>
  }
}

export default async function ContactPage() {
  const data = ((await sanityFetch({ query: CONTACT_PAGE_QUERY })).data as ContactData | null) ?? {}
  const cards = (data.cards ?? []).filter((c) => (c.lines?.length ?? 0) > 0)
  const mapSrc = safeMapEmbedSrc(data.map?.embedUrl, data.map?.latitude, data.map?.longitude)

  return (
    <Container className="py-16">
      <SectionHeading eyebrow="Get In Touch" title="Contact Us" />

      {cards.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <div key={card._key ?? card.label} className="rounded-card border-b-2 border-crimson bg-white p-6 text-center shadow-sm">
              <h3 className="font-semibold text-navy">{card.label}</h3>
              <ul className="mt-2 space-y-1 text-base text-ink-muted">
                {card.lines?.map((line) => (
                  <li key={line._key ?? line.value}>
                    <LineItem line={line} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <div className={`mt-12 grid gap-10 ${mapSrc ? 'lg:grid-cols-2' : 'mx-auto max-w-2xl'}`}>
        {mapSrc && (
          <div className="aspect-video overflow-hidden rounded-card bg-navy/10">
            <iframe
              src={mapSrc}
              title="Map showing the Taraba State University campus"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-full w-full border-0"
            />
          </div>
        )}
        <ContactForm />
      </div>
    </Container>
  )
}
