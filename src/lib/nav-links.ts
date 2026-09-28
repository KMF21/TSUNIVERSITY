// src/lib/nav-links.ts
// Single source of truth for primary navigation — used by both the desktop
// nav in Header.tsx and the mobile drawer in MobileNav.tsx, so the two
// never drift out of sync.
//
// A NavItem is either a direct link, or a group with a dropdown (desktop)
// / expandable section (mobile). Kept flat at 6 top-level links + 2 groups
// so the header doesn't get overcrowded as more sections get added.
export type NavItem =
  | { label: string; href: string }
  | { label: string; children: { label: string; href: string }[] }

export const NAV_LINKS: NavItem[] = [
  {
    label: 'About',
    children: [
      { label: 'About TSU', href: '/about' },
      { label: 'Rankings & Recognition', href: '/rankings' },
    ],
  },
  { label: 'Academics', href: '/academics' },
  { label: 'Admissions', href: '/admissions' },
  { label: 'News', href: '/news' },
  { label: 'Events', href: '/events' },
  {
    label: 'Campus Life',
    children: [
      { label: 'Student Life', href: '/student-life' },
      { label: 'Alumni', href: '/alumni' },
      { label: 'Campuses', href: '/campuses' },
    ],
  },
  {
    label: 'Resources',
    children: [
      { label: 'Academic Calendar', href: '/academic-calendar' },
      { label: 'Library', href: '/library' },
      { label: 'Portals', href: '/portals' },
      { label: 'TETFund', href: '/tetfund' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Staff Directory', href: '/staff-directory' },
    ],
  },
  { label: 'Contact', href: '/contact' },
]
