import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    disableLocalStorage: true,
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 576, position: 'centre' },
      { name: 'full', width: 1600, height: undefined, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
    {
      name: 'folder',
      type: 'select',
      defaultValue: 'projects',
      options: [
        { label: 'Projects', value: 'projects' },
        { label: 'Site', value: 'site' },
        { label: 'General', value: 'media' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
