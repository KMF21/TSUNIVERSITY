import { notFound } from 'next/navigation'

import { PageBuilder } from '@/components/ui/PageBuilder'

import { PAGE_BY_SLUG_QUERY, LEADERSHIP_QUERY } from '@/sanity/queries'
import { client } from '@/sanity/client'
import { LeadershipSection } from './LeadershipSection'

export default async function Page() {
  const [page, leadership] = await Promise.all([
    client.fetch(PAGE_BY_SLUG_QUERY, { slug: 'about' }),
    client.fetch(LEADERSHIP_QUERY),
  ])
  if (!page) notFound()

  return (
    <>
      <PageBuilder page={page} />
      <LeadershipSection profiles={leadership} />
    </>
  )
}