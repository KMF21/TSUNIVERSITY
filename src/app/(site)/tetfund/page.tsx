import { Accordion } from '@/components/ui/Accordion'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { TetfundGallery } from '@/components/tetfund/TetfundGallery'
import { sanityFetch } from '@/sanity/live'
import {
  PAGE_BY_SLUG_QUERY,
  TETFUND_INTERVENTIONS_QUERY,
} from '@/sanity/queries'

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
  const [page, interventions] = await Promise.all([
    (await sanityFetch({ query: PAGE_BY_SLUG_QUERY, params: { slug: 'tetfund' } })).data,
    (await sanityFetch({ query: TETFUND_INTERVENTIONS_QUERY })).data,
  ])

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

      <TetfundGallery interventions={interventions} />
    </Container>
  )
}