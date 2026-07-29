import { NotFoundPage } from '@payloadcms/next/views'
import config from '@payload-config'
import type { ImportMap } from 'payload'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

const NotFound = async ({ params, searchParams }: Args) => {
  const resolvedConfig = await config
  const importMap: ImportMap = resolvedConfig.admin?.importMap ?? { baseDir: process.cwd() }
  return <NotFoundPage config={config} importMap={importMap} params={params} searchParams={searchParams} />
}

export default NotFound
