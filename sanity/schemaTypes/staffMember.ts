import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'staffMember',
  title: 'Staff Directory',
  type: 'document',
  description: 'Individual academic or non-academic staff — for Principal Officers, Deans, and HODs use Leadership instead',
  fields: [
    defineField({
      name: 'name',
      title: 'Full Name',
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
      name: 'title',
      title: 'Title / Rank',
      type: 'string',
      description: 'e.g. "Senior Lecturer", "Lecturer I", "Chief Technologist"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'staffType',
      title: 'Staff Type',
      type: 'string',
      options: {
        list: [
          {title: 'Academic', value: 'academic'},
          {title: 'Non-Academic', value: 'non-academic'},
        ],
      },
      initialValue: 'academic',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'department',
      title: 'Department',
      type: 'reference',
      to: [{type: 'department'}],
      description: 'Leave blank for central-administration non-academic staff not tied to a specific department',
    }),
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'string'}],
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'officeLocation',
      title: 'Office Location',
      type: 'string',
      description: 'e.g. "Room 14, Science Complex"',
    }),
    defineField({
      name: 'qualifications',
      title: 'Qualifications',
      type: 'string',
      description: 'e.g. "PhD, M.Sc, B.Sc"',
    }),
    defineField({
      name: 'specialization',
      title: 'Specialization',
      type: 'string',
    }),
    defineField({
      name: 'bio',
      title: 'Biography',
      type: 'array',
      of: [{type: 'block'}],
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Optional — controls ordering within a department listing',
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'title', media: 'photo'},
  },
})
