function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/')
}

export async function putFile(
  baseUrl: string, username: string, password: string,
  remotePath: string, buffer: Buffer
): Promise<void> {
  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const url = `${normalizedBase}/remote.php/dav/files/${encodeURIComponent(username)}/${encodePath(remotePath)}`
  const auth = Buffer.from(`${username}:${password}`).toString('base64')
  const response = await fetch(url, {
    method: 'PUT',
    headers: { 'Authorization': `Basic ${auth}`, 'Content-Type': 'application/octet-stream' },
    body: new Uint8Array(buffer),
  })
  if (!response.ok) throw new Error(`WebDAV PUT failed: ${response.status} ${response.statusText}`)
}

export async function deleteFile(
  baseUrl: string, username: string, password: string,
  remotePath: string
): Promise<void> {
  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const url = `${normalizedBase}/remote.php/dav/files/${encodeURIComponent(username)}/${encodePath(remotePath)}`
  const auth = Buffer.from(`${username}:${password}`).toString('base64')
  const response = await fetch(url, {
    method: 'DELETE',
    headers: { 'Authorization': `Basic ${auth}` },
  })
  if (!response.ok && response.status !== 404) throw new Error(`WebDAV DELETE failed: ${response.status}`)
}

export async function getFile(
  baseUrl: string, username: string, password: string,
  remotePath: string
): Promise<{ buffer: Buffer; contentType: string }> {
  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const url = `${normalizedBase}/remote.php/dav/files/${encodeURIComponent(username)}/${encodePath(remotePath)}`
  const auth = Buffer.from(`${username}:${password}`).toString('base64')
  const response = await fetch(url, { headers: { 'Authorization': `Basic ${auth}` } })
  if (!response.ok) throw new Error(`WebDAV GET failed: ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const contentType = response.headers.get('content-type') || 'application/octet-stream'
  return { buffer, contentType }
}
