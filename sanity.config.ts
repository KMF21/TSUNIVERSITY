import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'TSU Main Website',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  basePath: '/studio',
  autoUpdates: true,

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            // Singleton: goes straight to the one Site Settings document,
            // skipping the create-new / list view every other type gets.
            S.listItem()
              .title('Site Settings')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
              ),
            S.listItem()
              .title('Contact Information')
              .id('contactPage')
              .child(
                S.document()
                  .schemaType('contactPage')
                  .documentId('contactPage')
              ),
            S.listItem()
              .title('Institutional Facts')
              .id('institutionalFacts')
              .child(
                S.document()
                  .schemaType('institutionalFacts')
                  .documentId('institutionalFacts')
              ),
            S.listItem()
              .title('Rankings & Recognition')
              .id('rankingsPage')
              .child(
                S.document()
                  .schemaType('rankingsPage')
                  .documentId('rankingsPage')
              ),
            S.divider(),
            // Conferences and their proceedings live together, newest first,
            // so ICT can publish a whole conference from one place.
            S.listItem()
              .title('Conferences')
              .id('conferencesGroup')
              .child(
                S.list()
                  .title('Conferences')
                  .items([
                    S.listItem()
                      .title('Conferences')
                      .id('conference')
                      .child(
                        S.documentTypeList('conference')
                          .title('Conferences')
                          .defaultOrdering([{field: 'startDate', direction: 'desc'}])
                      ),
                    S.listItem()
                      .title('Proceedings')
                      .id('proceedings')
                      .child(
                        S.documentTypeList('proceedings')
                          .title('Proceedings')
                          .defaultOrdering([{field: 'year', direction: 'desc'}])
                      ),
                  ])
              ),
            S.divider(),
            ...S.documentTypeListItems().filter(
              (item) =>
                !['siteSettings', 'contactPage', 'institutionalFacts', 'rankingsPage', 'conference', 'proceedings'].includes(
                  item.getId() ?? ''
                )
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})