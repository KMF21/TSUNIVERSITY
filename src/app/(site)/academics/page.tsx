import Link from 'next/link'
import Image from 'next/image'
import { client } from '@/sanity/client'
import { ALL_FACULTIES_QUERY } from '@/sanity/queries'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { urlFor } from '@/sanity/image'
// import { client } from '../../../sanity/client'
// import { ALL_FACULTIES_QUERY } from '../../../sanity/queries'
// import { urlFor } from '../../../sanity/image'
// import { Container } from '../../components/ui/Container'
// import { SectionHeading } from '../../components/ui/SectionHeading'

type Faculty = {
  _id: string
  name: string
  slug: { current: string }
  heroImage?: any
  deanName?: string
  departmentCount: number
}

export default async function AcademicsPage() {
  const faculties: Faculty[] = await client.fetch(ALL_FACULTIES_QUERY)

  return (
    <Container className="py-16">
      <SectionHeading eyebrow="Academics" title="Faculties & Departments" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {faculties.map((faculty) => (
          <Link
            key={faculty._id}
            href={`/academics/${faculty.slug.current}`}
            className="group overflow-hidden rounded-card border border-black/5 bg-white shadow-sm transition hover:shadow-md"
          >
            {faculty.heroImage && (
              <div className="relative h-40 w-full">
                <Image
                  src={urlFor(faculty.heroImage).width(600).height(300).url()}
                  alt={faculty.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-5">
              <h3 className="font-display text-lg font-semibold text-navy group-hover:text-crimson">
                {faculty.name}
              </h3>
              <p className="mt-1 text-md text-ink-muted">{faculty.departmentCount} Departments</p>
            </div>
          </Link>
        ))}
      </div>
    </Container>
  )
}
