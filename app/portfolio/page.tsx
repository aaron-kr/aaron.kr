// app/portfolio/page.tsx
// Portfolio archive — all design/creative work.

import type { Metadata } from 'next'
import Link from 'next/link'
import { getPortfolioPosts, getFeaturedImage, stripHtml, wpLinkToPath } from '@/lib/wordpress'
import Nav        from '@/components/Nav'
import Footer     from '@/components/Footer'
import ClientInit from '@/components/ClientInit'

export const metadata: Metadata = {
  title: 'Portfolio · Aaron Snowberger',
  description: 'Design, magazine, and visual work by Aaron Snowberger.',
}

export default async function PortfolioPage() {
  const posts = await getPortfolioPosts(24)

  return (
    <>
      <div id="prog" />
      <ClientInit />
      <Nav />

      <div className="post-aurora" aria-hidden="true" />

      <main style={{ paddingTop: '58px', minHeight: '80vh' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>

          {/* Header */}
          <div className="hero-eyebrow" style={{ marginBottom: '1rem' }}>
            <div className="ey-line" />
            <span className="ey-txt">Creative Work</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '3rem' }}>
            Portfolio
          </h1>

          {posts.length === 0 && (
            <p style={{ color: 'var(--t3)' }}>No portfolio items found.</p>
          )}

          {/* Grid reuses the homepage .d-grid design */}
          <div className="d-grid">
            {posts.map(p => {
              const img   = getFeaturedImage(p)
              const title = stripHtml(p.title.rendered)
              return (
                <Link key={p.id} href={wpLinkToPath(p.link)} className="di">
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={title} loading="lazy" />
                  ) : (
                    <div className="ph g-aurora" />
                  )}
                  <div className="di-ov">
                    <div className="di-lbl">
                      {title}
                      {p.excerpt_plain && (
                        <>{`\n`}{p.excerpt_plain.slice(0, 60)}</>
                      )}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}

export const revalidate = 3600
