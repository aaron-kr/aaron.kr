'use client'
// components/GiscusComments.tsx
// Embeds Giscus (GitHub Discussions-based comments).
//
// One-time setup — do this once, then it runs forever:
//   1. Enable Discussions on your GitHub repo:
//        github.com → your repo → Settings → Features → Discussions ✓
//   2. Install the Giscus GitHub App:
//        https://github.com/apps/giscus → Install → select your repo
//   3. Go to https://giscus.app, enter your repo (e.g. "aaron-kr/aaron.kr"),
//      choose "pathname" mapping, pick or create a "Comments" category,
//      then copy the three IDs it shows you.
//   4. Add to .env.local AND to Vercel environment variables:
//        NEXT_PUBLIC_GISCUS_REPO=aaron-kr/aaron.kr
//        NEXT_PUBLIC_GISCUS_REPO_ID=R_xxxxxxxxxx
//        NEXT_PUBLIC_GISCUS_CATEGORY=Comments
//        NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxxxxxxx
//
// Behavior:
//   • Renders nothing when env vars are not set (safe to ship before setup).
//   • Theme syncs with the dark/light toggle automatically (postMessage).
//   • Language syncs with the 한국어/English toggle (re-initialises widget).
//   • Enabled on: blog posts, research, talks  (see PostLayout.tsx).

import { useEffect, useRef } from 'react'

const REPO        = process.env.NEXT_PUBLIC_GISCUS_REPO        ?? ''
const REPO_ID     = process.env.NEXT_PUBLIC_GISCUS_REPO_ID     ?? ''
const CATEGORY    = process.env.NEXT_PUBLIC_GISCUS_CATEGORY    ?? 'Comments'
const CATEGORY_ID = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID ?? ''

function giscusTheme(): string {
  if (typeof document === 'undefined') return 'dark_dimmed'
  return document.documentElement.getAttribute('data-theme') === 'light'
    ? 'light'
    : 'dark_dimmed'
}

function giscusLang(): string {
  if (typeof document === 'undefined') return 'en'
  return document.documentElement.getAttribute('data-lang') === 'ko' ? 'ko' : 'en'
}

function sendTheme(theme: string) {
  const iframe = document.querySelector<HTMLIFrameElement>('.giscus-frame')
  if (!iframe?.contentWindow) return
  iframe.contentWindow.postMessage(
    { giscus: { setConfig: { theme } } },
    'https://giscus.app',
  )
}

export default function GiscusComments() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!REPO || !REPO_ID || !CATEGORY_ID) return
    const container = containerRef.current
    if (!container) return

    function initGiscus() {
      if (!container) return
      // Clear any previous instance before re-injecting
      container.innerHTML = ''

      const script = document.createElement('script')
      script.src                               = 'https://giscus.app/client.js'
      script.setAttribute('data-repo',           REPO)
      script.setAttribute('data-repo-id',        REPO_ID)
      script.setAttribute('data-category',       CATEGORY)
      script.setAttribute('data-category-id',    CATEGORY_ID)
      // Each post's URL path maps to its own GitHub Discussion thread
      script.setAttribute('data-mapping',        'pathname')
      script.setAttribute('data-strict',         '0')
      script.setAttribute('data-reactions-enabled', '1')
      script.setAttribute('data-emit-metadata',  '0')
      // 'bottom' = show existing comments first, then the input box below
      script.setAttribute('data-input-position', 'bottom')
      script.setAttribute('data-theme',          giscusTheme())
      script.setAttribute('data-lang',           giscusLang())
      script.setAttribute('data-loading',        'lazy')
      script.crossOrigin                         = 'anonymous'
      script.async                               = true
      container.appendChild(script)
    }

    initGiscus()

    // Watch both data-theme and data-lang on <html>
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.attributeName === 'data-theme') {
          // Giscus supports live theme switching via postMessage
          sendTheme(giscusTheme())
        }
        if (m.attributeName === 'data-lang') {
          // Language can't be changed via postMessage — reinitialise the widget
          initGiscus()
        }
      }
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-lang'],
    })

    return () => {
      observer.disconnect()
      if (container) container.innerHTML = ''
    }
  }, [])

  // Render nothing if env vars are not configured yet
  if (!REPO || !REPO_ID || !CATEGORY_ID) return null

  return (
    <div className="giscus-outer">
      {/* Section eyebrow — same pattern as post section labels */}
      <div
        className="hero-eyebrow"
        style={{ marginBottom: '2rem', paddingTop: '2.5rem', borderTop: '1px solid var(--rule)' }}
      >
        <div className="ey-line" />
        <span className="ey-txt">
          <span className="en">Discussion</span>
          <span className="ko">댓글</span>
        </span>
      </div>
      <div ref={containerRef} />
    </div>
  )
}
