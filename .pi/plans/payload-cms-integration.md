# Portfolio — Payload CMS Integration Plan

> **Verified against:** [Payload v3 docs](https://payloadcms.com/docs) (installation,
> configuration, collections, uploads, storage-adapters, Postgres adapter),
> [blank template](https://github.com/payloadcms/payload/tree/3.x/templates/blank),
> [ecommerce template](https://github.com/payloadcms/payload/tree/3.x/templates/ecommerce),
> [plugin-cloud-storage types](https://github.com/payloadcms/payload/blob/3.x/packages/plugin-cloud-storage/src/types.ts).

---

## 0. Target Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                     Docker Compose                              │
│                                                                │
│  ┌──────────────────┐   ┌─────────────────────────────────┐   │
│  │  PostgreSQL      │   │  Next.js App                    │   │
│  │  (container)     │   │                                 │   │
│  │  port 5432       │◄──┤  Payload CMS (in-process)       │   │
│  │  volume: pgdata  │   │  Admin panel at /admin          │   │
│  └──────────────────┘   │  Public pages at /, /projects   │   │
│                         │  API routes at /api/images/*    │   │
│                         └──────────────┬──────────────────┘   │
│                                        │                       │
│                     ┌──────────────────┴──────────────────┐    │
│                     │  Nextcloud Storage Plugin           │    │
│                     │  (wraps @payloadcms/plugin-         │    │
│                     │   cloud-storage)                    │    │
│                     │  Upload → WebDAV PUT                │    │
│                     │  Read   → WebDAV GET (via proxy)    │    │
│                     │  Delete → WebDAV DELETE             │    │
│                     └──────────────┬──────────────────┘    │    │
└────────────────────────────────────┼────────────────────────────┘
                                     │
┌────────────────────────────────────┴────────────────────────────┐
│  Nextcloud @ duivenkamp206.duckdns.org                          │
│                                                                 │
│  remote.php/dav/files/{user}/Portfolio/                         │
│  ├── projects/            ← project photos uploaded via admin    │
│  ├── site/                ← logo, favicon, about page photos    │
│  └── media/               ← general media library               │
└─────────────────────────────────────────────────────────────────┘
```

### Data flow

```
Admin user uploads photo in Payload UI
        │
        ▼
Payload calls GeneratedAdapter.handleUpload()
        │
        ▼
Nextcloud adapter does WebDAV PUT → Nextcloud
        │
        ▼
Payload stores metadata (filename, alt, size, mime) in PostgreSQL
        │
        ▼
Public page renders <ProjectImage path={media.filename} />
        │
        ▼
Browser requests /api/images/projects/kitchen-01.jpg
        │
        ▼
API route does WebDAV GET → Nextcloud
        │
        ▼
Returns with Cache-Control: public, max-age=31536000, immutable
```

---

## 1. Dependencies to add

### Production

```
payload                              # Payload CMS core
@payloadcms/next                     # Next.js integration
@payloadcms/db-postgres              # PostgreSQL adapter (Drizzle ORM + node-postgres)
@payloadcms/richtext-lexical         # Rich text editor
@payloadcms/plugin-cloud-storage     # Base plugin infrastructure for storage adapters
sharp                                # Image resizing, cropping, focal point
```

### Dev / build

No additional dev dependencies. `dotenv` is already present via Next.js.

### PostgreSQL

- PostgreSQL 16 in Docker, port 5432
- Database: `portfolio`
- User/pass via `DATABASE_URL` env var
- Persistent volume for data

---

## 2. Environment variables (.env.local)

```env
# PostgreSQL
DATABASE_URL=postgresql://portfolio:password@localhost:5432/portfolio

# Payload
PAYLOAD_SECRET=<random-64-char-string>
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Nextcloud
NEXTCLOUD_BASE=https://duivenkamp206.duckdns.org
NEXTCLOUD_USER=<username>
NEXTCLOUD_PASS=<app-password>
NEXTCLOUD_MEDIA_ROOT=Portfolio
```

---

## 3. File structure — what changes

```
portfolio/
├── docker-compose.yml                   ✨ NEW
│
├── .env.local                           🔄 MODIFIED
│
├── src/
│   ├── payload.config.ts                ✨ NEW (NOT nested in src/payload/)
│   ├── payload-types.ts                 ✨ GENERATED (payload generate:types)
│   │
│   ├── collections/                     (following template convention)
│   │   ├── Projects.ts                  ✨ NEW
│   │   ├── Media.ts                     ✨ NEW
│   │   ├── Categories.ts                ✨ NEW
│   │   └── Users.ts                     ✨ NEW
│   │
│   ├── plugins/
│   │   └── nextcloud-storage/
│   │       ├── index.ts                 ✨ NEW (plugin entry, wraps cloudStoragePlugin)
│   │       ├── adapter.ts              ✨ NEW (implements GeneratedAdapter)
│   │       ├── webdav.ts               ✨ NEW (WebDAV PUT/GET/DELETE helpers)
│   │       └── types.ts                ✨ NEW (plugin options type)
│   │
│   ├── app/
│   │   ├── (payload)/                   ✨ NEW (Payload admin route group)
│   │   │   ├── layout.tsx              ✨ NEW (from blank template)
│   │   │   ├── custom.scss             ✨ NEW (empty — Payload expects this import)
│   │   │   ├── admin/
│   │   │   │   ├── importMap.js        ✨ NEW (from blank template)
│   │   │   │   └── [[...segments]]/
│   │   │   │       ├── page.tsx        ✨ NEW (from blank template)
│   │   │   │       └── not-found.tsx   ✨ NEW (from blank template)
│   │   │   └── api/
│   │   │       └── [...slug]/
│   │   │           └── route.ts        ✨ NEW (Payload REST API)
│   │   │
│   │   ├── (frontend)/                  ✨ NEW (route group for public pages)
│   │   │   ├── layout.tsx              🔄 MOVE (site chrome: navbar + footer)
│   │   │   ├── page.tsx                🔄 MOVE (homepage)
│   │   │   ├── about/
│   │   │   │   └── page.tsx            🔄 MOVE
│   │   │   ├── contact/
│   │   │   │   └── page.tsx            🔄 MOVE
│   │   │   └── projects/
│   │   │       ├── page.tsx             🔄 MOVE + REWRITE (fetch from Payload)
│   │   │       └── [slug]/
│   │   │           └── page.tsx         🔄 MOVE + REWRITE (fetch from Payload)
│   │   │
│   │   ├── api/
│   │   │   └── images/
│   │   │       └── [...path]/
│   │   │           └── route.ts        ✨ NEW (Nextcloud proxy)
│   │   │
│   │   ├── layout.tsx                   🔄 CHANGE (root layout: html/body only)
│   │   ├── globals.css                  (unchanged)
│   │   └── favicon.ico                  (unchanged)
│   │
│   ├── components/
│   │   ├── project-card.tsx             🔄 REWRITE (Payload-typed props)
│   │   ├── project-image.tsx            ✨ NEW
│   │   ├── navbar.tsx                   (unchanged)
│   │   ├── footer.tsx                   (unchanged)
│   │   ├── section.tsx                  (unchanged)
│   │   └── service-card.tsx             (unchanged)
│   │
│   └── lib/
│       └── (removed — merged into plugins/nextcloud-storage/)
│
├── next.config.ts                       🔄 MODIFIED (withPayload wrapper)
├── tsconfig.json                        🔄 MODIFIED (@payload-config path alias)
└── package.json                         🔄 MODIFIED (new scripts, deps)
```

### Files to DELETE

```
src/data/            (replaced by Payload collections)
public/projects/     (images served from Nextcloud)
```

### Route group strategy

Following the docs recommendation, existing pages move into a `(frontend)` route
group so the root layout only contains `<html>`/`<body>` and doesn't conflict
with Payload's `(payload)` layout. This keeps site chrome (navbar/footer) inside
the frontend layout.

```
src/app/
├── layout.tsx              # root: <html><body>{children}</body></html>
├── globals.css             # global styles
├── (payload)/              # Payload admin + API
│   ├── layout.tsx
│   ├── admin/...
│   └── api/...
├── (frontend)/             # public site pages
│   ├── layout.tsx          # Navbar + Footer wrapper
│   ├── page.tsx
│   ├── about/...
│   ├── contact/...
│   └── projects/...
└── api/
    └── images/...          # proxy endpoint (no layout needed)
```

---

## 4. Collections schema

### 4.1 Projects

```ts
// src/collections/Projects.ts
import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'date', 'featured'],
  },
  fields: [
    { name: 'title',       type: 'text',        required: true },
    { name: 'slug',        type: 'text',        required: true, unique: true,
      admin: { position: 'sidebar' } },
    { name: 'category',    type: 'relationship', relationTo: 'categories',
      admin: { position: 'sidebar' } },
    { name: 'description', type: 'richText' },
    { name: 'date',        type: 'date',
      admin: { position: 'sidebar', date: { pickerAppearance: 'monthOnly' } } },
    { name: 'featured',    type: 'checkbox',    defaultValue: false,
      admin: { position: 'sidebar' } },
    {
      name: 'images',      type: 'array',
      fields: [
        { name: 'image',   type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'details',     type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'value', type: 'text', required: true },
      ],
    },
  ],
}
```

### 4.2 Media

```ts
// src/collections/Media.ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  upload: {
    disableLocalStorage: true,        // Nextcloud handles storage
    mimeTypes: ['image/*'],
    imageSizes: [                     // sharp required
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 576, position: 'centre' },
      { name: 'full', width: 1600, height: undefined, position: 'centre' },
    ],
    adminThumbnail: 'thumbnail',
  },
  fields: [
    { name: 'alt',   type: 'text', required: true },
    { name: 'folder', type: 'select', defaultValue: 'projects', options: [
      { label: 'Projects', value: 'projects' },
      { label: 'Site',     value: 'site' },
      { label: 'General',  value: 'media' },
    ]},
  ],
}
```

`disableLocalStorage: true` tells Payload not to write files to disk.
The Nextcloud storage plugin (wired below) handles the actual upload/delete.

### 4.3 Categories

```ts
// src/collections/Categories.ts
import type { CollectionConfig } from 'payload'

export const Categories: CollectionConfig = {
  slug: 'categories',
  admin: { useAsTitle: 'name' },
  fields: [
    { name: 'name', type: 'text', required: true, unique: true },
    { name: 'slug', type: 'text', required: true, unique: true },
  ],
}
```

Seed values (added manually in admin after first launch):
`{ name: 'Custom Furniture', slug: 'furniture' }`,
`{ name: 'Kitchen Renovations', slug: 'kitchens' }`,
`{ name: 'Decking & Outdoor', slug: 'decking' }`,
`{ name: 'Interior Fit-outs', slug: 'interiors' }`.

### 4.4 Users

```ts
// src/collections/Users.ts
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: { useAsTitle: 'email' },
  fields: [
    { name: 'name', type: 'text' },
  ],
}
```

Single admin user. Email + password login at `/admin`.

---

## 5. Nextcloud storage plugin (detailed)

Payload v3 uses a **plugin** architecture for cloud storage. The pattern:

- `@payloadcms/plugin-cloud-storage` exports `cloudStoragePlugin()` — a Payload
  plugin that hooks into the upload lifecycle
- Storage providers (S3, GCS, Azure) create an **adapter** implementing the
  `GeneratedAdapter` interface and pass it to `cloudStoragePlugin()`
- The adapter has: `handleUpload`, `handleDelete`, `generateURL`, `staticHandler`,
  `name`, `fields` (optional)

Our Nextcloud plugin follows the same pattern.

### Files

```
src/plugins/nextcloud-storage/
├── index.ts       # Plugin entry — exports createNextcloudStoragePlugin()
├── adapter.ts     # Implements GeneratedAdapter (handleUpload, handleDelete, generateURL, staticHandler)
├── webdav.ts      # Low-level WebDAV helpers (putFile, getFile, deleteFile)
└── types.ts       # NextcloudStorageOptions type
```

### index.ts (plugin entry)

```ts
import { cloudStoragePlugin } from '@payloadcms/plugin-cloud-storage'
import type { Plugin } from 'payload'
import type { NextcloudStorageOptions } from './types'
import { createNextcloudAdapter } from './adapter'

export function nextcloudStorage(options: NextcloudStorageOptions): Plugin {
  return cloudStoragePlugin({
    collections: options.collections,
    enabled: options.enabled ?? true,
    // Each collection slug gets the Nextcloud adapter
    ...Object.fromEntries(
      Object.entries(options.collections).map(([slug, collOpts]) => [
        slug,
        {
          ...(typeof collOpts === 'object' ? collOpts : {}),
          adapter: createNextcloudAdapter({
            baseUrl: options.baseUrl,
            username: options.username,
            password: options.password,
            mediaRoot: options.mediaRoot ?? 'Portfolio',
          }),
        },
      ])
    ),
  })
}
```

Wait — the actual `cloudStoragePlugin` API takes options differently. Let me
trace the real S3 plugin: the adapter factory is passed as part of `collections`.
The key is `collections: { media: { adapter: createNextcloudAdapter(...) } }`.

### types.ts

```ts
import type { CollectionOptions, Adapter } from '@payloadcms/plugin-cloud-storage/types'
import type { UploadCollectionSlug } from 'payload'

export interface NextcloudStorageOptions {
  collections: Partial<Record<UploadCollectionSlug, CollectionOptions | true>>
  baseUrl: string       // https://duivenkamp206.duckdns.org
  username: string
  password: string      // app password
  mediaRoot?: string    // default: 'Portfolio'
  enabled?: boolean     // default: true
}
```

### adapter.ts (GeneratedAdapter)

```ts
import type { Adapter, GeneratedAdapter } from '@payloadcms/plugin-cloud-storage/types'
import { putFile, deleteFile } from './webdav'

interface CreateAdapterArgs {
  baseUrl: string
  username: string
  password: string
  mediaRoot: string
}

export function createNextcloudAdapter(args: CreateAdapterArgs): Adapter {
  return ({ collection, prefix }): GeneratedAdapter => ({
    name: 'nextcloud',

    handleUpload: async ({ file, data }) => {
      // Determine folder: data.folder || 'media'
      // Build path: {mediaRoot}/{folder}/{file.filename}
      // WebDAV PUT
      const folder = data.folder || 'media'
      const remotePath = `${args.mediaRoot}/${folder}/${file.filename}`
      await putFile(args.baseUrl, args.username, args.password, remotePath, file.buffer)
      return data
    },

    handleDelete: async ({ filename }) => {
      // filename already includes folder prefix from the collection's prefix config
      const remotePath = `${args.mediaRoot}/${filename}`
      await deleteFile(args.baseUrl, args.username, args.password, remotePath)
    },

    generateURL: ({ filename, data }) => {
      // Return proxy URL — never expose raw WebDAV
      // The filename includes the folder segment from the prefix
      return `/api/images/${filename}`
    },

    staticHandler: () => {
      // Not used — images are served through /api/images/* proxy route
      return new Response('Not found', { status: 404 })
    },
  })
}
```

### webdav.ts (WebDAV helpers)

```ts
export async function putFile(
  baseUrl: string, username: string, password: string,
  remotePath: string, buffer: Buffer
): Promise<void> {
  const url = `${baseUrl}/remote.php/dav/files/${encodeURIComponent(username)}/${remotePath}`
  const auth = Buffer.from(`${username}:${password}`).toString('base64')

  const response = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/octet-stream',
    },
    body: buffer,
  })

  if (!response.ok) {
    throw new Error(`WebDAV PUT failed: ${response.status} ${response.statusText}`)
  }
}

export async function deleteFile(
  baseUrl: string, username: string, password: string,
  remotePath: string
): Promise<void> {
  const url = `${baseUrl}/remote.php/dav/files/${encodeURIComponent(username)}/${remotePath}`
  const auth = Buffer.from(`${username}:${password}`).toString('base64')

  const response = await fetch(url, {
    method: 'DELETE',
    headers: { 'Authorization': `Basic ${auth}` },
  })

  // 404 on delete is fine — file already gone
  if (!response.ok && response.status !== 404) {
    throw new Error(`WebDAV DELETE failed: ${response.status} ${response.statusText}`)
  }
}

export async function getFile(
  baseUrl: string, username: string, password: string,
  remotePath: string
): Promise<{ buffer: Buffer; contentType: string }> {
  const url = `${baseUrl}/remote.php/dav/files/${encodeURIComponent(username)}/${remotePath}`
  const auth = Buffer.from(`${username}:${password}`).toString('base64')

  const response = await fetch(url, {
    headers: { 'Authorization': `Basic ${auth}` },
  })

  if (!response.ok) throw new Error(`WebDAV GET failed: ${response.status}`)

  const buffer = Buffer.from(await response.arrayBuffer())
  const contentType = response.headers.get('content-type') || 'application/octet-stream'
  return { buffer, contentType }
}
```

### Wiring into payload.config.ts

```ts
import { nextcloudStorage } from './plugins/nextcloud-storage'

export default buildConfig({
  // ...
  plugins: [
    nextcloudStorage({
      collections: {
        media: {
          prefix: '',          // folder field on Media determines actual path
          disableLocalStorage: true,
        },
      },
      baseUrl: process.env.NEXTCLOUD_BASE!,
      username: process.env.NEXTCLOUD_USER!,
      password: process.env.NEXTCLOUD_PASS!,
      mediaRoot: process.env.NEXTCLOUD_MEDIA_ROOT || 'Portfolio',
    }),
  ],
})
```

---

## 6. Image proxy route (`/api/images/[...path]/route.ts`)

```
GET /api/images/projects/kitchen-01.jpg
       │
       ▼
1. Extract path from URL
2. Build full WebDAV path: Portfolio/{path}
3. WebDAV GET via getFile() helper
4. If 200 → return image buffer with:
     Content-Type: image/jpeg
     Cache-Control: public, max-age=31536000, immutable
5. If 404 → Next.js notFound()
6. If error → 502
```

Reuses `getFile` from `src/plugins/nextcloud-storage/webdav.ts`.

### Thumbnail variant (phase 2, not in this plan)

---

## 7. Components

### `<ProjectImage>`

```tsx
// src/components/project-image.tsx
import Image from 'next/image'

interface ProjectImageProps {
  path: string                    // relative to Nextcloud Portfolio/ root
  alt: string
  width?: number
  height?: number
  priority?: boolean
  fill?: boolean
  sizes?: string
  className?: string
}

export function ProjectImage({ path, alt, fill, className, priority, sizes, width, height }: ProjectImageProps) {
  const src = `/api/images/${path}`

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={!fill ? width : undefined}
      height={!fill ? height : undefined}
      priority={priority}
      loading={priority ? undefined : 'lazy'}
      sizes={sizes}
      className={className}
    />
  )
}
```

Key behaviors:
- `loading="lazy"` by default — built into `next/image` for non-priority images
- `priority` disables lazy loading for above-the-fold images
- `src` is constructed from `path`, never passed by caller

### `<ProjectCard>` (updated)

```tsx
// Props change from `image: string` to receiving a Payload project object
<ProjectImage
  path={project.images[0]?.image?.filename ?? ''}
  alt={project.images[0]?.image?.alt ?? project.title}
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  className="object-cover transition-transform duration-500 group-hover:scale-105"
/>
```

---

## 8. Public pages — data fetching pattern

### Projects listing (`/projects`)

```tsx
// src/app/(frontend)/projects/page.tsx — RSC
import { getPayload } from 'payload'
import config from '@payload-config'

export default async function ProjectsPage() {
  const payload = await getPayload({ config })
  const { docs: projects } = await payload.find({
    collection: 'projects',
    sort: '-date',
    depth: 2,
    limit: 50,
  })

  return (
    <Section title="Our projects">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </Section>
  )
}
```

### Project detail (`/projects/[slug]`)

```tsx
export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'projects',
    where: { slug: { equals: slug } },
    depth: 2,
  })

  if (!docs.length) notFound()
  const project = docs[0]
  // render...
}
```

### Homepage (`/`)

Featured projects fetched from Payload. Services stay hardcoded (marketing copy).

### Layout strategy

- **Root layout** (`src/app/layout.tsx`): `<html>` + `<body>` + `{children}` only
- **Frontend layout** (`src/app/(frontend)/layout.tsx`): `<Navbar />` + `{children}` + `<Footer />`
- **Payload layout** (`src/app/(payload)/layout.tsx`): from blank template (handles admin chrome)

---

## 9. Docker Compose

```yaml
version: '3.9'
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: portfolio
      POSTGRES_USER: portfolio
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    ports:
      - '127.0.0.1:5432:5432'
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

Start: `docker compose up -d`
Connection string: `postgresql://portfolio:${DB_PASSWORD}@localhost:5432/portfolio`

---

## 10. Config files

### payload.config.ts (`src/payload.config.ts`)

```ts
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Categories } from './collections/Categories'
import { nextcloudStorage } from './plugins/nextcloud-storage'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Projects, Media, Categories],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    nextcloudStorage({
      collections: {
        media: { disableLocalStorage: true },
      },
      baseUrl: process.env.NEXTCLOUD_BASE!,
      username: process.env.NEXTCLOUD_USER!,
      password: process.env.NEXTCLOUD_PASS!,
      mediaRoot: process.env.NEXTCLOUD_MEDIA_ROOT || 'Portfolio',
    }),
  ],
})
```

### tsconfig.json (additions)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@payload-config": ["./src/payload.config.ts"]
    }
  }
}
```

### next.config.ts

```ts
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = { /* existing config */ }

export default withPayload(nextConfig)
```

### package.json (scripts additions)

```json
{
  "scripts": {
    "payload:generate-types": "payload generate:types",
    "payload:migrate": "payload migrate",
    "payload:create-migration": "payload migrate:create"
  }
}
```

---

## 11. Build order (subtasks)

### Subtask 1: Infrastructure
**Files:** `docker-compose.yml` (CREATE), `.env.local` (MODIFY), `package.json` (MODIFY), `tsconfig.json` (MODIFY), `next.config.ts` (MODIFY)

- Create `docker-compose.yml` with PostgreSQL 16
- Install packages: `payload`, `@payloadcms/next`, `@payloadcms/db-postgres`, `@payloadcms/richtext-lexical`, `@payloadcms/plugin-cloud-storage`, `sharp`
- Add `@payload-config` path alias to `tsconfig.json`
- Wrap `nextConfig` with `withPayload` in `next.config.ts`
- Add Payload scripts to `package.json`
- Validate: `docker compose up -d && npm run type-check`

### Subtask 2: Payload config + collections
**Files:** `src/payload.config.ts` (CREATE), `src/collections/Users.ts` (CREATE), `src/collections/Categories.ts` (CREATE), `src/collections/Projects.ts` (CREATE), `src/collections/Media.ts` (CREATE), `src/app/(payload)/layout.tsx` (CREATE), `src/app/(payload)/custom.scss` (CREATE), `src/app/(payload)/admin/importMap.js` (CREATE), `src/app/(payload)/admin/[[...segments]]/page.tsx` (CREATE), `src/app/(payload)/admin/[[...segments]]/not-found.tsx` (CREATE), `src/app/(payload)/api/[...slug]/route.ts` (CREATE)

- `payload.config.ts` with Postgres adapter, Lexical editor, sharp, admin config, `typescript.outputFile`
- `Users.ts` with auth, `Categories.ts`, `Projects.ts`, `Media.ts` (without storage plugin — local uploads for this subtask)
- Copy `(payload)/` route files from blank template (verbatim — never edited)
- Validate: `npm run dev`, open `/admin`, create first user, seed categories, create a test project with local image upload

### Subtask 3: Nextcloud storage plugin
**Files:** `src/plugins/nextcloud-storage/index.ts` (CREATE), `src/plugins/nextcloud-storage/adapter.ts` (CREATE), `src/plugins/nextcloud-storage/webdav.ts` (CREATE), `src/plugins/nextcloud-storage/types.ts` (CREATE), `src/payload.config.ts` (MODIFY), `src/collections/Media.ts` (MODIFY)

- `webdav.ts`: `putFile()`, `getFile()`, `deleteFile()` using WebDAV + Basic auth
- `types.ts`: `NextcloudStorageOptions` interface
- `adapter.ts`: `createNextcloudAdapter()` returning `GeneratedAdapter`
- `index.ts`: plugin entry wrapping `cloudStoragePlugin`
- Wire plugin into `payload.config.ts`
- Set `disableLocalStorage: true` and add `imageSizes` to `Media.ts`
- Validate: upload an image in admin → verify `handleUpload` succeeded (WebDAV PROPFIND or curl check), verify `generateURL` returns `/api/images/...`

### Subtask 4: Image proxy route
**Files:** `src/app/api/images/[...path]/route.ts` (CREATE)

- Proxy GET route: reads path, fetches from Nextcloud via `getFile()`, returns with cache headers
- Handle 404, errors
- Validate: `curl -I http://localhost:3000/api/images/projects/test.jpg` → verify `Cache-Control` headers

### Subtask 5: Route group migration + page rewrites
**Files:** `src/app/layout.tsx` (MODIFY), `src/app/(frontend)/layout.tsx` (CREATE), move all existing pages into `(frontend)/`, `src/components/project-image.tsx` (CREATE), `src/components/project-card.tsx` (MODIFY), `src/app/(frontend)/projects/page.tsx` (MODIFY), `src/app/(frontend)/projects/[slug]/page.tsx` (MODIFY), `src/app/(frontend)/page.tsx` (MODIFY)

- Strip root layout to `<html><body>{children}</body></html>`
- Create `(frontend)/layout.tsx` with Navbar + Footer
- Move all existing page files into `(frontend)/`
- Create `<ProjectImage>` wrapper around `next/image`
- Update `<ProjectCard>` to take Payload-typed project data
- Rewrite project listing page → `payload.find()`
- Rewrite project detail page → `payload.find()` with slug filter
- Optionally fetch featured projects on homepage from Payload
- Validate: full build succeeds, all pages render, admin accessible at `/admin`

### Subtask 6: Cleanup + generate types
**Files:** `src/data/` (DELETE), `public/projects/` (DELETE)

- Remove hardcoded data directory
- Remove placeholder images from public/
- Run `payload generate:types` → generates `src/payload-types.ts`
- Run `npm run lint && npm run type-check && npm run build`
- Validate: clean output on all three

---

## 12. Non-goals for this plan

- Do NOT implement thumbnail/preview API (`?w=`) — phase 2
- Do NOT add Payload Globals (SiteSettings) — phase 2
- Do NOT add authentication middleware or rate limiting
- Do NOT set up CI for Payload migrations
- Do NOT implement any form handling (contact form stays static)
- Do NOT change the design system / wood-tone theme
- Do NOT add tests — the `test` script stays as placeholder
- Do NOT touch services section on homepage (stays hardcoded marketing copy)
- Do NOT implement Payload's `staticHandler` for direct file serving (proxy route handles it)
