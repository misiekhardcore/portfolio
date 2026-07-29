import type { CollectionOptions } from '@payloadcms/plugin-cloud-storage/types'
import type { UploadCollectionSlug } from 'payload'

type CollectionOptionsWithoutAdapter = Omit<CollectionOptions, 'adapter'>

export interface NextcloudStorageOptions {
  collections: Partial<Record<UploadCollectionSlug, CollectionOptionsWithoutAdapter | true>>
  baseUrl: string
  username: string
  password: string
  mediaRoot?: string
  enabled?: boolean
}
