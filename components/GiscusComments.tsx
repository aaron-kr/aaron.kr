'use client'
// components/GiscusComments.tsx
// Embeds Giscus (GitHub Discussions-based comments).
//
// Setup steps (one-time):
//   1. Enable Discussions on your GitHub repo (Settings → Features → Discussions)
//   2. Install the Giscus GitHub App: https://github.com/apps/giscus
//   3. Visit https://giscus.app — paste your repo name → copy the generated IDs
//   4. Add to .env.local (and Vercel environment variables):
//        NEXT_PUBLIC_GISCUS_REPO=username/repo
//        NEXT_PUBLIC_GISCUS_REPO_ID=R_xxxxxxxxxx
//        NEXT_PUBLIC_GISCUS_CATEGORY=Comments
//        NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxxxxxxx
//
// The component renders nothing when env vars are not set.
// Theme syncs automatically with the site's dark/light toggle.

import { useEffect, useRef } from 'react'

const REPO          = process.env.NEXT_PUBLIC_GISCUS_REPO          ?? ''
const REPO_ID       = process.env.NEXT_PUBLIC_GISCUS_REPO_ID       ?? ''
const CATEGORY      = process.env.NEXT_PUBLIC_GISCUS_CATEGORY      ?? 'Comments'
const CATEGORY_ID   = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID   ?? ''

function giscusTheme(): string {
  if (typeof document === 'undefined') return 'dark_dimmed'
  return document.documentElement.getAttribute('data-theme') === 'light'
    ? 'light'
    : 'dark_dimmed'
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

    // Inject script
    const script = document.createElement('script')
    script.src                            = 'https://giscus.app/client.js'
    script.setAttribute('data-repo',            REPO)
    script.setAttribute('data-repo-id',         REPO_ID)
    script.setAttribute('data-category',        CATEGORY)
    script.setAttribute('data-category-id',     CATEGORY_ID)
    script.setAttribute('data-mapping',         'pathname')
    script.setAttribute('data-strict',          '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata',   '0')
    script.setAttribute('data-input-position',  'top')
    script.setAttribute('data-theme',           giscusTheme())
    script.setAttribute('data-lang',            'en')
    script.setAttribute('data-loading',         'lazy')
    script.crossOrigin                    = 'anonymous'
    script.async                          = true
    container.appendChild(script)

    // Sync theme when user toggles dark/light
    const observer = new MutationObserver(() => sendTheme(giscusTheme()))
    observer.observe(document.documentElement, {
      attributes: true, attributeFilter: ['data-theme'],
    })

    return () => {
      observer.disconnect()
      if (container) container.innerHTML = ''
    }
  }, [])

  // Render nothing if env vars are not configured
  if (!REPO || !REPO_ID || !CATEGORY_ID) return null

  return (
    <div className="giscus-outer">
      <div className="giscus-lbl">Discussion</div>
      <div ref={containerRef} />
    </div>
  )
}
