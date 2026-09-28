import {defineField, defineType} from 'sanity'

// One document holding the university's headline numbers. It feeds both the
// About page (Institutional Profile) and the Rankings & Recognition stat
// strip, so a figure is edited once and stays consistent everywhere.
export default defineType({
  name: 'institutionalFacts',
  title: 'Institutional Facts',
  type: 'document',
  description:
    "The university's headline numbers and key facts. Edit them here once — they appear on the About and Rankings & Recognition pages.",
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      readOnly: true,
      initialValue: 'Institutional Facts',
    }),
    defineField({
      name: 'stats',
      title: 'Headline Stats',
      description: 'The stat strip at the top of Rankings & Recognition. Four reads best.',
      type: 'array',
      validation: (Rule) => Rule.max(4),
      of: [
        {
          type: 'object',
          fields: [
            {name: 'value', title: 'Value', type: 'string', description: 'e.g. "30,840"'},
            {name: 'label', title: 'Label', type: 'string', description: 'e.g. "Students enrolled"'},
            {name: 'note', title: 'Small note', type: 'string', description: 'e.g. "2025/2026 session"'},
          ],
          preview: {select: {title: 'value', subtitle: 'label'}},
        },
      ],
    }),
    defineField({
      name: 'keyFacts',
      title: 'Key Facts',
      description: 'Label / value pairs, e.g. Established — 2008, by the Taraba State Government',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'value', title: 'Value', type: 'string'},
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        },
      ],
    }),
    defineField({
      name: 'studentCommunity',
      title: 'Student Community',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'label', title: 'Label', type: 'string'},
            {name: 'value', title: 'Value', type: 'string'},
          ],
          preview: {select: {title: 'label', subtitle: 'value'}},
        },
      ],
    }),
    defineField({
      name: 'studentCommunityNote',
      title: 'Student Community Note',
      description: 'Small print under the student figures, e.g. "2025/2026 session · Source: TSU student records"',
      type: 'string',
    }),
  ],
  preview: {prepare: () => ({title: 'Institutional Facts'})},
})
