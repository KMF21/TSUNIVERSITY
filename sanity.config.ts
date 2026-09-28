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
            ...S.documentTypeListItems().filter(
              (item) => !['siteSettings', 'institutionalFacts', 'rankingsPage'].includes(item.getId() ?? '')
            ),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})