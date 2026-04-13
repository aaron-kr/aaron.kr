// app/page.tsx
// Server Component — fetches WordPress data at build/ISR time.
// Static sections (Research, Teaching, Labs) render from hardcoded data.
// Dynamic sections (Design, Writing, Beyond) receive WP posts as props.

import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import WyoKoreaSlider from '@/components/WyoKoreaSlider'
import Research from '@/components/Research'
import Teaching from '@/components/Teaching'
import Labs from '@/components/Labs'
import Design from '@/components/Design'
import Writing from '@/components/Writing'
import Beyond from '@/components/Beyond'
import Footer from '@/components/Footer'
import QRModal from '@/components/QRModal'
import ClientInit from '@/components/ClientInit'

import { getDesignPosts, getWritingPosts, getBeyondPosts } from '@/lib/wordpress'

export default async function Home() {
  // Fetch WP data in parallel — each call falls back to [] on failure,
  // so the page always renders (static fallback data in each component).
  const [designPosts, writingPosts, beyondPosts] = await Promise.all([
    getDesignPosts(4),
    getWritingPosts(),
    getBeyondPosts(6),
  ])

  return (
    <>
      {/* Client-side init: scroll progress bar + IntersectionObserver for .rise */}
      <ClientInit />

      {/* Scroll progress bar (rendered by ClientInit, this is just the DOM target) */}
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

        <Beyond posts={beyondPosts} />
      </main>

      <Footer />

      {/* QR Modal — client component, opens via custom DOM event 'openQRModal' */}
      <QRModal />
    </>
  )
}
