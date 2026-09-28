import {defineField, defineType} from 'sanity'

// Content for the Rankings & Recognition page. Every ranking carries its own
// source, edition and "as of" date so figures can be refreshed in Studio
// whenever an index updates — no developer needed.
export default defineType({
  name: 'rankingsPage',
  title: 'Rankings & Recognition',
  type: 'document',
  description: 'Everything shown on the Rankings & Recognition page',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', readOnly: true, initialValue: 'Rankings & Recognition'}),
    defineField({name: 'heroHeading', title: 'Hero Heading', type: 'string'}),
    defineField({name: 'heroSubheading', title: 'Hero Subheading', type: 'text', rows: 3}),

    defineField({
      name: 'rankingsIntro',
      title: 'Rankings — Intro',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'rankings',
      title: 'Rankings',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'source', title: 'Source', type: 'string', description: 'e.g. "AD Scientific Index"'},
            {name: 'metric', title: 'Metric', type: 'string', description: 'e.g. "World rank by H-index"'},
            {name: 'position', title: 'Position', type: 'string', description: 'e.g. "7,686"'},
            {name: 'edition', title: 'Edition', type: 'string', description: 'e.g. "2027 edition"'},
            {name: 'asOf', title: 'Data as of', type: 'date'},
            {name: 'note', title: 'Note', type: 'string', description: 'Optional, e.g. "107 academic researchers profiled"'},
            {name: 'url', title: 'Source link', type: 'url'},
          ],
          preview: {select: {title: 'metric', subtitle: 'position'}},
        },
      ],
    }),
    defineField({
      name: 'rankingsMethodNote',
      title: 'Rankings — How to read this',
      description: 'A short, plain-language explanation of what the rankings measure',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'highlights',
      title: 'Highlights',
      description: 'Three short callouts shown under the rankings table',
      type: 'array',
      validation: (Rule) => Rule.max(3),
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', title: 'Title', type: 'string'},
            {name: 'text', title: 'Text', type: 'text', rows: 3},
          ],
          preview: {select: {title: 'title'}},
        },
      ],
    }),

    defineField({name: 'strengthsIntro', title: 'Research Strengths — Intro', type: 'text', rows: 3}),
    defineField({
      name: 'researchStrengths',
      title: 'Research Strengths',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', title: 'Area', type: 'string'},
            {name: 'description', title: 'Description', type: 'text', rows: 3},
            {name: 'linkLabel', title: 'Link label', type: 'string', description: 'e.g. "Subject profile"'},
            {name: 'linkUrl', title: 'Link URL', type: 'string', description: 'A full https:// link, or a page on this site like /tetfund'},
          ],
          preview: {select: {title: 'title'}},
        },
      ],
    }),

    defineField({name: 'awardsIntro', title: 'Awards & Recognition — Intro', type: 'text', rows: 2}),
    defineField({
      name: 'awards',
      title: 'Awards, Distinctions & Recognition',
      description: 'Newest first. Entries display in the order listed here.',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'date', title: 'Date label', type: 'string', description: 'e.g. "2026", "Aug 2026", "Feb 2026"'},
            {name: 'title', title: 'Title', type: 'string'},
            {name: 'description', title: 'Description', type: 'text', rows: 3},
            {
              name: 'links',
              title: 'Source links',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {name: 'label', title: 'Label', type: 'string'},
                    {name: 'url', title: 'URL', type: 'string', description: 'A full https:// link, or a page on this site like /tetfund'},
                  ],
                  preview: {select: {title: 'label', subtitle: 'url'}},
                },
              ],
            },
          ],
          preview: {select: {title: 'title', subtitle: 'date'}},
        },
      ],
    }),

    defineField({name: 'scholarsIntro', title: 'Recognised Scholars — Intro', type: 'text', rows: 2}),
    defineField({
      name: 'scholars',
      title: 'Recognised Scholars',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'name', title: 'Name', type: 'string'},
            {name: 'role', title: 'Role / field', type: 'string'},
            {name: 'summary', title: 'Summary', type: 'text', rows: 4},
            {
              name: 'photo',
              title: 'Photo (optional)',
              type: 'image',
              options: {hotspot: true},
              fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
            },
            {name: 'linkLabel', title: 'Link label', type: 'string'},
            {name: 'linkUrl', title: 'Link URL', type: 'url'},
          ],
          preview: {select: {title: 'name', subtitle: 'role', media: 'photo'}},
        },
      ],
    }),

    defineField({
      name: 'sources',
      title: 'Sources & Notes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', title: 'What it supports', type: 'string', description: 'e.g. "Research ranking"'},
            {name: 'detail', title: 'Source', type: 'string'},
            {name: 'url', title: 'Link (optional)', type: 'url'},
          ],
          preview: {select: {title: 'label', subtitle: 'detail'}},
        },
      ],
    }),
    defineField({
      name: 'lastUpdatedNote',
      title: 'Last updated note',
      type: 'string',
      description: 'e.g. "September 2026"',
    }),
  ],
  preview: {prepare: () => ({title: 'Rankings & Recognition'})},
})
