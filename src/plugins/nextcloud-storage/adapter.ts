import type { Adapter, GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types'
import { putFile, deleteFile } from './webdav'

interface CreateAdapterArgs { baseUrl: string; username: string; password: string; mediaRoot: string }

export function createNextcloudAdapter(args: CreateAdapterArgs): Adapter {
  return ({ collection: _, prefix: __ }): GeneratedAdapter => ({
    name: 'nextcloud',
    handleUpload: async ({ file, data }) => {
      const folder = data.folder || 'projects'
      const remotePath = `${args.mediaRoot}/${folder}/${file.filename}`
      await putFile(args.baseUrl, args.username, args.password, remotePath, file.buffer)
      return data
    },
    handleDelete: async ({ doc, filename }) => {
      const folder = doc.folder || 'projects'
      const remotePath = `${args.mediaRoot}/${folder}/${filename}`
      await deleteFile(args.baseUrl, args.username, args.password, remotePath)
    },
    generateURL: ({ filename, data }) => `/api/images/${data.folder || 'projects'}/${filename}`,
    staticHandler: () => new Response('Not found', { status: 404 }),
  })
}
