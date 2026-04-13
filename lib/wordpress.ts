// lib/wordpress.ts
// WordPress REST API helpers — all fetches use Next.js ISR (revalidate: 3600)

import type { WPPost } from '@/types/wordpress'

const WP_API = process.env.WP_API_URL ?? 'https://aaron.kr/wp-json/wp/v2'

// ── Generic fetcher with ISR caching ──────────────────────────────────────────
async function fetchWP<T>(
  endpoint: string,
  params: Record<string, string> = {}
): Promise<T | null> {
  const url = new URL(`${WP_API}/${endpoint}`)
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))

  try {
    const res = await fetch(url.toString(), {
      next: { revalidate: 3600 }, // ISR: refresh at most once per hour
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    // Network error or WP not reachable — return null so callers use fallback
    return null
  }
}

// ── Design / Projects ──────────────────────────────────────────────────────────
// Assumes a custom post type registered as `project` in WordPress.
// Adjust WP_PROJECT_POST_TYPE env var if your slug differs (e.g. "portfolio").
export async function getDesignPosts(perPage = 4): Promise<WPPost[]> {
  const type = process.env.WP_PROJECT_POST_TYPE ?? 'project'
  const data = await fetchWP<WPPost[]>(type, {
    per_page: String(perPage),
    _embed: '1',
    orderby: 'date',
    order: 'desc',
  })
  return data ?? []
}

// ── Writing / Blog Posts ───────────────────────────────────────────────────────
export async function getWritingPosts(
  perPage?: number
): Promise<WPPost[]> {
  const n = perPage ?? Number(process.env.WP_WRITING_PER_PAGE ?? 8)
  const data = await fetchWP<WPPost[]>('posts', {
    per_page: String(n),
    _embed: '1',
    orderby: 'date',
    order: 'desc',
  })
  return data ?? []
}

// ── Beyond Posts (personal interest category) ─────────────────────────────────
export async function getBeyondPosts(perPage = 6): Promise<WPPost[]> {
  const slug = process.env.WP_BEYOND_CATEGORY ?? 'beyond'
  // WP REST API accepts category slug via the `slug` filter on /categories first,
  // then filters posts — or you can use category IDs. This approach fetches by slug.
  const cats = await fetchWP<{ id: number }[]>('categories', { slug })
  const catId = cats?.[0]?.id

  const data = await fetchWP<WPPost[]>('posts', {
    per_page: String(perPage),
    ...(catId ? { categories: String(catId) } : {}),
    _embed: '1',
    orderby: 'date',
    order: 'desc',
  })
  return data ?? []
}

// ── Utilities ─────────────────────────────────────────────────────────────────
/** Strip HTML tags from WP rendered title/excerpt */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

/** Format a WP ISO date string → "Jan 2025" */
export function formatWPDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}

/** Get the best available featured image URL from an embedded WP post */
export function getFeaturedImage(post: WPPost): string | null {
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  if (!media) return null
  return (
    media.media_details?.sizes?.large?.source_url ??
    media.media_details?.sizes?.medium?.source_url ??
    media.source_url ??
    null
  )
}
