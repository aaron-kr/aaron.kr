// app/page.tsx
// Server Component — fetches WordPress data at build/ISR time.
// Static sections (Research, Teaching, Labs) render from hardcoded data.
// Dynamic sections (Design, Writing, Beyond) receive WP data as props.

import { redirect } from 'next/navigation'
import Nav      from '@/components/Nav'
import Hero     from '@/components/Hero'
import WyoKoreaSlider from '@/components/WyoKoreaSlider'
import Research from '@/components/Research'
import Teaching from '@/components/Teaching'
import Labs     from '@/components/Labs'
import Design   from '@/components/Design'
import Writing  from '@/components/Writing'
import Beyond   from '@/components/Beyond'
import Footer   from '@/components/Footer'
import QRModal  from '@/components/QRModal'
import ClientInit from '@/components/ClientInit'

import {
  getDesignPosts, getWritingPosts, getBeyondCategories, getPostById, wpLinkToPath,
} from '@/lib/wordpress'

interface Props {
  searchParams: Promise<{ p?: string; preview?: string; page_id?: string }>
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams

  // WP preview redirect: ?p=123&preview=true  → look up post and redirect
  const postId = params.p ? parseInt(params.p, 10) : (params.page_id ? parseInt(params.page_id, 10) : NaN)
  if (!isNaN(postId) && postId > 0) {
    const post = await getPostById(postId)
    if (post) redirect(wpLinkToPath(post.link))
    // If not found, fall through and render the homepage
  }

  // Fetch WP data in parallel — each call falls back to [] on failure.
  const [designPosts, writingPosts, beyondCategories] = await Promise.all([
    getDesignPosts(4),
    getWritingPosts(),
    getBeyondCategories(6),
  ])

  return (
    <>
      <ClientInit />
      <div id="prog" />
      <Nav />

      <main>
        <Hero />
        <WyoKoreaSlider />
        <div className="rule" />
        <Research />
        <div className="rule" />
        <Teaching />
        <div className="rule" />
        <Labs />
        <div className="rule" />
        <Design posts={designPosts} />
        <div className="rule" />
        <Writing posts={writingPosts} />
        <div className="rule" />
        <Beyond categories={beyondCategories} />
      </main>

      <Footer />
      <QRModal />
    </>
  )
}
