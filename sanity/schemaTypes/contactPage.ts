import {defineArrayMember, defineField, defineType} from 'sanity'

const LINE_KINDS = [
  {title: 'Address / text', value: 'text'},
  {title: 'Email', value: 'email'},
  {title: 'Phone', value: 'phone'},
  {title: 'WhatsApp', value: 'whatsapp'},
]

// Single shared document behind the Contact page. Cards and map are managed
// here so a changed number or email never needs a code change.
export default defineType({
  name: 'contactPage',
  title: 'Contact Information',
  type: 'document',
  description: 'The details shown on the Contact page. There is only ever one of these.',
  fields: [
    defineField({name: 'title', title: 'Internal title', type: 'string', initialValue: 'Contact Information', readOnly: true}),
    defineField({
      name: 'cards',
      title: 'Contact cards',
      type: 'array',
      description: 'Each card appears on the Contact page in this order. Add one per office or department.',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'contactCard',
          fields: [
            defineField({name: 'label', title: 'Card title', type: 'string', description: 'e.g. "Admissions", "ICT Support"', validation: (Rule) => Rule.required()}),
            defineField({
              name: 'lines',
              title: 'Details',
              type: 'array',
              validation: (Rule) => Rule.required().min(1),
              of: [
                defineArrayMember({
                  type: 'object',
                  name: 'contactLine',
                  fields: [
                    defineField({name: 'kind', title: 'Type', type: 'string', options: {list: LINE_KINDS, layout: 'radio'}, initialValue: 'phone', validation: (Rule) => Rule.required()}),
                    defineField({
                      name: 'value',
                      title: 'Value',
                      type: 'string',
                      description: 'Phone and WhatsApp: include the number only, e.g. +2348160695156 or 08035781645.',
                      validation: (Rule) => Rule.required(),
                    }),
                  ],
                  preview: {select: {title: 'value', subtitle: 'kind'}},
                }),
              ],
            }),
          ],
          preview: {select: {title: 'label', lines: 'lines'}, prepare: ({title, lines}) => ({title, subtitle: `${lines?.length ?? 0} detail(s)`})},
        }),
      ],
    }),
    defineField({
      name: 'map',
      title: 'Campus map',
      type: 'object',
      description: 'Optional. Paste a Google Maps "Embed a map" link, or give coordinates. Leave empty to hide the map.',
      fields: [
        defineField({name: 'embedUrl', title: 'Map embed link', type: 'url', validation: (Rule) => Rule.uri({scheme: ['https']})}),
        defineField({name: 'latitude', title: 'Latitude', type: 'number', validation: (Rule) => Rule.min(-90).max(90)}),
        defineField({name: 'longitude', title: 'Longitude', type: 'number', validation: (Rule) => Rule.min(-180).max(180)}),
      ],
    }),
  ],
  preview: {prepare: () => ({title: 'Contact Information'})},
})
