'use client'

import { useActionState } from 'react'
import { submitContactForm, type ContactFormState } from '../../app/actions/contactForm'

const initialState: ContactFormState = { status: 'idle' }

export function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContactForm, initialState)

  return (
    <form action={formAction} className="space-y-4 rounded-card border border-black/5 bg-white p-6 shadow-sm">
      <h3 className="font-display text-lg font-semibold text-navy">Send Us a Message</h3>

      {state.status === 'success' && (
        <p role="status" className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          {state.message}
        </p>
      )}
      {state.status === 'error' && (
        <p role="alert" className="rounded-lg bg-crimson-50 px-4 py-3 text-sm text-crimson">
          {state.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <input
          type="text"
          name="name"
          placeholder="Enter your name"
          required
          className="rounded-lg border border-black/10 px-4 py-2.5 text-sm"
        />
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          required
          className="rounded-lg border border-black/10 px-4 py-2.5 text-sm"
        />
      </div>
      <input
        type="text"
        name="subject"
        placeholder="How can we help?"
        required
        className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm"
      />
      <textarea
        name="message"
        placeholder="Write your message here..."
        rows={5}
        required
        className="w-full rounded-lg border border-black/10 px-4 py-2.5 text-sm"
      />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-crimson px-6 py-3 font-semibold text-white transition hover:bg-crimson-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? 'Sending…' : 'Submit Inquiry'}
      </button>
    </form>
  )
}
