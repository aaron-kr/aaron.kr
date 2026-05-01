// components/Beyond.tsx
// Receives WP *categories* (children of the "beyond" parent) from the server.
// Featured categories are shown as image cards; all remaining blog categories
// appear as tag-style buttons below the grid.
// Falls back to static data if WP is offline or categories aren't set up yet.

import Link from 'next/link'
import Image from 'next/image'
import type { WPCategory } from '@/types/wordpress'

// ── Configurable: which slugs get the large image card treatment ───────────────
// Edit this list to change which categories appear as image cards.
// Keep in sync with BEYOND_ITEMS in Nav.tsx (the dropdown list).
export const FEATURED_SLUGS = ['sport', 'health', 'music', 'coffee', 'books', 'wyoming']

// ── Static fallback — update to match WP category slugs you create ─────────────
const FALLBACK: {
  id: number; slug: string; name: string; nameKo: string
  body: string; bodyKo: string; link: string; img: string
}[] = [
  { id: 1, slug: 'sport',   name: 'Sport',   nameKo: '운동',
    body: 'Second-degree black belt earned in Korea.',
    bodyKo: '한국에서 2단 검은 띠 취득.', link: '/category/sport',
    img: '/img/bike2.jpeg' },
  { id: 2, slug: 'health',  name: 'Health',  nameKo: '건강',
    body: 'Five half-marathons, semi-pro cycling, heavy compound lifts.',
    bodyKo: '하프마라톤 5회, 세미프로 사이클링, 복합 운동.', link: '/category/health',
    img: '/img/muscle-support-gym.png' },
  { id: 3, slug: 'music',   name: 'Music',   nameKo: '음악',
    body: 'Playing bass and drums. Baritone — experimenting with country phrasing.',
    bodyKo: '베이스와 드럼 연주. 바리톤 — 컨트리 창법 실험 중.', link: '/category/music',
    img: '/img/bass.jpg' },
  { id: 4, slug: 'coffee',  name: 'Coffee',  nameKo: '커피',
    body: '산미맛 single-origin — Ethiopia, Kenya, black Americano.',
    bodyKo: '산미맛 싱글 오리진 — 에티오피아, 케냐, 블랙 아메리카노.', link: '/category/coffee',
    img: '/img/coffee.jpg' },
  { id: 5, slug: 'books',   name: 'Books',   nameKo: '독서',
    body: 'Andy Weir, Terry Brooks, Jordan Peterson. Project Hail Mary.',
    bodyKo: '앤디 위어, 테리 브룩스, 조던 피터슨.', link: '/category/books',
    img: '/img/books2.jpg' },
  { id: 6, slug: 'wyoming', name: 'Wyoming', nameKo: '와이오밍',
    body: 'From Big Sky Country. The wide open West shaped how I think.',
    bodyKo: '빅 스카이 컨트리 출신. 드넓은 서부가 저의 사고방식을 형성했습니다.',
    link: '/category/wyoming', img: '/img/wyoming-yellowstone-plains.jpg' },
]

// Slugs that are never shown as tag buttons (WP system categories + the parent)
const EXCLUDED_SLUGS = new Set(['uncategorized', 'beyond'])

interface Props {
  categories:    WPCategory[]  // Children of "beyond" parent (image cards)
  allCategories: WPCategory[]  // All blog categories (for the tag list)
}

export default function Beyond({ categories, allCategories }: Props) {
  // ── Featured image cards ───────────────────────────────────────────────────
  const wpItems = categories.slice(0, 6).map(c => ({
    id:     c.id,
    slug:   c.slug,
    name:   c.name,
    nameKo: '',
    body:   c.description?.slice(0, 120) || '',
    bodyKo: '',
    link:   `/category/${c.slug}`,
    img:    c.meta?.category_image_url ?? '',
  }))

  const items = wpItems.length >= 6
    ? wpItems
    : [...wpItems, ...FALLBACK.slice(wpItems.length)]

  // ── Remaining categories as tag buttons ───────────────────────────────────
  // Exclude: the 6 featured slugs, system slugs, and zero-count categories.
  const shownSlugs = new Set(items.map(i => i.slug))
  const tagCategories = allCategories.filter(
    c => !shownSlugs.has(c.slug) && !EXCLUDED_SLUGS.has(c.slug) && c.count > 0
  )

  return (
    <section
      className="pad"
      id="beyond"
      style={{ background: 'var(--bg-soft)', borderTop: '1px solid var(--rule)' }}
    >
      <div className="wrap">
        {/* ── Section header ── */}
        <div className="sec-hdr rise">
          <div className="sec-hdr-txt">
            <div className="sec-lbl pk en">Beyond the Lab</div>
            <div className="sec-lbl pk ko">랩 밖에서</div>
            <h2>
              <a href="#beyond" className="sec-h2-link">
                <span className="en">Beyond the <span className="ipk">Research</span></span>
                <span className="ko"><span className="ipk">연구</span> 너머</span>
              </a>
            </h2>
            <p className="sec-intro en">Work is not the whole person.</p>
            <p className="sec-intro ko">일이 전부는 아닙니다.</p>
          </div>
        </div>

        {/* ── Beyond grid (featured image cards) ── */}
        <div className="byd-grid rise">
          {items.map((item) => (
            <div key={item.id} className="byd-item">
              <Link href={item.link} className="byd-img">
                {item.img ? (
                  <Image
                    src={item.img}
                    alt={item.name}
                    fill
                    sizes="(max-width:640px) 100vw, (max-width:960px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                  />
                ) : (
                  <div className="ph g-aurora" />
                )}
                <span className="byd-img-lnk en">Read posts →</span>
                <span className="byd-img-lnk ko">글 읽기 →</span>
              </Link>

              <Link href={item.link} className="byd-ta">
                {item.name   && <span className="byd-title en">{item.name}</span>}
                {item.nameKo && <span className="byd-title ko">{item.nameKo}</span>}
              </Link>

              {item.body   && <p className="byd-body en">{item.body}</p>}
              {item.bodyKo && <p className="byd-body ko">{item.bodyKo}</p>}
            </div>
          ))}
        </div>

        {/* ── All other blog categories as tag buttons ── */}
        {tagCategories.length > 0 && (
          <div className="byd-all-cats rise">
            <div className="byd-all-lbl en">More Topics</div>
            <div className="byd-all-lbl ko">더 많은 주제</div>
            <div className="byd-tag-row">
              {tagCategories.map(c => (
                <Link key={c.id} href={`/category/${c.slug}`} className="tag fss">
                  <span>{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
