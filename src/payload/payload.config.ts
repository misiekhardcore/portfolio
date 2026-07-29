import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { SiteSettings } from './globals/SiteSettings'

export default buildConfig({
  serverURL: process.env.PAYLOAD_PUBLIC_SERVER_URL || 'http://localhost:3000',
  admin: { user: Users.slug },
  collections: [Users, Media, Projects],
  globals: [SiteSettings],
  editor: lexicalEditor({}),
  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: 'src/payload-types.ts' },
})
