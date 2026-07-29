import config from '@payload-config'
import { NotFoundPage } from '@payloadcms/next/views'
import type { Metadata } from 'next'
import type { ImportMap } from 'payload'
import React from 'react'

const importMap: ImportMap = {}

type Args = {
  params: Promise<{ segments: string[] }>
  searchParams: Promise<Record<string, string | string[]>>
}

export const generateMetadata = async (): Promise<Metadata> => {
  const cfg = await config
  return {
    title: 'Not Found',
    description: 'Page not found',
    metadataBase: new URL(cfg.serverURL || 'http://localhost:3000'),
  }
}

const NotFound = async ({ params, searchParams }: Args) => {
  const resolvedParams = await params
  const resolvedSearchParams = await searchParams

  return <NotFoundPage config={config} importMap={importMap} params={Promise.resolve(resolvedParams)} searchParams={Promise.resolve(resolvedSearchParams)} />
}

export default NotFound
