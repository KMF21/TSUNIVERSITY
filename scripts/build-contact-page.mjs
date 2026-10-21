// Seeds the Contact Information document with the details that were
// previously hard-coded on the Contact page. Edit them in Studio afterwards.
//
//   node scripts/build-contact-page.mjs
//   pnpm exec sanity dataset import scripts/contact-page.ndjson production --replace
import { writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { key } from './lib/seed-helpers.mjs'

const line = (kind, value) => ({ _key: key(), _type: 'contactLine', kind, value })
const card = (label, lines) => ({ _key: key(), _type: 'contactCard', label, lines })

const doc = {
  _id: 'contactPage',
  _type: 'contactPage',
  title: 'Contact Information',
  cards: [
    card('Our Campus', [line('text', 'ATC, 660213, Jalingo, Taraba State')]),
    card('Email Us', [line('email', 'registrar@tsuniversity.edu.ng')]),
    card('ICT Support', [line('phone', '08035781645'), line('phone', '08168385747')]),
    card('Admissions', [line('phone', '+2348160695156'), line('whatsapp', '+2349020020173')]),
  ],
}

const out = fileURLToPath(new URL('./contact-page.ndjson', import.meta.url))
writeFileSync(out, JSON.stringify(doc) + '\n')
console.log(`Wrote ${out}`)
