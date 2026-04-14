// lib/wordpress.ts
// WordPress REST API helpers — all fetches use Next.js ISR (revalidate: 3600)

import type { WPPost, WPCategory, WPTag } from '@/types/wordpress'

const WP_API = process.env.WP_API_URL ?? 'https://notes.aaron.kr/wp-json/wp/v2'

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



/** Convert an absolute WP permalink to a root-relative path for Next.js navigation.
 *  Strips whatever domain WP happens to be on (notes.aaron.kr, aaronkr.local, aaron.kr)
 *  so components link to the correct host regardless of environment.
 *  e.g. https://notes.aaron.kr/portfolio/my-item/ → /portfolio/my-item/ */
export function wpLinkToPath(link: string): string {
  try {
    return new URL(link).pathname
  } catch {
    return link
  }
}

/** Get the best available featured image — prefers the inline `featured_image_urls`
 *  field (no extra API call) over the legacy _embed approach. */
export function getFeaturedImage(post: WPPost): string | null {
  // Prefer the new inline field from the mu-plugin (no _embed needed)
  if (post.featured_image_urls) {
    return (
      post.featured_image_urls.large        ??
      post.featured_image_urls.medium_large ??
      post.featured_image_urls.medium       ??
      post.featured_image_urls.full         ??
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

// ── Single post fetchers ───────────────────────────────────────────────────────

/** Fetch a single post by slug from any post type */
export async function getPostBySlug(
  postType: string,
  slug: string
): Promise<WPPost | null> {
  const data = await fetchWP<WPPost[]>(postType, {
    slug,
    _embed: '1',
    per_page: '1',
  })
  return data?.[0] ?? null
}

/** Map a URL path segment to a WP REST endpoint slug */
export const POST_TYPE_MAP: Record<string, string> = {
  blog:        'posts',
  portfolio:   'portfolio',
  research:    'research',
  talks:       'talks',
  courses:     'courses',
  testimonials:'testimonials',
}

/** Map a WP post type name to its REST API endpoint */
export function wpTypeEndpoint(wpType: string): string {
  const m: Record<string, string> = {
    post: 'posts', page: 'pages', portfolio: 'portfolio',
    testimonial: 'testimonials', research: 'research',
    talk: 'talks', course: 'courses',
  }
  return m[wpType] ?? wpType
}

/** Generate static params for a post type (used in generateStaticParams) */
export async function getAllSlugs(
  postType: string
): Promise<{ slug: string }[]> {
  const data = await fetchWP<WPPost[]>(postType, {
    per_page: '100',
    _fields:  'slug',
    orderby:  'date',
    order:    'desc',
  })
  return (data ?? []).map( (p) => ({ slug: p.slug }) )
}

// ── Archive fetchers ──────────────────────────────────────────────────────────

/** All portfolio posts for the archive page */
export async function getPortfolioPosts(perPage = 24): Promise<WPPost[]> {
  const type = process.env.WP_PROJECT_POST_TYPE ?? 'portfolio'
  const data = await fetchWP<WPPost[]>(type, {
    per_page: String(perPage), _embed: '1', orderby: 'date', order: 'desc',
  })
  return data ?? []
}

/** Posts filtered by category slug */
export async function getPostsByCategory(slug: string, perPage = 10): Promise<{
  posts: WPPost[]; categoryName: string
}> {
  const cats = await fetchWP<{ id: number; name: string }[]>('categories', {
    slug, _fields: 'id,name',
  })
  const cat = cats?.[0]
  if (!cat) return { posts: [], categoryName: slug }
  const posts = await fetchWP<WPPost[]>('posts', {
    categories: String(cat.id), per_page: String(perPage),
    _embed: '1', orderby: 'date', order: 'desc',
  })
  return { posts: posts ?? [], categoryName: cat.name }
}

/** Posts filtered by tag slug */
export async function getPostsByTag(slug: string, perPage = 10): Promise<{
  posts: WPPost[]; tagName: string
}> {
  const tags = await fetchWP<{ id: number; name: string }[]>('tags', {
    slug, _fields: 'id,name',
  })
  const tag = tags?.[0]
  if (!tag) return { posts: [], tagName: slug }
  const posts = await fetchWP<WPPost[]>('posts', {
    tags: String(tag.id), per_page: String(perPage),
    _embed: '1', orderby: 'date', order: 'desc',
  })
  return { posts: posts ?? [], tagName: tag.name }
}

// ── Related / adjacent posts ──────────────────────────────────────────────────

/** Related posts: same categories (or just recent posts of same type) */
export async function getRelatedPosts(
  endpoint: string,
  categoryIds: number[],
  excludeId: number,
  perPage = 3,
): Promise<WPPost[]> {
  const base = {
    per_page: String(perPage + 1),
    exclude:  String(excludeId),
    _fields:  'id,title,slug,link,type,date,excerpt_plain,featured_image_urls',
  }
  const params =
    endpoint === 'posts' && categoryIds.length > 0
      ? { ...base, categories: categoryIds.join(',') }
      : base
  const data = await fetchWP<WPPost[]>(endpoint, params)
  return (data ?? []).filter(p => p.id !== excludeId).slice(0, perPage)
}

/** Fetch a single post by WP ID (for preview/redirect support) */
export async function getPostById(id: number): Promise<WPPost | null> {
  // Try common endpoints — WP REST doesn't have a universal "get by ID" endpoint
  for (const endpoint of ['posts', 'pages', 'portfolio', 'research', 'talks', 'courses']) {
    const data = await fetchWP<WPPost[]>(endpoint, {
      include: String(id), per_page: '1', _fields: 'id,slug,link,type',
    })
    if (data?.[0]) return data[0]
  }
  return null
}

/** Fetch all tags with at least one post */
export async function getAllTags(): Promise<WPTag[]> {
  const data = await fetchWP<WPTag[]>('tags', {
    per_page: '100',
    orderby:  'count',
    order:    'desc',
    _fields:  'id,name,slug,count',
  })
  return (data ?? []).filter(t => t.count > 0)
}

/** Fetch ALL categories (used for the Beyond section's all-topics tag list) */
export async function getAllBlogCategories(): Promise<WPCategory[]> {
  const data = await fetchWP<WPCategory[]>('categories', {
    per_page: '100',
    orderby:  'count',
    order:    'desc',
    _fields:  'id,name,slug,count,parent',
  })
  return data ?? []
}

/** Fetch subcategories of the "beyond" parent category (for the Beyond section) */
export async function getBeyondCategories(
  perPage = 12,
): Promise<WPCategory[]> {
  const parentSlug = process.env.WP_BEYOND_CATEGORY ?? 'beyond'

  // Find the parent category ID
  const parents = await fetchWP<WPCategory[]>('categories', {
    slug: parentSlug, _fields: 'id',
  })
  const parentId = parents?.[0]?.id

  // Fetch child categories
  const params: Record<string, string> = {
    per_page: String(perPage),
    orderby:  'count',
    order:    'desc',
    _fields:  'id,name,slug,description,count,meta',
  }
  if (parentId) params.parent = String(parentId)

  const cats = await fetchWP<WPCategory[]>('categories', params)
  return (cats ?? []).filter(c => c.slug !== parentSlug)
}

/** Adjacent posts: one before and one after by date */
export async function getAdjacentPosts(
  endpoint: string,
  date: string,
): Promise<{ prev: WPPost | null; next: WPPost | null }> {
  const fields = 'id,title,slug,link,type,date'
  const [prevData, nextData] = await Promise.all([
    fetchWP<WPPost[]>(endpoint, { before: date, per_page: '1', orderby: 'date', order: 'desc', _fields: fields }),
    fetchWP<WPPost[]>(endpoint, { after:  date, per_page: '1', orderby: 'date', order: 'asc',  _fields: fields }),
  ])
  return { prev: prevData?.[0] ?? null, next: nextData?.[0] ?? null }
}
