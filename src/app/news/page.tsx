import { client } from '../../../sanity/client'
import { ALL_POSTS_QUERY } from '../../../sanity/queries'
import { Container } from '../../components/ui/Container'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { Card } from '../../components/ui/Card'

type Post = {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  mainImage?: any
  category: string
  publishedAt: string
}

export default async function NewsPage() {
  const posts: Post[] = await client.fetch(ALL_POSTS_QUERY)

  return (
    <Container className="py-16">
      <SectionHeading eyebrow="Stay Informed" title="Campus News" />
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card
            key={post._id}
            href={`/news/${post.slug.current}`}
            image={post.mainImage}
            eyebrow={post.category}
            title={post.title}
            excerpt={post.excerpt}
            meta={new Date(post.publishedAt).toLocaleDateString('en-NG', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          />
        ))}
      </div>
    </Container>
  )
}
