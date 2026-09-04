// src/lib/nav-links.ts
// Single source of truth for primary navigation — used by both the desktop
// nav in Header.tsx and the mobile drawer in MobileNav.tsx, so the two
// never drift out of sync.
export const NAV_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Academics', href: '/academics' },
  { label: 'Admissions', href: '/admissions' },
  // { label: 'Research', href: '/research' },
  { label: 'Campuses', href: '/campuses' },
  { label: 'Library', href: '/library' },
  { label: 'Portals', href: '/portals' },
  { label: 'News', href: '/news' },
  { label: 'TETFund', href: '/tetfund' },
  { label: 'Events', href: '/events' },
  { label: 'Alumni', href: '/alumni' },
  { label: 'Contact', href: '/contact' },
] as const
