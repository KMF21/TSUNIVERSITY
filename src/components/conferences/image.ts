import type { SanityImageSource } from '@sanity/image-url/lib/types/types'
import { urlFor } from '@/sanity/image'
import type { SanityImg } from './types'

/** True when an editor has actually uploaded an image into the field. */
export const hasImage = (img?: SanityImg | null): img is SanityImg => Boolean(img?.asset)

/** Sanity CDN URL at a given width (and optional cropped height), auto-format. */
export function imageUrl(img: SanityImg, width: number, height?: number): string {
  let builder = urlFor(img as SanityImageSource).width(width).auto('format')
  if (height) builder = builder.height(height).fit('crop')
  return builder.url()
}
