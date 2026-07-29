import type { Adapter, GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types'
import { putFile, deleteFile } from './webdav'

interface CreateAdapterArgs { baseUrl: string; username: string; password: string; mediaRoot: string }

export function createNextcloudAdapter(args: CreateAdapterArgs): Adapter {
  return ({ collection, prefix }): GeneratedAdapter => ({
    name: 'nextcloud',
    handleUpload: async ({ file, data }) => {
      const folder = data.folder || 'media'
      const remotePath = `${args.mediaRoot}/${folder}/${file.filename}`
      await putFile(args.baseUrl, args.username, args.password, remotePath, file.buffer)
      return data
    },
    handleDelete: async ({ filename }) => {
      await deleteFile(args.baseUrl, args.username, args.password, `${args.mediaRoot}/${filename}`)
    },
    generateURL: ({ filename }) => `/api/images/${filename}`,
    staticHandler: () => new Response('Not found', { status: 404 }),
  })
}
