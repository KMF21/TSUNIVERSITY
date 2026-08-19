import {defineField, defineType} from 'sanity'
import {HomeIcon} from '@sanity/icons'

export default defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: HomeIcon,
  description:
    'Single shared document for homepage-only imagery (Hero, "Who We Are") — there is only ever one of these.',
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      initialValue: 'Site Settings',
      readOnly: true,
    }),
    defineField({
      name: 'heroImage',
      title: 'Homepage Hero Image',
      description: 'Large image on the right side of the homepage hero banner.',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'string', validation: (Rule) => Rule.required()}],
    }),
    defineField({
      name: 'aboutImage',
      title: '"Who We Are" Section Image',
      description: 'Portrait image on the homepage About/Who We Are section.',
      type: 'image',
      options: {hotspot: true},
      fields: [{name: 'alt', title: 'Alt text', type: 'string', validation: (Rule) => Rule.required()}],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Site Settings'}
    },
  },
})