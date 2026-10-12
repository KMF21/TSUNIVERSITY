export type IndicatorStat = { value?: string; label: string }

export type FactsTableRow = { cells?: string[]; emphasis?: boolean }
export type FactsTableSection = {
  _type: 'factsTable'
  heading?: string
  intro?: string
  columns?: string[]
  rows?: FactsTableRow[]
  footerRow?: string[]
}

export type BarPanelBar = { label: string; percent?: number; displayValue?: string }
export type BarPanelSection = {
  _type: 'barPanel'
  heading?: string
  bars?: BarPanelBar[]
}

export type NoteSection = {
  _type: 'note'
  tone?: 'pending' | 'formula' | 'info'
  text?: string
  linkHref?: string
  linkLabel?: string
}

export type RichTextSection = {
  _type: 'richText'
  heading?: string
  body?: any
}

export type IndicatorSection = FactsTableSection | BarPanelSection | NoteSection | RichTextSection

export type IndicatorListItem = {
  _id: string
  title: string
  slug: string
  indicatorNumber?: number
  summary?: string
  stats?: IndicatorStat[]
}

export type IndicatorDetail = {
  title: string
  indicatorNumber?: number
  summary?: string
  stats?: IndicatorStat[]
  sections?: IndicatorSection[]
  sourceNotes?: string[]
  lastUpdatedNote?: string
}
