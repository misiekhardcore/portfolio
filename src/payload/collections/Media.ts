import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    // adapter: to be wired in follow-up PR — Payload serializes collection
    // config for the admin UI, so a stub with functions can't cross the
    // server/client boundary.
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
