
// Placeholder structure — the live site's TETFund submenu items all pointed
// to the homepage with no real content behind them, so there was nothing to
// migrate. This at least gives every category a real, findable page instead
// of a broken link, and TSU can fill in real descriptions via Sanity Studio
// (page slug: "tetfund") whenever that content is ready — this fallback

import { Accordion } from "@/components/ui/Accordion"
import { Container } from "@/components/ui/Container"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { client } from "@/sanity/client"
import { PAGE_BY_SLUG_QUERY } from "@/sanity/queries"

// disappears automatically once that document exists.
const SPECIAL_INTERVENTION = [
  'ICT Support',
  'High Impact Intervention',
  'Zonal',
  'Disaster Recovery',
  'National Research Fund',
  'Conference Attendance',
  'Teaching Practice',
  'Institution-Based Research',
  'Entrepreneurship',
]

const ANNUAL_INTERVENTION = [
  'Procurement of General Equipment',
  'TETFund Project Maintenance',
  'Physical Infrastructure',
  'Physical Infrastructure/Program Upgrade',
  'Academic Staff Training & Development',
  'Library Development',
  'Academic Research Journal',
  'Equipment Fabrication',
  'Academic Manuscript Development',
]

export default async function TetfundPage() {
  const page = await client.fetch(PAGE_BY_SLUG_QUERY, { slug: 'tetfund' })

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="TETFund"
        title={page?.heroHeading || 'TETFund Intervention'}
        subtitle={
          page?.heroSubheading ||
          'Tertiary Education Trust Fund programs supporting infrastructure, research, and staff development at TSU.'
        }
      />
      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <Accordion
          groupTitle="Special Intervention"
          items={SPECIAL_INTERVENTION.map((heading) => ({ heading }))}
        />
        <Accordion
          groupTitle="Annual Intervention"
          items={ANNUAL_INTERVENTION.map((heading) => ({ heading }))}
        />
      </div>
    </Container>
  )
}
