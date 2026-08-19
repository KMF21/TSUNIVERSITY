import Link from 'next/link'
import Image from 'next/image'
import { client } from '../../../sanity/client'
import { ALL_FACULTIES_QUERY } from '../../../sanity/queries'
import { urlFor } from '../../../sanity/image'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { AnimateOnScroll } from '../motion/AnimateOnScroll'
import { StaggerGroup, StaggerItem } from '../motion/StaggerGroup'

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
        <AnimateOnScroll>
          <SectionHeading
            eyebrow="Academics"
            title="Our Faculties"
            subtitle="Nine faculties spanning the sciences, humanities, and professional disciplines."
          />
        </AnimateOnScroll>

        <StaggerGroup className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5" staggerDelay={0.06}>
          {faculties.map((faculty) => (
            <StaggerItem key={faculty._id}>
              <Link
                href={`/academics/${faculty.slug.current}`}
                className="group relative flex aspect-[3/4] overflow-hidden rounded-card bg-navy"
              >
                {faculty.heroImage && (
                  <Image
                    src={urlFor(faculty.heroImage).width(400).height(550).url()}
                    alt={faculty.name}
                    fill
                    className="object-cover opacity-70 transition duration-300 group-hover:scale-105 group-hover:opacity-90"
                  />
                )}
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-navy-900/90 to-transparent p-4">
                  <p className="font-display text-md font-semibold text-white">{faculty.name}</p>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  )
}
