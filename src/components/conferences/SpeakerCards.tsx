'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { X } from 'lucide-react'
import { hasImage, imageUrl } from './image'
import type { Speaker } from './types'

function Avatar({ speaker, size }: { speaker: Speaker; size: number }) {
  if (hasImage(speaker.photo)) {
    return (
      <Image
        src={imageUrl(speaker.photo, size * 2, size * 2)}
        alt={speaker.photo.alt || speaker.name}
        width={size}
        height={size}
        className="rounded-full object-cover"
        style={{ width: size, height: size }}
      />
    )
  }
  const initials = speaker.name.split(/\s+/).filter((t) => /^\p{L}/u.test(t) && !/^(dr|prof|professor|mr|mrs|ms|engr|rev)\.?$/i.test(t)).slice(0, 2).map((p) => p[0]?.toUpperCase()).join('')
  return (
    <span
      aria-hidden="true"
      className="flex items-center justify-center rounded-full bg-navy font-display font-bold text-white"
      style={{ width: size, height: size, fontSize: size / 3 }}
    >
      {initials}
    </span>
  )
}

export function SpeakerCards({ speakers }: { speakers: Speaker[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const opener = useRef<HTMLElement | null>(null)
  const [selected, setSelected] = useState<Speaker | null>(null)

  const open = (s: Speaker, trigger: HTMLElement) => {
    opener.current = trigger
    setSelected(s)
    dialogRef.current?.showModal()
  }
  const close = () => dialogRef.current?.close()

  return (
    <>
      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {speakers.map((s) => {
          const inner = (
            <>
              <Avatar speaker={s} size={96} />
              <h3 className="mt-4 font-display text-lg font-semibold text-navy">{s.name}</h3>
              {s.title && <p className="text-sm text-ink">{s.title}</p>}
              {s.affiliation && <p className="text-sm text-ink-muted">{s.affiliation}</p>}
              {s.talkTitle && <p className="mt-3 text-sm font-medium text-crimson">“{s.talkTitle}”</p>}
              {s.bio && <span className="mt-3 text-sm font-semibold text-navy underline underline-offset-2">Read bio</span>}
            </>
          )
          const cardClass = 'flex h-full w-full flex-col items-center rounded-card border border-black/10 bg-white p-6 text-center'
          return (
            <li key={s._key ?? s.name}>
              {s.bio ? (
                <button
                  type="button"
                  onClick={(e) => open(s, e.currentTarget)}
                  aria-haspopup="dialog"
                  className={`${cardClass} transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson`}
                >
                  {inner}
                </button>
              ) : (
                <div className={cardClass}>{inner}</div>
              )}
            </li>
          )
        })}
      </ul>

      <dialog
        ref={dialogRef}
        aria-labelledby="speaker-dialog-title"
        onClose={() => {
          setSelected(null)
          opener.current?.focus()
        }}
        onClick={(e) => {
          if (e.target === dialogRef.current) close()
        }}
        className="m-auto w-[calc(100%-2rem)] max-w-xl rounded-card p-0 backdrop:bg-navy-900/60"
      >
        {selected && (
          <div className="relative p-6 sm:p-8">
            <button
              type="button"
              onClick={close}
              aria-label="Close biography"
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full text-ink-muted hover:bg-navy-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-crimson"
            >
              <X aria-hidden="true" className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-4 pr-10">
              <Avatar speaker={selected} size={72} />
              <div>
                <h3 id="speaker-dialog-title" className="font-display text-xl font-bold text-navy">{selected.name}</h3>
                {selected.title && <p className="text-sm text-ink">{selected.title}</p>}
                {selected.affiliation && <p className="text-sm text-ink-muted">{selected.affiliation}</p>}
              </div>
            </div>
            {selected.talkTitle && <p className="mt-4 font-medium text-crimson">“{selected.talkTitle}”</p>}
            <p className="mt-4 whitespace-pre-line text-base leading-relaxed text-ink">{selected.bio}</p>
          </div>
        )}
      </dialog>
    </>
  )
}
