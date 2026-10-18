import type { MetadataRoute } from 'next'
import { sanityFetch } from '@/sanity/live'
import { CONFERENCE_SITEMAP_QUERY } from '@/sanity/queries'
import { SITE_URL } from '@/lib/site'

const STATIC_ROUTES = [
  '',
  '/about',
  '/academic-calendar',
  '/academics',
  '/admissions',
  '/admissions/postgraduate',
  '/admissions/undergraduate',
  '/alumni',
  '/campuses',
  '/careers',
  '/conferences',
  '/contact',
  '/events',
  '/facts-and-figures',
  '/faq',
  '/giving',
  '/library',
  '/news',
  '/portals',
  '/privacy-policy',
  '/proceedings',
  '/rankings',
  '/research',
  '/staff-directory',
  '/student-life',
  '/tetfund',
]

type Entry = { slug: string; _updatedAt: string }

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = (await sanityFetch({ query: CONFERENCE_SITEMAP_QUERY })).data as { conferences?: Entry[]; proceedings?: Entry[] } | null

  return [
    ...STATIC_ROUTES.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...(data?.conferences ?? []).map((c) => ({ url: `${SITE_URL}/conferences/${c.slug}`, lastModified: c._updatedAt })),
    ...(data?.proceedings ?? []).map((p) => ({ url: `${SITE_URL}/conferences/${p.slug}/proceedings`, lastModified: p._updatedAt })),
  ]
}
