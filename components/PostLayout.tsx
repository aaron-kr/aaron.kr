// components/PostLayout.tsx
// Shared server component for all single-post pages.

import type { WPPost } from '@/types/wordpress'
import {
  stripHtml, formatWPDate, formatWPDateShort, getFeaturedImage, wpLinkToPath,
} from '@/lib/wordpress'
import Nav              from '@/components/Nav'
import Footer           from '@/components/Footer'
import ClientInit       from '@/components/ClientInit'
import PostSidebar      from '@/components/PostSidebar'
import PostFooter       from '@/components/PostFooter'
import PostLightbox     from '@/components/PostLightbox'
import ShareButtons     from '@/components/ShareButtons'
import GiscusComments   from '@/components/GiscusComments'
import Breadcrumbs      from '@/components/Breadcrumbs'
import BrokenLinks      from '@/components/BrokenLinks'
import Link from 'next/link'

interface Props {
  post:          WPPost
  related:       WPPost[]
  prev:          WPPost | null
  next:          WPPost | null
  // showShare: default true for all post types.
  // showComments: default true for standard 'post', false for CPTs.
  //   Pass showComments={true} on a CPT page to opt that type in.
  showShare?:    boolean
  showComments?: boolean
}

const SECTION_LABELS: Record<string, string> = {
  portfolio:   'Design',
  research:    'Research',
  talk:        'Talks',
  testimonial: 'Testimonials',
  course:      'Courses',
  post:        'Writing',
  page:        '',
}

export default function PostLayout({
  post, related, prev, next,
  showShare    = true,
  showComments,
}: Props) {
  // Comments: on by default for blog posts, research, and talks.
  // Portfolio, testimonials, courses, and pages opt out by default.
  // Any route can override by passing showComments={true|false} explicitly.
  const COMMENTS_ON_TYPES = new Set(['post', 'research', 'talk'])
  const commentsOn = showComments ?? COMMENTS_ON_TYPES.has(post.type)
  const title       = stripHtml(post.title.rendered)
  const date        = formatWPDate(post.date)
  const image       = getFeaturedImage(post)
  const readTime    = post.reading_time_minutes
  const tags        = post.tag_list      ?? []
  const cats        = post.category_list ?? []
  const author      = post.author_card
  const section     = SECTION_LABELS[post.type] ?? post.type
  const isPost      = post.type === 'post'
  const isPortfolio = post.type === 'portfolio'

  // "Updated" meta: show when modified is more than 7 days after original publish
  const publishedMs = new Date(post.date).getTime()
  const modifiedMs  = new Date(post.modified).getTime()
  const SEVEN_DAYS  = 7 * 24 * 60 * 60 * 1000
  const wasUpdated  = modifiedMs - publishedMs > SEVEN_DAYS

  // "Possibly outdated" banner: post is 3+ years old and hasn't been meaningfully updated
  const THREE_YEARS = 3 * 365.25 * 24 * 60 * 60 * 1000
  const isOldContent = Date.now() - publishedMs > THREE_YEARS && !wasUpdated

  // Breadcrumb trail: Home > Section > Title
  const SECTION_HREF: Record<string, string> = {
    post:        '/writing',
    portfolio:   '/portfolio',
    research:    '/#research',
    talk:        '/#research',
    testimonial: '/#research',
    course:      'https://courses.aaron.kr/',
  }
  const breadcrumbs = [
    { label: 'Home', href: '/' },
    ...(section ? [{ label: section, href: SECTION_HREF[post.type] }] : []),
    { label: title },
  ]

  // Portfolio type taxonomy (from mu-plugin's portfolio_type taxonomy)
  const portfolioTypes = (post._embedded?.['wp:term'] ?? [])
    .flat()
    .filter(t => t.taxonomy === 'portfolio_type')

  // External/cross-post links
  const naverUrl  = post.naver_blog_url  ?? null
  const koreanUrl = post.korean_post_url ?? null

  return (
    <>
      <div id="prog" />
      <ClientInit />
      <Nav />
      <PostLightbox />
      <div className="post-aurora" aria-hidden="true" />

      <main style={{ paddingTop: '58px', minHeight: '60vh' }}>
        <div className={`post-layout${isPost ? ' has-sidebar' : ''}`}>

          {/* ── Article ── */}
          <article>

            {/* Breadcrumbs */}
            <Breadcrumbs crumbs={breadcrumbs} />

            {/* Eyebrow */}
            {section && (
              <div className="hero-eyebrow" style={{ marginBottom: '1.5rem' }}>
                <div className="ey-line" />
                <span className="ey-txt">{section}</span>
              </div>
            )}

            <h1 style={{ fontSize: 'clamp(2rem,5vw,3.2rem)', marginBottom: '1rem' }}>
              {title}
            </h1>

            {/* ── Meta byline ── */}
            <div className="post-meta">
              {author?.avatar && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={author.avatar}
                  alt={author.name}
                  style={{ width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover' }}
                />
              )}
              {author?.name && <span style={{ color: 'var(--t2)' }}>{author.name}</span>}
              {/* Show updated date when meaningfully revised; collapse original to short form */}
              {wasUpdated ? (
                <>
                  <span className="post-meta-updated">
                    Updated {formatWPDate(post.modified)}
                  </span>
                  <span className="post-meta-orig">
                    orig. {formatWPDateShort(post.date)}
                  </span>
                </>
              ) : (
                <span>{date}</span>
              )}
              {readTime && <span>{readTime} min read</span>}

              {/* "Filed under" — category links */}
              {cats.length > 0 && (
                <span className="post-meta-filed">
                  <span style={{ color: 'var(--t3)', fontSize: '.72rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                    Filed under
                  </span>
                  {cats.map(c => (
                    <Link key={c.id} href={`/category/${c.slug}`} className="post-meta-cat">
                      {c.name}
                    </Link>
                  ))}
                </span>
              )}

              {/* Portfolio type taxonomy */}
              {isPortfolio && portfolioTypes.length > 0 && (
                <span className="post-meta-filed">
                  {portfolioTypes.map(t => (
                    <span key={t.id} className="post-meta-cat" style={{ opacity: .75 }}>{t.name}</span>
                  ))}
                </span>
              )}

              {/* Korean cross-post links */}
              {naverUrl && (
                <a href={naverUrl} target="_blank" rel="noopener noreferrer" className="post-meta-ko">
                  한국어로 읽기 →
                </a>
              )}
              {!naverUrl && koreanUrl && (
                <a href={koreanUrl} target="_blank" rel="noopener noreferrer" className="post-meta-ko">
                  한국어로 읽기 →
                </a>
              )}
            </div>

            {/* ── Featured image ── */}
            {image && (
              isPortfolio ? (
                <div className="portfolio-hero-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={image} alt={post.featured_image_urls?.alt || title} />
                </div>
              ) : (
                <div style={{ marginBottom: '2.5rem', borderRadius: '8px',
                              overflow: 'hidden', aspectRatio: '16/9' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={image}
                    alt={post.featured_image_urls?.alt || title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              )
            )}

            {/* ── Research meta panel ── */}
            {post.research_meta?.doi && (
              <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-muted)',
                            borderRadius: '8px', marginBottom: '2rem', fontSize: '.85rem' }}>
                {post.research_meta.venue && <p><strong>Venue:</strong> {post.research_meta.venue}</p>}
                {post.research_meta.year  && <p><strong>Year:</strong>  {post.research_meta.year}</p>}
                {post.research_meta.doi   && (
                  <p><strong>DOI:</strong>
                    <a href={`https://doi.org/${post.research_meta.doi}`}
                       target="_blank" rel="noopener noreferrer"
                       style={{ color: 'var(--teal)', marginLeft: '.4rem' }}>
                      {post.research_meta.doi}
                    </a>
                  </p>
                )}
                {post.research_meta.award      && <p><strong>Award:</strong>     {post.research_meta.award}</p>}
                {post.research_meta.coauthors  && <p><strong>Co-authors:</strong> {post.research_meta.coauthors}</p>}
                {post.research_meta.pdf_url && (
                  <a href={post.research_meta.pdf_url} target="_blank" rel="noopener noreferrer"
                     className="slink sl-t fs" style={{ marginTop: '.5rem', display: 'inline-flex' }}>
                    📄 Download PDF
                  </a>
                )}
              </div>
            )}

            {/* ── Talk meta panel ── */}
            {post.talk_meta?.event && (
              <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-muted)',
                            borderRadius: '8px', marginBottom: '2rem', fontSize: '.85rem' }}>
                {post.talk_meta.event      && <p><strong>Event:</strong>    {post.talk_meta.event}</p>}
                {post.talk_meta.event_date && <p><strong>Date:</strong>     {post.talk_meta.event_date}</p>}
                {post.talk_meta.location   && <p><strong>Location:</strong> {post.talk_meta.location}</p>}
                <div style={{ display: 'flex', gap: '.6rem', marginTop: '.5rem' }}>
                  {post.talk_meta.slides_url && (
                    <a href={post.talk_meta.slides_url} target="_blank" rel="noopener noreferrer"
                       className="slink sl-b fs" style={{ display: 'inline-flex' }}>Slides →</a>
                  )}
                  {post.talk_meta.video_url && (
                    <a href={post.talk_meta.video_url} target="_blank" rel="noopener noreferrer"
                       className="slink sl-p fs" style={{ display: 'inline-flex' }}>Video →</a>
                  )}
                </div>
              </div>
            )}

            {/* ── Portfolio meta panel ── */}
            {isPortfolio && post.portfolio_meta && (
              post.portfolio_meta.client || post.portfolio_meta.year ||
              post.portfolio_meta.tools  || post.portfolio_meta.project_url
            ) && (
              <div style={{ padding: '1rem 1.25rem', background: 'var(--bg-muted)',
                            borderRadius: '8px', marginBottom: '2rem', fontSize: '.85rem' }}>
                {post.portfolio_meta.client      && <p><strong>Client:</strong> {post.portfolio_meta.client}</p>}
                {post.portfolio_meta.year        && <p><strong>Year:</strong>   {post.portfolio_meta.year}</p>}
                {post.portfolio_meta.tools       && <p><strong>Tools:</strong>  {post.portfolio_meta.tools}</p>}
                {post.portfolio_meta.project_url && (
                  <a href={post.portfolio_meta.project_url} target="_blank" rel="noopener noreferrer"
                     className="slink sl-t fs" style={{ marginTop: '.5rem', display: 'inline-flex' }}>
                    View Project →
                  </a>
                )}
              </div>
            )}

            {/* ── Possibly outdated banner ── */}
            {isOldContent && (
              <div className="post-outdated">
                <span className="en">This post is over 3 years old — some information may be outdated.</span>
                <span className="ko">이 글은 3년 이상 된 글입니다. 일부 정보가 오래되었을 수 있습니다.</span>
              </div>
            )}

            {/* ── Post content ── */}
            <div className="wp-content"
                 dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
              <BrokenLinks />

            {/* ── Tags ── */}
            {tags.length > 0 && (
              <div className="tags" style={{ marginTop: '3rem' }}>
                {tags.map(t => (
                  <Link key={t.id} href={`/tag/${t.slug}`} className="tag fss">
                    <span>{t.name}</span>
                  </Link>
                ))}
              </div>
            )}

            {/* ── Share buttons ── */}
            {showShare && <ShareButtons title={title} />}

          </article>

          {/* ── Sidebar (blog posts only) ── */}
          {isPost && (
            <PostSidebar post={post} related={related} />
          )}

        </div>

        {/* ── Comments (Giscus) — full article width, below sidebar grid ── */}
        {commentsOn && (
          <div className="comments-wrap">
            <GiscusComments />
          </div>
        )}

      </main>

      {/* Full-width footer section — outside the constrained layout */}
      <PostFooter prev={prev} next={next} related={related} />

      <Footer />
    </>
  )
}
