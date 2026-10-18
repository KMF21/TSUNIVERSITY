'use client'

import { useState } from 'react'
import { Check, Link2, Linkedin, MessageCircle, Twitter } from 'lucide-react'

const buttonClass =
  'inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white hover:text-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy'

/** Share row for the conference hero: WhatsApp, LinkedIn, X and copy-link. */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const text = encodeURIComponent(title)
  const link = encodeURIComponent(url)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const input = document.createElement('input')
      input.value = url
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex items-center gap-2" data-no-print>
      <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-white/60">Share</span>
      <a
        href={`https://wa.me/?text=${text}%20${link}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp (opens in a new tab)"
        className={buttonClass}
      >
        <MessageCircle aria-hidden="true" className="h-5 w-5" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${link}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn (opens in a new tab)"
        className={buttonClass}
      >
        <Linkedin aria-hidden="true" className="h-5 w-5" />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?text=${text}&url=${link}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (opens in a new tab)"
        className={buttonClass}
      >
        <Twitter aria-hidden="true" className="h-5 w-5" />
      </a>
      <button type="button" onClick={copy} aria-label="Copy link" className={buttonClass}>
        {copied ? <Check aria-hidden="true" className="h-5 w-5" /> : <Link2 aria-hidden="true" className="h-5 w-5" />}
      </button>
      <span role="status" className="sr-only">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  )
}
