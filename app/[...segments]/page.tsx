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
  stripHtml,
  formatWPDate,
  getFeaturedImage,
} from '@/lib/wordpress'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import ClientInit from '@/components/ClientInit'
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
  'posts',   // regular blog posts last (largest set)
  'pages',
]

// Given URL segments, try to find a WP post
async function findPost( segments: string[] ): Promise<WPPost | null> {
  // Last segment is always the slug in /%category%/%postname%/ or /type/slug
  const slug = segments[ segments.length - 1 ]
  if ( !slug ) return null

  // If first segment is a known CPT slug, try that type first
  const firstSegment = segments[0]
  const typeMap: Record<string, string> = {
    portfolio:    'portfolio',
    research:     'research',
    talks:        'talks',
    talk:         'talks',
    testimonials: 'testimonials',
    courses:      'courses',
    course:       'courses',
  }
  const hintedType = typeMap[firstSegment]

  if ( hintedType ) {
    const post = await getPostBySlug( hintedType, slug )
    if ( post ) return post
  }

  // Try all types in order (skip hinted one since we just tried it)
  for ( const type of SEARCH_ORDER ) {
    if ( type === hintedType ) continue
    const post = await getPostBySlug( type, slug )
    if ( post ) return post
  }

  return null
}

// ── Metadata ──────────────────────────────────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { segments } = await params
  const post = await findPost( segments )
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function CatchAllPage({ params }: Props) {
  const { segments } = await params
  const post = await findPost( segments )

  if ( !post ) notFound()

  const title    = stripHtml( post.title.rendered )
  const date     = formatWPDate( post.date )
  const image    = getFeaturedImage( post )
  const readTime = post.reading_time_minutes
  const tags     = post.tag_list     ?? []
  const cats     = post.category_list ?? []
  const author   = post.author_card

  // Label the section based on post type
  const sectionLabels: Record<string, string> = {
    portfolio:   'Design',
    research:    'Research',
    talk:        'Talks',
    testimonial: 'Testimonials',
    course:      'Courses',
    post:        'Writing',
    page:        '',
  }
  const sectionLabel = sectionLabels[post.type] ?? post.type

  return (
    <>
      <div id="prog" />
      <ClientInit />
      <Nav />

      <main style={{ paddingTop: '58px', minHeight: '80vh' }}>
        <article style={{ maxWidth: '760px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>

          {/* Eyebrow */}
          {sectionLabel && (
            <div className="hero-eyebrow" style={{ marginBottom: '1.5rem' }}>
              <div className="ey-line" />
              <span className="ey-txt">{sectionLabel}</span>
            </div>
          )}

          {/* Title */}
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', marginBottom: '1rem' }}>
            {title}
          </h1>

          {/* Meta */}
          <div style={{ display: 'flex', gap: '1.2rem', flexWrap: 'wrap',
                        marginBottom: '2rem', fontSize: '.78rem',
                        color: 'var(--t3)', letterSpacing: '.04em', alignItems: 'center' }}>
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

          {/* Featured image */}
          {image && (
            <div style={{ marginBottom: '2.5rem', borderRadius: '8px',
                          overflow: 'hidden', aspectRatio: '16/9' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={image} alt={post.featured_image_urls?.alt || title}
                   style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </div>
          )}

          {/* Post-type specific meta panels */}
          {post.research_meta?.doi && (
            <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-muted)',
                          borderRadius: '8px', marginBottom: '2rem', fontSize: '.85rem' }}>
              {post.research_meta.venue && <p><strong>Venue:</strong> {post.research_meta.venue}</p>}
              {post.research_meta.year  && <p><strong>Year:</strong>  {post.research_meta.year}</p>}
              {post.research_meta.doi   && <p><strong>DOI:</strong>
                <a href={`https://doi.org/${post.research_meta.doi}`}
                   target="_blank" rel="noopener noreferrer"
                   style={{ color: 'var(--teal)', marginLeft: '.4rem' }}>
                  {post.research_meta.doi}
                </a>
              </p>}
              {post.research_meta.award && <p><strong>Award:</strong> {post.research_meta.award}</p>}
              {post.research_meta.pdf_url && (
                <a href={post.research_meta.pdf_url} target="_blank" rel="noopener noreferrer"
                   className="slink sl-t fs" style={{ marginTop: '.5rem', display: 'inline-flex' }}>
                  📄 Download PDF
                </a>
              )}
            </div>
          )}

          {post.talk_meta?.event && (
            <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-muted)',
                          borderRadius: '8px', marginBottom: '2rem', fontSize: '.85rem' }}>
              {post.talk_meta.event      && <p><strong>Event:</strong>    {post.talk_meta.event}</p>}
              {post.talk_meta.event_date && <p><strong>Date:</strong>     {post.talk_meta.event_date}</p>}
              {post.talk_meta.location   && <p><strong>Location:</strong> {post.talk_meta.location}</p>}
              <div style={{ display: 'flex', gap: '.6rem', marginTop: '.5rem' }}>
                {post.talk_meta.slides_url && (
                  <a href={post.talk_meta.slides_url} target="_blank" rel="noopener noreferrer"
                     className="slink sl-b fs" style={{ display: 'inline-flex' }}>
                    Slides →
                  </a>
                )}
                {post.talk_meta.video_url && (
                  <a href={post.talk_meta.video_url} target="_blank" rel="noopener noreferrer"
                     className="slink sl-p fs" style={{ display: 'inline-flex' }}>
                    Video →
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          <div className="wp-content"
               dangerouslySetInnerHTML={{ __html: post.content.rendered }} />

          {/* Tags */}
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

// No generateStaticParams — catch-all routes use on-demand ISR.
// Pages are generated on first visit and cached for 1 hour.
export const revalidate = 3600
export const dynamicParams = true
