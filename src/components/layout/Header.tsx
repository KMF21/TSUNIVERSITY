'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { ChevronDown, Search } from 'lucide-react'
import { TopBar } from './TopBar'
import { MobileNav } from './MobileNav'
import { Container } from '../ui/Container'
import { NAV_LINKS } from '@/lib/nav-links'
import { slideInDown, tapScale } from '@/lib/motion-variants'

export function Header() {
  return (
    <motion.header initial="hidden" animate="visible" variants={slideInDown} className="sticky top-0 z-50">
      <TopBar />

      <div className="bg-navy">
        <Container className="flex h-20 items-center justify-between">
          <Link
           className="flex items-center gap-3"
           href="/">
            <Image
              src="/assets/tsu_logo1.png"
              width={36}
              height={36}
              alt="Taraba State University"
            />
              <p className="text-white text-lg font-semibold visible lg:hidden ">Taraba State University</p>
       
          </Link>
        

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) =>
              'href' in link ? (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative text-md font-medium text-white/85 transition hover:text-white group"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-crimson transition-all duration-300 group-hover:w-full" />
                </Link>
              ) : (
                <div key={link.label} className="group relative">
                  <button
                    className="flex items-center gap-1 text-md font-medium text-white/85 transition hover:text-white"
                    aria-haspopup="true"
                  >
                    {link.label}
                    <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
                  </button>
                  {/* Invisible bridge closes the hover gap between trigger and panel */}
                  <div className="absolute left-0 top-full h-3 w-full" />
                  <div className="invisible absolute left-0 top-full w-56 rounded-card border border-black/5 bg-white p-2 opacity-0 shadow-lg transition group-hover:visible group-hover:opacity-100">
                    {link.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-lg px-3 py-2 text-md font-medium text-navy transition hover:bg-rose-tint hover:text-crimson"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            )}
          </nav>

          <div className="hidden items-center gap-4 lg:flex">
            <Link
              href="/search"
              aria-label="Search"
              className="flex h-9 w-9 items-center justify-center rounded-full text-white/85 transition hover:bg-white/10 hover:text-white"
            >
              <Search className="h-5 w-5" />
            </Link>

            <motion.div {...tapScale}>
              <Link
                href="/admissions"
                className="inline-flex items-center rounded-full bg-crimson px-5 py-2.5 text-md font-semibold text-white transition hover:bg-crimson-600"
              >
                Apply Now
              </Link>
            </motion.div>
          </div>

          <MobileNav />
        </Container>
      </div>
    </motion.header>
  )
}
