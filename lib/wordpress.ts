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
  const type = process.env.WP_PROJECT_POST_TYPE ?? 'portfolio'
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

/** Strip HTML tags AND decode HTML entities from WP rendered fields.
 *  Runs server-side (no DOM), so we use a lookup table for the most
 *  common WP entities plus a numeric-codepoint fallback. */
export function stripHtml(html: string): string {
  // 1. Remove all HTML tags
  const noTags = html.replace(/<[^>]*>/g, '')

  // Named entity lookup — covers everything WP's wpautop / wptexturize emits
  const named: Record<string, string> = {
    '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
    '&apos;': "'", '&nbsp;': ' ',
    // Smart quotes / dashes / ellipsis (wptexturize output)
    '&#8216;': '\u2018', '&#8217;': '\u2019',
    '&#8220;': '\u201C', '&#8221;': '\u201D',
    '&#8212;': '\u2014', '&#8211;': '\u2013',
    '&#8230;': '\u2026',
  }

  return noTags
    .replace(/&[a-zA-Z]+;/g,      (m) => named[m] ?? m)
    .replace(/&#(\d+);/g,         (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .trim()
}

/** Format a WP ISO date string → "Jan 2025" */
export function formatWPDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
  })
}



/** Get the best available featured image — prefers the inline `featured_image_urls`
 *  field (no extra API call) over the legacy _embed approach. */
export function getFeaturedImage(post: WPPost): string | null {
  // Prefer the new inline field from the mu-plugin (no _embed needed)
  if (post.featured_image_urls) {
    return (
      post.featured_image_urls.large ??
      post.featured_image_urls.medium ??
      post.featured_image_urls.full ??
      null
    )
  }
  // Fallback: old _embed approach
  const media = post._embedded?.['wp:featuredmedia']?.[0]
  if (!media) return null
  return (
    media.media_details?.sizes?.large?.source_url ??
    media.media_details?.sizes?.medium?.source_url ??
    media.source_url ??
    null
  )
}
