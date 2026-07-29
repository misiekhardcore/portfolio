import type { CollectionConfig } from 'payload'
import { nextcloudStorage } from '../adapters/nextcloud-storage'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*'],
    // @ts-expect-error - adapter stub returns object, will be properly typed when implemented
    adapter: process.env.NEXTCLOUD_BASE ? nextcloudStorage() : undefined,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}
