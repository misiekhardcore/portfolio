import { NotFoundPage } from '@payloadcms/next/views'
import configPromise from '@payload-config'
import type { ImportMap } from 'payload'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}

const Page = async ({ params, searchParams }: Args) => {
  const config = await configPromise
  const importMap: ImportMap = config.admin?.importMap ?? { baseDir: process.cwd() }
  return <NotFoundPage config={configPromise} importMap={importMap} params={params} searchParams={searchParams} />
}

export default Page
