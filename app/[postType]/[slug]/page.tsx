// app/[postType]/[slug]/page.tsx
// Handles: /portfolio/my-item, /research/paper-title, /talks/talk-name, etc.

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getPostBySlug,
  getAllSlugs,
  getRelatedPosts,
  getAdjacentPosts,
  stripHtml,
  getFeaturedImage,
  POST_TYPE_MAP,
  wpTypeEndpoint,
} from '@/lib/wordpress'
import PostLayout from '@/components/PostLayout'

interface Props {
  params: Promise<{ postType: string; slug: string }>
}

// ── Generate static paths at build time ──────────────────────────────────────
export async function generateStaticParams() {
  const paths: { postType: string; slug: string }[] = []

  for (const [urlSegment, wpEndpoint] of Object.entries(POST_TYPE_MAP)) {
    if (urlSegment === 'blog') continue // blog has its own route
    const slugs = await getAllSlugs(wpEndpoint)
    slugs.forEach(({ slug }) => paths.push({ postType: urlSegment, slug }))
  }

  return paths
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postType, slug } = await params
  const endpoint = POST_TYPE_MAP[postType]
  if (!endpoint) return {}

  const post = await getPostBySlug(endpoint, slug)
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
export default async function PostPage({ params }: Props) {
  const { postType, slug } = await params
  const endpoint = POST_TYPE_MAP[postType]
  if (!endpoint) notFound()

  const post = await getPostBySlug(endpoint, slug)
  if (!post) notFound()

  const typeEndpoint = wpTypeEndpoint(post.type)
  const catIds = (post.category_list ?? []).map(c => c.id)

  const [related, { prev, next }] = await Promise.all([
    getRelatedPosts(typeEndpoint, catIds, post.id),
    getAdjacentPosts(typeEndpoint, post.date),
  ])

  return <PostLayout post={post} related={related} prev={prev} next={next} />
}

export const revalidate = 3600
