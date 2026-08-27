'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { fadeIn, slideInRight, staggerContainer, fadeInUp, tapScale } from '@/lib/motion-variants'
import { NAV_LINKS } from '@/lib/nav-links'

export function MobileNav() {
  const [open, setOpen] = useState(false)

  // Lock background scroll while the drawer is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <div className="lg:hidden">
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <Menu className="h-6 w-6 text-white" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeIn}
              className="fixed inset-0 z-40 bg-navy-900/60"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Drawer */}
            <motion.nav
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={slideInRight}
              className="fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-navy text-white shadow-xl"
              aria-hidden={!open}
            >
              <div className="flex items-center justify-between border-b border-white/10 p-6">
                <span className="font-display text-lg font-bold">Menu</span>
                <motion.button
                  whileTap={{ scale: 0.9, rotate: 90 }}
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-10 w-10 items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>

              <motion.ul
                initial="hidden"
                animate="visible"
                variants={staggerContainer(0.05)}
                className="flex flex-col gap-1 p-6"
              >
                {NAV_LINKS.map((link) => (
                  <motion.li key={link.href} variants={fadeInUp}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-lg px-3 py-3 text-base font-medium text-white/90 transition hover:bg-white/10"
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
                <motion.li variants={fadeInUp} className="pt-4">
                  <motion.div {...tapScale}>
                    <Link
                      href="https://apply.tsuniversity.edu.ng/apply"
                      onClick={() => setOpen(false)}
                      className="block rounded-full bg-crimson px-5 py-3 text-center font-semibold text-white transition hover:bg-crimson-600"
                    >
                      Apply Now
                    </Link>
                  </motion.div>
                </motion.li>
              </motion.ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
