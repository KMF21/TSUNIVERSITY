/** Anchored section wrapper: consistent spacing, heading and scroll offset under the sticky header + section nav. */
export function SectionBlock({
  id,
  eyebrow,
  title,
  children,
  className = '',
}: {
  id: string
  eyebrow?: string
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className={`scroll-mt-48 border-t border-black/10 py-12 first:border-t-0 first:pt-0 sm:py-14 ${className}`}>
      <div className="flex flex-col items-start gap-3">
        {eyebrow && <span className="text-sm font-semibold uppercase tracking-wide text-crimson">{eyebrow}</span>}
        <h2 id={`${id}-heading`} className="font-display text-2xl font-bold text-navy sm:text-3xl">
          {title}
        </h2>
        <span aria-hidden="true" className="h-1 w-12 rounded-full bg-crimson" />
      </div>
      <div className="mt-8">{children}</div>
    </section>
  )
}
