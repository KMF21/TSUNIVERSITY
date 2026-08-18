// src/components/motion/MotionProvider.tsx
// Wraps the app so every Framer Motion animation automatically respects the
// user's OS-level "reduce motion" preference — no per-component checks needed.
'use client'

import { MotionConfig } from 'framer-motion'

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}
