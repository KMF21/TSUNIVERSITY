import Image from 'next/image'
import Link from 'next/link'
import { PortableText } from 'next-sanity'
import { Mail, MapPin, ArrowLeft } from 'lucide-react'
import { notFound } from 'next/navigation'
import { Container } from '@/components/ui/Container'
import { urlFor } from '@/sanity/image'
import { sanityFetch } from '@/sanity/live'
import { STAFF_MEMBER_BY_SLUG_QUERY } from '@/sanity/queries'

export default async function StaffMemberPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const staff = (await sanityFetch({ query: STAFF_MEMBER_BY_SLUG_QUERY, params: { slug } })).data
  if (!staff) notFound()

  return (
    <Container className="py-16">
      <Link href="/staff-directory" className="inline-flex items-center gap-1 text-md font-semibold text-crimson hover:underline">
        <ArrowLeft className="h-4 w-4" />
        Back to Staff Directory
      </Link>

      <div className="mt-8 grid gap-10 lg:grid-cols-[300px_1fr]">
        <div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-navy/10">
            {staff.photo ? (
              <Image
                src={urlFor(staff.photo).width(600).height(750).url()}
                alt={staff.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center font-display text-5xl font-bold text-navy/40">
                {staff.name.split(' ').map((n: string) => n[0]).slice(0, 2).join('')}
              </div>
            )}
          </div>
        </div>

        <div>
          <h1 className="font-display text-3xl font-bold text-navy">{staff.name}</h1>
          <p className="mt-1 text-lg font-medium text-crimson">{staff.title}</p>
          {staff.department && (
            <Link
              href={`/academics/${staff.department.facultySlug}/${staff.department.slug.current}`}
              className="mt-1 inline-block text-md text-ink-muted hover:text-crimson hover:underline"
            >
              {staff.department.name}
            </Link>
          )}

          <div className="mt-6 flex flex-col gap-2">
            {staff.email && (
              <a href={`mailto:${staff.email}`} className="flex items-center gap-2 text-md text-ink-muted hover:text-crimson">
                <Mail className="h-4 w-4" />
                {staff.email}
              </a>
            )}
            {staff.officeLocation && (
              <span className="flex items-center gap-2 text-md text-ink-muted">
                <MapPin className="h-4 w-4" />
                {staff.officeLocation}
              </span>
            )}
          </div>

          {(staff.qualifications || staff.specialization) && (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {staff.qualifications && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Qualifications</p>
                  <p className="mt-1 text-md text-navy">{staff.qualifications}</p>
                </div>
              )}
              {staff.specialization && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Specialization</p>
                  <p className="mt-1 text-md text-navy">{staff.specialization}</p>
                </div>
              )}
            </div>
          )}

          {staff.bio && (
            <div className="prose prose-neutral mt-8 max-w-none">
              <PortableText value={staff.bio} />
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
