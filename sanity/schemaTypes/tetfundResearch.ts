import {defineField, defineType} from 'sanity'

// One record per piece of TETFund-supported research (a published paper, or
// a featured award such as an NRF grant). Shown in the "TETFund-Supported
// Research" section of the TETFund page — add a record here and it appears.
export default defineType({
  name: 'tetfundResearch',
  title: 'TETFund Research',
  type: 'document',
  description:
    'Published research that acknowledges TETFund support, or a featured research award. Shown on the TETFund page.',
  fields: [
    defineField({
      name: 'title',
      title: 'Research Title',
      description: 'For a featured award, use the award headline, e.g. "Dr Jane Doe: TETFund NRF grant, 2024 cycle"',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fundingType',
      title: 'Funding Type',
      type: 'string',
      options: {
        list: [
          {title: 'TETFund IBR (Institution-Based Research)', value: 'ibr'},
          {title: 'TETFund NRF (National Research Fund)', value: 'nrf'},
          {title: 'TETFund Research Grant', value: 'research-grant'},
          {title: 'TETFund Study Fellowship', value: 'study-fellowship'},
          {title: 'TETFund (other)', value: 'other'},
        ],
        layout: 'dropdown',
      },
      initialValue: 'ibr',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fundingNote',
      title: 'Funding Note',
      description: 'Optional detail shown under the funding type — a grant reference or intervention year, e.g. "2022 intervention"',
      type: 'string',
    }),
    defineField({
      name: 'researchers',
      title: 'TSU Researchers',
      description: 'Names as they should appear, with the department in brackets if known — e.g. "Jane Doe, John Bello (Geography)"',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.integer().min(2000).max(2100),
    }),
    defineField({
      name: 'publication',
      title: 'Journal / Publication',
      description: 'Optional, e.g. "Developing Country Studies"',
      type: 'string',
    }),
    defineField({
      name: 'paperUrl',
      title: 'Link to the Paper',
      description: 'The published paper or its abstract page. Leave blank if there is no public link.',
      type: 'url',
    }),
    defineField({
      name: 'featured',
      title: 'Featured Award',
      description: 'Turn on for a headline award (e.g. an NRF grant). It appears as a highlighted card above the table instead of a table row.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'summary',
      title: 'Summary (featured awards)',
      description: 'A short paragraph explaining the award. Only shown for featured items.',
      type: 'text',
      rows: 4,
      hidden: ({document}) => !document?.featured,
    }),
    defineField({
      name: 'links',
      title: 'Links (featured awards)',
      description: 'e.g. researcher profile, funder announcement. Only shown for featured items.',
      type: 'array',
      hidden: ({document}) => !document?.featured,
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'url', title: 'URL', type: 'url'},
          ],
          preview: {select: {title: 'label', subtitle: 'url'}},
        },
      ],
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      description: 'Optional. Rows are sorted newest year first; this breaks ties (lower numbers first).',
      type: 'number',
    }),
  ],
  preview: {
    select: {title: 'title', type: 'fundingType', year: 'year', featured: 'featured'},
    prepare({title, type, year, featured}) {
      return {
        title,
        subtitle: `${featured ? '★ ' : ''}${type ?? 'tetfund'}${year ? ` • ${year}` : ''}`,
      }
    },
  },
})
