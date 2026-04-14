// app/writing/page.tsx
// Blog post archive — all published posts, newest first.

import type { Metadata } from 'next'
import Link from 'next/link'
import { getWritingPosts, stripHtml, formatWPDate, wpLinkToPath } from '@/lib/wordpress'
import { WRITING_COUNT } from '@/components/Writing'
import Nav        from '@/components/Nav'
import Footer     from '@/components/Footer'
import ClientInit from '@/components/ClientInit'

export const metadata: Metadata = {
  title: 'Writing · Aaron Snowberger',
  description: 'Essays, reflections, and notes from Aaron Snowberger.',
}

export const revalidate = 3600

export default async function WritingPage() {
  // Fetch more posts for the archive than the homepage section shows
  const posts = await getWritingPosts(Math.max(WRITING_COUNT * 3, 24))

  return (
    <>
      <div id="prog" />
      <ClientInit />
      <Nav />

      <div className="post-aurora" aria-hidden="true" />

      <main style={{ paddingTop: '58px', minHeight: '80vh' }}>
        <div style={{ maxWidth: '880px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>

          <div className="hero-eyebrow" style={{ marginBottom: '1rem' }}>
            <div className="ey-line" />
            <span className="ey-txt">Writing</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '3rem' }}>
            From the Notebook
          </h1>

          {posts.length === 0 ? (
            <p style={{ color: 'var(--t3)' }}>No posts published yet.</p>
          ) : (
            <div className="blist">
              {posts.map(p => (
                <Link key={p.id} href={wpLinkToPath(p.link)} className="bi">
                  <span className="bt">{stripHtml(p.title.rendered)}</span>
                  <span className="bm">{formatWPDate(p.date)}</span>
                </Link>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  )
}
