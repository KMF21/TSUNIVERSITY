import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'department',
  title: 'Department',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Department Name',
      type: 'string',
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
      name: 'faculty',
      title: 'Parent Faculty',
      type: 'reference',
      to: [{type: 'faculty'}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'hodName',
      title: 'Head of Department',
      type: 'string',
    }),
    defineField({
      name: 'programsOffered',
      title: 'Programs Offered',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'programName', title: 'Program Name', type: 'string'},
            {
              name: 'level',
              title: 'Level',
              type: 'string',
              options: {
                list: ['PGD', "Bachelor's", "Master's", 'PhD'],
              },
            },
            {name: 'duration', title: 'Duration', type: 'string'},
          ],
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'faculty.name'},
  },
})
