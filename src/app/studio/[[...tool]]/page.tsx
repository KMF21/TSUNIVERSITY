import { NextStudio } from 'next-sanity/studio'
import config from '../../../../sanity.config'

// This route makes Sanity Studio live at yourdomain.com/studio —
// same deployment, same domain, no separate hosting needed.
export const dynamic = 'force-static'

export { metadata, viewport } from 'next-sanity/studio'

export default function StudioPage() {
  return <NextStudio config={config} />
}
