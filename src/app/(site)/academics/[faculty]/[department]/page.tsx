import { notFound } from 'next/navigation'
import { PortableText } from 'next-sanity'
import { client } from '../../../../../sanity/client'
import { DEPARTMENT_BY_SLUG_QUERY } from '../../../../../sanity/queries'
import { Container } from '../../../../components/ui/Container'

type Program = {
  programName: string
  level: string
  duration: string
}

type DepartmentPageProps = {
  params: Promise<{
    faculty: string
    department: string
  }>
}

export default async function DepartmentPage({
  params,
}: DepartmentPageProps) {
  const { faculty, department: departmentSlug } = await params

  const department = await client.fetch(DEPARTMENT_BY_SLUG_QUERY, {
    slug: departmentSlug,
    facultySlug: faculty,
  })

  if (!department) {
    notFound()
  }

  return (
    <Container className="max-w-3xl py-16">
      <p className="text-md font-semibold uppercase text-crimson">
        {department.faculty.name}
      </p>

      <h1 className="mt-2 font-display text-3xl font-bold text-navy">
        {department.name}
      </h1>

      {department.hodName && (
        <p className="mt-2 text-ink-muted">
          Head of Department: {department.hodName}
        </p>
      )}

      {department.description && (
        <div className="prose prose-neutral mt-8 max-w-none">
          <PortableText value={department.description} />
        </div>
      )}

      {department.programsOffered?.length > 0 && (
        <>
          <h2 className="mt-12 font-display text-xl font-bold text-navy">
            Programs Offered
          </h2>

          <div className="mt-4 divide-y divide-black/5 rounded-card border border-black/5">
            {department.programsOffered.map(
              (program: Program, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4"
                >
                  <span className="font-medium text-navy">
                    {program.programName}
                  </span>

                  <span className="text-md text-ink-muted">
                    {program.level} · {program.duration}
                  </span>
                </div>
              ),
            )}
          </div>
        </>
      )}
    </Container>
  )
}