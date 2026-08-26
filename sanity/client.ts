import { createClient } from '@sanity/client'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2026-08-18', // use current date, keeps query behavior pinned
  useCdn: false, // fast, cached reads — flip to false for instant-preview needs
})
