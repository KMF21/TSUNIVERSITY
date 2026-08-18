import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  description:
    'Flexible content for static pages like About, History, Vision & Mission — lets staff edit copy without a developer',
  fields: [
    defineField({
      name: 'title',
      title: 'Page Title',
      type: 'string',
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
      name: 'heroHeading',
      title: 'Hero Heading',
      type: 'string',
    }),
    defineField({
      name: 'heroSubheading',
      title: 'Hero Subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
    }),
    defineField({
      name: 'sections',
      title: 'Content Sections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'contentBlock',
          title: 'Content Block',
          fields: [
            {name: 'heading', title: 'Heading', type: 'string'},
            {name: 'body', title: 'Body', type: 'array', of: [{type: 'block'}]},
          ],
        },
        {
          type: 'object',
          name: 'statBlock',
          title: 'Stat Block',
          fields: [
            {name: 'value', title: 'Value', type: 'string', description: 'e.g. "96%", "60+"'},
            {name: 'label', title: 'Label', type: 'string'},
          ],
        },
        {
          type: 'object',
          name: 'milestone',
          title: 'Milestone',
          fields: [
            {name: 'year', title: 'Year', type: 'string'},
            {name: 'title', title: 'Title', type: 'string'},
            {name: 'description', title: 'Description', type: 'text', rows: 2},
          ],
        },
        {
          type: 'object',
          name: 'accordionGroup',
          title: 'Accordion Group',
          description: 'Best for dense, categorized content like TETFund intervention lists',
          fields: [
            {name: 'groupTitle', title: 'Group Title', type: 'string'},
            {
              name: 'items',
              title: 'Items',
              type: 'array',
              of: [
                {
                  type: 'object',
                  fields: [
                    {name: 'heading', title: 'Heading', type: 'string'},
                    {
                      name: 'body',
                      title: 'Body',
                      type: 'array',
                      of: [{type: 'block'}],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'title'},
  },
})
