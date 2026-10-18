import { sanityFetch } from '@/sanity/live'
import { CONFERENCE_BY_SLUG_QUERY } from '@/sanity/queries'
import { buildIcs, DEFAULT_TIMEZONE } from '@/lib/conferences'
import { conferenceUrl } from '@/lib/conference-jsonld'
import type { ConferenceDetail } from '@/components/conferences/types'

type Ctx = { params: Promise<{ slug: string }> }

/**
 * Calendar download. With ?date=<key|YYYY-MM-DD> it returns that single
 * deadline as an all-day event; without it, the conference itself.
 */
export async function GET(request: Request, { params }: Ctx) {
  const { slug } = await params
  const c = ((await sanityFetch({ query: CONFERENCE_BY_SLUG_QUERY, params: { slug } })).data as ConferenceDetail | null) ?? null
  if (!c) return new Response('Conference not found', { status: 404 })

  const name = c.shortName || c.title
  const location = [c.venue?.name, c.venue?.address, c.venue?.city].filter(Boolean).join(', ') || undefined
  const url = conferenceUrl(c.slug)
  const wanted = new URL(request.url).searchParams.get('date')

  let body: string
  let filename = `${c.slug}.ics`
  if (wanted) {
    const milestone = (c.importantDates ?? []).find((d) => d._key === wanted || d.date === wanted)
    if (!milestone) return new Response('Date not found', { status: 404 })
    body = buildIcs({
      uid: `${c._id}-${milestone._key ?? milestone.date}@tsuniversity.edu.ng`,
      title: `${milestone.label} — ${name}`,
      description: [milestone.note, c.title, `Deadline: end of day, ${c.timezone || DEFAULT_TIMEZONE}`].filter(Boolean).join('\n'),
      url,
      allDay: milestone.date,
    })
    filename = `${c.slug}-${milestone.label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.ics`
  } else {
    body = buildIcs({
      uid: `${c._id}@tsuniversity.edu.ng`,
      title: c.title,
      description: c.theme,
      url,
      location,
      allDay: c.startDate,
      lastDay: c.endDate,
    })
  }

  return new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
