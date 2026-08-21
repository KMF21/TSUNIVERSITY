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

function ProfileCard({ profile }: { profile: LeadershipProfile }) {
  return (
    <div className="flex flex-col items-center rounded-card border border-black/5 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-navy/10">
        {profile.photo ? (
          <Image
            src={urlFor(profile.photo).width(200).height(200).url()}
            alt={profile.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-xl font-bold text-navy/40">
            {profile.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
        )}
      </div>
      <p className="mt-4 font-display text-base font-semibold text-navy">{profile.name}</p>
      <p className="mt-1 text-sm text-ink-muted">{profile.role}</p>
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
              <StaggerGroup className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" staggerDelay={0.06}>
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