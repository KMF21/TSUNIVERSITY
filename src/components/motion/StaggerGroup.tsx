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
      viewport={{ once: true, amount: 0.15 }}
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
