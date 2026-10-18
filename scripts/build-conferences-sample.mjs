// Seeds two clearly-marked SAMPLE conferences so the Conferences section can
// be reviewed end to end: one upcoming (full programme, speakers, committees,
// fees) and one past with a proceedings volume. Delete them from Studio
// (or run: pnpm exec sanity documents delete <id>) once real content exists.
//
//   node scripts/build-conferences-sample.mjs
//   pnpm exec sanity dataset import scripts/conferences-sample.ndjson production --replace
//
// Placeholder artwork is generated locally — it is
// not real photography and is replaced by uploading proper images in Studio.
import { deflateSync } from 'node:zlib'
import { existsSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { assetFsPath, block, image, key, ref, withKeys } from './lib/seed-helpers.mjs'

// Placeholder artwork: a navy-to-crimson gradient PNG written with plain Node
// (no Python/ImageMagick needed, so it runs the same on Windows).
const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
  return c >>> 0
})
const crc32 = (buf) => {
  let c = 0xffffffff
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8)
  return (c ^ 0xffffffff) >>> 0
}
const chunk = (type, data) => {
  const out = Buffer.alloc(12 + data.length)
  out.writeUInt32BE(data.length, 0)
  out.write(type, 4, 'ascii')
  data.copy(out, 8)
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length)
  return out
}
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16))

function gradientPng(from, to, w = 1600, h = 800) {
  const [a, b] = [hex(from), hex(to)]
  const raw = Buffer.alloc((w * 3 + 1) * h)
  for (let y = 0; y < h; y++) {
    const row = y * (w * 3 + 1)
    for (let x = 0; x < w; x++) {
      const t = (x / w) * 0.6 + (y / h) * 0.4
      for (let i = 0; i < 3; i++) raw[row + 1 + x * 3 + i] = Math.round(a[i] + (b[i] - a[i]) * t)
    }
  }
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0)
  ihdr.writeUInt32BE(h, 4)
  ihdr.set([8, 2, 0, 0, 0], 8)
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ])
}

const art = [
  ['sample-conference-upcoming.png', '#0F1F3D', '#C4293B'],
  ['sample-conference-past.png', '#16305F', '#7A1A28'],
]
for (const [name, from, to] of art) {
  if (!existsSync(assetFsPath(name))) writeFileSync(assetFsPath(name), gradientPng(from, to))
}

const year = new Date().getFullYear()
const isoDay = (offsetDays) => new Date(Date.now() + offsetDays * 86_400_000).toISOString().slice(0, 10)
const lorem = (t) => block(t)

const UP_ID = 'sample-conference-upcoming'
const PAST_ID = 'sample-conference-past'

const upcoming = {
  _id: UP_ID,
  _type: 'conference',
  title: '[SAMPLE] International Conference on Sustainable Development and Innovation',
  shortName: 'SAMPLE-ICSDI',
  edition: '3rd',
  year,
  slug: { _type: 'slug', current: 'sample-icsdi-upcoming' },
  series: 'SAMPLE ICSDI',
  organiserOther: '[SAMPLE] Centre for Research and Innovation',
  theme: 'Research, Policy and Practice for Sustainable Development in Northeast Nigeria',
  subThemes: ['Agriculture and food security', 'Climate and environment', 'Health systems', 'Education and technology', 'Peace, governance and society'],
  featured: true,
  startDate: `${isoDay(60)}T08:00:00+01:00`,
  endDate: `${isoDay(62)}T17:00:00+01:00`,
  timezone: 'Africa/Lagos',
  mode: 'hybrid',
  heroImage: image('sample-conference-upcoming.png', 'Placeholder artwork for the sample conference'),
  venue: {
    name: 'Taraba State University Main Campus',
    address: 'Along Jalingo–Yola Road',
    city: 'Jalingo',
    latitude: 8.8937,
    longitude: 11.3596,
    directions: [lorem('Sample directions: the main campus is on the Jalingo–Yola road. Taxis and shuttle buses stop at the main gate.')],
  },
  importantDates: withKeys([
    { _type: 'conferenceImportantDate', label: 'Abstract submission', date: isoDay(-10) },
    { _type: 'conferenceImportantDate', label: 'Full paper submission', date: isoDay(20) },
    { _type: 'conferenceImportantDate', label: 'Notification of acceptance', date: isoDay(35) },
    { _type: 'conferenceImportantDate', label: 'Early-bird registration ends', date: isoDay(45) },
  ]),
  overview: [lorem('This is a SAMPLE conference created to demonstrate the Conferences section. Replace it with a real conference from Studio.'), lorem('It shows every section a published conference can have: dates, registration, programme, speakers, committees, venue and publication.')],
  callForPapers: [lorem('Sample call for papers: original empirical and theoretical contributions on the listed sub-themes are welcome.')],
  submissionGuidelines: [lorem('Sample guidelines: abstracts of 250–300 words; full papers up to 8,000 words.')],
  submissionUrl: 'https://example.org/sample-submission',
  registration: {
    fees: withKeys([
      { _type: 'conferenceFee', category: 'Faculty / researchers', amount: 25000, currency: 'NGN' },
      { _type: 'conferenceFee', category: 'Students', amount: 10000, currency: 'NGN', note: 'Valid student ID required' },
      { _type: 'conferenceFee', category: 'International participants', amount: 60, currency: 'USD' },
    ]),
    instructions: [lorem('Sample instructions: register on the external registration page below.')],
    registrationUrl: 'https://example.org/sample-registration',
  },
  programme: withKeys([
    {
      _type: 'conferenceDay',
      label: 'Day 1',
      date: isoDay(60),
      sessions: withKeys([
        { _type: 'conferenceSession', startTime: '08:30', endTime: '09:30', title: 'Registration', type: 'break' },
        { _type: 'conferenceSession', startTime: '09:30', endTime: '10:30', title: 'Opening ceremony and keynote', type: 'keynote', speaker: '[SAMPLE] Prof. A. Speaker' },
        { _type: 'conferenceSession', startTime: '11:00', endTime: '12:30', title: 'Agriculture and food security', type: 'parallel', room: 'Hall A' },
        { _type: 'conferenceSession', startTime: '11:00', endTime: '12:30', title: 'Climate and environment', type: 'parallel', room: 'Hall B' },
        { _type: 'conferenceSession', startTime: '13:30', endTime: '15:00', title: 'Plenary panel: research and policy', type: 'plenary' },
      ]),
    },
    {
      _type: 'conferenceDay',
      label: 'Day 2',
      date: isoDay(61),
      sessions: withKeys([
        { _type: 'conferenceSession', startTime: '09:00', endTime: '10:30', title: 'Health systems', type: 'parallel', room: 'Hall A' },
        { _type: 'conferenceSession', startTime: '09:00', endTime: '10:30', title: 'Education and technology', type: 'parallel', room: 'Hall B' },
        { _type: 'conferenceSession', startTime: '18:00', endTime: '20:00', title: 'Conference dinner', type: 'social' },
      ]),
    },
  ]),
  keynoteSpeakers: withKeys([
    { _type: 'conferenceSpeaker', name: '[SAMPLE] Prof. A. Speaker', title: 'Professor of Development Studies', affiliation: 'Sample University', talkTitle: 'Sample keynote title', bio: 'Sample biography text shown in the speaker dialog.' },
    { _type: 'conferenceSpeaker', name: '[SAMPLE] Dr. B. Guest', title: 'Senior Fellow', affiliation: 'Sample Institute' },
  ]),
  committees: withKeys([
    {
      _type: 'conferenceCommittee',
      committeeName: 'Organising Committee',
      members: withKeys([
        { _type: 'conferenceCommitteeMember', name: '[SAMPLE] Dr. C. Chair', role: 'Chair', affiliation: 'Taraba State University' },
        { _type: 'conferenceCommitteeMember', name: '[SAMPLE] Mr. D. Secretary', role: 'Secretary', affiliation: 'Taraba State University' },
      ]),
    },
  ]),
  travelAndAccommodation: [lorem('Sample travel note: nearest airport is Jalingo Airport. Partner hotels offer conference rates.')],
  publication: [lorem('Sample publication note: accepted papers will appear in the conference proceedings.')],
  contact: { email: 'conferences@example.org' },
}

const SAMPLE_PAPER_META = [
  ['[SAMPLE] Community Water Systems and Public Health Outcomes', ['Amina Bello', 'John Musa'], '1–14', 'Sample abstract: this placeholder paper demonstrates how an abstract expands under the paper title.'],
  ['[SAMPLE] Digital Skills Training in Secondary Schools', ['Grace Tanko'], '15–27', 'Sample abstract for a second placeholder paper.'],
  ['[SAMPLE] Smallholder Farming and Climate Adaptation', ['Ibrahim Danladi', 'Ruth Samuel', 'Peter Audu'], '28–45'],
]

const past = {
  _id: PAST_ID,
  _type: 'conference',
  title: '[SAMPLE] International Conference on Sustainable Development and Innovation',
  shortName: 'SAMPLE-ICSDI',
  edition: '2nd',
  year: year - 1,
  slug: { _type: 'slug', current: 'sample-icsdi-past' },
  series: 'SAMPLE ICSDI',
  organiserOther: '[SAMPLE] Centre for Research and Innovation',
  theme: 'Sample theme from the previous edition',
  featured: false,
  startDate: `${year - 1}-06-10T08:00:00+01:00`,
  endDate: `${year - 1}-06-11T17:00:00+01:00`,
  timezone: 'Africa/Lagos',
  mode: 'in-person',
  heroImage: image('sample-conference-past.png', 'Placeholder artwork for the sample past conference'),
  venue: { name: 'Taraba State University Main Campus', city: 'Jalingo' },
  overview: [lorem('SAMPLE past edition, linked to a SAMPLE proceedings volume.')],
  publication: [lorem('Sample: papers from this edition are published in the proceedings.')],
}

const proceedings = {
  _id: 'sample-proceedings-past',
  _type: 'proceedings',
  title: '[SAMPLE] Proceedings of the 2nd International Conference on Sustainable Development and Innovation',
  slug: { _type: 'slug', current: 'sample-icsdi-past-proceedings' },
  year: year - 1,
  conference: ref(PAST_ID),
  coverImage: image('sample-conference-past.png', 'Placeholder cover for the sample proceedings'),
  publisher: '[SAMPLE] TSU Press',
  editors: ['Sample Editor'],
  publishedDate: `${year - 1}-09-01`,
  papers: SAMPLE_PAPER_META.map(([title, authors, pages, abstract]) => ({
    _type: 'proceedingsPaper',
    _key: key(),
    title,
    authors,
    pages,
    ...(abstract ? { abstract } : {}),
  })),
}

const out = fileURLToPath(new URL('./conferences-sample.ndjson', import.meta.url))
writeFileSync(out, [upcoming, past, proceedings].map((d) => JSON.stringify(d)).join('\n') + '\n')
console.log(`Wrote ${out}`)
