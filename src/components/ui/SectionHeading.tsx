export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
}) {
  const alignment = align === 'center' ? 'text-center items-center' : 'text-left items-start'

  return (
    <div className={`flex flex-col gap-3 ${alignment}`}>
      {eyebrow && (
        <span className="text-md font-semibold uppercase tracking-wide text-crimson">{eyebrow}</span>
      )}
      <h2 className="font-display text-3xl font-bold text-navy sm:text-4xl">{title}</h2>
      <span className="h-1 w-16 rounded-full bg-crimson" />
      {subtitle && <p className="max-w-2xl text-ink-muted">{subtitle}</p>}
    </div>
  )
}
