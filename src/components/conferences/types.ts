import type { PortableTextProps } from 'next-sanity'

export type RichTextValue = PortableTextProps['value']

/** Shape of a Sanity image with the editor-supplied alt text. */
export type SanityImg = {
  asset?: { _ref?: string; _id?: string; url?: string }
  alt?: string
  hotspot?: unknown
  crop?: unknown
}

export type ConferenceMode = 'in-person' | 'virtual' | 'hybrid'
export type ConferenceStatus = 'upcoming' | 'ongoing' | 'past'
export type SessionType = 'keynote' | 'plenary' | 'parallel' | 'break' | 'social'

export type ImportantDate = { _key?: string; label: string; date: string; note?: string }

/** Fields shared by every place a conference is shown as a card or list row. */
export type ConferenceSummary = {
  _id: string
  title: string
  shortName?: string
  edition?: string
  year: number
  slug: string
  series?: string
  theme?: string
  startDate: string
  endDate: string
  timezone?: string
  mode?: ConferenceMode
  featured?: boolean
  heroImage?: SanityImg
  organiserName?: string
  organiserId?: string
  venueCity?: string
  venueName?: string
  importantDates?: ImportantDate[]
  hasProceedings?: boolean
}

export type Fee = { _key?: string; category: string; amount?: number; currency?: string; note?: string }
export type Session = {
  _key?: string
  startTime: string
  endTime?: string
  title: string
  type?: SessionType
  speaker?: string
  room?: string
}
export type ProgrammeDay = { _key?: string; date: string; label?: string; sessions?: Session[] }
export type Speaker = {
  _key?: string
  name: string
  title?: string
  affiliation?: string
  photo?: SanityImg
  bio?: string
  talkTitle?: string
}
export type CommitteeMember = { _key?: string; name: string; role?: string; affiliation?: string }
export type Committee = { _key?: string; committeeName: string; members?: CommitteeMember[] }
export type Sponsor = { _key?: string; name: string; logo?: SanityImg; url?: string }

export type ConferenceDetail = ConferenceSummary & {
  organiserOther?: string
  logo?: SanityImg
  subThemes?: string[]
  overview?: RichTextValue
  venue?: {
    name?: string
    address?: string
    city?: string
    mapEmbedUrl?: string
    latitude?: number
    longitude?: number
    directions?: RichTextValue
  }
  callForPapers?: RichTextValue
  submissionGuidelines?: RichTextValue
  submissionUrl?: string
  templateFileUrl?: string
  registration?: { fees?: Fee[]; instructions?: RichTextValue; registrationUrl?: string }
  programme?: ProgrammeDay[]
  programmePdfUrl?: string
  keynoteSpeakers?: Speaker[]
  committees?: Committee[]
  publication?: RichTextValue
  travelAndAccommodation?: RichTextValue
  sponsors?: Sponsor[]
  contact?: { email?: string; phone?: string; whatsapp?: string }
  gallery?: (SanityImg & { _key?: string })[]
  seo?: { metaTitle?: string; metaDescription?: string; ogImage?: SanityImg }
  proceedingsTitle?: string
  otherEditions?: Pick<ConferenceSummary, '_id' | 'title' | 'shortName' | 'edition' | 'year' | 'slug' | 'startDate' | 'endDate' | 'heroImage'>[]
}

export type Paper = {
  _key?: string
  title: string
  authors: string[]
  affiliations?: string
  abstract?: string
  pages?: string
  doi?: string
  keywords?: string[]
  pdfUrl?: string
}

export type ProceedingsDetail = {
  _id: string
  title: string
  slug: string
  year: number
  coverImage?: SanityImg
  isbn?: string
  issn?: string
  doi?: string
  publisher?: string
  editors?: string[]
  publishedDate?: string
  fullVolumeUrl?: string
  fullVolumeSize?: number
  papers?: Paper[]
  conference: {
    title: string
    shortName?: string
    edition?: string
    year: number
    slug: string
    startDate: string
    endDate: string
    theme?: string
    organiserName?: string
    venueCity?: string
  }
}

export type ProceedingsListItem = {
  _id: string
  title: string
  year: number
  coverImage?: SanityImg
  publisher?: string
  isbn?: string
  paperCount: number
  hasFullVolume: boolean
  conference: { title: string; shortName?: string; slug: string; organiserName?: string }
}
