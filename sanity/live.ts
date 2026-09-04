import { defineLive } from 'next-sanity'
import { client } from './client'

// Live Content API: replaces plain client.fetch() calls with a subscription-
// aware fetch. sanityFetch() returns fresh data on first load AND keeps the
// page in sync — when an editor publishes in Studio, connected clients
// re-render automatically within seconds, no webhook or manual revalidation
// needed. <SanityLive /> (mounted once in the root layout) is what keeps
// the subscription open.
export const { sanityFetch, SanityLive } = defineLive({
  client: client.withConfig({
    // Live queries need the API's live/streaming endpoint, which requires
    // apiVersion >= v2021-03-25 — already satisfied by client.ts's pinned version.
    useCdn: false,
  }),
  // This project doesn't use Sanity's Draft Mode / Visual Editing, so no
  // read token is needed — this opts out cleanly instead of warning at build time.
  serverToken: false,
  browserToken: false,
})
