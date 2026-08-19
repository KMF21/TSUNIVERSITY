import { notFound } from 'next/navigation'

import { PageBuilder } from '@/components/ui/PageBuilder'
import { PAGE_BY_SLUG_QUERY } from '@/sanity/queries'
import { client } from '@/sanity/client'


export default async function Page() {
  const page = await client.fetch(PAGE_BY_SLUG_QUERY, { slug: 'about' })
  if (!page) notFound()

  return <PageBuilder page={page} />
}
