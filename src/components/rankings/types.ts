export type Stat = { value: string; label: string; note?: string }
export type FactRow = { label: string; value: string }

export type Ranking = {
  source: string
  metric: string
  position: string
  edition?: string
  asOf?: string
  note?: string
  url?: string
}

export type Highlight = { title: string; text: string }
export type Strength = { title: string; description?: string; linkLabel?: string; linkUrl?: string }
export type AwardLink = { label: string; url: string }
export type Award = { date: string; title: string; description?: string; links?: AwardLink[] }
export type Scholar = {
  name: string
  role?: string
  summary?: string
  photo?: any
  linkLabel?: string
  linkUrl?: string
}
export type SourceNote = { label: string; detail: string; url?: string }

export type RankingsPageData = {
  title: string
  heroHeading?: string
  heroSubheading?: string
  rankingsIntro?: string
  rankings?: Ranking[]
  rankingsMethodNote?: string
  highlights?: Highlight[]
  strengthsIntro?: string
  researchStrengths?: Strength[]
  awardsIntro?: string
  awards?: Award[]
  scholarsIntro?: string
  scholars?: Scholar[]
  sources?: SourceNote[]
  lastUpdatedNote?: string
}

export type InstitutionalFactsData = {
  stats?: Stat[]
  keyFacts?: FactRow[]
  studentCommunity?: FactRow[]
  studentCommunityNote?: string
} | null
