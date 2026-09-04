import { notFound } from 'next/navigation'

import { PageBuilder } from '@/components/ui/PageBuilder'

import { PAGE_BY_SLUG_QUERY, LEADERSHIP_QUERY } from '@/sanity/queries'
import { sanityFetch } from '@/sanity/live'
import { LeadershipSection } from './LeadershipSection'

export default async function Page() {
  const [page, leadership] = await Promise.all([
    (await sanityFetch({ query: PAGE_BY_SLUG_QUERY, params: { slug: 'about' } })).data,
    (await sanityFetch({ query: LEADERSHIP_QUERY })).data,
  ])
  if (!page) notFound()

  return (
    <>
      <PageBuilder page={page} />
      <LeadershipSection profiles={leadership} />
    </>
  )
}