// app/portfolio/page.tsx
// Portfolio archive — paginated grid.

import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getPortfolioPostsPaged, getFeaturedImage, stripHtml, wpLinkToPath } from '@/lib/wordpress'
import Nav        from '@/components/Nav'
import Footer     from '@/components/Footer'
import ClientInit from '@/components/ClientInit'
import Pagination from '@/components/Pagination'

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Design, magazine layout, and visual work by Aaron Snowberger — two decades of creative projects spanning print, digital, and academic publishing.',
  alternates: { canonical: 'https://aaron.kr/portfolio' },
  openGraph: {
    title: 'Portfolio · Aaron Snowberger',
    description:
      'Design, magazine layout, and visual work by Aaron Snowberger — two decades of creative projects spanning print, digital, and academic publishing.',
    url: 'https://aaron.kr/portfolio',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Portfolio · Aaron Snowberger',
    description: 'Design, magazine, and visual work by Aaron Snowberger.',
    creator: '@aaronsnowberger',
  },
}

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function PortfolioPage({ searchParams }: Props) {
  const { page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1)

  const { posts, totalPages } = await getPortfolioPostsPaged(page)

  return (
    <>
      <div id="prog" role="progressbar" aria-label="Page scroll progress" aria-hidden="true" />
      <ClientInit />
      <Nav />

      <div className="post-aurora" aria-hidden="true" />

      <main id="main-content" style={{ paddingTop: '58px', minHeight: '80vh' }}>
        <div style={{ maxWidth: '1060px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>

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

          <div className="d-grid">
            {posts.map(p => {
              const img   = getFeaturedImage(p)
              const title = stripHtml(p.title.rendered)
              return (
                <Link key={p.id} href={wpLinkToPath(p.link)} className="di">
                  {img ? (
                    <Image
                      src={img}
                      alt={title}
                      fill
                      sizes="(max-width:640px) 50vw, 25vw"
                      style={{ objectFit: 'cover' }}
                      loading="lazy"
                    />
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

          <Pagination currentPage={page} totalPages={totalPages} basePath="/portfolio" />

        </div>
      </main>

      <Footer />
    </>
  )
}

export const revalidate = 3600
