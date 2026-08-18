import Link from 'next/link'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'

const PORTALS = [
  { label: 'Undergraduate', href: 'https://degportal.tsuniversity.edu.ng' },
  { label: 'Post-Graduate', href: 'https://pgportal.tsuniversity.edu.ng' },
  { label: 'IJMB', href: 'https://ijmbportal.tsuniversity.edu.ng' },
  { label: 'Distance Learning', href: 'https://dlc.tsuniversity.edu.ng' },
  { label: 'Application', href: 'https://application.tsuniversity.edu.ng' },
  { label: 'Payments', href: 'https://payments.tsuniversity.edu.ng' },
]

export function PortalsTeaser() {
  return (
    <section className="py-16">
      <Container>
        <SectionHeading eyebrow="Quick Access" title="Student & Applicant Portals" />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {PORTALS.map((portal) => (
            <a
              key={portal.label}
              href={portal.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-24 items-center justify-center rounded-card border border-black/5 bg-white text-center text-sm font-semibold text-navy shadow-sm transition hover:border-crimson hover:text-crimson"
            >
              {portal.label}
            </a>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/portals" className="text-sm font-semibold text-crimson">
            View All Portals →
          </Link>
        </div>
      </Container>
    </section>
  )
}
