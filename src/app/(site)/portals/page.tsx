import { Container } from "@/components/ui/Container"
import { SectionHeading } from "@/components/ui/SectionHeading"

type Portal = { label: string; href: string; description: string }

const STUDENT_PORTALS: Portal[] = [
  { label: 'Undergraduate / Sandwich / Diploma Portal', href: 'https://degportal.tsuniversity.edu.ng/', description: 'Student dashboard for undergraduate, sandwich, and diploma programmes.' },
  { label: 'Postgraduate Portal', href: 'https://pgportal.tsuniversity.edu.ng/', description: 'Manage postgraduate records and coursework.' },
  { label: 'IJMB Portal', href: 'https://ijmbportal.tsuniversity.edu.ng/', description: 'IJMB programme access and results.' },
  { label: 'IDELL Portal (Distance Learning)', href: 'https://idell_tsu_stream1.safrecords.com/login', description: 'Coursework and materials for distance learners.' },
]

const APPLICATION_PORTALS: Portal[] = [
  { label: 'Undergraduate Application', href: 'https://apply.tsuniversity.edu.ng/', description: 'Start a new undergraduate application.' },
  { label: 'Sandwich Application', href: 'https://apply.tsuniversity.edu.ng/register_sand.php', description: 'Apply to a sandwich programme.' },
  { label: 'Diploma Application (Jalingo)', href: 'https://apply.tsuniversity.edu.ng/register_diploma.php', description: 'Diploma application for the Jalingo campus.' },
  { label: 'Diploma Application (Takum)', href: 'https://apply.tsuniversity.edu.ng/register_diploma_takum.php', description: 'Diploma application for the Takum campus.' },
  { label: 'IJMB Application', href: 'https://apply.tsuniversity.edu.ng/register_predegree.php', description: 'Apply to the IJMB pre-degree programme.' },
  { label: 'IDELL Application', href: 'https://idell_tsu.admissions.cloud/create-account.jsp', description: 'Apply to the distance learning programme.' },
  { label: 'Postgraduate Application', href: 'https://pgapp.tsuniversity.edu.ng/auth/login', description: 'Start or continue a postgraduate application.' },
  { label: 'Inter-University Transfer', href: 'https://apply.tsuniversity.edu.ng/inter_transfer/register.php', description: 'Apply for an inter-university transfer.' },
]

const OTHER_SERVICES: Portal[] = [
  { label: 'Payments', href: 'https://payments.tsuniversity.edu.ng/login.php', description: 'Make fee and application payments securely.' },
  { label: 'Student Result Checker', href: 'http://resultchecker.tsuniversity.edu.ng/', description: 'Check your academic results.' },
  { label: 'ICT Help Desk', href: 'https://helpdesk.tsuniversity.ng/', description: 'Get support for technical and account issues.' },
  { label: 'OER Portal', href: 'https://oer.tsuniversity.edu.ng/', description: 'Open Educational Resources for students and staff.' },
]

function PortalGroup({ title, portals }: { title: string; portals: Portal[] }) {
  return (
    <div className="mt-12 first:mt-0">
      <h2 className="font-display text-lg font-semibold text-navy">{title}</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {portals.map((portal) => (
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
    </div>
  )
}

export default function PortalsPage() {
  return (
    <Container className="py-16">
      <SectionHeading eyebrow="Quick Access" title="All Portals" subtitle="Direct access to every student and applicant system." />
      <PortalGroup title="Student Portals" portals={STUDENT_PORTALS} />
      <PortalGroup title="Application Portals" portals={APPLICATION_PORTALS} />
      <PortalGroup title="Other Services" portals={OTHER_SERVICES} />
    </Container>
  )
}