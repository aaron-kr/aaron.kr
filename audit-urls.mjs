#!/usr/bin/env node
/**
 * audit-urls.mjs — full site audit for aaron.kr
 *
 * Usage:
 *   node audit-urls.mjs                        # audits aaron.kr (production)
 *   node audit-urls.mjs http://localhost:3000  # audits local dev server
 *
 * Output (./audit-results/):
 *   broken-pages.csv          — pages returning non-200/301/302
 *   broken-images.csv         — images returning non-200/301
 *   broken-external-links.csv — external <a href> links returning errors
 *   ok-pages.csv              — all 200 pages (for reference)
 *
 * Requires Node 18+. No external dependencies.
 */

import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

const BASE        = process.argv[2]?.replace(/\/$/, '') || 'https://aaron.kr'
const CONCURRENCY = 5
const TIMEOUT_MS  = 12_000
const OUT_DIR     = './audit-results'

// Domains to skip — they block bot HEAD/GET requests, giving false positives.
// Your own subdomains are checked as "pages" already.
const SKIP_EXTERNAL_DOMAINS = [
  'linkedin.com', 'twitter.com', 'x.com', 'facebook.com',
  'google.com', 'youtube.com', 'instagram.com', 'researchgate.net',
  'aaron.kr', 'notes.aaron.kr', 'files.aaron.kr',
  'courses.aaron.kr', 'pailab.io',
]

mkdirSync(OUT_DIR, { recursive: true })

// ─── helpers ────────────────────────────────────────────────────────────────

async function fetchWithTimeout(url, options = {}) {
  const ctrl  = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, { ...options, signal: ctrl.signal })
  } catch (e) {
    return { ok: false, status: e.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERR', url }
  } finally {
    clearTimeout(timer)
  }
}

async function runInBatches(items, fn, concurrency) {
  const results = []
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency)
    const res   = await Promise.all(batch.map(fn))
    results.push(...res)
    process.stdout.write(`\r    ${Math.min(i + concurrency, items.length)} / ${items.length}   `)
  }
  process.stdout.write('\n')
  return results
}

function writeCsv(filename, rows, cols) {
  const path = resolve(OUT_DIR, filename)
  const esc  = v => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"` : s
  }
  const lines = [cols.join(','), ...rows.map(r => cols.map(c => esc(r[c])).join(','))]
  writeFileSync(path, lines.join('\n') + '\n')
  console.log(`    💾  Saved → ${path}  (${rows.length} rows)`)
}

function shouldSkip(url) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return SKIP_EXTERNAL_DOMAINS.some(d => host === d || host.endsWith('.' + d))
  } catch { return true }
}

// ─── sitemap / crawler ──────────────────────────────────────────────────────

async function getUrlsFromSitemap() {
  console.log(`\n📡  Fetching sitemap from ${BASE}/sitemap.xml …`)
  const res = await fetchWithTimeout(`${BASE}/sitemap.xml`)
  if (res.ok) {
    const xml  = await res.text()
    const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])
    console.log(`    ✅  ${urls.length} URLs in sitemap.xml`)
    return urls
  }
  console.log('    sitemap.xml → ' + res.status + ', trying sitemap_index.xml …')
  const res2 = await fetchWithTimeout(`${BASE}/sitemap_index.xml`)
  if (res2.ok) {
    const xml           = await res2.text()
    const childSitemaps = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1])
    const allUrls       = []
    for (const sm of childSitemaps) {
      const r = await fetchWithTimeout(sm)
      if (r.ok) {
        const x = await r.text()
        allUrls.push(...[...x.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]))
      }
    }
    console.log(`    ✅  ${allUrls.length} URLs across ${childSitemaps.length} child sitemaps`)
    return allUrls
  }
  return null
}

async function crawlFromHomepage() {
  console.log(`\n🕷️   No sitemap — crawling from ${BASE}`)
  console.log('    ⚠️  Add app/sitemap.ts to your Next.js repo to fix this!\n')
  const visited = new Set()
  const queue   = [BASE + '/']
  while (queue.length) {
    const url = queue.shift()
    if (visited.has(url)) continue
    visited.add(url)
    const res = await fetchWithTimeout(url)
    if (!res.ok) continue
    const html  = await res.text()
    const links = [...html.matchAll(/href=["']([^"'#?]+)["']/g)]
      .map(m => m[1])
      .filter(h => h.startsWith(BASE) || h.startsWith('/'))
      .map(h => h.startsWith('http') ? h : BASE + h)
      .map(h => h.replace(/\/$/, '') || BASE + '/')
      .filter(h => !visited.has(h) && !queue.includes(h))
    queue.push(...links)
    process.stdout.write(`\r    crawled ${visited.size}, queued ${queue.length}   `)
  }
  process.stdout.write('\n')
  return [...visited]
}

// ─── content extraction ─────────────────────────────────────────────────────

async function extractContent(pageUrl) {
  const res = await fetchWithTimeout(pageUrl)
  if (!res.ok) return { images: [], externalLinks: [] }
  const html = await res.text()

  const images = [...html.matchAll(/\ssrc=["']([^"']+\.(png|jpg|jpeg|gif|webp|svg|avif))["']/gi)]
    .map(m => m[1])
    .filter(src => !src.startsWith('data:'))
    .map(src => src.startsWith('http') ? src : `${BASE}${src.startsWith('/') ? '' : '/'}${src}`)

  const externalLinks = [...html.matchAll(/href=["'](https?:\/\/[^"']+)["']/gi)]
    .map(m => m[1])
    .filter(href => !href.startsWith(BASE) && !shouldSkip(href))

  return { images: [...new Set(images)], externalLinks: [...new Set(externalLinks)] }
}

async function checkUrl(url) {
  const res = await fetchWithTimeout(url, { method: 'HEAD', redirect: 'follow' })
  return { url, status: res.status ?? 'ERROR' }
}

// ─── main ───────────────────────────────────────────────────────────────────

let rawUrls = await getUrlsFromSitemap()
if (!rawUrls) rawUrls = await crawlFromHomepage()

const urls = rawUrls.map(u => u.replace(/^https?:\/\/aaron\.kr/, BASE))
console.log(`\n    Total URLs to audit: ${urls.length}\n`)

// ── 1. Page statuses ─────────────────────────────────────────────────────────
console.log('🔍  Checking page statuses …')
const pageResults = await runInBatches(urls, checkUrl, CONCURRENCY)
const broken = pageResults.filter(r => ![200,301,302].includes(Number(r.status)))
const ok     = pageResults.filter(r => r.status === 200)
writeCsv('broken-pages.csv', broken.map(r => ({ status: r.status, url: r.url })), ['status','url'])
writeCsv('ok-pages.csv',     ok.map(r    => ({ status: r.status, url: r.url })), ['status','url'])

// ── 2. Extract images + external links from 200 pages ───────────────────────
console.log(`\n🖼️   Scanning ${ok.length} pages for images and external links …`)
const imageMap   = {}
const extLinkMap = {}
for (let i = 0; i < ok.length; i += CONCURRENCY) {
  const batch = ok.slice(i, i + CONCURRENCY)
  await Promise.all(batch.map(async ({ url }) => {
    const { images, externalLinks } = await extractContent(url)
    if (images.length)       imageMap[url]   = images
    if (externalLinks.length) extLinkMap[url] = externalLinks
  }))
  process.stdout.write(`\r    scanned ${Math.min(i + CONCURRENCY, ok.length)} / ${ok.length}   `)
}
process.stdout.write('\n')

// ── 3. Broken images ─────────────────────────────────────────────────────────
const allImageUrls = [...new Set(Object.values(imageMap).flat())]
console.log(`\n    Checking ${allImageUrls.length} unique image URLs …`)
const imgResults = await runInBatches(allImageUrls, checkUrl, CONCURRENCY)
const brokenImgs = imgResults.filter(r => ![200,301].includes(Number(r.status)))
const imgToPages = {}
for (const [page, imgs] of Object.entries(imageMap))
  for (const img of imgs) { if (!imgToPages[img]) imgToPages[img] = []; imgToPages[img].push(page) }
writeCsv('broken-images.csv',
  brokenImgs.map(r => ({
    status: r.status, image_url: r.url,
    found_on: (imgToPages[r.url] || []).slice(0,3).join(' | ')
  })), ['status','image_url','found_on']
)

// ── 4. Broken external links ─────────────────────────────────────────────────
const allExtUrls = [...new Set(Object.values(extLinkMap).flat())]
console.log(`\n    Checking ${allExtUrls.length} unique external link URLs …`)

// HEAD first (fast), fall back to GET if server rejects HEAD
const extResults = await runInBatches(allExtUrls, async url => {
  let res = await fetchWithTimeout(url, { method: 'HEAD', redirect: 'follow' })
  if (res.status === 405) res = await fetchWithTimeout(url, { method: 'GET', redirect: 'follow' })
  return { url, status: res.status ?? 'ERROR' }
}, CONCURRENCY)

const brokenExt = extResults.filter(r => {
  const s = Number(r.status)
  return r.status === 'TIMEOUT' || r.status === 'NETWORK_ERR' || s === 404 || s === 410 || s >= 500
})
const extToPages = {}
for (const [page, links] of Object.entries(extLinkMap))
  for (const link of links) { if (!extToPages[link]) extToPages[link] = []; extToPages[link].push(page) }
writeCsv('broken-external-links.csv',
  brokenExt.map(r => ({
    status: r.status, external_url: r.url,
    found_on: (extToPages[r.url] || []).slice(0,3).join(' | ')
  })), ['status','external_url','found_on']
)

// ── Summary ──────────────────────────────────────────────────────────────────
console.log('\n════════════════════════════════════════')
console.log('  AUDIT SUMMARY')
console.log('════════════════════════════════════════')
console.log(`  Pages checked            : ${pageResults.length}`)
console.log(`  Broken pages             : ${broken.length}`)
console.log(`  Images checked           : ${allImageUrls.length}`)
console.log(`  Broken images            : ${brokenImgs.length}`)
console.log(`  External links checked   : ${allExtUrls.length}`)
console.log(`  Broken external links    : ${brokenExt.length}`)
console.log(`  (Skipped social/own domains — false positive bots)`)
console.log(`\n  Results → ${resolve(OUT_DIR)}/`)
console.log('  ├── broken-pages.csv')
console.log('  ├── broken-images.csv')
console.log('  ├── broken-external-links.csv')
console.log('  └── ok-pages.csv')
console.log('════════════════════════════════════════\n')
