// app/blog/[slug]/page.tsx
// Individual blog post pages at /blog/[slug].
// Separate from the [postType] route so blog posts get their own URL structure.

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getPostBySlug,
  getAllSlugs,
  stripHtml,
  formatWPDate,
  getFeaturedImage,
} from '@/lib/wordpress'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ClientInit from '@/components/ClientInit'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllSlugs( 'posts' )
  return slugs
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug( 'posts', slug )
  if ( !post ) return {}

  const title   = stripHtml( post.title.rendered )
  const desc    = post.seo?.description || post.excerpt_plain || stripHtml( post.excerpt.rendered )
  const ogImage = post.seo?.og_image || getFeaturedImage( post )

  return {
    title: `${title} · Aaron Snowberger`,
    description: desc,
    openGraph: {
      title,
      description: desc,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
  }
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug( 'posts', slug )
  if ( !post ) notFound()

  const title    = stripHtml( post.title.rendered )
  const date     = formatWPDate( post.date )
  const image    = getFeaturedImage( post )
  const readTime = post.reading_time_minutes
  const tags     = post.tag_list ?? []
  const cats     = post.category_list ?? []
  const author   = post.author_card

  return (
    <>
      <div id="prog" />
      <ClientInit />
      <Nav />

      <main style={{ paddingTop: '58px', minHeight: '80vh' }}>
        <article style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>

          <div className="hero-eyebrow" style={{ marginBottom: '1.5rem' }}>
            <div className="ey-line" />
            <span className="ey-txt">Writing</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', marginBottom: '1rem' }}>
            {title}
          </h1>

          <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', marginBottom: '2rem',
                        fontSize: '.78rem', color: 'var(--t3)', letterSpacing: '.04em',
                        alignItems: 'center' }}>
            {author?.avatar && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={author.avatar} alt={author.name}
                   style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }} />
            )}
            {author?.name && <span style={{ color: 'var(--t2)' }}>{author.name}</span>}
            <span>{date}</span>
            {readTime && <span>{readTime} min read</span>}
            {cats.map( c => (
              <span key={c.id} style={{ color: 'var(--teal)' }}>{c.name}</span>
            ))}
          </div>

          {image && (
            <div style={{ marginBottom: '2.5rem', borderRadius: '8px', overflow: 'hidden',
                          aspectRatio: '16/9' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={post.featured_image_urls?.alt || title}
                   style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          )}

          <div
            className="wp-content"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {tags.length > 0 && (
            <div className="tags" style={{ marginTop: '3rem' }}>
              {tags.map( t => (
                <span key={t.id} className="tag fss"><span>{t.name}</span></span>
              ))}
            </div>
          )}

        </article>
      </main>

      <Footer />
    </>
  )
}

export const revalidate = 3600
