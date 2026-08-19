import { Container } from '../../components/ui/Container'
import { SectionHeading } from '../../components/ui/SectionHeading'
import { ContactForm } from '../../components/contact/ContactForm'

const INFO = [
  { label: 'Our Campus', value: 'ATC, 660213, Jalingo, Taraba State' },
  { label: 'Email Us', value: 'registrar@tsuniversity.edu.ng' },
  { label: 'ICT Support', value: '08035781645 · 08168385747' },
  { label: 'Admissions', value: '+2348160695156 · +2348087227122' },
]

export default function ContactPage() {
  return (
    <Container className="py-16">
      <SectionHeading eyebrow="Get In Touch" title="Contact Us" />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {INFO.map((item) => (
          <div key={item.label} className="rounded-card border-b-2 border-crimson bg-white p-6 text-center shadow-sm">
            <h3 className="font-semibold text-navy">{item.label}</h3>
            <p className="mt-2 text-md text-ink-muted">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <div className="aspect-video overflow-hidden rounded-card bg-navy/10">
          {/* Embed a real campus map iframe here once coordinates are confirmed */}
          <div className="flex h-full items-center justify-center text-ink-muted">Campus map</div>
        </div>

        <ContactForm />
      </div>
    </Container>
  )
}
