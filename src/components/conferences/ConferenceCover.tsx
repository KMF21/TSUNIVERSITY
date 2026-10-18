import Image from 'next/image'
import { hasImage, imageUrl } from './image'
import type { SanityImg } from './types'

/**
 * Card/hero artwork. Falls back to a branded navy panel with the conference's
 * short name when no image has been uploaded, so a new conference never
 * looks broken while artwork is still being prepared.
 */
export function ConferenceCover({
  image,
  title,
  shortName,
  year,
  width = 800,
  height = 450,
  sizes = '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw',
  priority = false,
  className = '',
}: {
  image?: SanityImg
  title: string
  shortName?: string
  year?: number
  width?: number
  height?: number
  sizes?: string
  priority?: boolean
  className?: string
}) {
  if (hasImage(image)) {
    return (
      <Image
        src={imageUrl(image, width, height)}
        alt={image.alt || ''}
        fill
        sizes={sizes}
        priority={priority}
        className={`object-cover ${className}`}
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={title}
      className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-navy via-navy-700 to-navy-900 text-center text-white"
    >
      <span className="font-display text-2xl font-bold tracking-wide sm:text-3xl">{shortName || 'TSU'}</span>
      {year && <span className="mt-1 text-sm font-semibold text-white/60">{year}</span>}
      <span aria-hidden="true" className="mt-3 h-1 w-10 rounded-full bg-crimson" />
    </div>
  )
}
