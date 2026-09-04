import { Card } from "@/components/ui/Card"
import { Container } from "@/components/ui/Container"
import { SectionHeading } from "@/components/ui/SectionHeading"
import { sanityFetch } from "@/sanity/live"
import { ALL_POSTS_QUERY } from "@/sanity/queries"


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
  const posts: Post[] = (await sanityFetch({ query: ALL_POSTS_QUERY })).data

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
