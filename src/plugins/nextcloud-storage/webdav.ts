function encodePath(path: string): string {
  return path.split('/').map(encodeURIComponent).join('/');
}

async function ensureDir(
  baseUrl: string,
  username: string,
  password: string,
  remoteDir: string
): Promise<void> {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const segments = remoteDir.split('/').filter(Boolean);
  let currentPath = '';

  for (const segment of segments) {
    currentPath += `/${encodeURIComponent(segment)}`;
    const url = `${normalizedBase}/remote.php/dav/files/${encodeURIComponent(username)}${currentPath}`;
    const auth = Buffer.from(`${username}:${password}`).toString('base64');

    // PROPFIND to check existence — 404 means create it
    const check = await fetch(url, {
      method: 'PROPFIND',
      headers: { Authorization: `Basic ${auth}`, Depth: '0' },
    });

    if (check.status === 404) {
      const create = await fetch(url, {
        method: 'MKCOL',
        headers: { Authorization: `Basic ${auth}` },
      });
      // 405 = already exists, 201 = created
      if (!create.ok && create.status !== 405) {
        throw new Error(`MKCOL failed for ${currentPath}: ${create.status}`);
      }
    }
  }
}

export async function putFile(
  baseUrl: string,
  username: string,
  password: string,
  remotePath: string,
  buffer: Buffer
): Promise<void> {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const dir = remotePath.split('/').slice(0, -1).join('/');
  await ensureDir(baseUrl, username, password, dir);

  const url = `${normalizedBase}/remote.php/dav/files/${encodeURIComponent(username)}/${encodePath(remotePath)}`;
  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  const response = await fetch(url, {
    method: 'PUT',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/octet-stream' },
    body: new Uint8Array(buffer),
  });
  if (!response.ok) throw new Error(`WebDAV PUT failed: ${response.status} ${response.statusText}`);
}

export async function deleteFile(
  baseUrl: string,
  username: string,
  password: string,
  remotePath: string
): Promise<void> {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const url = `${normalizedBase}/remote.php/dav/files/${encodeURIComponent(username)}/${encodePath(remotePath)}`;
  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  const response = await fetch(url, {
    method: 'DELETE',
    headers: { Authorization: `Basic ${auth}` },
  });
  if (!response.ok && response.status !== 404)
    throw new Error(`WebDAV DELETE failed: ${response.status}`);
}

export async function getFile(
  baseUrl: string,
  username: string,
  password: string,
  remotePath: string
): Promise<{ buffer: Buffer; contentType: string }> {
  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const url = `${normalizedBase}/remote.php/dav/files/${encodeURIComponent(username)}/${encodePath(remotePath)}`;
  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  const response = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
  if (!response.ok) throw new Error(`WebDAV GET failed: ${response.status}`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const contentType = response.headers.get('content-type') || 'application/octet-stream';
  return { buffer, contentType };
}
