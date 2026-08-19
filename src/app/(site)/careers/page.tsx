import { PageBuilder } from '@/components/ui/PageBuilder'
import { client } from '@/sanity/client'
import { PAGE_BY_SLUG_QUERY } from '@/sanity/queries'
import { notFound } from 'next/navigation'


export default async function Page() {
  const page = await client.fetch(PAGE_BY_SLUG_QUERY, { slug: 'careers' })
  if (!page) notFound()

  return <PageBuilder page={page} />
}
