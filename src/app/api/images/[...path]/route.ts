import { NextRequest, NextResponse } from 'next/server'

function buildWebDavUrl(pathSegments: string[]): string {
  const base = process.env.NEXTCLOUD_BASE
  const user = process.env.NEXTCLOUD_USER
  const mediaRoot = process.env.NEXTCLOUD_MEDIA_ROOT || 'Portfolio'
  if (!base || !user) throw new Error('Nextcloud config missing')
  const cleanSegments = pathSegments.filter((s) => s && s !== '..')
  const filePath = cleanSegments.join('/')
  return `${base}/remote.php/dav/files/${user}/${mediaRoot}/${filePath}`
}

function authHeader(): string {
  const user = process.env.NEXTCLOUD_USER || ''
  const pass = process.env.NEXTCLOUD_PASS || ''
  const encoded = Buffer.from(`${user}:${pass}`).toString('base64')
  return `Basic ${encoded}`
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params

  try {
    const webdavUrl = buildWebDavUrl(path)
    const res = await fetch(webdavUrl, {
      headers: { Authorization: authHeader() },
      signal: AbortSignal.timeout(5000),
    })

    if (!res.ok) {
      if (res.status === 404) return new NextResponse('Not found', { status: 404 })
      return new NextResponse('Upstream error', { status: 502 })
    }

    const body = res.body
    const contentType = res.headers.get('content-type') ?? 'application/octet-stream'
    const etag = res.headers.get('etag') ?? ''

    return new NextResponse(body, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        ...(etag ? { ETag: etag } : {}),
      },
    })
  } catch {
    return new NextResponse('Upstream error', { status: 502 })
  }
}
