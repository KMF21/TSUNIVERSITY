// src/lib/motion-variants.ts
// Central animation vocabulary. Import these into any component instead of
// hand-writing transition objects, so easing/duration/distance stay
// consistent across the whole site.

import { Variants } from 'framer-motion'

/** Soft, confident deceleration curve used everywhere instead of the default. */
export const EASE = [0.22, 1, 0.36, 1] as const

/** Fade + rise — the default for headings, cards, and section intros. */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE },
  },
}

/** Plain fade — for things that shouldn't shift position (overlays, backdrops). */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: EASE } },
}

/** Scale + fade — good for cards, badges, dropdown panels. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.35, ease: EASE },
  },
}

/** Slide in from the right — used for the mobile nav drawer. */
export const slideInRight: Variants = {
  hidden: { x: '100%' },
  visible: { x: 0, transition: { duration: 0.35, ease: EASE } },
  exit: { x: '100%', transition: { duration: 0.3, ease: EASE } },
}

/** Slide down from top — sticky header on mount, desktop dropdown-style reveals. */
export const slideInDown: Variants = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25, ease: EASE } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.15, ease: EASE } },
}

/**
 * Stagger container — wrap a list of children (nav links, grid cards) in a
 * motion.div using this, give each child `fadeInUp`, and they animate in
 * one after another automatically.
 */
export const staggerContainer = (staggerDelay = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.05,
    },
  },
})

/** Shared hover/tap spec for buttons and CTAs — subtle, not bouncy. */
export const tapScale = {
  whileHover: { scale: 1.03 },
  whileTap: { scale: 0.97 },
  transition: { duration: 0.15, ease: EASE },
}
