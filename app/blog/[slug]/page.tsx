// app/blog/[slug]/page.tsx
// Individual blog post pages at /blog/[slug].

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getPostBySlug,
  getAllSlugs,
  getRelatedPosts,
  getAdjacentPosts,
  stripHtml,
  getFeaturedImage,
} from '@/lib/wordpress'
import PostLayout from '@/components/PostLayout'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllSlugs('posts')
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug('posts', slug)
  if (!post) return {}

  const title    = stripHtml(post.title.rendered)
  const desc     = post.seo?.description || post.excerpt_plain || stripHtml(post.excerpt.rendered)
  const ogImage  = post.seo?.og_image || getFeaturedImage(post)
  // Prefer the WP SEO canonical; fall back to the canonical Next.js URL.
  const canonical = post.seo?.canonical || `https://aaron.kr/blog/${slug}`

  return {
    title,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title,
      description: desc,
      url: canonical,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: ['https://aaron.kr'],
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

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug('posts', slug)
  if (!post) notFound()

  const catIds = (post.category_list ?? []).map(c => c.id)
  const title    = stripHtml(post.title.rendered)
  const desc     = post.seo?.description || post.excerpt_plain || stripHtml(post.excerpt.rendered)
  const ogImage  = post.seo?.og_image || getFeaturedImage(post)
  const canonical = post.seo?.canonical || `https://aaron.kr/blog/${slug}`

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: desc,
    url: canonical,
    datePublished: post.date,
    dateModified: post.modified,
    author: {
      '@type': 'Person',
      name: post.author_card?.name ?? 'Aaron Snowberger',
      url: 'https://aaron.kr',
    },
    publisher: {
      '@type': 'Person',
      name: 'Aaron Snowberger',
      url: 'https://aaron.kr',
    },
    ...(ogImage ? { image: ogImage } : {}),
    ...(post.category_list?.length
      ? { articleSection: post.category_list.map(c => c.name).join(', ') }
      : {}),
    ...(post.tag_list?.length
      ? { keywords: post.tag_list.map(t => t.name).join(', ') }
      : {}),
  }

  const [related, { prev, next }] = await Promise.all([
    getRelatedPosts('posts', catIds, post.id),
    getAdjacentPosts('posts', post.date),
  ])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <PostLayout post={post} related={related} prev={prev} next={next} />
    </>
  )
}

export const revalidate = 3600
