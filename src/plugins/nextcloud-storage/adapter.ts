import type { Adapter, GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types'
import { putFile, deleteFile, getFile } from './webdav'

interface CreateAdapterArgs { baseUrl: string; username: string; password: string; mediaRoot: string }

function getFolder(doc: unknown): string {
  if (!doc) return 'projects'
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
    staticHandler: async (_req, { doc, params: { filename } }) => {
      try {
        const folder = getFolder(doc)
        const remotePath = `${args.mediaRoot}/${folder}/${filename}`
        const { buffer, contentType } = await getFile(
          args.baseUrl, args.username, args.password, remotePath,
        )
        return new Response(new Uint8Array(buffer), {
          headers: {
            'Content-Type': contentType,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
      } catch {
        return new Response('Not found', { status: 404 })
      }
    },
  })
}
