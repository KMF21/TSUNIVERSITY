'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'
import { urlFor } from '@/sanity/image'

type GalleryImage = {
  asset?: {
    _ref?: string
  }
  alt?: string
  caption?: string
}

type Intervention = {
  _id: string
  title: string
  category: string
  description: string
  mainImage?: GalleryImage
  gallery?: GalleryImage[]
  year?: number
  location?: string
  status?: string
}

type Props = {
  interventions: Intervention[]
}

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Infrastructure', value: 'infrastructure' },
  { label: 'Equipment', value: 'equipment' },
  { label: 'Library', value: 'library' },
  { label: 'ICT', value: 'ict' },
  { label: 'Research', value: 'research' },
  { label: 'Staff Development', value: 'staff-development' },
]

const CATEGORY_LABELS: Record<string, string> = {
  infrastructure: 'Infrastructure',
  equipment: 'Equipment',
  library: 'Library',
  ict: 'ICT',
  research: 'Research',
  'staff-development': 'Staff Development',
  'academic-development': 'Academic Development',
  maintenance: 'Maintenance',
  other: 'Other',
}

export function TetfundGallery({ interventions }: Props) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selected, setSelected] = useState<Intervention | null>(null)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const filteredInterventions = useMemo(() => {
    if (activeFilter === 'all') {
      return interventions
    }

    return interventions.filter(
      (intervention) => intervention.category === activeFilter
    )
  }, [activeFilter, interventions])

  function getImages(intervention: Intervention): GalleryImage[] {
    const images: GalleryImage[] = []

    if (intervention.mainImage?.asset?._ref) {
      images.push(intervention.mainImage)
    }

    if (intervention.gallery?.length) {
      images.push(
        ...intervention.gallery.filter(
          (image) => image.asset?._ref
        )
      )
    }

    return images
  }

  function openIntervention(intervention: Intervention) {
    setSelected(intervention)
    setSelectedImageIndex(0)
  }

  function closeIntervention() {
    setSelected(null)
    setSelectedImageIndex(0)
  }

  function goToNextImage() {
    if (!selected) return

    const images = getImages(selected)

    if (images.length <= 1) return

    setSelectedImageIndex((current) =>
      current === images.length - 1 ? 0 : current + 1
    )
  }

  function goToPreviousImage() {
    if (!selected) return

    const images = getImages(selected)

    if (images.length <= 1) return

    setSelectedImageIndex((current) =>
      current === 0 ? images.length - 1 : current - 1
    )
  }

  /*
   * Keyboard navigation.
   *
   * Escape = close
   * ArrowLeft = previous image
   * ArrowRight = next image
   */
  useEffect(() => {
    if (!selected) return

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        closeIntervention()
      }

      if (event.key === 'ArrowLeft') {
        goToPreviousImage()
      }

      if (event.key === 'ArrowRight') {
        goToNextImage()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [selected])

  /*
   * Prevent the page behind the modal from scrolling.
   */
  useEffect(() => {
    if (!selected) return

    const originalOverflow = document.body.style.overflow

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [selected])

  /*
   * Empty state.
   */
  if (!interventions.length) {
    return (
      <section className="mt-24">
        <div className="rounded-3xl border border-border bg-muted/30 px-6 py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            TETFund Impact
          </p>

          <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            TETFund Interventions at TSU
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Photographs and project information for TETFund interventions at
            Taraba State University will be featured here as they are
            documented.
          </p>
        </div>
      </section>
    )
  }

  return (
    <>
      {/* ============================================================
          GALLERY SECTION
      ============================================================ */}

      <section className="mt-24">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Impact & Interventions
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Transforming TSU Through TETFund
          </h2>

          <p className="mt-4 text-base leading-7 text-muted-foreground">
            Explore selected infrastructure, equipment, research and academic
            development initiatives supported through TETFund interventions at
            Taraba State University.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {FILTERS.map((filter) => {
            const active = activeFilter === filter.value

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => setActiveFilter(filter.value)}
                className={[
                  'whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition',
                  active
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background hover:bg-muted',
                ].join(' ')}
              >
                {filter.label}
              </button>
            )
          })}
        </div>

        {/* Intervention Cards */}
        {filteredInterventions.length > 0 ? (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredInterventions.map((intervention) => (
              <article
                key={intervention._id}
                className="group overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <button
                  type="button"
                  onClick={() => openIntervention(intervention)}
                  className="block w-full text-left"
                >
                  {/* Card Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {intervention.mainImage?.asset?._ref ? (
                      <Image
                        src={urlFor(intervention.mainImage)
                          .width(1000)
                          .height(625)
                          .fit('crop')
                          .url()}
                        alt={
                          intervention.mainImage.alt ||
                          intervention.title
                        }
                        fill
                        className="object-cover transition duration-500 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                        No image available
                      </div>
                    )}

                    {/* Category Overlay */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-5 pt-20">
                      <span className="text-xs font-semibold uppercase tracking-wider text-white">
                        {CATEGORY_LABELS[intervention.category] ||
                          intervention.category}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {intervention.year && (
                        <span>{intervention.year}</span>
                      )}

                      {intervention.year &&
                        intervention.location && (
                          <span>•</span>
                        )}

                      {intervention.location && (
                        <span>{intervention.location}</span>
                      )}
                    </div>

                    <h3 className="mt-2 text-lg font-semibold leading-snug">
                      {intervention.title}
                    </h3>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {intervention.description}
                    </p>

                    <span className="mt-4 inline-flex text-sm font-semibold text-primary">
                      View intervention →
                    </span>
                  </div>
                </button>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
            <p className="text-muted-foreground">
              No interventions have been added to this category yet.
            </p>
          </div>
        )}
      </section>

      {/* ============================================================
          INTERVENTION MODAL
      ============================================================ */}

      {selected && (
        <InterventionModal
          intervention={selected}
          imageIndex={selectedImageIndex}
          onImageChange={setSelectedImageIndex}
          onNext={goToNextImage}
          onPrevious={goToPreviousImage}
          onClose={closeIntervention}
        />
      )}
    </>
  )
}

/* ================================================================
   MODAL
================================================================ */

type ModalProps = {
  intervention: Intervention
  imageIndex: number
  onImageChange: (index: number) => void
  onNext: () => void
  onPrevious: () => void
  onClose: () => void
}

function InterventionModal({
  intervention,
  imageIndex,
  onImageChange,
  onNext,
  onPrevious,
  onClose,
}: ModalProps) {
  const images: GalleryImage[] = [
    ...(intervention.mainImage?.asset?._ref
      ? [intervention.mainImage]
      : []),

    ...(intervention.gallery || []).filter(
      (image) => image.asset?._ref
    ),
  ]

  const currentImage = images[imageIndex]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={intervention.title}
      onClick={onClose}
    >
      {/* ============================================================
          SOLID MODAL CONTAINER
      ============================================================ */}

      <div
        className="relative flex max-h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close intervention"
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-2xl leading-none text-white backdrop-blur transition hover:bg-black/80"
        >
          ×
        </button>

        {/* ==========================================================
            IMAGE VIEWER
        =========================================================== */}

        <div className="relative bg-black">
          <div className="relative aspect-video w-full">
            {currentImage?.asset?._ref ? (
              <Image
                src={urlFor(currentImage)
                  .width(1800)
                  .height(1100)
                  .fit('max')
                  .url()}
                alt={
                  currentImage.alt ||
                  intervention.title
                }
                fill
                className="object-contain"
                sizes="100vw"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-white/70">
                No image available
              </div>
            )}

            {/* Previous */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={onPrevious}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-3xl leading-none text-white backdrop-blur transition hover:bg-black/80"
              >
                ‹
              </button>
            )}

            {/* Next */}
            {images.length > 1 && (
              <button
                type="button"
                onClick={onNext}
                aria-label="Next image"
                className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-3xl leading-none text-white backdrop-blur transition hover:bg-black/80"
              >
                ›
              </button>
            )}

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                {imageIndex + 1} / {images.length}
              </div>
            )}
          </div>
        </div>

        {/* ==========================================================
            THUMBNAIL STRIP
        =========================================================== */}

        {images.length > 1 && (
          <div className="border-b border-border bg-muted/30 p-4">
            <div className="flex gap-3 overflow-x-auto pb-1">
              {images.map((image, index) => {
                const active = index === imageIndex

                return (
                  <button
                    key={`${image.asset?._ref}-${index}`}
                    type="button"
                    onClick={() => onImageChange(index)}
                    aria-label={`View image ${index + 1}`}
                    aria-current={active ? 'true' : undefined}
                    className={[
                      'relative h-20 w-28 shrink-0 overflow-hidden rounded-lg border-2 transition duration-200',
                      active
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-transparent opacity-70 hover:opacity-100',
                    ].join(' ')}
                  >
                    <Image
                      src={urlFor(image)
                        .width(280)
                        .height(175)
                        .fit('crop')
                        .url()}
                      alt={
                        image.alt ||
                        intervention.title
                      }
                      fill
                      className="object-cover"
                      sizes="112px"
                    />

                    {/* Active indicator */}
                    {active && (
                      <span className="absolute inset-x-0 bottom-0 h-1 bg-primary" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ==========================================================
            PROJECT INFORMATION
        =========================================================== */}

        <div className="overflow-y-auto bg-background p-5 sm:p-8">
          {/* Caption */}
          {currentImage?.caption && (
            <p className="mb-5 text-sm italic leading-6 text-muted-foreground">
              {currentImage.caption}
            </p>
          )}

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span className="font-semibold text-primary">
              {CATEGORY_LABELS[intervention.category] ||
                intervention.category}
            </span>

            {intervention.year && (
              <>
                <span>•</span>
                <span>{intervention.year}</span>
              </>
            )}

            {intervention.location && (
              <>
                <span>•</span>
                <span>{intervention.location}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h3 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
            {intervention.title}
          </h3>

          {/* Description */}
          <p className="mt-4 max-w-4xl text-base leading-7 text-muted-foreground">
            {intervention.description}
          </p>

          {/* Status */}
          {intervention.status && (
            <span className="mt-6 inline-flex rounded-full bg-muted px-3 py-1 text-sm font-medium capitalize">
              {intervention.status}
            </span>
          )}

          {/* Close */}
          <div className="mt-8 border-t border-border pt-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium transition hover:bg-muted"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}