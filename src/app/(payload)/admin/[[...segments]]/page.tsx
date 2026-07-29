import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '@payload-config'
import type { ImportMap } from 'payload'

export { generatePageMetadata }

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

const Page = async ({ params, searchParams }: Args) => {
  const resolvedConfig = await config
  const importMap: ImportMap = resolvedConfig.admin?.importMap ?? { baseDir: process.cwd() }
  return <RootPage config={config} importMap={importMap} params={params} searchParams={searchParams} />
}

export default Page
