import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'academicCalendarEntry',
  title: 'Academic Calendar Entry',
  type: 'document',
  description: 'A single dated item on the academic calendar — registration, exams, breaks, etc.',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'e.g. "First Semester Examinations"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'session',
      title: 'Academic Session',
      type: 'string',
      description: 'e.g. "2025/2026" — used to group entries on the calendar page',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'semester',
      title: 'Semester',
      type: 'string',
      options: {
        list: ['First Semester', 'Second Semester', 'General / Whole Session'],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Resumption', value: 'resumption'},
          {title: 'Registration', value: 'registration'},
          {title: 'Examination', value: 'examination'},
          {title: 'Break', value: 'break'},
          {title: 'Convocation', value: 'convocation'},
          {title: 'Other', value: 'other'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      type: 'date',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      type: 'date',
      description: 'Leave blank for a single-day item',
    }),
    defineField({
      name: 'isPlaceholder',
      title: 'Placeholder / Sample Date',
      type: 'boolean',
      description: 'Turn this OFF once the real, registrar-confirmed date replaces this entry. While ON, the calendar page shows a notice that dates are provisional.',
      initialValue: true,
    }),
  ],
  orderings: [
    {
      title: 'Start Date',
      name: 'startDateAsc',
      by: [{field: 'startDate', direction: 'asc'}],
    },
  ],
  preview: {
    select: {title: 'title', subtitle: 'session', date: 'startDate'},
    prepare({title, subtitle, date}) {
      return {title, subtitle: `${subtitle} · ${date}`}
    },
  },
})
