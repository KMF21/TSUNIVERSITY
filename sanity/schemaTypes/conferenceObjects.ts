import {defineArrayMember, defineField, defineType} from 'sanity'

// Reusable building blocks for the `conference` and `proceedings` documents.
// Registered as named object types so Studio gives each one a proper
// preview and the GROQ projections stay readable.

/** Alt text field for images — mandatory whenever an image is present. */
export const altTextField = defineField({
  name: 'alt',
  title: 'Alt text',
  type: 'string',
  description: 'Describe the image for people using screen readers. Required.',
  validation: (Rule) =>
    Rule.custom((alt, context) => {
      const parent = context.parent as {asset?: unknown} | undefined
      return parent?.asset && !alt ? 'Alt text is required for accessibility' : true
    }),
})

export function imageWithAlt(name: string, title: string, options: {group?: string; description?: string} = {}) {
  return defineField({
    name,
    title,
    type: 'image',
    group: options.group,
    description: options.description,
    options: {hotspot: true},
    fields: [altTextField],
  })
}

export const TIMEZONES = [
  {title: 'West Africa Time — Africa/Lagos (WAT)', value: 'Africa/Lagos'},
  {title: 'Ghana — Africa/Accra (GMT)', value: 'Africa/Accra'},
  {title: 'East Africa Time — Africa/Nairobi (EAT)', value: 'Africa/Nairobi'},
  {title: 'South Africa — Africa/Johannesburg (SAST)', value: 'Africa/Johannesburg'},
  {title: 'United Kingdom — Europe/London', value: 'Europe/London'},
  {title: 'Coordinated Universal Time (UTC)', value: 'UTC'},
]

export const SESSION_TYPES = [
  {title: 'Keynote', value: 'keynote'},
  {title: 'Plenary', value: 'plenary'},
  {title: 'Parallel session', value: 'parallel'},
  {title: 'Break', value: 'break'},
  {title: 'Social', value: 'social'},
]

const venue = defineType({
  name: 'conferenceVenue',
  title: 'Venue',
  type: 'object',
  fields: [
    defineField({name: 'name', title: 'Venue name', type: 'string', description: 'e.g. "Senate Building, Taraba State University"'}),
    defineField({name: 'address', title: 'Address', type: 'string'}),
    defineField({name: 'city', title: 'City', type: 'string', initialValue: 'Jalingo'}),
    defineField({
      name: 'mapEmbedUrl',
      title: 'Map embed URL',
      type: 'url',
      description:
        'Optional. In Google Maps choose Share → Embed a map → copy the src="…" URL. Only Google Maps and OpenStreetMap embeds are shown. Leave blank to use the coordinates below.',
      validation: (Rule) => Rule.uri({scheme: ['https']}),
    }),
    defineField({name: 'latitude', title: 'Latitude', type: 'number', validation: (Rule) => Rule.min(-90).max(90)}),
    defineField({name: 'longitude', title: 'Longitude', type: 'number', validation: (Rule) => Rule.min(-180).max(180)}),
    defineField({name: 'directions', title: 'Directions', type: 'array', of: [{type: 'block'}]}),
  ],
})

const importantDate = defineType({
  name: 'conferenceImportantDate',
  title: 'Important date',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'e.g. "Abstract submission deadline"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'date',
      description: 'Treated as end of day in the conference timezone.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'note', title: 'Note', type: 'string', description: 'Optional, e.g. "Extended"'}),
  ],
  preview: {select: {title: 'label', subtitle: 'date'}},
})

const fee = defineType({
  name: 'conferenceFee',
  title: 'Registration fee',
  type: 'object',
  fields: [
    defineField({name: 'category', title: 'Category', type: 'string', description: 'e.g. "Students"', validation: (Rule) => Rule.required()}),
    defineField({name: 'amount', title: 'Amount', type: 'number', description: 'Leave blank for "Free" or "To be announced"'}),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: {list: ['NGN', 'USD', 'GBP', 'EUR']},
      initialValue: 'NGN',
    }),
    defineField({name: 'note', title: 'Note', type: 'string'}),
  ],
  preview: {
    select: {title: 'category', amount: 'amount', currency: 'currency'},
    prepare: ({title, amount, currency}) => ({title, subtitle: amount != null ? `${currency ?? ''} ${amount}` : 'No amount'}),
  },
})

const session = defineType({
  name: 'conferenceSession',
  title: 'Session',
  type: 'object',
  fields: [
    defineField({name: 'startTime', title: 'Start time', type: 'string', description: '24-hour, e.g. 09:30', validation: (Rule) => Rule.required().regex(/^([01]\d|2[0-3]):[0-5]\d$/, {name: 'HH:MM'})}),
    defineField({name: 'endTime', title: 'End time', type: 'string', description: '24-hour, e.g. 10:30', validation: (Rule) => Rule.regex(/^([01]\d|2[0-3]):[0-5]\d$/, {name: 'HH:MM'})}),
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'type', title: 'Type', type: 'string', options: {list: SESSION_TYPES, layout: 'radio'}, initialValue: 'parallel'}),
    defineField({name: 'speaker', title: 'Speaker / chair', type: 'string'}),
    defineField({name: 'room', title: 'Room / hall', type: 'string', description: 'Sessions in the same time slot but different rooms appear side by side'}),
  ],
  preview: {
    select: {title: 'title', time: 'startTime', room: 'room', type: 'type'},
    prepare: ({title, time, room, type}) => ({title, subtitle: [time, type, room].filter(Boolean).join(' · ')}),
  },
})

const programmeDay = defineType({
  name: 'conferenceDay',
  title: 'Programme day',
  type: 'object',
  fields: [
    defineField({name: 'date', title: 'Date', type: 'date', validation: (Rule) => Rule.required()}),
    defineField({name: 'label', title: 'Label', type: 'string', description: 'Optional, e.g. "Day 1 — Opening"'}),
    defineField({name: 'sessions', title: 'Sessions', type: 'array', of: [defineArrayMember({type: 'conferenceSession'})]}),
  ],
  preview: {
    select: {title: 'label', date: 'date', sessions: 'sessions'},
    prepare: ({title, date, sessions}) => ({
      title: title || date,
      subtitle: `${date ?? ''} · ${sessions?.length ?? 0} sessions`,
    }),
  },
})

const speaker = defineType({
  name: 'conferenceSpeaker',
  title: 'Keynote speaker',
  type: 'object',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'title', title: 'Title / position', type: 'string', description: 'e.g. "Professor of Peace Studies"'}),
    defineField({name: 'affiliation', title: 'Affiliation', type: 'string'}),
    imageWithAlt('photo', 'Photo'),
    defineField({name: 'bio', title: 'Biography', type: 'text', rows: 6}),
    defineField({name: 'talkTitle', title: 'Talk title', type: 'string'}),
  ],
  preview: {select: {title: 'name', subtitle: 'affiliation', media: 'photo'}},
})

const committeeMember = defineType({
  name: 'conferenceCommitteeMember',
  title: 'Committee member',
  type: 'object',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'role', title: 'Role', type: 'string', description: 'e.g. "Chair", "Member", "Secretary"'}),
    defineField({name: 'affiliation', title: 'Affiliation', type: 'string'}),
  ],
  preview: {select: {title: 'name', subtitle: 'role'}},
})

const committee = defineType({
  name: 'conferenceCommittee',
  title: 'Committee',
  type: 'object',
  fields: [
    defineField({
      name: 'committeeName',
      title: 'Committee name',
      type: 'string',
      description: 'e.g. "Local Organising Committee"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'members', title: 'Members', type: 'array', of: [defineArrayMember({type: 'conferenceCommitteeMember'})]}),
  ],
  preview: {
    select: {title: 'committeeName', members: 'members'},
    prepare: ({title, members}) => ({title, subtitle: `${members?.length ?? 0} members`}),
  },
})

const sponsor = defineType({
  name: 'conferenceSponsor',
  title: 'Sponsor / partner',
  type: 'object',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required()}),
    imageWithAlt('logo', 'Logo'),
    defineField({name: 'url', title: 'Website', type: 'url', validation: (Rule) => Rule.uri({scheme: ['http', 'https']})}),
  ],
  preview: {select: {title: 'name', media: 'logo'}},
})

const seo = defineType({
  name: 'conferenceSeo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({name: 'metaTitle', title: 'Meta title', type: 'string', validation: (Rule) => Rule.max(70)}),
    defineField({name: 'metaDescription', title: 'Meta description', type: 'text', rows: 3, validation: (Rule) => Rule.max(160)}),
    imageWithAlt('ogImage', 'Social share image', {description: 'Shown when the page is shared. 1200×630 works best.'}),
  ],
})

const paper = defineType({
  name: 'proceedingsPaper',
  title: 'Paper',
  type: 'object',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({name: 'authors', title: 'Authors', type: 'array', of: [{type: 'string'}], validation: (Rule) => Rule.required().min(1)}),
    defineField({name: 'affiliations', title: 'Affiliations', type: 'text', rows: 2}),
    defineField({name: 'abstract', title: 'Abstract', type: 'text', rows: 6}),
    defineField({name: 'pages', title: 'Pages', type: 'string', description: 'e.g. "12–35"'}),
    defineField({name: 'doi', title: 'DOI', type: 'string', description: 'e.g. 10.1234/abcd.2026.001'}),
    defineField({name: 'pdf', title: 'Paper PDF', type: 'file', options: {accept: 'application/pdf'}}),
    defineField({name: 'keywords', title: 'Keywords', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}}),
  ],
  preview: {
    select: {title: 'title', authors: 'authors', pages: 'pages'},
    prepare: ({title, authors, pages}) => ({
      title,
      subtitle: [authors?.slice(0, 2).join(', ') + (authors?.length > 2 ? ' et al.' : ''), pages && `pp. ${pages}`]
        .filter(Boolean)
        .join(' · '),
    }),
  },
})

export const conferenceObjectTypes = [
  venue,
  importantDate,
  fee,
  session,
  programmeDay,
  speaker,
  committeeMember,
  committee,
  sponsor,
  seo,
  paper,
]
