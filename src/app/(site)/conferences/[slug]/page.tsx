import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BookOpen, FileDown, Mail, MessageCircle, Phone } from 'lucide-react'
import { Container } from '@/components/ui/Container'
import { sanityFetch } from '@/sanity/live'
import { CONFERENCE_BY_SLUG_QUERY } from '@/sanity/queries'
import { getConferenceStatus, formatDateRange, DEFAULT_TIMEZONE } from '@/lib/conferences'
import { conferenceJsonLd, conferenceUrl } from '@/lib/conference-jsonld'
import { ConferenceHero } from '@/components/conferences/ConferenceHero'
import { SectionNav, type NavSection } from '@/components/conferences/SectionNav'
import { SectionBlock } from '@/components/conferences/SectionBlock'
import { ImportantDates } from '@/components/conferences/ImportantDates'
import { RegistrationTable } from '@/components/conferences/RegistrationTable'
import { Programme } from '@/components/conferences/Programme'
import { SpeakerCards } from '@/components/conferences/SpeakerCards'
import { Committees } from '@/components/conferences/Committees'
import { VenueMap } from '@/components/conferences/VenueMap'
import { OtherEditions } from '@/components/conferences/OtherEditions'
import { ExternalLink } from '@/components/conferences/ExternalLink'
import { RichText, hasRichText } from '@/components/conferences/RichText'
import { JsonLd } from '@/components/conferences/JsonLd'
import { hasImage, imageUrl } from '@/components/conferences/image'
import type { ConferenceDetail } from '@/components/conferences/types'

type Props = { params: Promise<{ slug: string }> }

async function getConference(slug: string) {
  return ((await sanityFetch({ query: CONFERENCE_BY_SLUG_QUERY, params: { slug } })).data as ConferenceDetail | null) ?? null
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const c = await getConference(slug)
  if (!c) return { title: 'Conference not found' }
  const name = c.shortName ? `${c.shortName} — ${c.title}` : c.title
  const title = c.seo?.metaTitle || name
  const description =
    c.seo?.metaDescription ||
    [c.theme, `${formatDateRange(c.startDate, c.endDate, c.timezone || DEFAULT_TIMEZONE)}`, c.venueCity || c.venueName, c.organiserName && `Organised by ${c.organiserName}`]
      .filter(Boolean)
      .join(' · ')
  const ogSource = hasImage(c.seo?.ogImage) ? c.seo?.ogImage : hasImage(c.heroImage) ? c.heroImage : undefined
  const images = ogSource ? [{ url: imageUrl(ogSource, 1200, 630), width: 1200, height: 630, alt: ogSource.alt || name }] : undefined
  const canonical = `/conferences/${c.slug}`
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonical, type: 'website', images },
    twitter: { card: images ? 'summary_large_image' : 'summary', title, description, images: images?.map((i) => i.url) },
  }
}

export default async function ConferencePage({ params }: Props) {
  const { slug } = await params
  const c = await getConference(slug)
  if (!c) notFound()

  const now = new Date()
  const tz = c.timezone || DEFAULT_TIMEZONE
  const status = getConferenceStatus(c.startDate, c.endDate, now)

  const hasOverview = hasRichText(c.overview) || (c.subThemes?.length ?? 0) > 0
  const hasCfp = hasRichText(c.callForPapers) || hasRichText(c.submissionGuidelines) || Boolean(c.templateFileUrl) || Boolean(c.submissionUrl)
  const hasDates = (c.importantDates?.length ?? 0) > 0
  const hasRegistration = Boolean(c.registration && ((c.registration.fees?.length ?? 0) > 0 || hasRichText(c.registration.instructions) || c.registration.registrationUrl))
  const programme = (c.programme ?? []).filter((d) => d.date)
  const hasProgramme = programme.length > 0 || Boolean(c.programmePdfUrl)
  const hasSpeakers = (c.keynoteSpeakers?.length ?? 0) > 0
  const hasCommittees = (c.committees ?? []).some((x) => (x.members?.length ?? 0) > 0)
  const hasVenue = Boolean(c.venue?.name || c.venue?.address) || hasRichText(c.travelAndAccommodation)
  const hasPublication = hasRichText(c.publication) || Boolean(c.proceedingsTitle)
  const hasContact = Boolean(c.contact?.email || c.contact?.phone || c.contact?.whatsapp)
  const sponsors = c.sponsors ?? []
  const gallery = (c.gallery ?? []).filter((g) => hasImage(g))
  const editions = c.otherEditions ?? []

  const sections: NavSection[] = (
    [
      [hasOverview, 'overview', 'Overview'],
      [hasCfp, 'call-for-papers', 'Call for Papers'],
      [hasDates, 'important-dates', 'Important Dates'],
      [hasRegistration, 'registration', 'Registration'],
      [hasProgramme, 'programme', 'Programme'],
      [hasSpeakers, 'speakers', 'Speakers'],
      [hasCommittees, 'committees', 'Committees'],
      [hasVenue, 'venue', 'Venue & Travel'],
      [hasPublication, 'publication', 'Publication'],
      [hasContact, 'contact', 'Contact'],
    ] as const
  )
    .filter(([show]) => show)
    .map(([, id, label]) => ({ id, label }))

  const url = conferenceUrl(c.slug)

  return (
    <>
      <JsonLd data={conferenceJsonLd(c)} />
      <ConferenceHero conference={c} status={status} now={now} url={url} />
      <SectionNav sections={sections} />

      <Container className="py-12 sm:py-16">
        {sections.length === 0 && (
          <p className="rounded-card bg-navy-50 p-8 text-center text-ink-muted">
            Full details for this conference will be published here soon. Please check back shortly.
          </p>
        )}

        {hasOverview && (
          <SectionBlock id="overview" title="About the conference">
            <RichText value={c.overview} />
            {(c.subThemes?.length ?? 0) > 0 && (
              <div className="mt-8">
                <h3 className="font-display text-lg font-semibold text-navy">Sub-themes</h3>
                <ul className="mt-3 grid gap-x-8 gap-y-2 sm:grid-cols-2">
                  {c.subThemes?.map((t, i) => (
                    <li key={`${i}-${t}`} className="flex gap-3 text-base text-ink">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson" />
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </SectionBlock>
        )}

        {hasCfp && (
          <SectionBlock id="call-for-papers" title="Call for papers">
            <RichText value={c.callForPapers} />
            {hasRichText(c.submissionGuidelines) && (
              <div className="mt-8">
                <h3 className="font-display text-lg font-semibold text-navy">Submission guidelines</h3>
                <RichText value={c.submissionGuidelines} className="mt-3" />
              </div>
            )}
            <div className="mt-8 flex flex-wrap gap-3">
              {c.submissionUrl && status !== 'past' && (
                <ExternalLink href={c.submissionUrl} className="inline-flex min-h-[48px] items-center rounded-full bg-crimson px-7 font-semibold text-white transition hover:bg-crimson-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson focus-visible:ring-offset-2">
                  Submit your paper
                </ExternalLink>
              )}
              {c.templateFileUrl && (
                <a href={c.templateFileUrl} download className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-navy/20 px-6 font-semibold text-navy hover:bg-navy-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson">
                  <FileDown aria-hidden="true" className="h-4 w-4" />
                  Download paper template
                </a>
              )}
            </div>
          </SectionBlock>
        )}

        {hasDates && (
          <SectionBlock id="important-dates" title="Important dates">
            <ImportantDates dates={c.importantDates ?? []} timeZone={tz} slug={c.slug} now={now} />
          </SectionBlock>
        )}

        {hasRegistration && c.registration && (
          <SectionBlock id="registration" title="Registration">
            <RegistrationTable registration={c.registration} />
          </SectionBlock>
        )}

        {hasProgramme && (
          <SectionBlock id="programme" title="Programme">
            {programme.length > 0 ? (
              <Programme days={programme} timeZone={tz} pdfUrl={c.programmePdfUrl} />
            ) : (
              <ExternalLink href={c.programmePdfUrl as string} className="font-semibold text-crimson underline">
                Download the programme (PDF)
              </ExternalLink>
            )}
          </SectionBlock>
        )}

        {hasSpeakers && (
          <SectionBlock id="speakers" title="Keynote speakers">
            <SpeakerCards speakers={c.keynoteSpeakers ?? []} />
          </SectionBlock>
        )}

        {hasCommittees && (
          <SectionBlock id="committees" title="Committees">
            <Committees committees={c.committees ?? []} />
          </SectionBlock>
        )}

        {hasVenue && (
          <SectionBlock id="venue" title="Venue & travel">
            {c.venue && (c.venue.name || c.venue.address) && <VenueMap venue={c.venue} title={c.title} />}
            {hasRichText(c.travelAndAccommodation) && (
              <div className="mt-8">
                <h3 className="font-display text-lg font-semibold text-navy">Travel &amp; accommodation</h3>
                <RichText value={c.travelAndAccommodation} className="mt-3" />
              </div>
            )}
          </SectionBlock>
        )}

        {hasPublication && (
          <SectionBlock id="publication" title="Publication">
            <RichText value={c.publication} />
            {c.proceedingsTitle && (
              <Link
                href={`/conferences/${c.slug}/proceedings`}
                className="mt-6 inline-flex min-h-[48px] items-center gap-2 rounded-card border border-navy/15 bg-navy-50 px-5 font-semibold text-navy hover:bg-navy/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
              >
                <BookOpen aria-hidden="true" className="h-5 w-5 text-crimson" />
                {c.proceedingsTitle}
              </Link>
            )}
          </SectionBlock>
        )}

        {hasContact && c.contact && (
          <SectionBlock id="contact" title="Contact the organisers">
            <ul className="flex flex-col gap-2">
              {c.contact.email && (
                <li>
                  <a href={`mailto:${c.contact.email}`} className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-crimson hover:text-crimson-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson">
                    <Mail aria-hidden="true" className="h-5 w-5" />
                    {c.contact.email}
                  </a>
                </li>
              )}
              {c.contact.phone && (
                <li>
                  <a href={`tel:${c.contact.phone.replace(/[^\d+]/g, '')}`} className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-crimson hover:text-crimson-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson">
                    <Phone aria-hidden="true" className="h-5 w-5" />
                    {c.contact.phone}
                  </a>
                </li>
              )}
              {c.contact.whatsapp && (
                <li>
                  <a
                    href={`https://wa.me/${c.contact.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center gap-2 font-semibold text-crimson hover:text-crimson-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
                  >
                    <MessageCircle aria-hidden="true" className="h-5 w-5" />
                    WhatsApp {c.contact.whatsapp}
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              )}
            </ul>
          </SectionBlock>
        )}

        {sponsors.length > 0 && (
          <SectionBlock id="sponsors" title="Sponsors & partners">
            <ul className="flex flex-wrap items-center gap-8">
              {sponsors.map((s) => {
                const logo = hasImage(s.logo) ? (
                  <Image src={imageUrl(s.logo, 320)} alt={s.logo.alt || s.name} width={160} height={80} className="h-16 w-auto object-contain" />
                ) : (
                  <span className="font-semibold text-navy">{s.name}</span>
                )
                return (
                  <li key={s._key ?? s.name}>
                    {s.url ? (
                      <ExternalLink href={s.url} showIcon={false} className="flex min-h-[44px] items-center">
                        {logo}
                      </ExternalLink>
                    ) : (
                      logo
                    )}
                  </li>
                )
              })}
            </ul>
          </SectionBlock>
        )}

        {gallery.length > 0 && (
          <SectionBlock id="gallery" title="Gallery">
            <ul className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {gallery.map((g, i) => (
                <li key={g._key ?? i} className="relative aspect-[4/3] overflow-hidden rounded-card">
                  <Image src={imageUrl(g, 640, 480)} alt={g.alt || ''} fill sizes="(min-width: 768px) 33vw, 50vw" loading="lazy" className="object-cover" />
                </li>
              ))}
            </ul>
          </SectionBlock>
        )}

        {editions.length > 0 && (
          <SectionBlock id="editions" title={`Other editions of ${c.series}`}>
            <OtherEditions editions={editions} />
          </SectionBlock>
        )}
      </Container>
    </>
  )
}
