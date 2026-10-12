import {defineField, defineType} from 'sanity'

// One document per Facts & Figures indicator (academic reputation, staff-to-student
// ratio, gender statistics, research output, etc). Each indicator is self-contained —
// its own stats, tables and bar charts — so Studio editors can add, update or retire
// one indicator at a time without touching the others. Numeric facts that are still
// being compiled can be left blank in a cell/stat and the page shows "pending".
export default defineType({
  name: 'statisticIndicator',
  title: 'Facts & Figures — Indicator',
  type: 'document',
  description: 'One university statistics indicator shown on the Facts & Figures section',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "Gender Statistics"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'indicatorNumber',
      title: 'Indicator number',
      type: 'number',
      description: 'Optional reference number (e.g. from an external ranking framework)',
    }),
    defineField({
      name: 'order',
      title: 'Display order',
      type: 'number',
      description: 'Lower numbers show first on the Facts & Figures index',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'One or two sentences shown in the hero and on the index card',
    }),
    defineField({
      name: 'stats',
      title: 'Headline Stats',
      description: 'Up to 5 figures shown in the stat strip at the top of the page',
      type: 'array',
      validation: (Rule) => Rule.max(5),
      of: [
        {
          type: 'object',
          fields: [
            {name: 'value', title: 'Value', type: 'string', description: 'e.g. "43.6%" — leave blank if still pending'},
            {name: 'label', title: 'Label', type: 'string'},
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        },
      ],
    }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'factsTable',
          title: 'Table',
          fields: [
            {name: 'heading', title: 'Heading', type: 'string'},
            {name: 'intro', title: 'Intro text', type: 'text', rows: 2},
            {
              name: 'columns',
              title: 'Column headings',
              type: 'array',
              of: [{type: 'string'}],
            },
            {
              name: 'rows',
              title: 'Rows',
              type: 'array',
              of: [
                {
                  type: 'object',
                  name: 'tableRow',
                  fields: [
                    {
                      name: 'cells',
                      title: 'Cells',
                      description: 'One entry per column, in the same order. Leave a cell blank for a pending figure.',
                      type: 'array',
                      of: [{type: 'string'}],
                    },
                    {name: 'emphasis', title: 'Emphasise this row (e.g. a total)', type: 'boolean'},
                  ],
                  preview: {select: {cells: 'cells'}, prepare: ({cells}) => ({title: cells?.join(' · ')})},
                },
              ],
            },
            {
              name: 'footerRow',
              title: 'Footer / total row',
              type: 'array',
              of: [{type: 'string'}],
            },
          ],
          preview: {select: {title: 'heading'}},
        },
        {
          type: 'object',
          name: 'barPanel',
          title: 'Bar Chart',
          fields: [
            {name: 'heading', title: 'Heading', type: 'string'},
            {
              name: 'bars',
              title: 'Bars',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {name: 'label', title: 'Label', type: 'string'},
                    {
                      name: 'percent',
                      title: 'Bar fill (0–100)',
                      type: 'number',
                      description: 'How full the bar renders, relative to the largest value in the panel',
                    },
                    {name: 'displayValue', title: 'Displayed value', type: 'string', description: 'e.g. "83.2%" or "9,303"'},
                  ],
                  preview: {select: {title: 'label', subtitle: 'displayValue'}},
                },
              ],
            },
          ],
          preview: {select: {title: 'heading'}},
        },
        {
          type: 'object',
          name: 'note',
          title: 'Note / Legend',
          description: 'A short callout — e.g. "figures pending" or how a figure is calculated',
          fields: [
            {name: 'tone', title: 'Tone', type: 'string', options: {list: ['pending', 'formula', 'info']}, initialValue: 'info'},
            {name: 'text', title: 'Text', type: 'text', rows: 3},
            {name: 'linkHref', title: 'Link URL (optional)', type: 'string', description: 'e.g. "/rankings" — use to point to the full page instead of repeating its content here'},
            {name: 'linkLabel', title: 'Link label (optional)', type: 'string', description: 'e.g. "See the full Rankings & Recognition page"'},
          ],
          preview: {select: {title: 'text'}},
        },
        {
          type: 'object',
          name: 'richText',
          title: 'Text Block',
          fields: [
            {name: 'heading', title: 'Heading', type: 'string'},
            {name: 'body', title: 'Body', type: 'array', of: [{type: 'block'}]},
          ],
          preview: {select: {title: 'heading'}},
        },
      ],
    }),
    defineField({
      name: 'sourceNotes',
      title: 'Sources & Notes',
      type: 'array',
      of: [{type: 'text', rows: 2}],
    }),
    defineField({
      name: 'lastUpdatedNote',
      title: 'Last updated',
      type: 'string',
      description: 'e.g. "October 2026"',
    }),
  ],
  orderings: [
    {
      title: 'Display order',
      name: 'orderAsc',
      by: [{field: 'order', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'summary'},
  },
})
