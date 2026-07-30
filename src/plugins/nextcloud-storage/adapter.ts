import type { Adapter, GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types'
import { putFile, deleteFile } from './webdav'

interface CreateAdapterArgs { baseUrl: string; username: string; password: string; mediaRoot: string }

function getFolder(doc: unknown): string {
  return ((doc as Record<string, unknown>).folder as string) || 'projects'
}

export function createNextcloudAdapter(args: CreateAdapterArgs): Adapter {
  return (): GeneratedAdapter => ({
    name: 'nextcloud',
    handleUpload: async ({ file, data }) => {
      const folder = getFolder(data)
      const remotePath = `${args.mediaRoot}/${folder}/${file.filename}`
      await putFile(args.baseUrl, args.username, args.password, remotePath, file.buffer)
      return data
    },
    handleDelete: async ({ doc, filename }) => {
      const folder = getFolder(doc)
      const remotePath = `${args.mediaRoot}/${folder}/${filename}`
      await deleteFile(args.baseUrl, args.username, args.password, remotePath)
    },
    generateURL: ({ filename, data }) =>
      `/api/images/${getFolder(data)}/${filename}`,
    staticHandler: () => new Response('Not found', { status: 404 }),
  })
}
