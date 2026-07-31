import config from '@payload-config'
import { generatePageMetadata, RootPage } from '@payloadcms/next/views'
import React from 'react'
import { importMap } from '@/app/(payload)/admin/importMap.js'

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<Record<string, string | string[]>>
}

export const generateMetadata = ({ params, searchParams }: Args) =>
  generatePageMetadata({ config, params, searchParams })

const Page = async ({ params, searchParams }: Args) => {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  return (
    <RootPage
      config={config}
      importMap={importMap}
      params={Promise.resolve(resolvedParams)}
      searchParams={Promise.resolve(resolvedSearchParams)}
    />
  )
}

export default Page
