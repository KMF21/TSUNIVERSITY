import Image from 'next/image'
import { urlFor } from '@/sanity/image'
import { Container } from '@/components/ui/Container'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { AnimateOnScroll } from '@/components/motion/AnimateOnScroll'
import { StaggerGroup, StaggerItem } from '@/components/motion/StaggerGroup'

type LeadershipProfile = {
  _id: string
  name: string
  slug?: { current: string }
  role: string
  category: 'principal-officer' | 'governing-council' | 'dean' | 'hod' | 'staff'
  photo?: any
}

const CATEGORY_LABELS: Record<string, string> = {
  'principal-officer': 'Principal Officers',
  'governing-council': 'Governing Council',
  dean: 'Deans',
  hod: 'Heads of Department',
}

const CATEGORY_ORDER = ['principal-officer', 'governing-council', 'dean', 'hod']

const CATEGORY_TITLES: Record<string, string> = {
  'principal-officer': 'Principal Officer',
  'governing-council': 'Governing Council',
  dean: 'Dean',
  hod: 'Head of Department',
}

function ProfileCard({ profile }: { profile: LeadershipProfile }) {
  return (
    <div className="overflow-hidden rounded-card border border-black/5 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/5] w-full bg-navy/10">
        {profile.photo ? (
          <Image
            src={urlFor(profile.photo).width(500).height(625).url()}
            alt={profile.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-4xl font-bold text-navy/40">
            {profile.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
        )}
      </div>
      <div className="p-5">
        <p className="font-display text-base font-semibold text-navy">{profile.name}</p>
        <p className="mt-1 text-sm font-medium text-crimson">{profile.role}</p>
        <p className="mt-1 text-xs uppercase tracking-wide text-ink-muted">
          {CATEGORY_TITLES[profile.category]}
        </p>
      </div>
    </div>
  )
}

// Fetched and grouped server-side in about/page.tsx, then passed in here —
// this component only handles layout + scroll-reveal animation.
export function LeadershipSection({ profiles }: { profiles: LeadershipProfile[] }) {
  if (!profiles.length) return null

  const byCategory = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    people: profiles.filter((p) => p.category === cat),
  })).filter((group) => group.people.length > 0)

  if (!byCategory.length) return null

  return (
    <section className="bg-rose-tint py-16">
      <Container>
        <AnimateOnScroll>
          <SectionHeading eyebrow="Leadership" title="Our Leadership" />
        </AnimateOnScroll>

        <div className="mt-12 space-y-12">
          {byCategory.map((group) => (
            <div key={group.category}>
              <AnimateOnScroll>
                <h3 className="text-center font-display text-lg font-semibold text-navy sm:text-left">
                  {group.label}
                </h3>
              </AnimateOnScroll>
              <StaggerGroup className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4" staggerDelay={0.06}>
                {group.people.map((person) => (
                  <StaggerItem key={person._id}>
                    <ProfileCard profile={person} />
                  </StaggerItem>
                ))}
              </StaggerGroup>
            </div>
          ))}
        </div>
      </Container>
    </section>
  )
}