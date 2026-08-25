'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useMemo, useState } from 'react'
import { urlFor } from '@/sanity/image'

type Program = {
  programName?: string
  level?: string
  duration?: string
}

type Department = {
  _id: string
  name: string
  slug?: {
    current: string
  }
  hodName?: string
  programs?: Program[]
}

type Faculty = {
  _id: string
  name: string
  slug?: {
    current: string
  }
  heroImage?: any
  departments?: Department[]
}

type Props = {
  faculties: Faculty[]
  mode: 'undergraduate' | 'postgraduate'
}

const UNDERGRADUATE_LEVELS = [
  {
    label: 'All Programmes',
    value: 'all',
  },
  {
    label: "Bachelor's",
    value: "Bachelor's",
  },
]

const POSTGRADUATE_LEVELS = [
  {
    label: 'All Programmes',
    value: 'all',
  },
  {
    label: 'PGD',
    value: 'pgd',
  },
  {
    label: "Master's",
    value: "Master's",
  },
  {
    label: 'PhD',
    value: 'PhD',
  },
]

function normalizeLevel(level?: string) {
  if (!level) return ''

  const value = level.toLowerCase().trim()

  /*
   * Your existing schema currently calls this "Diploma".
   * Since TSU uses PGD for the postgraduate diploma,
   * both values are treated as PGD here.
   */
  if (
    value === 'diploma' ||
    value === 'pgd' ||
    value === 'postgraduate diploma'
  ) {
    return 'pgd'
  }

  if (
    value === "master's" ||
    value === 'masters' ||
    value === 'master'
  ) {
    return "Master's"
  }

  if (
    value === 'phd' ||
    value === 'ph.d' ||
    value === 'doctorate'
  ) {
    return 'PhD'
  }

  if (
    value === "bachelor's" ||
    value === 'bachelors' ||
    value === 'bachelor'
  ) {
    return "Bachelor's"
  }

  return level
}

function displayLevel(level?: string) {
  const normalized = normalizeLevel(level)

  if (normalized === 'pgd') {
    return 'PGD'
  }

  if (normalized === "Master's") {
    return "Master's"
  }

  if (normalized === "Bachelor's") {
    return "Bachelor's"
  }

  if (normalized === 'PhD') {
    return 'PhD'
  }

  return level || ''
}

export function AcademicCatalogue({
  faculties,
  mode,
}: Props) {
  const [search, setSearch] = useState('')
  const [activeLevel, setActiveLevel] = useState('all')
  const [openFaculty, setOpenFaculty] = useState<string | null>(
    null
  )

  const isUndergraduate = mode === 'undergraduate'

  const filters = isUndergraduate
    ? UNDERGRADUATE_LEVELS
    : POSTGRADUATE_LEVELS

  const filteredFaculties = useMemo(() => {
    const query = search.trim().toLowerCase()

    return faculties
      .map((faculty) => {
        const departments = (faculty.departments || [])
          .map((department) => {
            const programs = (department.programs || []).filter(
              (program) => {
                const normalized = normalizeLevel(program.level)

                const matchesLevel =
                  activeLevel === 'all' ||
                  normalized === activeLevel

                const matchesSearch =
                  !query ||
                  faculty.name.toLowerCase().includes(query) ||
                  department.name.toLowerCase().includes(query) ||
                  program.programName
                    ?.toLowerCase()
                    .includes(query)

                return matchesLevel && matchesSearch
              }
            )

            const departmentMatchesSearch =
              !query ||
              department.name.toLowerCase().includes(query) ||
              faculty.name.toLowerCase().includes(query)

            if (
              programs.length === 0 &&
              !departmentMatchesSearch
            ) {
              return null
            }

            /*
             * When the user searches for a faculty or department,
             * retain all matching programmes rather than hiding
             * the department completely.
             */
            if (
              programs.length === 0 &&
              departmentMatchesSearch
            ) {
              return {
                ...department,
                programs: (department.programs || []).filter(
                  (program) => {
                    const normalized = normalizeLevel(program.level)

                    return (
                      activeLevel === 'all' ||
                      normalized === activeLevel
                    )
                  }
                ),
              }
            }

            return {
              ...department,
              programs,
            }
          })
          .filter(Boolean) as Department[]

        if (departments.length === 0) {
          return null
        }

        return {
          ...faculty,
          departments,
        }
      })
      .filter(Boolean) as Faculty[]
  }, [faculties, search, activeLevel])

  const totalDepartments = filteredFaculties.reduce(
    (total, faculty) =>
      total + (faculty.departments?.length || 0),
    0
  )

  const totalPrograms = filteredFaculties.reduce(
    (total, faculty) =>
      total +
      (faculty.departments || []).reduce(
        (departmentTotal, department) =>
          departmentTotal +
          (department.programs?.length || 0),
        0
      ),
    0
  )

  return (
    <div>
      {/* =========================================================
          INTRO / SEARCH
      ========================================================= */}

      <section className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-crimson">
              {isUndergraduate
                ? 'Undergraduate Programmes'
                : 'Postgraduate Programmes'}
            </p>

            <h2 className="mt-3 font-display text-2xl font-bold text-navy sm:text-3xl">
              {isUndergraduate
                ? 'Find your undergraduate programme'
                : 'Explore postgraduate opportunities'}
            </h2>

            <p className="mt-3 max-w-2xl leading-7 text-ink-muted">
              {isUndergraduate
                ? 'Explore faculties, departments and degree programmes available at Taraba State University.'
                : 'Explore postgraduate diploma, master’s and doctoral programmes across Taraba State University.'}
            </p>
          </div>

          <div className="flex gap-6 border-t border-black/5 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <div>
              <p className="text-2xl font-bold text-navy">
                {filteredFaculties.length}
              </p>
              <p className="text-xs uppercase tracking-wide text-ink-muted">
                Faculties
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-navy">
                {totalDepartments}
              </p>
              <p className="text-xs uppercase tracking-wide text-ink-muted">
                Departments
              </p>
            </div>

            <div>
              <p className="text-2xl font-bold text-navy">
                {totalPrograms}
              </p>
              <p className="text-xs uppercase tracking-wide text-ink-muted">
                Programmes
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-8">
          <label
            htmlFor={`${mode}-programme-search`}
            className="sr-only"
          >
            Search programmes
          </label>

          <div className="relative">
            <input
              id={`${mode}-programme-search`}
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder={
                isUndergraduate
                  ? 'Search by programme, department or faculty...'
                  : 'Search by programme, department or faculty...'
              }
              className="w-full rounded-xl border border-black/10 bg-white px-5 py-3.5 pr-12 text-sm text-navy outline-none transition placeholder:text-ink-muted focus:border-crimson focus:ring-2 focus:ring-crimson/10"
            />

            <svg
              className="pointer-events-none absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-muted"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
              />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </div>
        </div>

        {/* Programme Type Filters */}
        <div className="mt-5 flex flex-wrap gap-2">
          {filters.map((filter) => {
            const active = activeLevel === filter.value

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  setActiveLevel(filter.value)
                }
                className={[
                  'rounded-full border px-4 py-2 text-sm font-medium transition',
                  active
                    ? 'border-navy bg-navy text-white'
                    : 'border-black/10 bg-white text-ink-muted hover:border-navy hover:text-navy',
                ].join(' ')}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* =========================================================
          FACULTY CATALOGUE
      ========================================================= */}

      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-crimson">
              Academic Catalogue
            </p>

            <h2 className="mt-2 font-display text-2xl font-bold text-navy">
              Browse by Faculty
            </h2>
          </div>

          {(search || activeLevel !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearch('')
                setActiveLevel('all')
              }}
              className="text-sm font-semibold text-crimson hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {filteredFaculties.length > 0 ? (
          <div className="space-y-4">
            {filteredFaculties.map((faculty) => {
              const isOpen = openFaculty === faculty._id

              const facultyProgramCount =
                faculty.departments?.reduce(
                  (total, department) =>
                    total +
                    (department.programs?.length || 0),
                  0
                ) || 0

              return (
                <article
                  key={faculty._id}
                  className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm"
                >
                  {/* Faculty Header */}
                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaculty(
                        isOpen ? null : faculty._id
                      )
                    }
                    className="group flex w-full items-center gap-4 p-4 text-left sm:p-5"
                    aria-expanded={isOpen}
                  >
                    {faculty.heroImage ? (
                      <div className="relative hidden h-16 w-24 shrink-0 overflow-hidden rounded-xl sm:block">
                        <Image
                          src={urlFor(faculty.heroImage)
                            .width(300)
                            .height(200)
                            .fit('crop')
                            .url()}
                          alt={faculty.name}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    ) : (
                      <div className="hidden h-16 w-24 shrink-0 items-center justify-center rounded-xl bg-rose-tint text-xs font-semibold text-crimson sm:flex">
                        TSU
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <h3 className="font-display text-lg font-bold text-navy transition group-hover:text-crimson">
                        {faculty.name}
                      </h3>

                      <p className="mt-1 text-sm text-ink-muted">
                        {faculty.departments?.length || 0}{' '}
                        {faculty.departments?.length === 1
                          ? 'Department'
                          : 'Departments'}{' '}
                        · {facultyProgramCount}{' '}
                        {facultyProgramCount === 1
                          ? 'Programme'
                          : 'Programmes'}
                      </p>
                    </div>

                    <span
                      className={[
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/10 text-lg text-navy transition',
                        isOpen
                          ? 'rotate-180 bg-navy text-white'
                          : 'bg-white',
                      ].join(' ')}
                      aria-hidden="true"
                    >
                      ↓
                    </span>
                  </button>

                  {/* Departments */}
                  {isOpen && (
                    <div className="border-t border-black/5 bg-[#fafafa] p-4 sm:p-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        {faculty.departments?.map(
                          (department) => (
                            <div
                              key={department._id}
                              className="rounded-xl border border-black/5 bg-white p-5"
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <h4 className="font-semibold text-navy">
                                    {department.name}
                                  </h4>

                                  {department.hodName && (
                                    <p className="mt-1 text-xs text-ink-muted">
                                      HOD:{' '}
                                      {department.hodName}
                                    </p>
                                  )}
                                </div>

                                {department.slug?.current && (
                                  <Link
                                    href={`/academics/${faculty.slug?.current}/${department.slug.current}`}
                                    className="shrink-0 text-xs font-semibold text-crimson hover:underline"
                                  >
                                    Department →
                                  </Link>
                                )}
                              </div>

                              {department.programs &&
                              department.programs.length > 0 ? (
                                <div className="mt-4 divide-y divide-black/5 rounded-lg border border-black/5">
                                  {department.programs.map(
                                    (program, index) => (
                                      <div
                                        key={`${program.programName}-${index}`}
                                        className="flex items-center justify-between gap-4 p-3"
                                      >
                                        <span className="text-sm font-medium leading-5 text-navy">
                                          {program.programName}
                                        </span>

                                        <div className="shrink-0 text-right">
                                          <span className="block text-xs font-semibold text-crimson">
                                            {displayLevel(
                                              program.level
                                            )}
                                          </span>

                                          {program.duration && (
                                            <span className="mt-0.5 block text-[11px] text-ink-muted">
                                              {
                                                program.duration
                                              }
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                <p className="mt-4 rounded-lg bg-muted/30 p-3 text-sm text-ink-muted">
                                  Programme information is
                                  currently being updated.
                                </p>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-black/10 bg-white px-6 py-16 text-center">
            <p className="font-semibold text-navy">
              No programmes found
            </p>

            <p className="mt-2 text-sm text-ink-muted">
              Try another programme, department, faculty or
              programme type.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch('')
                setActiveLevel('all')
              }}
              className="mt-5 text-sm font-semibold text-crimson hover:underline"
            >
              Reset search
            </button>
          </div>
        )}
      </section>
    </div>
  )
}