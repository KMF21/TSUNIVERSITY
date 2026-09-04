import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText } from 'next-sanity'
import { sanityFetch } from '@/sanity/live'
import { FACULTY_BY_SLUG_QUERY } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'
import { Container } from '@/components/ui/Container'

type FacultyPageProps = {
  params: Promise<{
    faculty: string
  }>
}

export default async function FacultyPage({
  params,
}: FacultyPageProps) {
  const { faculty: facultySlug } = await params

  const faculty = (await sanityFetch({ query: FACULTY_BY_SLUG_QUERY, params: {
    slug: facultySlug,
  } })).data

  if (!faculty) {
    notFound()
  }

  return (
    <>
      {faculty.heroImage && (
        <div className="relative h-64 w-full sm:h-80">
          <Image
            src={urlFor(faculty.heroImage).width(1600).url()}
            alt={faculty.name}
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 flex items-end bg-navy-900/50">
            <Container className="pb-8">
              <h1 className="font-display text-3xl font-bold text-white sm:text-4xl">
                {faculty.name}
              </h1>
            </Container>
          </div>
        </div>
      )}

      <Container className="py-16">
        {faculty.deanName && (
          <div className="mb-10 rounded-card bg-rose-tint p-6">
            <p className="text-md font-semibold uppercase text-crimson">
              Dean&apos;s Message
            </p>

            <p className="mt-2 font-semibold text-navy">
              {faculty.deanName}
            </p>

            {faculty.deanMessage && (
              <p className="mt-2 text-ink-muted">
                {faculty.deanMessage}
              </p>
            )}
          </div>
        )}

        {faculty.overview && (
          <div className="prose prose-neutral max-w-none">
            <PortableText value={faculty.overview} />
          </div>
        )}

        <h2 className="mt-12 font-display text-2xl font-bold text-navy">
          Departments
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {faculty.departments?.map(
            (dept: {
              _id: string
              name: string
              slug: { current: string }
              hodName?: string
            }) => (
              <Link
                key={dept._id}
                href={`/academics/${facultySlug}/${dept.slug.current}`}
                className="rounded-card border border-black/5 p-5 shadow-sm transition hover:border-crimson"
              >
                <h3 className="font-semibold text-navy">
                  {dept.name}
                </h3>

                {dept.hodName && (
                  <p className="mt-1 text-md text-ink-muted">
                    HOD: {dept.hodName}
                  </p>
                )}
              </Link>
            ),
          )}
        </div>
      </Container>
    </>
  )
}