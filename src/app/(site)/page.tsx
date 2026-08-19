import { client } from '../../../sanity/client'
import { SITE_SETTINGS_QUERY } from '../../../sanity/queries'
import { Hero } from '../../components/home/Hero'
import { AboutSection } from '../../components/home/AboutSection'
import { QuickAccess } from '../../components/home/QuickAccess'
import { FacultyGrid } from '../../components/home/FacultyGrid'
import { NewsPreview } from '../../components/home/NewsPreview'
import { EventsPreview } from '../../components/home/EventsPreview'
import { PortalsTeaser } from '../../components/home/PortalsTeaser'
import { CtaBanner } from '../../components/home/CtaBanner'

export default async function HomePage() {
  const siteSettings = await client.fetch(SITE_SETTINGS_QUERY)

  return (
    <>
      <Hero heroImage={siteSettings?.heroImage} />
      <AboutSection aboutImage={siteSettings?.aboutImage} />
      <QuickAccess />
      <FacultyGrid />
      <NewsPreview />
      <EventsPreview />
      <PortalsTeaser />
      <CtaBanner />
    </>
  )
}