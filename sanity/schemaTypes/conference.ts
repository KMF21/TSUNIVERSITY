import {defineArrayMember, defineField, defineType} from 'sanity'
import {altTextField, imageWithAlt, TIMEZONES} from './conferenceObjects'

const blocks = (name: string, title: string, group: string, description?: string) =>
  defineField({name, title, group, description, type: 'array', of: [{type: 'block'}]})

// One document per conference *edition*. Every faculty, department, centre or
// institute can host its own; `series` ties editions of the same conference
// together across years. Everything on the public conference page is driven
// from here — a section with no content simply doesn't appear.
export default defineType({
  name: 'conference',
  title: 'Conference',
  type: 'document',
  groups: [
    {name: 'basics', title: 'Basics', default: true},
    {name: 'dates', title: 'Dates & Venue'},
    {name: 'papers', title: 'Call for Papers'},
    {name: 'registration', title: 'Registration'},
    {name: 'programme', title: 'Programme'},
    {name: 'people', title: 'People'},
    {name: 'info', title: 'Travel & Publication'},
    {name: 'media', title: 'Media & Sponsors'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // ── Basics ─────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'basics',
      description: 'e.g. "International Conference on Peace and Development"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'shortName', title: 'Short name', type: 'string', group: 'basics', description: 'e.g. "TSU-ICPD"'}),
    defineField({name: 'edition', title: 'Edition', type: 'string', group: 'basics', description: 'e.g. "3rd"'}),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      group: 'basics',
      validation: (Rule) => Rule.required().integer().min(2000).max(2100),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'basics',
      description: 'Click Generate — it is built from the short name and year, e.g. "tsu-icpd-2026".',
      options: {
        source: (doc) => [(doc as {shortName?: string; title?: string}).shortName || (doc as {title?: string}).title, (doc as {year?: number}).year].filter(Boolean).join(' '),
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'organiser',
      title: 'Organising faculty or department',
      type: 'reference',
      group: 'basics',
      to: [{type: 'faculty'}, {type: 'department'}],
      description: 'Pick the host faculty or department. For a centre or institute, leave this empty and use the field below.',
    }),
    defineField({
      name: 'organiserOther',
      title: 'Organiser (centre / institute / other)',
      type: 'string',
      group: 'basics',
      description: 'Free text, e.g. "Institute of Peace and Conflict Management". Shown when no faculty/department is selected.',
    }),
    defineField({
      name: 'series',
      title: 'Series',
      type: 'string',
      group: 'basics',
      description: 'Use the exact same text on every edition of the same conference (e.g. "TSU International Conference on Peace") so editions are linked.',
    }),
    defineField({name: 'theme', title: 'Theme', type: 'string', group: 'basics', validation: (Rule) => Rule.required()}),
    defineField({name: 'subThemes', title: 'Sub-themes', type: 'array', group: 'basics', of: [{type: 'string'}]}),
    imageWithAlt('heroImage', 'Hero image', {group: 'basics', description: 'Optional but recommended. A branded fallback is used if empty.'}),
    imageWithAlt('logo', 'Conference logo', {group: 'basics'}),
    defineField({
      name: 'featured',
      title: 'Feature on homepage',
      type: 'boolean',
      group: 'basics',
      description: 'Upcoming or ongoing featured conferences appear on the homepage.',
      initialValue: false,
    }),
    blocks('overview', 'Overview', 'basics'),

    // ── Dates & venue ──────────────────────────────────────
    defineField({name: 'startDate', title: 'Start', type: 'datetime', group: 'dates', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'endDate',
      title: 'End',
      type: 'datetime',
      group: 'dates',
      validation: (Rule) =>
        Rule.required().custom((end, context) => {
          const start = (context.document as {startDate?: string} | undefined)?.startDate
          return start && end && end < start ? 'End must be after the start' : true
        }),
    }),
    defineField({
      name: 'timezone',
      title: 'Timezone',
      type: 'string',
      group: 'dates',
      options: {list: TIMEZONES},
      initialValue: 'Africa/Lagos',
      description: 'All times on the public page are shown in this timezone.',
    }),
    defineField({
      name: 'mode',
      title: 'Mode',
      type: 'string',
      group: 'dates',
      options: {
        list: [
          {title: 'In person', value: 'in-person'},
          {title: 'Virtual', value: 'virtual'},
          {title: 'Hybrid', value: 'hybrid'},
        ],
        layout: 'radio',
      },
      initialValue: 'in-person',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'venue', title: 'Venue', type: 'conferenceVenue', group: 'dates'}),
    defineField({
      name: 'importantDates',
      title: 'Important dates',
      type: 'array',
      group: 'dates',
      description: 'Deadlines and milestones. The next upcoming one gets a live countdown.',
      of: [defineArrayMember({type: 'conferenceImportantDate'})],
    }),

    // ── Call for papers ────────────────────────────────────
    blocks('callForPapers', 'Call for papers', 'papers'),
    blocks('submissionGuidelines', 'Submission guidelines', 'papers'),
    defineField({
      name: 'submissionUrl',
      title: 'Submission link',
      type: 'url',
      group: 'papers',
      description: 'External submission system (EasyChair, OpenConf, a form…). Shows a "Submit Paper" button.',
      validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
    }),
    defineField({name: 'templateFile', title: 'Paper template', type: 'file', group: 'papers'}),

    // ── Registration ───────────────────────────────────────
    defineField({
      name: 'registration',
      title: 'Registration',
      type: 'object',
      group: 'registration',
      fields: [
        defineField({name: 'fees', title: 'Fees', type: 'array', of: [defineArrayMember({type: 'conferenceFee'})]}),
        defineField({name: 'instructions', title: 'Instructions', type: 'array', of: [{type: 'block'}]}),
        defineField({
          name: 'registrationUrl',
          title: 'Registration link',
          type: 'url',
          description: 'External registration/payment page. Shows a "Register" button.',
          validation: (Rule) => Rule.uri({scheme: ['http', 'https']}),
        }),
      ],
    }),

    // ── Programme ──────────────────────────────────────────
    defineField({
      name: 'programme',
      title: 'Programme',
      type: 'array',
      group: 'programme',
      description: 'One entry per day, each with its sessions.',
      of: [defineArrayMember({type: 'conferenceDay'})],
    }),
    defineField({name: 'programmePdf', title: 'Programme PDF', type: 'file', group: 'programme', options: {accept: 'application/pdf'}}),

    // ── People ─────────────────────────────────────────────
    defineField({name: 'keynoteSpeakers', title: 'Keynote speakers', type: 'array', group: 'people', of: [defineArrayMember({type: 'conferenceSpeaker'})]}),
    defineField({name: 'committees', title: 'Committees', type: 'array', group: 'people', of: [defineArrayMember({type: 'conferenceCommittee'})]}),
    defineField({
      name: 'contact',
      title: 'Contact',
      type: 'object',
      group: 'people',
      fields: [
        defineField({name: 'email', title: 'Email', type: 'string', validation: (Rule) => Rule.email()}),
        defineField({name: 'phone', title: 'Phone', type: 'string'}),
        defineField({name: 'whatsapp', title: 'WhatsApp', type: 'string', description: 'International format, e.g. +2348012345678'}),
      ],
    }),

    // ── Travel & publication ───────────────────────────────
    blocks('travelAndAccommodation', 'Travel & accommodation', 'info', 'Getting to Jalingo, hotels, visa and invitation-letter information.'),
    blocks('publication', 'Publication', 'info', 'Where accepted papers will be published and indexed.'),

    // ── Media & sponsors ───────────────────────────────────
    defineField({name: 'sponsors', title: 'Sponsors & partners', type: 'array', group: 'media', of: [defineArrayMember({type: 'conferenceSponsor'})]}),
    defineField({
      name: 'gallery',
      title: 'Gallery',
      type: 'array',
      group: 'media',
      description: 'Photos from the event — useful for past editions.',
      of: [defineArrayMember({type: 'image', options: {hotspot: true}, fields: [altTextField]})],
    }),

    // ── SEO ────────────────────────────────────────────────
    defineField({name: 'seo', title: 'SEO', type: 'conferenceSeo', group: 'seo'}),
  ],
  orderings: [
    {title: 'Start date, newest first', name: 'startDesc', by: [{field: 'startDate', direction: 'desc'}]},
    {title: 'Start date, oldest first', name: 'startAsc', by: [{field: 'startDate', direction: 'asc'}]},
  ],
  preview: {
    select: {
      title: 'title',
      shortName: 'shortName',
      year: 'year',
      organiser: 'organiser.name',
      organiserOther: 'organiserOther',
      media: 'heroImage',
    },
    prepare: ({title, shortName, year, organiser, organiserOther, media}) => ({
      title: shortName ? `${shortName} — ${title}` : title,
      subtitle: [year, organiser || organiserOther].filter(Boolean).join(' · '),
      media,
    }),
  },
})
