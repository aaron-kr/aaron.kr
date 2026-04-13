// app/[postType]/[slug]/page.tsx
// Handles: /portfolio/my-item, /research/paper-title, /talks/talk-name, etc.
// Fetches the post from WordPress and renders it.
// Add more sophisticated templates per post type as needed.

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import {
  getPostBySlug,
  getAllSlugs,
  stripHtml,
  formatWPDate,
  getFeaturedImage,
  POST_TYPE_MAP,
} from '@/lib/wordpress'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ClientInit from '@/components/ClientInit'

interface Props {
  params: Promise<{ postType: string; slug: string }>
}

// ── Generate static paths at build time ──────────────────────────────────────
export async function generateStaticParams() {
  const paths: { postType: string; slug: string }[] = []

  for ( const [urlSegment, wpEndpoint] of Object.entries( POST_TYPE_MAP ) ) {
    if ( urlSegment === 'blog' ) continue // blog has its own route
    const slugs = await getAllSlugs( wpEndpoint )
    slugs.forEach( ({ slug }) => paths.push({ postType: urlSegment, slug }) )
  }

  return paths
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postType, slug } = await params
  const endpoint = POST_TYPE_MAP[postType]
  if ( !endpoint ) return {}

  const post = await getPostBySlug( endpoint, slug )
  if ( !post ) return {}

  const title    = stripHtml( post.title.rendered )
  const desc     = post.seo?.description || post.excerpt_plain || stripHtml( post.excerpt.rendered )
  const ogImage  = post.seo?.og_image || getFeaturedImage( post )

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

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function PostPage({ params }: Props) {
  const { postType, slug } = await params
  const endpoint = POST_TYPE_MAP[postType]

  if ( !endpoint ) notFound()

  const post = await getPostBySlug( endpoint, slug )
  if ( !post ) notFound()

  const title    = stripHtml( post.title.rendered )
  const date     = formatWPDate( post.date )
  const image    = getFeaturedImage( post )
  const readTime = post.reading_time_minutes
  const tags     = post.tag_list ?? []
  const cats     = post.category_list ?? []

  return (
    <>
      <div id="prog" />
      <ClientInit />
      <Nav />

      <main style={{ paddingTop: '58px', minHeight: '80vh' }}>
        <article style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>

          {/* ── Eyebrow ── */}
          <div className="hero-eyebrow" style={{ marginBottom: '1.5rem' }}>
            <div className="ey-line" />
            <span className="ey-txt" style={{ textTransform: 'capitalize' }}>
              {postType.replace(/-/g, ' ')}
            </span>
          </div>

          {/* ── Title ── */}
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', marginBottom: '1rem' }}>
            {title}
          </h1>

          {/* ── Meta row ── */}
          <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap', marginBottom: '2rem',
                        fontSize: '.78rem', color: 'var(--t3)', letterSpacing: '.04em' }}>
            <span>{date}</span>
            {readTime && <span>{readTime} min read</span>}
            {cats.map( c => (
              <span key={c.id} style={{ color: 'var(--teal)' }}>{c.name}</span>
            ))}
          </div>

          {/* ── Featured image ── */}
          {image && (
            <div style={{ marginBottom: '2.5rem', borderRadius: '8px', overflow: 'hidden',
                          aspectRatio: '16/9' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={post.featured_image_urls?.alt || title}
                   style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          )}

          {/* ── Content ── */}
          <div
            className="wp-content"
            dangerouslySetInnerHTML={{ __html: post.content.rendered }}
          />

          {/* ── Tags ── */}
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

// ISR: rebuild individual posts at most once per hour
export const revalidate = 3600
