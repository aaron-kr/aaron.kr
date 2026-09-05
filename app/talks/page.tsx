// app/talks/page.tsx
// Talks archive — paginated list, pulled live from the `talk` CPT.

import type { Metadata } from 'next'
import Link from 'next/link'
import { getTalksPostsPaged, stripHtml, formatWPDate, wpLinkToPath } from '@/lib/wordpress'
import Nav        from '@/components/Nav'
import Footer     from '@/components/Footer'
import ClientInit from '@/components/ClientInit'
import Pagination from '@/components/Pagination'
import type { WPPost } from '@/types/wordpress'

export const metadata: Metadata = {
  title: 'Talks',
  description:
    'Conference talks, guest lectures, and presentations by Aaron Snowberger — AI researcher and educator based in Jeonju, South Korea.',
  alternates: { canonical: 'https://aaron.kr/talks' },
  openGraph: {
    title: 'Talks · Aaron Snowberger',
    description:
      'Conference talks, guest lectures, and presentations by Aaron Snowberger.',
    url: 'https://aaron.kr/talks',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Talks · Aaron Snowberger',
    description: 'Conference talks, guest lectures, and presentations by Aaron Snowberger.',
    creator: '@aaronsnowberger',
  },
}

function TalkRow({ p }: { p: WPPost }) {
  const meta = p.talk_meta
  return (
    <div className="bi">
      <Link href={wpLinkToPath(p.link)} className="bi-main">
        <span className="bt">{stripHtml(p.title.rendered)}</span>
        {(meta?.event || meta?.location) && (
          <span className="bt-ko">
            {[meta?.event, meta?.location].filter(Boolean).join(' · ')}
          </span>
        )}
      </Link>
      <span className="bi-aside">
        <span className="bm">{formatWPDate(meta?.event_date || p.date)}</span>
      </span>
    </div>
  )
}

interface Props {
  searchParams: Promise<{ page?: string }>
}

export default async function TalksPage({ searchParams }: Props) {
  const { page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1)

  const { posts, totalPages } = await getTalksPostsPaged(page)

  return (
    <>
      <div id="prog" role="progressbar" aria-label="Page scroll progress" aria-hidden="true" />
      <ClientInit />
      <Nav />

      <div className="post-aurora" aria-hidden="true" />

      <main id="main-content" style={{ paddingTop: '58px', minHeight: '80vh' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>

          <div className="hero-eyebrow" style={{ marginBottom: '1rem' }}>
            <div className="ey-line" />
            <span className="ey-txt">Research &amp; Publications</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '3rem' }}>
            Talks
          </h1>

          {posts.length === 0 && (
            <p style={{ color: 'var(--t3)' }}>No talks found.</p>
          )}

          <div className="blist">
            {posts.map(p => <TalkRow key={p.id} p={p} />)}
          </div>

          <Pagination currentPage={page} totalPages={totalPages} basePath="/talks" />

        </div>
      </main>

      <Footer />
    </>
  )
}

export const revalidate = 3600
