// schema.org structured data for conferences (Event) and proceedings
// (Book + ScholarlyArticle). Returned as plain objects; <JsonLd> serialises.
import { SITE_URL } from './site'
import type { ConferenceDetail, ProceedingsDetail } from '@/components/conferences/types'
import { imageUrl, hasImage } from '@/components/conferences/image'

const ATTENDANCE = {
  'in-person': 'https://schema.org/OfflineEventAttendanceMode',
  virtual: 'https://schema.org/OnlineEventAttendanceMode',
  hybrid: 'https://schema.org/MixedEventAttendanceMode',
} as const

export function conferenceUrl(slug: string) {
  return `${SITE_URL}/conferences/${slug}`
}

export function conferenceJsonLd(c: ConferenceDetail) {
  const mode = c.mode ?? 'in-person'
  const place = {
    '@type': 'Place',
    name: c.venue?.name || 'Taraba State University',
    address: {
      '@type': 'PostalAddress',
      streetAddress: c.venue?.address,
      addressLocality: c.venue?.city || 'Jalingo',
      addressRegion: 'Taraba State',
      addressCountry: 'NG',
    },
  }
  const location =
    mode === 'virtual'
      ? { '@type': 'VirtualLocation', url: conferenceUrl(c.slug) }
      : mode === 'hybrid'
        ? [place, { '@type': 'VirtualLocation', url: conferenceUrl(c.slug) }]
        : place

  const image = hasImage(c.seo?.ogImage) ? c.seo!.ogImage! : hasImage(c.heroImage) ? c.heroImage! : undefined

  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: [c.edition, c.title].filter(Boolean).join(' '),
    description: c.seo?.metaDescription || c.theme,
    startDate: c.startDate,
    endDate: c.endDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: ATTENDANCE[mode],
    location,
    image: image ? [imageUrl(image, 1200, 630)] : undefined,
    organizer: {
      '@type': 'CollegeOrUniversity',
      name: c.organiserName ? `${c.organiserName}, Taraba State University` : 'Taraba State University',
      url: SITE_URL,
    },
    offers: c.registration?.registrationUrl
      ? { '@type': 'Offer', url: c.registration.registrationUrl, availability: 'https://schema.org/InStock' }
      : undefined,
    url: conferenceUrl(c.slug),
  }
}

export function proceedingsJsonLd(p: ProceedingsDetail) {
  const url = `${conferenceUrl(p.conference.slug)}/proceedings`
  return {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: p.title,
    url,
    isbn: p.isbn,
    datePublished: p.publishedDate || String(p.year),
    publisher: p.publisher ? { '@type': 'Organization', name: p.publisher } : undefined,
    editor: p.editors?.map((name) => ({ '@type': 'Person', name })),
    image: hasImage(p.coverImage) ? imageUrl(p.coverImage, 800) : undefined,
    about: p.conference.theme,
    inLanguage: 'en',
    isPartOf: { '@type': 'Event', name: p.conference.title, url: conferenceUrl(p.conference.slug) },
    hasPart: p.papers?.slice(0, 300).map((paper) => ({
      '@type': 'ScholarlyArticle',
      headline: paper.title,
      author: paper.authors.map((name) => ({ '@type': 'Person', name })),
      pagination: paper.pages,
      keywords: paper.keywords?.join(', '),
      identifier: paper.doi,
      isPartOf: { '@type': 'Book', name: p.title, url },
    })),
  }
}
