'use client'
/**
 * BrokenLinks.tsx
 *
 * Marks known-broken external links in .wp-content at runtime.
 * Works by loading a static JSON file you generate from audit-urls.mjs,
 * then adding data-broken="true" to matching anchors.
 *
 * Setup:
 *   1. Run: node audit-urls.mjs
 *   2. Convert broken-external-links.csv → public/broken-links.json:
 *        node -e "
 *          const fs = require('fs');
 *          const rows = fs.readFileSync('./audit-results/broken-external-links.csv','utf8')
 *            .split('\n').slice(1).filter(Boolean)
 *            .map(l => l.split(',')[1]?.replace(/^"|"$/g,''));
 *          fs.writeFileSync('./public/broken-links.json', JSON.stringify([...new Set(rows)]));
 *        "
 *   3. Add <BrokenLinks /> to PostLayout.tsx (it's a client component, safe alongside server components)
 *
 * The JSON file is static — regenerate it whenever you run the audit.
 * Zero runtime fetch overhead on pages with no .wp-content.
 */

import { useEffect } from 'react'

export default function BrokenLinks() {
  useEffect(() => {
    const content = document.querySelector('.wp-content')
    if (!content) return

    // Load the list of known-broken URLs
    fetch('/broken-links.json')
      .then(r => r.json())
      .then((brokenUrls: string[]) => {
        if (!brokenUrls.length) return
        const brokenSet = new Set(brokenUrls)

        content.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(a => {
          if (brokenSet.has(a.href)) {
            a.dataset.broken = 'true'
            a.title = `This link may be broken: ${a.href}`
          }
        })
      })
      .catch(() => {
        // Silently fail — broken-links.json doesn't exist yet, no problem
      })
  }, [])

  return null
}

/*
 * Usage in PostLayout.tsx:
 *
 *   import BrokenLinks from '@/components/BrokenLinks'
 *
 *   // Inside the JSX, after your .wp-content div:
 *   <BrokenLinks />
 *
 * That's it. The component renders nothing visible —
 * it only adds data attributes to existing anchors.
 */
