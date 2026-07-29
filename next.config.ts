import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const hostname = process.env.PAYLOAD_PUBLIC_SERVER_URL
  ? new URL(process.env.PAYLOAD_PUBLIC_SERVER_URL).hostname
  : 'localhost'
const isProd = process.env.NODE_ENV === 'production'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: (isProd ? 'https' : 'http') as 'http' | 'https',
        hostname,
        port: isProd ? '' : '3000',
        pathname: '/api/images/**',
      },
    ],
  },
}

export default withPayload(nextConfig)
