import { Hero } from '../../components/home/Hero'
import { AboutSection } from '../../components/home/AboutSection'
import { QuickAccess } from '../../components/home/QuickAccess'
import { FacultyGrid } from '../../components/home/FacultyGrid'
import { NewsPreview } from '../../components/home/NewsPreview'
import { EventsPreview } from '../../components/home/EventsPreview'
import { PortalsTeaser } from '../../components/home/PortalsTeaser'
import { CtaBanner } from '../../components/home/CtaBanner'

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutSection />
      <QuickAccess />
      <FacultyGrid />
      <NewsPreview />
      <EventsPreview />
      <PortalsTeaser />
      <CtaBanner />
    </>
  )
}
