import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'tetfundIntervention',
  title: 'TETFund Intervention',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Project / Intervention Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'category',
      title: 'Intervention Category',
      type: 'string',
      options: {
        list: [
          { title: 'Infrastructure', value: 'infrastructure' },
          { title: 'Equipment', value: 'equipment' },
          { title: 'Library', value: 'library' },
          { title: 'ICT', value: 'ict' },
          { title: 'Research', value: 'research' },
          { title: 'Staff Development', value: 'staff-development' },
          { title: 'Academic Development', value: 'academic-development' },
          { title: 'Maintenance', value: 'maintenance' },
          { title: 'Other', value: 'other' },
        ],
        layout: 'dropdown',
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'mainImage',
      title: 'Main Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),

   defineField({
  name: 'gallery',
  title: 'Additional Images',
  type: 'array',
  of: [
    {
      type: 'image',
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'Describe what is visible in the image.',
        }),

        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
          description: 'Optional caption displayed below the image.',
        }),
      ],
    },
  ],
}),

    defineField({
      name: 'year',
      title: 'Intervention Year',
      type: 'number',
      validation: (Rule) => Rule.integer().min(2000).max(2100),
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),

    defineField({
      name: 'status',
      title: 'Project Status',
      type: 'string',
      options: {
        list: [
          { title: 'Completed', value: 'completed' },
          { title: 'Ongoing', value: 'ongoing' },
          { title: 'Planned', value: 'planned' },
        ],
        layout: 'radio',
      },
    }),

    defineField({
      name: 'featured',
      title: 'Featured Intervention',
      type: 'boolean',
      initialValue: false,
    }),

    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      initialValue: 0,
    }),
  ],

  preview: {
    select: {
      title: 'title',
      category: 'category',
      media: 'mainImage',
      year: 'year',
    },

    prepare({ title, category, media, year }) {
      return {
        title,
        subtitle: `${category || 'TETFund'}${year ? ` • ${year}` : ''}`,
        media,
      }
    },
  },
})