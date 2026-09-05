'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'
import { Container } from '../ui/Container'
import { fadeInUp, scaleIn, staggerContainer, tapScale } from '@/lib/motion-variants'
import { urlFor } from '../../../sanity/image'

const STATS = [
  { value: '12', label: 'Faculties' },
  { value: '50+', label: 'Programs Offered' },
  { value: '15+', label: 'Years of Excellence' },
]

const FALLBACK_HERO_IMAGE =
  'https://www.tsuniversity.edu.ng/wp-content/uploads/2014/10/GIT_1325-min-1024x731.jpg'

export function Hero({ heroImage }: { heroImage?: any }) {
  const imageSrc = heroImage ? urlFor(heroImage).width(1200).height(900).url() : FALLBACK_HERO_IMAGE
  const imageAlt = heroImage?.alt || 'Taraba State University campus'
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.12)}
          className="flex flex-col items-center text-center lg:items-start lg:text-start"
        >
          <motion.span
            variants={fadeInUp}
            className=" rounded-full bg-crimson-50 px-4 py-2 text-md font-semibold text-crimson"
          >
            Premier Academic Institution
          </motion.span>

          <motion.h1
            variants={fadeInUp}
            className="mt-5 text-center font-display text-3xl md:text-4xl font-bold text-navy  md:text-start"
          >
            Harnessing Nature&apos;s Gift, Shaping Tomorrow&apos;s Leaders
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="mt-5 max-w-xl text-center text-ink-muted md:text-start"
          >
            Taraba State University offers internationally recognized undergraduate, postgraduate,
            and distance learning programs across ten faculties.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="mt-8 grid grid-cols-3 divide-x divide-black/10 rounded-card bg-white p-4 shadow-xl"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="px-3 text-center first:pl-0 last:pr-0">
                <p className="font-display text-2xl font-bold text-crimson">{stat.value}</p>
                <p className="text-xs uppercase tracking-wide text-ink-muted">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.div variants={fadeInUp} className="mt-8 flex flex-wrap gap-4">
            <motion.div {...tapScale}>
              <Link
                href="/admissions"
                className="inline-flex rounded-full bg-crimson px-6 py-3 font-semibold text-white transition hover:bg-crimson-600"
              >
                Begin Your Journey
              </Link>
            </motion.div>
            <motion.div {...tapScale}>
              <Link
                href="/campuses"
                className="inline-flex rounded-full border border-navy/20 px-6 py-3 font-semibold text-navy transition hover:bg-navy hover:text-white"
              >
                Explore Campuses
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
          className="relative aspect-[4/3] w-full overflow-hidden rounded-card bg-navy/10 shadow-2xl"
        >
          {/* Temporary: real TSU campus photo hotlinked from the live site.
              Swap for a Sanity-hosted asset once TSU provides/re-uploads
              preferred photography — see next.config.js note. */}
                    {/* Sourced from Sanity (Site Settings → Homepage Hero Image) once
              uploaded; falls back to a hotlinked TSU photo until then. */}
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            className="object-cover"
          />

          <motion.div
            variants={scaleIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
            className="absolute bottom-4 right-4 flex items-center gap-3 rounded-card bg-white/95 px-4 py-3 shadow-lg backdrop-blur"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-crimson/10 text-crimson">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-md font-bold text-navy">Fully Accredited</p>
              <p className="text-xs text-ink-muted">Nationally Recognized</p>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  )
}
