import Image from 'next/image'
import { notFound } from 'next/navigation'
import { PortableText } from 'next-sanity'
import { FileDown } from 'lucide-react'
import { sanityFetch } from '@/sanity/live'
import { POST_BY_SLUG_QUERY } from '@/sanity/queries'
import { urlFor } from '@/sanity/image'
import { Container } from '@/components/ui/Container'

function formatFileSize(bytes?: number) {
  if (!bytes) return null
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`
}

type PostPageProps = {
  params: Promise<{
    slug: string
  }>
}

export default async function PostPage({
  params,
}: PostPageProps) {
  const { slug } = await params

  const post = (await sanityFetch({ query: POST_BY_SLUG_QUERY, params: {
    slug,
  } })).data

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
        <div className="relative mt-8 h-56 w-full overflow-hidden rounded-card bg-soft sm:h-72">
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

      {post.attachment?.url && (
        <a
          href={post.attachment.url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 flex items-center gap-4 rounded-card border border-black/10 bg-rose-tint/40 px-6 py-5 transition-colors hover:bg-rose-tint/60"
        >
          <FileDown className="h-8 w-8 shrink-0 text-crimson" />
          <div>
            <p className="font-semibold text-navy">
              {post.attachmentLabel || 'Download attachment (PDF)'}
            </p>
            <p className="text-sm text-ink-muted">
              {post.attachment.originalFilename}
              {formatFileSize(post.attachment.size) ? ` · ${formatFileSize(post.attachment.size)}` : ''}
            </p>
          </div>
        </a>
      )}
    </Container>
  )
}