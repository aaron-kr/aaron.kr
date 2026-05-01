// app/sitemap.ts
// Next.js App Router sitemap — served at /sitemap.xml automatically.
// Covers: homepage, static routes, all WP posts (with category prefix),
// pages, portfolio, research, talks, and courses.

import { MetadataRoute } from 'next'

const BASE_URL = 'https://aaron.kr'
const WP_API   = process.env.WP_API_URL || 'https://notes.aaron.kr/wp-json/wp/v2'

// Extended WP item with optional categories for post URL resolution
type WPItem = {
  slug: string
  modified: string
  type?: string
  categories?: number[]
}

async function fetchAll(endpoint: string, extraFields = ''): Promise<WPItem[]> {
  const items: WPItem[] = []
  let page = 1
  const fields = `slug,modified,type${extraFields ? ',' + extraFields : ''}`

  while (true) {
    try {
      const res = await fetch(
        `${WP_API}/${endpoint}?per_page=100&page=${page}&_fields=${fields}`,
        { next: { revalidate: 3600 } }
      )
      if (!res.ok) break
      const batch: WPItem[] = await res.json()
      if (!batch.length) break
      items.push(...batch)
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
    { url: BASE_URL,                lastModified: new Date(), changeFrequency: 'daily',   priority: 1.0 },
    { url: `${BASE_URL}/writing`,   lastModified: new Date(), changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/portfolio`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
  ]

  // ── Fetch WP content in parallel ─────────────────────────────────────────
  // Posts: fetch with categories so we can build /%category%/%postname%/ URLs
  const [posts, pages, portfolio, research, talks, courses, rawCategories] =
    await Promise.all([
      fetchAll('posts', 'categories'),
      fetchAll('pages'),
      fetchAll('portfolio'),
      fetchAll('research'),
      fetchAll('talks'),
      fetchAll('courses'),
      // Fetch all categories so we can map id → slug for post URLs
      fetch(`${WP_API}/categories?per_page=100&_fields=id,slug`, {
        next: { revalidate: 3600 },
      })
        .then(r => (r.ok ? r.json() : []))
        .catch(() => []) as Promise<Array<{ id: number; slug: string }>>,
    ])

  // Build category id → slug lookup
  const catMap: Record<number, string> = Object.fromEntries(
    rawCategories.map((c) => [c.id, c.slug])
  )

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

  // Posts: use the primary category slug to build the full permalink.
  // Falls back to slug-only if category is unknown (safe — catch-all handles it).
  const postEntries: MetadataRoute.Sitemap = posts.map((p) => {
    const primaryCatId = p.categories?.[0]
    const catSlug = primaryCatId ? catMap[primaryCatId] : undefined
    const url = catSlug
      ? `${BASE_URL}/${catSlug}/${p.slug}`
      : `${BASE_URL}/${p.slug}`
    return {
      url,
      lastModified: new Date(p.modified),
      changeFrequency: 'monthly',
      priority: 0.7,
    }
  })

  // Pages live at root level (/<slug>/)
  const pageEntries = pages
    .filter((p) => p.slug !== 'home' && p.slug !== 'sample-page')
    .map((p) => toEntry(p, '', 0.6))

  const portfolioEntries = portfolio.map((p) => toEntry(p, '/portfolio', 0.7))
  const researchEntries  = research.map((p)  => toEntry(p, '/research',  0.6))
  const talkEntries      = talks.map((p)     => toEntry(p, '/talks',     0.6))
  const courseEntries    = courses.map((p)   => toEntry(p, '/courses',   0.5))

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
