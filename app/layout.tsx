// app/layout.tsx
import type { Metadata } from 'next'
import './globals.css'

import 'highlight.js/styles/github-dark-dimmed.css'   // works in dark+light
// or: import 'highlight.js/styles/atom-one-dark.css'

import { SpeedInsights } from '@vercel/speed-insights/next'

// Font note: we load via standard <link> tags in the <head> below rather
// than next/font, because next/font downloads font files at build time and
// requires network access to Google Fonts servers. Using <link> tags:
//  • Works identically in all environments (no build-time network dependency)
//  • Still get font-display:swap and preconnect hinting
//  • Easy to swap for self-hosted fonts later (just change the href)
// If you want to self-host for maximum performance/privacy, run:
//   npx next-google-fonts   or   download manually → public/fonts/

export const metadata: Metadata = {
  title: 'Aaron Snowberger, Ph.D. · AI Researcher & Educator',
  description:
    'Lecturer across five Korean universities in AI, programming, IoT, and circuits. Research in handwriting recognition, Physical AI curriculum, and CS education. Twenty years in Korean academia.',
  keywords: [
    'Aaron Snowberger',
    'Physical AI',
    'AI researcher',
    'Korea',
    'computer vision',
    'handwriting recognition',
    'engineering education',
    'KSPAI',
  ],
  authors: [{ name: 'Aaron Snowberger', url: 'https://aaron.kr' }],
  openGraph: {
    title: 'Aaron Snowberger, Ph.D. · AI Researcher & Educator',
    description:
      'Bridging East and West through AI research, engineering education, and the occasional good Korean pour-over.',
    url: 'https://aaron.kr',
    siteName: 'Aaron Snowberger',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aaron Snowberger, Ph.D.',
    description: 'AI Researcher & Educator · Jeonju, Republic of Korea',
  },
  robots: { index: true, follow: true },
  alternates: { canonical: 'https://aaron.kr' },
}

// ── Anti-flash script: reads saved theme/lang/aurora from localStorage
//    and applies them to <html> BEFORE first paint — prevents flicker.
//    Must run synchronously (no defer/async). ──
const antiFlashScript = `
(function() {
  var h = document.documentElement;
  var t = localStorage.getItem('as_theme');
  var l = localStorage.getItem('as_lang');
  var a = localStorage.getItem('as_aurora');
  if (t) h.setAttribute('data-theme', t);
  if (l) h.setAttribute('data-lang', l);
  if (a) h.setAttribute('data-aurora', a);
})();
`

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      data-theme="dark"
      data-lang="en"
      data-aurora="off"
      suppressHydrationWarning
    >
      <head>
        {/* Anti-flash: must be the first script in <head>, before any CSS */}
        <script dangerouslySetInnerHTML={{ __html: antiFlashScript }} />

        {/* Google Fonts — preconnect for speed, then the actual stylesheet */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;0,900;1,400;1,700;1,900&family=DM+Sans:wght@300;400;500;600&family=Noto+Sans+KR:wght@300;400;500&display=swap"
          rel="stylesheet"
        />

        {/* Map Google Font names to the CSS variables used throughout globals.css */}
        <style dangerouslySetInnerHTML={{ __html: `
          :root {
            --font-playfair: 'Playfair Display';
            --font-dm: 'DM Sans';
            --font-kr: 'Noto Sans KR';
          }
        `}} />
      </head>
      <body suppressHydrationWarning>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
