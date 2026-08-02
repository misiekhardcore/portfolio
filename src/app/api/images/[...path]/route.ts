import { notFound } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
): Promise<Response> {
  const { path } = await params;
  const remotePath = path.join('/');

  const baseUrl = process.env.NEXTCLOUD_BASE;
  const username = process.env.NEXTCLOUD_USER;
  const password = process.env.NEXTCLOUD_PASS;
  const mediaRoot = process.env.NEXTCLOUD_MEDIA_ROOT || 'Portfolio';

  if (!baseUrl || !username || !password) {
    return NextResponse.json({ error: 'Image service not configured' }, { status: 503 });
  }

  // Normalize baseUrl — strip trailing slash
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const url = `${normalizedBase}/remote.php/dav/files/${encodeURIComponent(username)}/${mediaRoot}/${remotePath}`;
  const auth = Buffer.from(`${username}:${password}`).toString('base64');

  const response = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
  });

  if (response.status === 404) {
    notFound();
  }

  if (!response.ok) {
    return NextResponse.json({ error: `Upstream error: ${response.status}` }, { status: 502 });
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  const etag = response.headers.get('etag');

  const headers: Record<string, string> = {
    'Content-Type': contentType,
    'Cache-Control': 'public, max-age=31536000, immutable',
  };
  if (etag) headers['ETag'] = etag;

  return new Response(buffer, { headers });
}
