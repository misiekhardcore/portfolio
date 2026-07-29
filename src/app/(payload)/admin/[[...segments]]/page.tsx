import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import configPromise from '@payload-config'
import type { ImportMap } from 'payload'

export { generatePageMetadata }

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

const Page = async ({ params, searchParams }: Args) => {
  const config = await configPromise
  const importMap: ImportMap = config.admin?.importMap ?? { baseDir: process.cwd() }
  return <RootPage config={configPromise} importMap={importMap} params={params} searchParams={searchParams} />
}

export default Page
