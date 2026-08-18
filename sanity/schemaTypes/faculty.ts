import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'faculty',
  title: 'Faculty',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Faculty Name',
      type: 'string',
      description: 'e.g. "Faculty of Engineering"',
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
      name: 'deanName',
      title: "Dean's Name",
      type: 'string',
    }),
    defineField({
      name: 'deanMessage',
      title: "Dean's Message",
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'overview',
      title: 'Overview',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
    }),
    defineField({
      name: 'departments',
      title: 'Departments',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'department'}]}],
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Controls ordering in the faculty grid — lower shows first',
    }),
  ],
  preview: {
    select: {title: 'name', media: 'heroImage'},
  },
})
