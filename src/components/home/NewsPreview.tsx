import Link from 'next/link'
import { client } from '../../../sanity/client'
import { FEATURED_POSTS_QUERY } from '../../../sanity/queries'
import { Container } from '../ui/Container'
import { SectionHeading } from '../ui/SectionHeading'
import { Card } from '../ui/Card'
import { AnimateOnScroll } from '../motion/AnimateOnScroll'
import { StaggerGroup, StaggerItem } from '../motion/StaggerGroup'

type Post = {
  _id: string
  title: string
  slug: { current: string }
  excerpt?: string
  mainImage?: any
  category: string
  publishedAt: string
  authorName?: string
}

export async function NewsPreview() {
  const posts: Post[] = await client.fetch(FEATURED_POSTS_QUERY)

  return (
    <section className="py-16">
      <Container>
        <AnimateOnScroll className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Latest Updates" title="Campus News" align="left" />
          <Link href="/news" className="text-md font-semibold text-crimson">
            View All News →
          </Link>
        </AnimateOnScroll>

        <StaggerGroup className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => (
            <StaggerItem key={post._id}>
              <Card
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
            </StaggerItem>
          ))}
        </StaggerGroup>
      </Container>
    </section>
  )
}
