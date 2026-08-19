'use client'

import Link from 'next/link'
import { Container } from '../ui/Container'
import { StaggerGroup, StaggerItem } from '../motion/StaggerGroup'
import { tapScale } from '@/lib/motion-variants'
import { motion } from 'framer-motion'

const TRACKS = [
  {
    title: 'Undergraduate Programmes',
    description: 'Explore degree programs across ten faculties, from Engineering to Law.',
    href: '/admissions/undergraduate',
  },
  {
    title: 'Postgraduate Programmes',
    description: 'Internationally recognized master\'s and doctoral research programs.',
    href: '/admissions/postgraduate',
  },
  {
    title: 'Distance Learning',
    description: 'Earn your degree remotely through our accredited distance learning centre.',
    href: '/portals',
  },
]

export function QuickAccess() {
  return (
    <section className="py-16">
      <Container>
        <StaggerGroup className="grid gap-6 md:grid-cols-3">
        {TRACKS.map((track) => (
          <StaggerItem key={track.title}>
            <motion.div {...tapScale}>
              <Link
                href={track.href}
                className="group block rounded-card border border-black/5 p-6 shadow-sm transition hover:border-crimson hover:shadow-md"
              >
                <h3 className="font-display text-lg font-semibold text-navy group-hover:text-crimson">
                  {track.title}
                </h3>
                <p className="mt-2 text-md text-ink-muted">{track.description}</p>
                <span className="mt-4 inline-block text-md font-semibold text-crimson">List of Courses →</span>
              </Link>
            </motion.div>
          </StaggerItem>
        ))}
        </StaggerGroup>
      </Container>
    </section>
  )
}
