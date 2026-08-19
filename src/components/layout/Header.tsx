'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { TopBar } from './TopBar'
import { MobileNav } from './MobileNav'
import { Container } from '../ui/Container'
import { NAV_LINKS } from '@/lib/nav-links'
import { slideInDown, tapScale } from '@/lib/motion-variants'
import logo from "../../app/assets/tsu_logo1.png";

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
              src={logo}
              width={36}
              height={36}
              alt="Taraba State University"
            />
              <p className="text-white text-lg font-semibold visible lg:hidden ">Taraba State University</p>
       
          </Link>
        

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative text-md font-medium text-white/85 transition hover:text-white group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-crimson transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          <motion.div {...tapScale} className="hidden lg:block">
            <Link
              href="/admissions"
              className="inline-flex items-center rounded-full bg-crimson px-5 py-2.5 text-md font-semibold text-white transition hover:bg-crimson-600"
            >
              Apply Now
            </Link>
          </motion.div>

          <MobileNav />
        </Container>
      </div>
    </motion.header>
  )
}
