import Image from 'next/image'
import Link from 'next/link'
import { urlFor } from '../../../sanity/image'
import type { SanityImageSource } from '@sanity/image-url/lib/types/types'

export function Card({
  href,
  image,
  eyebrow,
  title,
  meta,
  excerpt,
}: {
  href: string
  image?: SanityImageSource
  eyebrow?: string
  title: string
  meta?: string
  excerpt?: string
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-card border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      {image && (
        <div className="relative h-48 w-full overflow-hidden">
          <Image
            src={urlFor(image).width(600).height(400).url()}
            alt={title}
            fill
            className="object-cover transition duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 p-5">
        {eyebrow && (
          <span className="w-fit rounded-full bg-crimson-50 px-3 py-1 text-xs font-semibold uppercase text-crimson">
            {eyebrow}
          </span>
        )}
        <h3 className="font-display text-lg font-semibold text-navy group-hover:text-crimson">{title}</h3>
        {excerpt && <p className="line-clamp-2 text-md text-ink-muted">{excerpt}</p>}
        {meta && <span className="mt-auto pt-2 text-xs text-ink-muted">{meta}</span>}
      </div>
    </Link>
  )
}
