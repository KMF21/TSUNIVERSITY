# TSU Main Website — Next.js Starter

Full Next.js 15 (App Router) + TypeScript + Tailwind starter, wired to the
Sanity schema from `/tsu-sanity-schema`. Design tokens (navy + crimson,
rose-tint alternating sections) are drawn directly from the approved
UniPulse reference.

## Content Studio — embedded, not separate

Sanity Studio is mounted **inside this app** at `/studio`, using the
`NextStudio` component. That means:

- One deployment, one domain — you push to Vercel once, and both the
  public site and the `/studio` content editor go live together
- No separate `sanity.studio` subdomain or second `sanity deploy` step
- Schema files live in `sanity/schemaTypes/`, right next to the
  components that render that content
- `sanity.config.ts` at the project root wires it all together, with
  `basePath: '/studio'` matching the route folder
  `src/app/studio/[[...tool]]/page.tsx`

You'll still need a free Sanity account and project ID (Sanity hosts the
database/API even when Studio itself is embedded) — get one at
sanity.io, drop the project ID into `.env.local`, and `/studio` is
immediately live and editable once you run the app.

## What's built and working

- **Homepage** — Hero (stats, no news carousel — per your decision), Quick
  Access tracks, Faculty grid, News preview, Events preview, Portals
  teaser, CTA banner. All live-fetching from Sanity except the hero image
  placeholder.
- **News** — listing (`/news`) + single post (`/news/[slug]`) with Portable
  Text rendering for rich content.
- **Events** — listing (`/events`) + single event (`/events/[slug]`).
- **Academics** — faculty grid (`/academics`), faculty detail with dean's
  message + department list (`/academics/[faculty]`), department detail
  with programs offered (`/academics/[faculty]/[department]`).
- **Portals** — full directory of the 8 external subdomains (payments,
  application, hostel, etc.) as agreed — external links, not folded into
  this app.
- **Contact** — info cards + message form (UI only, see below).
- **About / Admissions / Research / Campuses / Library / Alumni / Giving /
  Careers** — all wired to the flexible `page` Sanity schema via a shared
  `PageBuilder` component, so these are live and editable in Sanity
  immediately rather than empty stubs. You (or TSU staff) fill these in
  through Sanity Studio — no code changes needed to add content.

## What still needs real work before launch

Being upfront about scope so nothing surprises you later:

1. **Real photography, currently hotlinked as a stopgap** — the homepage
   hero, header logo, and CTA banner now use TSU's own real campus photos
   and logo, pulled directly from the live site's URLs (`next.config.js`
   allows `www.tsuniversity.edu.ng` as a temporary image source). This is
   fine for development and even for an initial soft-launch, since it's
   the university's own asset, not a stock photo, but it's fragile
   long-term: if the old WordPress site is ever taken down, these images
   break. Before final launch, download these files and re-upload them
   through Sanity Studio (or into `/public`) so the new site doesn't
   depend on the old one staying online. Every image marked with a
   "Temporary: hotlinked" comment in the code needs this swap.
2. **Contact form submission** — ✅ Built. A Server Action
   (`app/actions/contactForm.ts`) sends the form via Resend, with real
   pending/success/error states in the UI (`ContactForm.tsx`). Two things
   you need to do before it works live:
   - Sign up at resend.com (free tier: 3,000 emails/month), get an API
     key, add it to `.env.local` as `RESEND_API_KEY`
   - Verify a sending domain in Resend (e.g. `tsuniversity.edu.ng`) —
     until that's done, swap the `from` address in `contactForm.ts` to
     `onboarding@resend.dev` for testing only
3. **Mobile nav menu** — ✅ Built. Slide-out drawer with backdrop, scroll
   lock, keyboard focus states, and a close button — `MobileNav.tsx`.
4. **Events filter tabs** — ✅ Built. `EventsFilterGrid.tsx` — client-side
   tab filtering (All/Lectures/Athletics/Cultural/Outreach) over
   server-fetched data.
5. **TETFund accordion page** — ✅ Built at `/tetfund`. Important context:
   the live site's TETFund submenu (18 sub-items) all pointed to the
   homepage — there was no real content behind any of them to migrate.
   This page ships with correctly labeled categories (matching the real
   live-site list) and "Content coming soon" placeholders, wired to pull
   from a Sanity `page` document (slug: `tetfund`) the moment TSU adds
   real copy — no code changes needed when that content is ready.
6. **Sanity project creation** — Studio is embedded and ready at `/studio`,
   but you still need to create the actual Sanity project (free tier) at
   sanity.io and put its project ID in `.env.local` before `/studio` has
   anywhere to store content.
7. **SEO metadata per page** — only the root layout has metadata set.
   Each dynamic route should generate its own `<title>`/description from
   its Sanity content.
8. **Accessibility pass** — semantic structure is in place, but focus
   states, alt-text enforcement, and a full keyboard-navigation check
   should happen before launch.

## Setup

1. `npm install`
2. Copy `.env.local.example` to `.env.local` and fill in your Sanity
   project ID (from the Sanity Studio project you set up).
3. `npm run dev` — site runs at `localhost:3000`.
4. Populate content in Sanity Studio — the site is empty until faculties,
   posts, and pages exist as documents.

## Folder structure

```
src/
  app/            → routes (App Router — one folder per URL segment)
  components/
    layout/        → Header, Footer
    home/           → homepage sections
    ui/             → shared primitives (Card, Container, PageBuilder, etc.)
sanity/
  client.ts         → Sanity client config
  image.ts          → image URL builder
  queries.ts        → every GROQ query, centralized
  schemaTypes/       → document type definitions (post, event, faculty, etc.)
sanity.config.ts     → Studio config — basePath '/studio' embeds it in this app
```
