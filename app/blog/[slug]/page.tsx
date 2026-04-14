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

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug('posts', slug)
  if (!post) notFound()

  const catIds = (post.category_list ?? []).map(c => c.id)

  const [related, { prev, next }] = await Promise.all([
    getRelatedPosts('posts', catIds, post.id),
    getAdjacentPosts('posts', post.date),
  ])

  return <PostLayout post={post} related={related} prev={prev} next={next} />
}

export const revalidate = 3600
