'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Academics', href: '/academics' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'Research', href: '/research' },
  { label: 'Campuses', href: '/campuses' },
  { label: 'Library', href: '/library' },
  { label: 'Portals', href: '/portals' },
  { label: 'News', href: '/news' },
  { label: 'Events', href: '/events' },
  { label: 'Alumni', href: '/alumni' },
  { label: 'Contact', href: '/contact' },
]

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
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <span className="h-0.5 w-6 bg-white" />
        <span className="h-0.5 w-6 bg-white" />
        <span className="h-0.5 w-6 bg-white" />
      </button>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-navy-900/60 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer */}
      <nav
        className={`fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] transform bg-navy text-white shadow-xl transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-white/10 p-6">
          <span className="font-display text-lg font-bold">Menu</span>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="flex h-10 w-10 items-center justify-center text-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            ×
          </button>
        </div>
        <ul className="flex flex-col gap-1 p-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 text-base font-medium text-white/90 transition hover:bg-white/10"
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className="pt-4">
            <Link
              href="/admissions"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-crimson px-5 py-3 text-center font-semibold text-white transition hover:bg-crimson-600"
            >
              Apply Now
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
