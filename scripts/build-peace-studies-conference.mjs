// Migrates the real Peace Studies national conference and its Book of
// Proceedings into the Conferences section.
//
//   node scripts/build-peace-studies-conference.mjs
//   pnpm exec sanity dataset import scripts/peace-studies-conference.ndjson production --replace
//
// Needs scripts/assets/peace-studies-book-of-proceedings.pdf locally (it is
// gitignored — too large for the repo). Needs `qpdf` to split it into one PDF
// per paper; pass --no-split to skip that and import the full volume only.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { assetFsPath, block, file, image, key, ref, withKeys } from './lib/seed-helpers.mjs'

// ── Confirm with the department ─────────────────────────────────────────────
// The flyer announced 8–10 Dec 2025; the published proceedings say the
// conference was held on 30 Nov 2025. Change these two lines if that is wrong.
const CONFERENCE_START = '2025-11-30'
const CONFERENCE_END = '2025-11-30'
// ────────────────────────────────────────────────────────────────────────────

const PDF = 'peace-studies-book-of-proceedings.pdf'
const PDF_OFFSET = 12 // printed page 1 is PDF page 13
const split = !process.argv.includes('--no-split')

if (!existsSync(assetFsPath(PDF))) {
  console.error(`Missing scripts/assets/${PDF} — place the full Book of Proceedings PDF there first.`)
  process.exit(1)
}

const papersData = JSON.parse(readFileSync(new URL('./data/peace-studies-papers.json', import.meta.url), 'utf8'))

const paperPdfName = (i) => `peace-studies-papers/paper-${String(i + 1).padStart(2, '0')}.pdf`
if (split) {
  mkdirSync(assetFsPath('peace-studies-papers'), { recursive: true })
  papersData.forEach((p, i) => {
    execFileSync('qpdf', [
      assetFsPath(PDF),
      '--pages',
      '.',
      `${p.startPage + PDF_OFFSET}-${p.endPage + PDF_OFFSET}`,
      '--',
      assetFsPath(paperPdfName(i)),
    ])
  })
}

const CONF_ID = 'conference-peace-studies-national-2025'
const PROC_ID = 'proceedings-peace-studies-national-2025'
const SLUG = 'peace-studies-national-conference-2025'
const THEME = 'Violent Conflicts and Peace Building in Taraba State, Northeast Nigeria'

const subThemes = [
  'Banditry and Kidnapping in Taraba State',
  'Mapping Conflict Actors and Evolving Conflict Landscape in Taraba State',
  'State and Non-state Actors’ Responses to Violent Conflict and Peace Building in Taraba State',
  'Religion and inter-communal relations in conflict and reconciliation',
  'Indigenous conflict resolution mechanisms and traditional authority',
  'Climate change, environmental degradation, and communal violence',
  'Cross-border conflict dynamics and regional cooperation',
  'Displacement, humanitarian response, and durable solutions',
  'Theoretical and methodological approaches to peace and conflict studies',
  'Youth, Education and the future of Peace in Taraba State',
  'Conflict dynamics and identity politics',
  'Farmer-herder relations in Northern Senatorial District of Taraba State',
  'The role of gender and youth in peace building',
  'Transitional justice and reconciliation',
  'Governance and security sector reform in Nigeria',
  'The impact of climate change on communal relations in North East Nigeria',
  'Refugee and Internally Displaced Persons in North East and the Cameroons',
  'Sexual and Gender-Based Violence in Taraba State, Nigeria',
  'Women as victims and survivors of violent conflicts in Taraba State',
  'Media Narratives, Discursive Practice, Rumor Mongering and Violent Conflicts in Taraba State',
  'Traditional leaders, Religious leaders and Peace Building in Taraba State',
]

const overview = [
  block(
    'The National Conference on “Violent Conflicts and Peacebuilding in Taraba State, Northeast Nigeria” was organised by the Department of Peace Studies and Conflict Resolution, Taraba State University, Jalingo, in collaboration with the Bureau for Peace and Conflict Resolution, Office of the Governor, Taraba State. It provided a multidisciplinary platform for scholars, researchers, policy analysts, civil society actors and practitioners to examine the dynamics of violent conflict and the possibilities for sustainable peacebuilding in Taraba State and the wider Northeast.',
  ),
  block(
    'The conference sought to move beyond understanding Taraba merely as a site of insecurity, creating space for rigorous inquiry into the causes, manifestations, actors, consequences and responses to violent conflicts — with particular attention to governance, identity, environmental change, displacement, livelihoods, gender, youth, security and cross-border dynamics.',
  ),
  block(
    'A major objective was to strengthen the relationship between research, policy and practice, and to foreground local knowledge, local ownership and community-based approaches to peacebuilding.',
  ),
]

const callForPapers = [
  block(
    'The Department invited scholars, researchers, policy analysts, civil society actors and practitioners to submit original, empirical and theoretical contributions addressing, but not limited to, the sub-themes listed above. The call is now closed; the papers presented are published in the Book of Proceedings.',
  ),
]

const publication = [
  block(
    'Accepted papers are published in the Book of Proceedings (ISBN 978-978-68-9759-2), edited by Associate Professor Amos Jev Asongo as Editor-in-Chief with Dr. Buhari Shehu Miapyen and Dr. Nsemba Edward Lenshie as editors, and Mr. Nucha Gambo Suntai as production editor.',
  ),
]

const conference = {
  _id: CONF_ID,
  _type: 'conference',
  title: 'National Conference on Violent Conflicts and Peacebuilding in Taraba State',
  shortName: 'Peace Studies Conference',
  edition: 'Maiden',
  year: Number(CONFERENCE_START.slice(0, 4)),
  slug: { _type: 'slug', current: SLUG },
  organiserOther: 'Department of Peace Studies and Conflict Resolution, Taraba State University',
  theme: THEME,
  subThemes,
  featured: false,
  startDate: `${CONFERENCE_START}T08:00:00+01:00`,
  endDate: `${CONFERENCE_END}T18:00:00+01:00`,
  timezone: 'Africa/Lagos',
  mode: 'hybrid',
  venue: { _type: 'conferenceVenue', name: 'Taraba State University', city: 'Jalingo' },
  importantDates: withKeys([
    { _type: 'conferenceImportantDate', label: 'Abstract submission deadline', date: '2025-09-30' },
    { _type: 'conferenceImportantDate', label: 'Full paper submission deadline', date: '2025-11-15' },
  ]),
  overview,
  callForPapers,
  registration: {
    fees: withKeys([
      { _type: 'conferenceFee', category: 'Physical participation', amount: 25000, currency: 'NGN' },
      { _type: 'conferenceFee', category: 'Virtual participation', amount: 15000, currency: 'NGN' },
      { _type: 'conferenceFee', category: 'Students', amount: 15000, currency: 'NGN' },
      { _type: 'conferenceFee', category: 'Corporate organisations', amount: 30000, currency: 'NGN' },
      { _type: 'conferenceFee', category: 'International participants', amount: 40, currency: 'USD' },
    ]),
  },
  committees: withKeys([
    {
      _type: 'conferenceCommittee',
      committeeName: 'Editorial Board',
      members: withKeys([
        { _type: 'conferenceCommitteeMember', name: 'Assoc. Prof. Amos Asongo Jev', role: 'Editor-in-Chief' },
        { _type: 'conferenceCommitteeMember', name: 'Dr. Buhari Shehu Miapyen', role: 'Editor' },
        { _type: 'conferenceCommitteeMember', name: 'Dr. Nsemba Edward Lenshie', role: 'Editor' },
        { _type: 'conferenceCommitteeMember', name: 'Mr. Nucha Gambo Suntai', role: 'Production Editor' },
      ]),
    },
    {
      _type: 'conferenceCommittee',
      committeeName: 'Local Organising Committee',
      members: withKeys([
        { _type: 'conferenceCommitteeMember', name: 'Dr. Buhari Shehu Miapyen', role: 'Chairman' },
        { _type: 'conferenceCommitteeMember', name: 'Dr. Nsemba Edward Lenshie', role: 'Member' },
        { _type: 'conferenceCommitteeMember', name: 'Dr. Gabriel Iornumbe Yina', role: 'Member' },
        { _type: 'conferenceCommitteeMember', name: 'Dr. Ovenaone Jennifer Uniga', role: 'Member' },
        { _type: 'conferenceCommitteeMember', name: 'Dr. Danjuma Yusuf', role: 'Member' },
        { _type: 'conferenceCommitteeMember', name: 'Dr. Isa Mohammed', role: 'Member' },
        { _type: 'conferenceCommitteeMember', name: 'Mr. Shedrack Irimiya Gani', role: 'Member' },
        { _type: 'conferenceCommitteeMember', name: 'Mr. Nucha Gambo Suntai', role: 'Secretary' },
      ]),
    },
  ]),
  publication,
  contact: { email: 'nuchagambo@tsuniversity.edu.ng' },
}

const papers = papersData.map((p, i) => ({
  _type: 'proceedingsPaper',
  _key: key(),
  title: p.title,
  authors: p.authors,
  pages: `${p.startPage}–${p.endPage}`,
  ...(split ? { pdf: file(paperPdfName(i)) } : {}),
}))

const proceedings = {
  _id: PROC_ID,
  _type: 'proceedings',
  title: `Book of Proceedings — ${THEME}`,
  slug: { _type: 'slug', current: `${SLUG}-proceedings` },
  year: 2026,
  conference: ref(CONF_ID),
  coverImage: image('peace-studies-proceedings-cover.jpg', 'Cover of the Book of Proceedings — Violent Conflicts and Peacebuilding in Taraba State, Northeast Nigeria'),
  isbn: '978-978-68-9759-2',
  publisher: 'Department of Peace Studies and Conflict Resolution, Taraba State University, Jalingo',
  editors: ['Amos Asongo Jev', 'Buhari Shehu Miapyen', 'Nsemba Edward Lenshie'],
  fullVolumePdf: file(PDF),
  papers,
}

const out = fileURLToPath(new URL('./peace-studies-conference.ndjson', import.meta.url))
writeFileSync(out, [conference, proceedings].map((d) => JSON.stringify(d)).join('\n') + '\n')
console.log(`Wrote ${out} — conference + proceedings with ${papers.length} papers${split ? ' (per-paper PDFs split)' : ''}.`)
console.log(`Conference date used: ${CONFERENCE_START}${CONFERENCE_END !== CONFERENCE_START ? ` to ${CONFERENCE_END}` : ''}`)
