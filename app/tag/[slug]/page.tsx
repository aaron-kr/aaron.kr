// app/tag/[slug]/page.tsx
// Archive page for a WordPress tag.
// Shows all posts with this tag, a breadcrumb trail, and a full tag cloud
// so readers can browse to other tags.

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getPostsByTag, getAllTags,
  stripHtml, formatWPDate, wpLinkToPath,
} from '@/lib/wordpress'
import Nav          from '@/components/Nav'
import Footer       from '@/components/Footer'
import ClientInit   from '@/components/ClientInit'
import Breadcrumbs  from '@/components/Breadcrumbs'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { tagName } = await getPostsByTag(slug, 1)
  return {
    title: `#${tagName} · Aaron Snowberger`,
    description: `Posts tagged ${tagName}.`,
  }
}

export default async function TagPage({ params }: Props) {
  const { slug } = await params
  const [{ posts, tagName }, allTags] = await Promise.all([
    getPostsByTag(slug, 50),
    getAllTags(),
  ])

  if (posts.length === 0) notFound()

  const otherTags = allTags.filter(t => t.slug !== slug)

  return (
    <>
      <div id="prog" />
      <ClientInit />
      <Nav />

      <div className="post-aurora" aria-hidden="true" />

      <main style={{ paddingTop: '58px', minHeight: '80vh' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>

          <Breadcrumbs crumbs={[
            { label: 'Home', href: '/' },
            { label: 'Tag' },
            { label: `#${tagName}` },
          ]} />

          <div className="hero-eyebrow" style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>
            <div className="ey-line" />
            <span className="ey-txt">Tag</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '3rem' }}>
            #{tagName}
          </h1>

          <div className="blist">
            {posts.map(p => (
              <Link key={p.id} href={wpLinkToPath(p.link)} className="bi">
                <span className="bt">{stripHtml(p.title.rendered)}</span>
                <span className="bm">{formatWPDate(p.date)}</span>
              </Link>
            ))}
          </div>

          {/* ── All tags ── */}
          {otherTags.length > 0 && (
            <div style={{ marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid var(--rule)' }}>
              <div style={{
                fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em',
                textTransform: 'uppercase', color: 'var(--t3)', marginBottom: '.9rem',
              }}>
                All Tags
              </div>
              <div className="tags" style={{ gap: '.4rem' }}>
                {otherTags.map(t => (
                  <Link key={t.id} href={`/tag/${t.slug}`} className="tag fss">
                    <span>#{t.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  )
}

export const revalidate   = 3600
export const dynamicParams = true
