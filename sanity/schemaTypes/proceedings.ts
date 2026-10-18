import {defineArrayMember, defineField, defineType} from 'sanity'
import {imageWithAlt} from './conferenceObjects'

// The published record of a conference: the full volume plus (optionally)
// each individual paper. Linked to its conference by reference, so the
// conference page can offer a "Proceedings" link and the proceedings page
// can show the conference it belongs to.
export default defineType({
  name: 'proceedings',
  title: 'Conference Proceedings',
  type: 'document',
  fields: [
    defineField({name: 'title', title: 'Title', type: 'string', validation: (Rule) => Rule.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (Rule) => Rule.required().integer().min(2000).max(2100),
    }),
    defineField({
      name: 'conference',
      title: 'Conference',
      type: 'reference',
      to: [{type: 'conference'}],
      description: 'The conference these proceedings belong to. One proceedings volume per conference.',
      validation: (Rule) => Rule.required(),
    }),
    imageWithAlt('coverImage', 'Cover image'),
    defineField({name: 'isbn', title: 'ISBN', type: 'string'}),
    defineField({name: 'issn', title: 'ISSN', type: 'string'}),
    defineField({name: 'doi', title: 'DOI', type: 'string', description: 'e.g. 10.1234/abcd.2026'}),
    defineField({name: 'publisher', title: 'Publisher', type: 'string'}),
    defineField({name: 'editors', title: 'Editors', type: 'array', of: [{type: 'string'}]}),
    defineField({name: 'publishedDate', title: 'Published', type: 'date'}),
    defineField({name: 'fullVolumePdf', title: 'Full volume PDF', type: 'file', options: {accept: 'application/pdf'}}),
    defineField({
      name: 'papers',
      title: 'Papers',
      type: 'array',
      description: 'Title, authors and page range are enough to list a paper. Abstract and PDF are optional.',
      of: [defineArrayMember({type: 'proceedingsPaper'})],
    }),
  ],
  orderings: [
    {title: 'Year, newest first', name: 'yearDesc', by: [{field: 'year', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', year: 'year', conference: 'conference.title', media: 'coverImage'},
    prepare: ({title, year, conference, media}) => ({
      title,
      subtitle: [year, conference].filter(Boolean).join(' · '),
      media,
    }),
  },
})
