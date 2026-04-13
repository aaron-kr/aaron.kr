import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'aaron.kr' },
      { protocol: 'https', hostname: 'files.aaron.kr' },
      { protocol: 'https', hostname: 'i0.wp.com' },
      { protocol: 'https', hostname: 'lab.aaron.kr' },
      { protocol: 'https', hostname: 'aaronkr-courses.github.io' },
      { protocol: 'https', hostname: 'aaronsnowberger.com' },
    ],
  },
}

export default nextConfig
