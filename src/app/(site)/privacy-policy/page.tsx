import { notFound } from 'next/navigation'
import { PageBuilder } from '@/components/ui/PageBuilder'
import { sanityFetch } from '@/sanity/live'
import { PAGE_BY_SLUG_QUERY } from '@/sanity/queries'

export default async function PrivacyPolicyPage() {
  const page = (await sanityFetch({ query: PAGE_BY_SLUG_QUERY, params: { slug: 'privacy-policy' } })).data
  if (!page) notFound()

  return <PageBuilder page={page} />
}
