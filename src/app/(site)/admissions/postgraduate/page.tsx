import { sanityFetch } from '@/sanity/live'
import { ACADEMIC_CATALOG_QUERY } from '@/sanity/queries'

import { Container } from '@/components/ui/Container'
import { AcademicCatalogue } from '@/components/academics/AcademicCatalogue'

export default async function PostgraduatePage() {
  const faculties = (await sanityFetch({ query: ACADEMIC_CATALOG_QUERY })).data

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
              Postgraduate Education
            </p>

            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
              Advance your knowledge. Extend your impact.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-white/70 sm:text-lg">
              Explore postgraduate opportunities at Taraba State
              University, from postgraduate diplomas to master's and
              doctoral study.
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
                Postgraduate admissions
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* =========================================================
          STUDY LEVELS
      ========================================================= */}

      <section className="bg-rose-tint">
        <Container className="py-16 sm:py-20">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-crimson">
              Advanced Study
            </p>

            <h2 className="mt-3 font-display text-3xl font-bold text-navy sm:text-4xl">
              Choose the level that fits your goals.
            </h2>

            <p className="mt-5 leading-8 text-ink-muted">
              Whether you are seeking advanced professional training,
              specialised master's study or doctoral research, explore
              postgraduate programmes across the University's academic
              faculties.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl bg-white p-7 shadow-sm">
              <span className="text-sm font-bold uppercase tracking-wider text-crimson">
                PGD
              </span>

              <h3 className="mt-3 text-xl font-bold text-navy">
                Postgraduate Diploma
              </h3>

              <p className="mt-3 text-sm leading-7 text-ink-muted">
                Build advanced academic and professional knowledge
                through focused postgraduate study.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-sm">
              <span className="text-sm font-bold uppercase tracking-wider text-crimson">
                MASTERS
              </span>

              <h3 className="mt-3 text-xl font-bold text-navy">
                Master&apos;s Degree
              </h3>

              <p className="mt-3 text-sm leading-7 text-ink-muted">
                Deepen your expertise, develop research capability and
                advance your professional direction.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-sm">
              <span className="text-sm font-bold uppercase tracking-wider text-crimson">
                PHD
              </span>

              <h3 className="mt-3 text-xl font-bold text-navy">
                Doctoral Study
              </h3>

              <p className="mt-3 text-sm leading-7 text-ink-muted">
                Pursue original research and contribute new knowledge
                within your field.
              </p>
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
            mode="postgraduate"
          />
        </Container>
      </section>

      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="bg-navy">
        <Container className="py-16 sm:py-20">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-crimson">
                Postgraduate Admissions
              </p>

              <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
                Take the next step in your academic career.
              </h2>

              <p className="mt-4 leading-7 text-white/70">
                Consult the University's current admission information
                for programme requirements, application procedures and
                important deadlines.
              </p>
            </div>

            <a
              href="/admissions"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-crimson px-6 py-3 font-semibold text-white transition hover:bg-crimson/90"
            >
              View Admissions →
            </a>
          </div>
        </Container>
      </section>
    </>
  )
}