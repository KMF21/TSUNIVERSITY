import { notFound } from 'next/navigation'
import { client } from '../../../sanity/client'
import { PAGE_BY_SLUG_QUERY } from '../../../sanity/queries'
import { PageBuilder } from '../../components/ui/PageBuilder'

export default async function Page() {
  const page = await client.fetch(PAGE_BY_SLUG_QUERY, { slug: 'library' })
  if (!page) notFound()

  return <PageBuilder page={page} />
}
