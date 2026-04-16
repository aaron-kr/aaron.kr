#!/usr/bin/env node
/**
 * audit-wp-images.mjs — WordPress media audit for aaron.kr
 *
 * Queries the WP REST API directly to find broken image URLs across ALL
 * post types — including featured images that never appear in rendered HTML.
 * This catches the "old import linked images to files.aaron.kr incorrectly" problem.
 *
 * Usage:
 *   node audit-wp-images.mjs
 *
 * Output (./audit-results/):
 *   wp-broken-featured-images.csv   — posts with broken featured_image URLs
 *   wp-broken-content-images.csv    — posts with broken <img> URLs inside post_content
 *   wp-all-media.csv                — every media attachment and its status
 *
 * Config: edit the WP_API constant below or set WP_API_URL in your env.
 */

import { writeFileSync, mkdirSync } from 'fs'
import { resolve } from 'path'

const WP_API      = process.env.WP_API_URL || 'https://notes.aaron.kr/wp-json/wp/v2'
const FILES_BASE  = 'https://files.aaron.kr'  // your media domain
const CONCURRENCY = 8
const TIMEOUT_MS  = 10_000
const OUT_DIR     = './audit-results'

mkdirSync(OUT_DIR, { recursive: true })

// ─── helpers ────────────────────────────────────────────────────────────────

async function fetchWithTimeout(url, options = {}) {
  const ctrl  = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS)
  try {
    return await fetch(url, { ...options, signal: ctrl.signal })
  } catch (e) {
    return { ok: false, status: e.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERR' }
  } finally {
    clearTimeout(timer)
  }
}

async function fetchAllPages(endpoint) {
  const items = []
  let page    = 1
  process.stdout.write(`  Fetching ${endpoint} `)
  while (true) {
    const res = await fetchWithTimeout(`${WP_API}/${endpoint}&per_page=100&page=${page}`)
    if (!res.ok) break
    const batch = await res.json()
    if (!Array.isArray(batch) || batch.length === 0) break
    items.push(...batch)
    process.stdout.write('.')
    if (batch.length < 100) break
    page++
  }
  process.stdout.write(` (${items.length})\n`)
  return items
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
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }
  const lines = [
    cols.join(','),
    ...rows.map(r => cols.map(c => esc(r[c])).join(','))
  ]
  writeFileSync(path, lines.join('\n') + '\n')
  console.log(`    💾  Saved → ${path}  (${rows.length} rows)`)
}

function extractImgSrcs(html = '') {
  return [...(html).matchAll(/<img[^>]+src=["']([^"']+)["']/gi)]
    .map(m => m[1])
    .filter(src => !src.startsWith('data:'))
}

// ─── fetch all post types ────────────────────────────────────────────────────

const ENDPOINTS = [
  'posts?_fields=id,slug,title,featured_media,featured_image_urls,content,type',
  'pages?_fields=id,slug,title,featured_media,featured_image_urls,content,type',
  'portfolio?_fields=id,slug,title,featured_media,featured_image_urls,content,type',
  'research?_fields=id,slug,title,featured_media,featured_image_urls,content,type',
  'talks?_fields=id,slug,title,featured_media,featured_image_urls,content,type',
  'courses?_fields=id,slug,title,featured_media,featured_image_urls,content,type',
]

console.log('\n📡  Fetching all posts from WP REST API …\n')
const allPosts = []
for (const ep of ENDPOINTS) {
  try {
    const items = await fetchAllPages(ep)
    allPosts.push(...items)
  } catch {
    // endpoint may not exist — skip silently
  }
}
console.log(`\n    Total posts fetched: ${allPosts.length}\n`)

// ── Also fetch the full media library ───────────────────────────────────────
console.log('🗂️   Fetching media library …')
const mediaItems = await fetchAllPages('media?_fields=id,slug,source_url,post,media_details')

// ─── check featured image URLs ──────────────────────────────────────────────

// Collect all unique image URLs to check
const featuredImageRows = []
for (const post of allPosts) {
  // featured_image_urls is the custom REST field from your mu-plugin
  const fiu = post.featured_image_urls
  if (!fiu) continue

  const candidates = [
    fiu.full?.[0],
    fiu.large?.[0],
    fiu.medium?.[0],
    fiu.thumbnail?.[0],
  ].filter(Boolean)

  for (const url of candidates) {
    featuredImageRows.push({
      post_type: post.type || 'post',
      post_id:   post.id,
      slug:      post.slug,
      title:     post.title?.rendered || post.slug,
      image_url: url,
      size:      url === fiu.full?.[0]  ? 'full'
               : url === fiu.large?.[0] ? 'large'
               : url === fiu.medium?.[0]? 'medium'
               : 'thumbnail',
    })
  }
}

console.log(`🖼️   Checking ${featuredImageRows.length} featured image URLs …`)
const uniqueFeaturedUrls = [...new Set(featuredImageRows.map(r => r.image_url))]
const featuredStatuses   = {}
await runInBatches(uniqueFeaturedUrls, async url => {
  const res = await fetchWithTimeout(url, { method: 'HEAD', redirect: 'follow' })
  featuredStatuses[url] = res.status ?? 'ERROR'
}, CONCURRENCY)

const brokenFeatured = featuredImageRows.filter(r => {
  const s = Number(featuredStatuses[r.image_url])
  return ![200, 301, 302].includes(s)
}).map(r => ({ ...r, http_status: featuredStatuses[r.image_url] }))

// Deduplicate for CSV (one row per broken URL per post, full size only)
const brokenFeaturedDeduped = brokenFeatured.filter(r => r.size === 'full' || r.size === 'large')

writeCsv(
  'wp-broken-featured-images.csv',
  brokenFeaturedDeduped,
  ['http_status', 'post_type', 'post_id', 'slug', 'title', 'size', 'image_url']
)

// ─── check content images ────────────────────────────────────────────────────

console.log(`\n📄  Scanning post content for inline images …`)
const contentImageRows = []
for (const post of allPosts) {
  const html = post.content?.rendered || ''
  const srcs = extractImgSrcs(html)
  for (const src of srcs) {
    contentImageRows.push({
      post_type: post.type || 'post',
      post_id:   post.id,
      slug:      post.slug,
      title:     post.title?.rendered || post.slug,
      image_url: src,
    })
  }
}
console.log(`    Found ${contentImageRows.length} inline images across all posts.`)

const uniqueContentUrls = [...new Set(contentImageRows.map(r => r.image_url))]
console.log(`    Checking ${uniqueContentUrls.length} unique content image URLs …`)
const contentStatuses = {}
await runInBatches(uniqueContentUrls, async url => {
  const res = await fetchWithTimeout(url, { method: 'HEAD', redirect: 'follow' })
  contentStatuses[url] = res.status ?? 'ERROR'
}, CONCURRENCY)

const brokenContent = contentImageRows
  .filter(r => {
    const s = Number(contentStatuses[r.image_url])
    return ![200, 301, 302].includes(s)
  })
  .map(r => ({ ...r, http_status: contentStatuses[r.image_url] }))
  // Deduplicate: one row per (post_id, image_url)
  .filter((r, i, arr) =>
    arr.findIndex(x => x.post_id === r.post_id && x.image_url === r.image_url) === i
  )

writeCsv(
  'wp-broken-content-images.csv',
  brokenContent,
  ['http_status', 'post_type', 'post_id', 'slug', 'title', 'image_url']
)

// ─── media library audit ────────────────────────────────────────────────────

console.log(`\n🗂️   Checking ${mediaItems.length} media library entries …`)
const mediaStatuses = {}
await runInBatches(mediaItems.map(m => m.source_url).filter(Boolean), async url => {
  const res = await fetchWithTimeout(url, { method: 'HEAD', redirect: 'follow' })
  mediaStatuses[url] = res.status ?? 'ERROR'
}, CONCURRENCY)

const mediaRows = mediaItems.map(m => ({
  media_id:   m.id,
  source_url: m.source_url,
  post_id:    m.post,
  status:     mediaStatuses[m.source_url] ?? 'NOT_CHECKED',
}))
const brokenMedia = mediaRows.filter(r => ![200,301,302].includes(Number(r.status)))

writeCsv('wp-all-media.csv', mediaRows, ['status', 'media_id', 'post_id', 'source_url'])

// ─── summary ────────────────────────────────────────────────────────────────

console.log('\n════════════════════════════════════════')
console.log('  WP IMAGE AUDIT SUMMARY')
console.log('════════════════════════════════════════')
console.log(`  Posts/pages audited         : ${allPosts.length}`)
console.log(`  Broken featured images      : ${brokenFeaturedDeduped.length}`)
console.log(`  Posts w/ broken content img : ${[...new Set(brokenContent.map(r=>r.post_id))].length}`)
console.log(`  Total broken content images : ${brokenContent.length}`)
console.log(`  Media library entries       : ${mediaItems.length}`)
console.log(`  Broken media library files  : ${brokenMedia.length}`)
console.log(`\n  Results saved to: ${resolve(OUT_DIR)}/`)
console.log('  ├── wp-broken-featured-images.csv')
console.log('  ├── wp-broken-content-images.csv')
console.log('  └── wp-all-media.csv')
console.log('════════════════════════════════════════\n')
console.log('  💡 Tip: Open the CSVs in Numbers/Excel. Sort by http_status.')
console.log('     404 = file missing from files.aaron.kr')
console.log('     TIMEOUT = server too slow or domain DNS issue')
console.log('     NETWORK_ERR = domain doesn\'t exist\n')
