// src/components/motion/StaggerGroup.tsx
// Wrap a grid or list (faculty cards, news cards, event cards, portal
// links) with <StaggerGroup>, wrap each item with <StaggerItem>, and they
// cascade in one after another on scroll instead of popping in at once.
// Safe to use inside async server components — pass server-rendered
// elements as children.
'use client'

import { motion } from 'framer-motion'
import { fadeInUp, staggerContainer } from '@/lib/motion-variants'

export function StaggerGroup({
  children,
  className,
  staggerDelay = 0.08,
}: {
  children: React.ReactNode
  className?: string
  staggerDelay?: number
}) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      // Start as soon as any part of the group is on screen. A fractional
      // threshold (e.g. 0.15) can never be met by a tall single-column list
      // on a phone — the screen is shorter than 15% of the group — which left
      // every item stuck at opacity 0 (invisible but still clickable).
      viewport={{ once: true, amount: 'some' }}
      variants={staggerContainer(staggerDelay)}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <motion.div variants={fadeInUp} className={className}>
      {children}
    </motion.div>
  )
}
