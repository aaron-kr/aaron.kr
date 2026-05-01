// app/robots.ts
// Next.js App Router robots.txt generation — served at /robots.txt automatically.

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/wp-admin/',
          '/wp-login.php',
        ],
      },
    ],
    sitemap: 'https://aaron.kr/sitemap.xml',
    host: 'https://aaron.kr',
  }
}
