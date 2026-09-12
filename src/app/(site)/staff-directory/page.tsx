import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StaffDirectoryGrid } from '@/components/staff/StaffDirectoryGrid'
import { sanityFetch } from '@/sanity/live'
import { STAFF_DIRECTORY_QUERY } from '@/sanity/queries'

export default async function StaffDirectoryPage() {
  const staff = (await sanityFetch({ query: STAFF_DIRECTORY_QUERY })).data

  return (
    <Container className="py-16">
      <SectionHeading
        eyebrow="Our People"
        title="Staff Directory"
        subtitle="Find contact details and specializations for academic and non-academic staff across the university."
      />
      <div className="mt-10">
        <StaffDirectoryGrid staff={staff} />
      </div>
    </Container>
  )
}
