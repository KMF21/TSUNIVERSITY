import { notFound } from 'next/navigation'

import { PageBuilder } from '../../../../scripts/PageBuilder'

import { PAGE_BY_SLUG_QUERY, LEADERSHIP_QUERY, INSTITUTIONAL_FACTS_QUERY } from '@/sanity/queries'
import { sanityFetch } from '@/sanity/live'
import { LeadershipSection } from './LeadershipSection'
import { InstitutionalProfile, RankingsCallout } from './InstitutionalProfile'

export default async function Page() {
  const [page, leadership, facts] = await Promise.all([
    (await sanityFetch({ query: PAGE_BY_SLUG_QUERY, params: { slug: 'about' } })).data,
    (await sanityFetch({ query: LEADERSHIP_QUERY })).data,
    (await sanityFetch({ query: INSTITUTIONAL_FACTS_QUERY })).data,
  ])
  if (!page) notFound()

  return (
    <>
      <PageBuilder page={page} />
      <InstitutionalProfile facts={facts} />
      <LeadershipSection profiles={leadership} />
      <RankingsCallout />
    </>
  )
}
