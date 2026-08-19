'use client'

import { Mail, Facebook, Instagram, Linkedin, Youtube, Twitter } from 'lucide-react'
import { motion } from 'framer-motion'
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/motion-variants'

// TODO: swap in TSU's official social handles once provided — these are
// placeholders so the bar renders correctly ahead of real links.
const SOCIAL_LINKS = [
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
]

export function TopBar() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className=" bg-navy-900 text-white/90 lg:block"
    >
      <div className="mx-auto flex h-10 w-full max-w-7xl items-center justify-center lg:justify-between px-6 text-md lg:px-8">
        <motion.a
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          href="mailto:registrar@tsuniversity.edu.ng"
          className="hidden lg:flex items-center gap-2 transition hover:text-white"
        >
          <Mail className="h-3.5 w-3.5" />
          <span>registrar@tsuniversity.edu.ng</span>
        </motion.a>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.06)}
          className="flex items-center gap-4"
        >
          {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              variants={fadeInUp}
              whileHover={{ y: -2, scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="text-white/70 transition hover:text-white"
            >
              <Icon className="h-3.5 w-3.5" />
            </motion.a>
          ))}
        </motion.div>
      </div>
    </motion.div>
  )
}
