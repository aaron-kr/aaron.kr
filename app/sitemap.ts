// app/sitemap.ts
// Drop this file into your app/ directory. Next.js will serve it at /sitemap.xml automatically.
// Covers: homepage, static routes, all WP posts, pages, portfolio, research, talks, courses.

import { MetadataRoute } from 'next'

const BASE_URL = 'https://aaron.kr'
const WP_API  = process.env.WP_API_URL || 'https://notes.aaron.kr/wp-json/wp/v2'

type WPItem = { slug: string; modified: string; type?: string }

async function fetchAll(endpoint: string): Promise<WPItem[]> {
  const items: WPItem[] = []
  let page = 1
  while (true) {
    try {
      const res = await fetch(
        `${WP_API}/${endpoint}?per_page=100&page=${page}&_fields=slug,modified,type`,
        { next: { revalidate: 3600 } }
      )
      if (!res.ok) break
      const batch: WPItem[] = await res.json()
      if (!batch.length) break
      items.push(...batch)
      // If fewer than 100 came back, we're on the last page
      if (batch.length < 100) break
      page++
    } catch {
      break
    }
  }
  return items
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // ── Static routes ────────────────────────────────────────────────────────
  const statics: MetadataRoute.Sitemap = [
    { url: BASE_URL,               lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/writing`,  lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/portfolio`,lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]

  // ── WP content ───────────────────────────────────────────────────────────
  // posts  → /%category%/%postname%/ (catch-all route)
  const posts = await fetchAll('posts')
  // pages  → /[...segments] but WP pages typically sit at /<slug>/
  const pages = await fetchAll('pages')
  // CPTs   → /<slug>/ via catch-all
  const portfolio = await fetchAll('portfolio')
  const research  = await fetchAll('research')
  const talks     = await fetchAll('talks')
  const courses   = await fetchAll('courses')

  function toEntry(
    item: WPItem,
    prefix = '',
    priority = 0.7
  ): MetadataRoute.Sitemap[number] {
    return {
      url: `${BASE_URL}${prefix}/${item.slug}`,
      lastModified: new Date(item.modified),
      changeFrequency: 'monthly',
      priority,
    }
  }

  // NOTE: WP posts use /%category%/%postname%/ permalink structure.
  // We can't know the category prefix here without an extra API call,
  // so we emit the slug-only fallback URL that your catch-all handles.
  // If you want full category paths, fetch with ?_fields=slug,modified,categories
  // and resolve category slugs separately (see comment below).
  const postEntries = posts.map(p => toEntry(p, '', 0.7))

  // Pages often live at root level (/<slug>/)
  const pageEntries = pages
    .filter(p => p.slug !== 'home' && p.slug !== 'sample-page')
    .map(p => toEntry(p, '', 0.6))

  const portfolioEntries = portfolio.map(p => toEntry(p, '', 0.7))
  const researchEntries  = research.map(p  => toEntry(p, '', 0.6))
  const talkEntries      = talks.map(p     => toEntry(p, '', 0.6))
  const courseEntries    = courses.map(p   => toEntry(p, '', 0.5))

  return [
    ...statics,
    ...postEntries,
    ...pageEntries,
    ...portfolioEntries,
    ...researchEntries,
    ...talkEntries,
    ...courseEntries,
  ]
}

/*
 * OPTIONAL: To generate full /%category%/%postname%/ URLs in the sitemap,
 * replace the posts fetch above with something like:
 *
 *   const posts = await fetchAll('posts?_fields=slug,modified,categories')
 *   const categories = await fetch(`${WP_API}/categories?per_page=100&_fields=id,slug`).then(r=>r.json())
 *   const catMap = Object.fromEntries(categories.map((c:any) => [c.id, c.slug]))
 *
 * Then in toEntry: `${BASE_URL}/${catMap[post.categories[0]]}/${post.slug}`
 * This requires categories to be included in _fields and a bit more work,
 * but gives Google the canonical permalink.
 */
