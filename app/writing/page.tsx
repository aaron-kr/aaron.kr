// app/writing/page.tsx
// Blog post archive — paginated, newest first.

import type { Metadata } from 'next'
import Link from 'next/link'
import { getWritingPostsPaged, stripHtml, formatWPDate, wpLinkToPath } from '@/lib/wordpress'
import Nav        from '@/components/Nav'
import Footer     from '@/components/Footer'
import ClientInit from '@/components/ClientInit'
import Pagination from '@/components/Pagination'
import type { WPPost } from '@/types/wordpress'

export const metadata: Metadata = {
  title: 'Writing · Aaron Snowberger',
  description: 'Essays, reflections, and notes from Aaron Snowberger.',
}

export const revalidate = 3600

interface Props {
  searchParams: Promise<{ page?: string }>
}

function PostRow({ p }: { p: WPPost }) {
  const koUrl = p.naver_blog_url ?? p.korean_post_url ?? null
  return (
    <div className="bi">
      <Link href={wpLinkToPath(p.link)} className="bi-main">
        <span className="bt">{stripHtml(p.title.rendered)}</span>
        {p.korean_title && <span className="bt-ko">{p.korean_title}</span>}
      </Link>
      <span className="bi-aside">
        {koUrl && (
          <a href={koUrl} className="bi-ko" target="_blank" rel="noopener noreferrer">
            한국어 ↗
          </a>
        )}
        <span className="bm">{formatWPDate(p.date)}</span>
      </span>
    </div>
  )
}

export default async function WritingPage({ searchParams }: Props) {
  const { page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1)

  const { posts, totalPages } = await getWritingPostsPaged(page)

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
            <>
              <div className="blist">
                {posts.map(p => <PostRow key={p.id} p={p} />)}
              </div>
              <Pagination currentPage={page} totalPages={totalPages} basePath="/writing" />
            </>
          )}

        </div>
      </main>

      <Footer />
    </>
  )
}
