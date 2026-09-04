import { PageBuilder } from '@/components/ui/PageBuilder'
import { sanityFetch } from '@/sanity/live'
import { PAGE_BY_SLUG_QUERY } from '@/sanity/queries'
import { notFound } from 'next/navigation'

export default async function Page() {
  const page = (await sanityFetch({ query: PAGE_BY_SLUG_QUERY, params: { slug: 'research' } })).data
  if (!page) notFound()

  return <PageBuilder page={page} />
}
