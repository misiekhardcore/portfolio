import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    // adapter: wired in follow-up PR — Payload serializes collection config
    // for the admin UI, so a stub with functions can't cross the boundary.
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
