import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import type { Plugin } from 'payload'
import type { NextcloudStorageOptions } from './types'
import { createNextcloudAdapter } from './adapter'

export function nextcloudStorage(options: NextcloudStorageOptions): Plugin {
  const { collections, baseUrl, username, password, mediaRoot = 'Portfolio', enabled = true } = options
  const adapter = createNextcloudAdapter({ baseUrl, username, password, mediaRoot })

  const collectionConfigs = Object.fromEntries(
    Object.entries(collections).map(([slug, collOpts]) => {
      const opts = typeof collOpts === 'object' ? collOpts : {}
      return [slug, { ...opts, adapter }]
    })
  )

  return cloudStoragePlugin({ collections: collectionConfigs, enabled })
}
