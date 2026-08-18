import Link from 'next/link'
import Image from 'next/image'
import { client } from '../../../sanity/client'
import { ALL_FACULTIES_QUERY } from '../../../sanity/queries'
import { urlFor } from '../../../sanity/image'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'

type Faculty = {
  _id: string
  name: string
  slug: { current: string }
  heroImage?: any
  departmentCount: number
}

export async function FacultyGrid() {
  const faculties: Faculty[] = await client.fetch(ALL_FACULTIES_QUERY)

  return (
    <section className="bg-rose-tint py-16">
      <Container>
        <SectionHeading
          eyebrow="Academics"
          title="Our Faculties"
          subtitle="Nine faculties spanning the sciences, humanities, and professional disciplines."
        />
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {faculties.map((faculty) => (
            <Link
              key={faculty._id}
              href={`/academics/${faculty.slug.current}`}
              className="group relative aspect-[3/4] overflow-hidden rounded-card bg-navy"
            >
              {faculty.heroImage && (
                <Image
                  src={urlFor(faculty.heroImage).width(400).height(550).url()}
                  alt={faculty.name}
                  fill
                  className="object-cover opacity-70 transition group-hover:opacity-90"
                />
              )}
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-navy-900/90 to-transparent p-4">
                <p className="font-display text-sm font-semibold text-white">{faculty.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  )
}
