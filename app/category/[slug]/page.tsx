// app/category/[slug]/page.tsx
// Archive page for a WordPress category — paginated.

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getCategoryPostsPaged, getAllBlogCategories,
  stripHtml, formatWPDate, wpLinkToPath,
} from '@/lib/wordpress'
import Nav          from '@/components/Nav'
import Footer       from '@/components/Footer'
import ClientInit   from '@/components/ClientInit'
import Breadcrumbs  from '@/components/Breadcrumbs'
import Pagination   from '@/components/Pagination'
import type { WPPost } from '@/types/wordpress'

interface Props {
  params:       Promise<{ slug: string }>
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { categoryName } = await getCategoryPostsPaged(slug, 1)
  return {
    title: `${categoryName} · Aaron Snowberger`,
    description: `Posts in the ${categoryName} category.`,
  }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug }          = await params
  const { page: pageStr } = await searchParams
  const page = Math.max(1, parseInt(pageStr ?? '1', 10) || 1)

  const [{ posts, categoryName, totalPages }, allCategories] = await Promise.all([
    getCategoryPostsPaged(slug, page),
    getAllBlogCategories(),
  ])

  if (posts.length === 0 && page === 1) notFound()

  const otherCategories = allCategories.filter(
    c => c.slug !== slug && c.slug !== 'uncategorized' && c.count > 0
  )

  return (
    <>
      <div id="prog" />
      <ClientInit />
      <Nav />

      <div className="post-aurora" aria-hidden="true" />

      <main style={{ paddingTop: '58px', minHeight: '80vh' }}>
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '4rem 2rem 6rem' }}>

          <Breadcrumbs crumbs={[
            { label: 'Home',     href: '/' },
            { label: 'Category' },
            { label: categoryName },
          ]} />

          <div className="hero-eyebrow" style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>
            <div className="ey-line" />
            <span className="ey-txt">Category</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '3rem' }}>
            {categoryName}
          </h1>

          <div className="blist">
            {posts.map(p => <PostRow key={p.id} p={p} />)}
          </div>

          <Pagination currentPage={page} totalPages={totalPages} basePath={`/category/${slug}`} />

          {/* ── All categories ── */}
          {otherCategories.length > 0 && (
            <div style={{ marginTop: '3.5rem', paddingTop: '2rem', borderTop: '1px solid var(--rule)' }}>
              <div style={{
                fontSize: '.68rem', fontWeight: 700, letterSpacing: '.12em',
                textTransform: 'uppercase', color: 'var(--t3)', marginBottom: '.9rem',
              }}>
                All Categories
              </div>
              <div className="tags" style={{ gap: '.4rem' }}>
                {otherCategories.map(c => (
                  <Link key={c.id} href={`/category/${c.slug}`} className="tag fss">
                    <span>{c.name}</span>
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
