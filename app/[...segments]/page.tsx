// app/[...segments]/page.tsx
//
// Handles ALL URL patterns that don't match a more specific route:
//
//   /%category%/%postname%/    →  /design/my-post, /teaching/lecture-1
//   /portfolio/my-item         →  (also caught here as fallback)
//   /research/paper-title      →  etc.
//
// Strategy: try the last segment as a WP slug across all registered post types.
// The category/prefix segment is used only as a hint, not for routing.
// WP slugs are unique site-wide so this is safe.

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getPostBySlug,
  getRelatedPosts,
  getAdjacentPosts,
  stripHtml,
  getFeaturedImage,
  wpTypeEndpoint,
} from '@/lib/wordpress'
import PostLayout from '@/components/PostLayout'
import type { WPPost } from '@/types/wordpress'

interface Props {
  params: Promise<{ segments: string[] }>
}

// The order matters — more specific types first
const SEARCH_ORDER = [
  'portfolio',
  'research',
  'talks',
  'testimonials',
  'courses',
  'posts',
  'pages',
]

async function findPost(segments: string[]): Promise<WPPost | null> {
  const slug = segments[segments.length - 1]
  if (!slug) return null

  const typeMap: Record<string, string> = {
    portfolio: 'portfolio', research: 'research',
    talks: 'talks', talk: 'talks',
    testimonials: 'testimonials', courses: 'courses', course: 'courses',
  }
  const hintedType = typeMap[segments[0]]

  if (hintedType) {
    const post = await getPostBySlug(hintedType, slug)
    if (post) return post
  }

  for (const type of SEARCH_ORDER) {
    if (type === hintedType) continue
    const post = await getPostBySlug(type, slug)
    if (post) return post
  }

  return null
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segments } = await params
  const post = await findPost(segments)
  if (!post) return {}

  const title   = stripHtml(post.title.rendered)
  const desc    = post.seo?.description || post.excerpt_plain || stripHtml(post.excerpt.rendered)
  const ogImage = post.seo?.og_image || getFeaturedImage(post)

  return {
    title: `${title} · Aaron Snowberger`,
    description: desc,
    openGraph: {
      title, description: desc,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function CatchAllPage({ params }: Props) {
  const { segments } = await params
  const post = await findPost(segments)
  if (!post) notFound()

  const endpoint = wpTypeEndpoint(post.type)
  const catIds   = (post.category_list ?? []).map(c => c.id)

  const [related, { prev, next }] = await Promise.all([
    getRelatedPosts(endpoint, catIds, post.id),
    getAdjacentPosts(endpoint, post.date),
  ])

  return <PostLayout post={post} related={related} prev={prev} next={next} />
}

// No generateStaticParams — catch-all routes use on-demand ISR.
export const revalidate   = 3600
export const dynamicParams = true
