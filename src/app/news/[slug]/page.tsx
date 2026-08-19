import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText } from 'next-sanity'
import { client } from '../../../../sanity/client'
import { POST_BY_SLUG_QUERY } from '../../../../sanity/queries'
import { urlFor } from '../../../../sanity/image'
import { Container } from '../../../components/ui/Container'

type PostPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function PostPage({
  params,
}: PostPageProps) {
  const { slug } = await params

  const post = await client.fetch(POST_BY_SLUG_QUERY, {
    slug,
  })

  if (!post) {
    notFound()
  }

  return (
    <Container className="max-w-3xl py-16">
      <span className="text-md font-semibold uppercase text-crimson">
        {post.category}
      </span>

      <h1 className="mt-2 font-display text-3xl font-bold text-navy sm:text-4xl">
        {post.title}
      </h1>

      <p className="mt-3 text-md text-ink-muted">
        {post.authorName ? `${post.authorName} · ` : ''}
        {new Date(post.publishedAt).toLocaleDateString('en-NG', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>

      {post.mainImage && (
        <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-card">
          <Image
            src={urlFor(post.mainImage).width(1200).url()}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="prose prose-neutral mt-8 max-w-none">
        <PortableText value={post.body} />
      </div>
    </Container>
  )
}