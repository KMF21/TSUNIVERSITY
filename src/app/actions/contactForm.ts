'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export type ContactFormState = {
  status: 'idle' | 'success' | 'error'
  message?: string
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = formData.get('name')?.toString().trim()
  const email = formData.get('email')?.toString().trim()
  const subject = formData.get('subject')?.toString().trim()
  const message = formData.get('message')?.toString().trim()

  if (!name || !email || !subject || !message) {
    return { status: 'error', message: 'Please fill in every field before submitting.' }
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailPattern.test(email)) {
    return { status: 'error', message: 'Please enter a valid email address.' }
  }

  try {
    await resend.emails.send({
      // "from" must be a verified domain in your Resend account before
      // this works in production — use onboarding@resend.dev for testing.
      from: 'TSU Website <no-reply@tsuniversity.edu.ng>',
      to: process.env.CONTACT_FORM_RECIPIENT || 'registrar@tsuniversity.edu.ng',
      replyTo: email,
      subject: `[Website Inquiry] ${subject}`,
      text: `From: ${name} (${email})\n\n${message}`,
    })

    return { status: 'success', message: 'Thanks — your message has been sent. We\'ll be in touch soon.' }
  } catch (error) {
    console.error('Contact form send failed:', error)
    return {
      status: 'error',
      message: 'Something went wrong sending your message. Please try again or email us directly.',
    }
  }
}
