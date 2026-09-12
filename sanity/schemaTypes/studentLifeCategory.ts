import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'studentLifeCategory',
  title: 'Student Life',
  type: 'document',
  description: 'Ongoing student life content — sports teams, clubs, and societies — as opposed to a dated Event',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'e.g. "Football Club", "Debate Society"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Sports & Recreation', value: 'sports'},
          {title: 'Clubs & Societies', value: 'clubs'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
    }),
    defineField({
      name: 'summary',
      title: 'Short Summary',
      type: 'text',
      rows: 2,
      description: 'One or two sentences shown on the Student Life hub card',
    }),
    defineField({
      name: 'description',
      title: 'Full Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'category', media: 'coverImage'},
  },
})
