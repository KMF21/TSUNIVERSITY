import Image from 'next/image'

import { client } from '@/sanity/client'
import { ACADEMIC_CATALOG_QUERY } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'

import { Container } from '@/components/ui/Container'
import { AcademicCatalogue } from '@/components/academics/AcademicCatalogue'


type Props = {
  faculties: any[]
}

export default async function UndergraduatePage() {
  const faculties: Props['faculties'] = await client.fetch(
    ACADEMIC_CATALOG_QUERY
  )

  return (
    <>
      {/* =========================================================
          HERO
      ========================================================= */}

      <section className="relative overflow-hidden bg-navy">
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-navy to-[#202d42]" />

        <Container className="relative py-20 sm:py-24 lg:py-28">
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-crimson">
              Undergraduate Education
            </p>

            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Build your future at Taraba State University.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Discover undergraduate programmes across our faculties
              and departments, and find an academic path that matches
              your ambitions.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#programmes"
                className="rounded-xl bg-crimson px-5 py-3 text-sm font-semibold text-white transition hover:bg-crimson/90"
              >
                Explore programmes
              </a>

              <a
                href="/admissions"
                className="rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                Admissions information
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================
          INTRO
      ========================================================= */}

      <section className="bg-rose-tint">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-crimson">
                Your academic journey
              </p>

              <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">
                Explore. Choose. Grow.
              </h2>

              <p className="mt-5 max-w-2xl leading-8 text-ink-muted">
                Taraba State University offers a broad range of
                undergraduate disciplines designed to develop
                knowledge, professional competence, critical
                thinking and the capacity to contribute meaningfully
                to society.
              </p>

              <p className="mt-4 max-w-2xl leading-8 text-ink-muted">
                Browse the catalogue below by faculty, department or
                programme. Programme information is managed through
                the University's academic content system and can be
                updated as programmes evolve.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-3xl font-bold text-navy">01</p>
                <p className="mt-2 font-semibold text-navy">
                  Choose a faculty
                </p>
                <p className="mt-1 text-sm leading-6 text-ink-muted">
                  Explore academic areas that interest you.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-3xl font-bold text-navy">02</p>
                <p className="mt-2 font-semibold text-navy">
                  Find a department
                </p>
                <p className="mt-1 text-sm leading-6 text-ink-muted">
                  See the disciplines and programmes offered.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-3xl font-bold text-navy">03</p>
                <p className="mt-2 font-semibold text-navy">
                  Compare programmes
                </p>
                <p className="mt-1 text-sm leading-6 text-ink-muted">
                  Review degree levels and duration.
                </p>
              </div>

              <div className="rounded-2xl bg-white p-6 shadow-sm">
                <p className="text-3xl font-bold text-navy">04</p>
                <p className="mt-2 font-semibold text-navy">
                  Take the next step
                </p>
                <p className="mt-1 text-sm leading-6 text-ink-muted">
                  Continue to admissions and application information.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================
          PROGRAMME CATALOGUE
      ========================================================= */}

      <section id="programmes">
        <Container className="py-16 sm:py-20">
          <AcademicCatalogue
            faculties={faculties}
            mode="undergraduate"
          />
        </Container>
      </section>

      {/* =========================================================
          ADMISSIONS CTA
      ========================================================= */}

      <section className="bg-navy">
        <Container className="py-16 sm:py-20">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-crimson">
                Ready for the next step?
              </p>

              <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                Start your journey with TSU.
              </h2>

              <p className="mt-4 leading-7 text-white/70">
                Review admission requirements, application information
                and important updates before beginning your application.
              </p>
            </div>

            <a
              href="/admissions"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-crimson px-6 py-3 font-semibold text-white transition hover:bg-crimson/90"
            >
              Visit Admissions →
            </a>
          </div>
        </Container>
      </section>
    </>
  )
}