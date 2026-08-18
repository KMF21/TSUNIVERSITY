// src/components/motion/AnimateOnScroll.tsx
// Generic scroll-reveal wrapper. Wrap any section, card, or block with this
// and it animates in once when it enters the viewport. Safe to use inside
// server components — this is a client component, but server-rendered
// children can be passed straight through as `children`.
'use client'

import { motion, Variants } from 'framer-motion'
import { fadeInUp } from '@/lib/motion-variants'

export function AnimateOnScroll({
  children,
  variants = fadeInUp,
  delay = 0,
  className,
  amount = 0.2,
}: {
  children: React.ReactNode
  variants?: Variants
  delay?: number
  className?: string
  /** How much of the element must be visible before animating. 0.2 = 20%. */
  amount?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
