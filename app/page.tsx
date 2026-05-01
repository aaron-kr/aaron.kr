// app/page.tsx
// Server Component — fetches WordPress data at build/ISR time.
// Static sections (Research, Teaching, Labs) render from hardcoded data.
// Dynamic sections (Design, Writing, Beyond) receive WP data as props.

import type { Metadata } from 'next'
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
  getDesignPosts, getWritingPosts, getBeyondCategories, getAllBlogCategories,
  getPostById, wpLinkToPath,
} from '@/lib/wordpress'
import { DESIGN_COUNT  } from '@/components/Design'
import { WRITING_COUNT } from '@/components/Writing'

// ── Home page metadata (inherits template from root layout via title.default) ──
export const metadata: Metadata = {
  title: 'Aaron Snowberger, Ph.D. · AI Researcher & Educator',
  description:
    'Lecturer across five Korean universities in AI, programming, IoT, and circuits. Research in handwriting recognition, Physical AI curriculum, and CS education. Twenty years in Korean academia.',
  alternates: { canonical: 'https://aaron.kr' },
}

// ── JSON-LD: Person + WebSite structured data ─────────────────────────────────
const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Aaron Snowberger',
  honorificSuffix: 'Ph.D.',
  jobTitle: 'AI Researcher & Educator',
  description:
    'Lecturer across five Korean universities in AI, programming, IoT, and circuits. Research in handwriting recognition, Physical AI curriculum, and CS education.',
  url: 'https://aaron.kr',
  email: 'hi@aaron.kr',
  image: 'https://i0.wp.com/files.aaron.kr/media/2025/01/aaron.jpg?fit=460%2C460&ssl=1',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Jeonju',
    addressCountry: 'KR',
  },
  sameAs: [
    'https://linkedin.com/in/aaronsnowberger/',
    'https://github.com/jekkilekki',
    'https://www.researchgate.net/profile/Aaron-Snowberger',
    'https://scholar.google.com/citations?user=JCbnnvUAAAAJ',
    'https://orcid.org/0000-0001-8652-0936',
    'https://kspai.org',
    'https://m.blog.naver.com/aaron_kr',
  ],
  knowsAbout: [
    'Artificial Intelligence',
    'Handwriting Recognition',
    'Computer Vision',
    'Physical AI',
    'Engineering Education',
    'IoT',
    'Programming',
  ],
  worksFor: {
    '@type': 'Organization',
    name: 'Multiple Korean Universities',
    address: { '@type': 'PostalAddress', addressCountry: 'KR' },
  },
}

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Aaron Snowberger',
  url: 'https://aaron.kr',
  description:
    'Personal academic site for Aaron Snowberger, Ph.D. — AI Researcher & Educator based in Jeonju, South Korea.',
  author: { '@type': 'Person', name: 'Aaron Snowberger', url: 'https://aaron.kr' },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://aaron.kr/writing?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
}

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
  const [designPosts, writingPosts, beyondCategories, allCategories] = await Promise.all([
    getDesignPosts(DESIGN_COUNT),
    getWritingPosts(WRITING_COUNT),
    getBeyondCategories(6),
    getAllBlogCategories(),
  ])

  return (
    <>
      {/* ── JSON-LD structured data ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />

      <ClientInit />
      <div id="prog" role="progressbar" aria-label="Page scroll progress" aria-hidden="true" />
      <Nav />

      <main id="main-content">
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
        <Beyond categories={beyondCategories} allCategories={allCategories} />
      </main>

      <Footer />
      <QRModal />
    </>
  )
}
