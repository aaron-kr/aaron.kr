// app/category/[slug]/page.tsx
// Archive page for a WordPress category.

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { getPostsByCategory, stripHtml, formatWPDate, wpLinkToPath } from '@/lib/wordpress'
import Nav        from '@/components/Nav'
import Footer     from '@/components/Footer'
import ClientInit from '@/components/ClientInit'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { categoryName } = await getPostsByCategory(slug, 1)
  return {
    title: `${categoryName} · Aaron Snowberger`,
    description: `Posts in the ${categoryName} category.`,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const { posts, categoryName } = await getPostsByCategory(slug, 20)

  if (posts.length === 0) notFound()

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
            <span className="ey-txt">Category</span>
          </div>
          <h1 style={{ fontSize: 'clamp(2rem,5vw,3rem)', marginBottom: '3rem' }}>
            {categoryName}
          </h1>

          <div className="blist">
            {posts.map(p => (
              <Link key={p.id} href={wpLinkToPath(p.link)} className="bi">
                <span className="bt">{stripHtml(p.title.rendered)}</span>
                <span className="bm">{formatWPDate(p.date)}</span>
              </Link>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}

export const revalidate   = 3600
export const dynamicParams = true
