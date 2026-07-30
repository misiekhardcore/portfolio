import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import { Users } from './collections/Users'
import { Categories } from './collections/Categories'
import { Projects } from './collections/Projects'
import { Media } from './collections/Media'
import { nextcloudStorage } from './plugins/nextcloud-storage'

export default buildConfig({
  typescript: {
    outputFile: 'src/payload-types.ts',
  },
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
  secret: process.env.PAYLOAD_SECRET!,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL!,
    },
  }),
  editor: lexicalEditor(),
  sharp,
  collections: [Users, Categories, Projects, Media],
})
