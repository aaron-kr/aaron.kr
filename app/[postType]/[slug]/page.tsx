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

// ── Shared post resolver ──────────────────────────────────────────────────────
// When postType is a known CPT key (portfolio, research…) fetch from that endpoint.
// When it isn't — e.g. it's a WP category slug like "code" in /code/wp-cli —
// fall back to blog posts, which are the only type that uses /%category%/%postname%/.
async function resolvePost(postType: string, slug: string): Promise<import('@/types/wordpress').WPPost | null> {
  const endpoint = POST_TYPE_MAP[postType]
  if (endpoint) return getPostBySlug(endpoint, slug)
  // postType is a category slug — look the post up as a standard blog post
  return getPostBySlug('posts', slug)
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postType, slug } = await params
  const post = await resolvePost(postType, slug)
  if (!post) return {}

  const title    = stripHtml(post.title.rendered)
  const desc     = post.seo?.description || post.excerpt_plain || stripHtml(post.excerpt.rendered)
  const ogImage  = post.seo?.og_image || getFeaturedImage(post)
  const canonical = post.seo?.canonical || `https://aaron.kr/${postType}/${slug}`

  const ogType = post.type === 'post' ? 'article' : 'website'

  return {
    title,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title,
      description: desc,
      url: canonical,
      type: ogType,
      ...(post.type === 'post' ? {
        publishedTime: post.date,
        modifiedTime: post.modified,
        authors: ['https://aaron.kr'],
      } : {}),
      ...(ogImage ? { images: [{ url: ogImage, alt: title }] } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: desc,
      creator: '@aaronsnowberger',
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  }
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function PostPage({ params }: Props) {
  const { postType, slug } = await params
  const post = await resolvePost(postType, slug)
  if (!post) notFound()

  const typeEndpoint = wpTypeEndpoint(post.type)
  const catIds  = (post.category_list ?? []).map(c => c.id)
  const title   = stripHtml(post.title.rendered)
  const desc    = post.seo?.description || post.excerpt_plain || stripHtml(post.excerpt.rendered)
  const ogImage = post.seo?.og_image || getFeaturedImage(post)
  const canonical = post.seo?.canonical || `https://aaron.kr/${postType}/${slug}`

  // Research posts get ScholarlyArticle; talks get Event; everything else CreativeWork
  const schemaType =
    post.type === 'research' ? 'ScholarlyArticle'
    : post.type === 'talk'   ? 'Event'
    : post.type === 'post'   ? 'Article'
    : 'CreativeWork'

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': schemaType,
    name: title,
    headline: title,
    description: desc,
    url: canonical,
    datePublished: post.date,
    dateModified: post.modified,
    author: { '@type': 'Person', name: post.author_card?.name ?? 'Aaron Snowberger', url: 'https://aaron.kr' },
    ...(ogImage ? { image: ogImage } : {}),
  }

  // Research-specific additions
  if (post.type === 'research' && post.research_meta) {
    if (post.research_meta.doi)       jsonLd['identifier'] = `https://doi.org/${post.research_meta.doi}`
    if (post.research_meta.venue)     jsonLd['publisher']  = { '@type': 'Organization', name: post.research_meta.venue }
    if (post.research_meta.coauthors) jsonLd['contributor'] = post.research_meta.coauthors
  }

  // Talk/Event-specific additions
  if (post.type === 'talk' && post.talk_meta) {
    if (post.talk_meta.event)      jsonLd['name']     = post.talk_meta.event
    if (post.talk_meta.location)   jsonLd['location'] = { '@type': 'Place', name: post.talk_meta.location }
    if (post.talk_meta.event_date) jsonLd['startDate'] = post.talk_meta.event_date
  }

  const [related, { prev, next }] = await Promise.all([
    getRelatedPosts(typeEndpoint, catIds, post.id),
    getAdjacentPosts(typeEndpoint, post.date),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PostLayout post={post} related={related} prev={prev} next={next} />
    </>
  )
}

export const revalidate = 3600
