'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Target, Eye } from 'lucide-react'
import { Container } from '../ui/Container'
import { AnimateOnScroll } from '../motion/AnimateOnScroll'
import { StaggerGroup, StaggerItem } from '../motion/StaggerGroup'
import { fadeInUp, scaleIn } from '@/lib/motion-variants'

const PILLARS = [
  {
    icon: Target,
    title: 'Our Mission',
    body: 'To provide accessible, high-quality education that equips students with the knowledge, skills, and character to lead in their chosen fields and communities.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    body: 'To be a leading center of academic excellence in Nigeria, recognized for research, innovation, and producing graduates who shape the nation\'s future.',
  },
]

export function AboutSection() {
  return (
    <section className="py-16 sm:py-24">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative aspect-[4/5] w-full overflow-hidden rounded-card shadow-2xl"
        >
          {/* Temporary: real TSU campus photo hotlinked from the live site.
              Swap for a Sanity-hosted asset once available. */}
          <Image
            src="https://www.tsuniversity.edu.ng/wp-content/uploads/2022/05/GIT_1247-min-scaled-2000x441.jpg"
            alt="Taraba State University campus building"
            fill
            className="object-cover"
          />

          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="absolute bottom-6 left-6 rounded-card bg-crimson px-6 py-4 text-white shadow-lg"
          >
            <p className="font-display text-3xl font-bold">60+</p>
            <p className="text-md font-semibold uppercase tracking-wide">Years of Excellence</p>
          </motion.div>
        </motion.div>

        <div>
          <AnimateOnScroll>
            <span className="inline-flex items-center gap-2 text-md font-semibold uppercase tracking-wide text-crimson">
              <span className="h-0.5 w-6 bg-crimson" />
              Who We Are
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold text-navy sm:text-4xl">
              Shaping Futures Through Knowledge &amp; Discovery
            </h2>
            <p className="mt-5 max-w-xl text-ink-muted">
              For over six decades, Taraba State University has been a home for learners across
              Nigeria and beyond, offering internationally recognized programs across nine
              faculties and a growing portfolio of research initiatives.
            </p>
          </AnimateOnScroll>

          <StaggerGroup className="mt-8 grid gap-4 sm:grid-cols-2" staggerDelay={0.12}>
            {PILLARS.map(({ icon: Icon, title, body }) => (
              <StaggerItem
                key={title}
                className="rounded-card border-t-4 border-crimson bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-crimson-50 text-crimson">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-navy">{title}</h3>
                <p className="mt-2 text-md text-ink-muted">{body}</p>
              </StaggerItem>
            ))}
          </StaggerGroup>
        </div>
      </Container>
    </section>
  )
}
