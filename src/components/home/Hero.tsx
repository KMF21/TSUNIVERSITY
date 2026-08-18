import Link from 'next/link'
import Image from 'next/image'
import { Container } from '../ui/Container'

const STATS = [
  { value: '9', label: 'Faculties' },
  { value: '50+', label: 'Programs Offered' },
  { value: '60+', label: 'Years of Excellence' },
]

export function Hero() {
  return (
    <section className="bg-white py-16 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2 ">
        <div>
          <span className="inline-block rounded-full bg-crimson-50 px-4 py-1.5 text-sm font-semibold text-crimson">
            Premier Academic Institution
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold text-center md:text-start  text-navy sm:text-5xl">
            Harnessing Nature&apos;s Gift, Shaping Tomorrow&apos;s Leaders
          </h1>
          <p className="mt-5 max-w-xl text-ink-muted text-center md:text-start ">
            Taraba State University offers internationally recognized undergraduate, postgraduate,
            and distance learning programs across nine faculties.
          </p>
          <div className="mt-8 grid grid-cols-3 divide-x divide-black/10 rounded-card bg-white p-4 shadow-xl">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-3 text-center first:pl-0 last:pr-0">
                <p className="font-display text-2xl font-bold text-crimson">{stat.value}</p>
                <p className="text-xs uppercase tracking-wide text-ink-muted">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/admissions"
              className="rounded-full bg-crimson px-6 py-3 font-semibold text-white transition hover:bg-crimson-600"
            >
              Begin Your Journey
            </Link>
            <Link
              href="/campuses/main"
              className="rounded-full border border-navy/20 px-6 py-3 font-semibold text-navy transition hover:bg-navy hover:text-white"
            >
              Explore Campuses
            </Link>
          </div>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-navy/10 shadow-2xl">
          {/* Temporary: real TSU campus photo hotlinked from the live site.
              Swap for a Sanity-hosted asset once TSU provides/re-uploads
              preferred photography — see next.config.js note. */}
          <Image
            src="https://www.tsuniversity.edu.ng/wp-content/uploads/2014/10/GIT_1325-min-1024x731.jpg"
            alt="Taraba State University campus"
            fill
            priority
            className="object-cover"
          />
        </div>
      </Container>
    </section>
  )
}
