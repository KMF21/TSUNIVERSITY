// src/components/motion/PageTransition.tsx
// Wraps {children} in the root layout so every route change fades/rises in
// smoothly instead of hard-cutting between pages.
'use client'

import { motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { EASE } from '@/lib/motion-variants'

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
