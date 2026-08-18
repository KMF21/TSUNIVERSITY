import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'TSU Main Website',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',

  // Mounted inside the Next.js app at /studio via NextStudio — this basePath
  // must match the folder the catch-all route lives in.
  basePath: '/studio',

  // Keeps Studio auto-updated to the latest v6.x release, no manual rebuilds.
  autoUpdates: true,

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
