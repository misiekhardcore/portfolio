import { REST_GET, REST_POST, REST_PUT, REST_DELETE, REST_PATCH } from '@payloadcms/next/routes'
import configPromise from '@payload-config'

// Payload's REST handlers expect `params.slug` but Next.js catch-all
// [[...segments]] generates `params.segments`. This is a known type mismatch
// in Payload 3 — the runtime params are forwarded correctly.
export const GET = REST_GET(configPromise) as unknown as (request: Request, context: { params: Promise<{ segments?: string[] }> }) => Promise<Response>
export const POST = REST_POST(configPromise) as unknown as (request: Request, context: { params: Promise<{ segments?: string[] }> }) => Promise<Response>
export const PUT = REST_PUT(configPromise) as unknown as (request: Request, context: { params: Promise<{ segments?: string[] }> }) => Promise<Response>
export const DELETE = REST_DELETE(configPromise) as unknown as (request: Request, context: { params: Promise<{ segments?: string[] }> }) => Promise<Response>
export const PATCH = REST_PATCH(configPromise) as unknown as (request: Request, context: { params: Promise<{ segments?: string[] }> }) => Promise<Response>
