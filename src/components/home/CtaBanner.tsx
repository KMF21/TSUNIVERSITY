import Link from 'next/link'
import Image from 'next/image'
import { Container } from '../ui/Container'

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden bg-crimson py-16 text-white">
      {/* Temporary: real TSU campus photo hotlinked from the live site as a
          background texture. Swap for a Sanity-hosted asset later. */}
      <Image
        src="https://www.tsuniversity.edu.ng/wp-content/uploads/2022/05/GIT_1247-min-scaled-2000x441.jpg"
        alt=""
        fill
        className="object-cover opacity-15"
      />
      <Container className="relative flex flex-col items-center gap-6 text-center">
        <h2 className="font-display text-3xl font-bold sm:text-4xl">
          Do It Now. Sometimes, &lsquo;Later&rsquo; Becomes &lsquo;Never&rsquo;
        </h2>
        <Link
          href="/admissions"
          className="rounded-full bg-white px-8 py-3 font-semibold text-crimson transition hover:bg-rose-tint"
        >
          Apply Now
        </Link>
      </Container>
    </section>
  )
}
