import { Container } from '../../components/ui/Container'
import { SectionHeading } from '../../components/ui/SectionHeading'

// These remain external links for v1 per the client's confirmed decision —
// each is a separate system (payments, applications, etc.) that shouldn't
// be folded into the main site's scope right now.
const PORTALS = [
  { label: 'Undergraduate Portal', href: 'https://degportal.tsuniversity.edu.ng', description: 'Access your undergraduate student dashboard.' },
  { label: 'Post-Graduate Portal', href: 'https://pgportal.tsuniversity.edu.ng', description: 'Manage postgraduate applications and records.' },
  { label: 'IJMB Portal', href: 'https://ijmbportal.tsuniversity.edu.ng', description: 'IJMB program access and results.' },
  { label: 'Distance Learning Centre', href: 'https://dlc.tsuniversity.edu.ng', description: 'Coursework and materials for distance learners.' },
  { label: 'Diploma Portal', href: 'http://dipportal.tsuniversity.edu.ng', description: 'Diploma program student access.' },
  { label: 'PG & IJMB Application', href: 'https://application.tsuniversity.edu.ng', description: 'Start a new postgraduate or IJMB application.' },
  { label: 'Payments', href: 'https://payments.tsuniversity.edu.ng', description: 'Make fee and application payments securely.' },
  { label: 'Hostel Accommodation', href: 'https://hostel.tsuniversity.edu.ng', description: 'Apply for and manage campus accommodation.' },
]

export default function PortalsPage() {
  return (
    <Container className="py-16">
      <SectionHeading eyebrow="Quick Access" title="All Portals" subtitle="Direct access to every student and applicant system." />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PORTALS.map((portal) => (
          <a
            key={portal.label}
            href={portal.href}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-card border border-black/5 p-5 shadow-sm transition hover:border-crimson"
          >
            <h3 className="font-semibold text-navy">{portal.label}</h3>
            <p className="mt-1 text-md text-ink-muted">{portal.description}</p>
          </a>
        ))}
      </div>
    </Container>
  )
}
