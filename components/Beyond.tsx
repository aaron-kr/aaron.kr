// components/Beyond.tsx
// Receives WP posts from the server. Falls back to static data if WP is offline.
// Category: 'beyond' (configure slug in .env.local → WP_BEYOND_CATEGORY)

import type { WPPost } from '@/types/wordpress'
import { getFeaturedImage, stripHtml } from '@/lib/wordpress'

// ── Static fallback items (from v7 HTML) ──────────────────────────────────────
const FALLBACK_ITEMS = [
  {
    id: 1, href: '#blog',
    img: '/img/bike2.jpeg',
    titleEn: 'Sport',        titleKo: '운동',
    bodyEn:  'Second-degree black belt earned in Korea.',
    bodyKo:  '한국에서 2단 검은 띠 취득.',
    linkEn: 'Read posts →',  linkKo: '글 읽기 →',
  },
  {
    id: 2, href: '#blog',
    img: '/img/muscle-support-gym.png',
    titleEn: 'Health',       titleKo: '건강',
    bodyEn:  'Five half-marathons, semi-pro cycling, heavy compound lifts.',
    bodyKo:  '하프마라톤 5회, 세미프로 사이클링, 복합 운동.',
    linkEn: 'Read posts →',  linkKo: '글 읽기 →',
  },
  {
    id: 3, href: '#blog',
    img: '/img/bass.jpg',
    titleEn: 'Music',        titleKo: '음악',
    bodyEn:  'Playing bass and drums. Baritone — experimenting with country phrasing.',
    bodyKo:  '베이스와 드럼 연주. 바리톤 — 컨트리 창법 실험 중.',
    linkEn: 'Read posts →',  linkKo: '글 읽기 →',
  },
  {
    id: 4, href: '#blog',
    img: '/img/coffee.jpg',
    titleEn: 'Coffee',       titleKo: '커피',
    bodyEn:  '산미맛 single-origin — Ethiopia, Kenya, black Americano.',
    bodyKo:  '산미맛 싱글 오리진 — 에티오피아, 케냐, 블랙 아메리카노.',
    linkEn: 'Read posts →',  linkKo: '글 읽기 →',
  },
  {
    id: 5, href: '#blog',
    img: '/img/books2.jpg',
    titleEn: 'Books',        titleKo: '독서',
    bodyEn:  'Andy Weir, Terry Brooks, Jordan Peterson. Project Hail Mary.',
    bodyKo:  '앤디 위어, 테리 브룩스, 조던 피터슨.',
    linkEn: 'Read posts →',  linkKo: '글 읽기 →',
  },
  {
    id: 6, href: '#wyo-korea',
    img: '/img/wyoming-yellowstone-plains.jpg',
    titleEn: 'Wyoming',      titleKo: '와이오밍',
    bodyEn:  'From Big Sky Country. The wide open West shaped how I think.',
    bodyKo:  '빅 스카이 컨트리 출신. 드넓은 서부가 저의 사고방식을 형성했습니다.',
    linkEn: 'See Wyoming ↑', linkKo: '와이오밍 보기 ↑',
  },
]

interface Props {
  posts: WPPost[]
}

export default function Beyond({ posts }: Props) {
  // If we have WP posts, map them to the same shape; else use static fallback.
  // We always show exactly 6 items (pad with fallback if WP returns fewer).
  const wpItems = posts.slice(0, 6).map((p, i) => ({
    id: p.id,
    href: p.link,
    img: getFeaturedImage(p) ?? '',
    titleEn: stripHtml(p.title.rendered),
    titleKo: '',
    bodyEn:  stripHtml(p.excerpt.rendered).slice(0, 120),
    bodyKo:  '',
    linkEn: 'Read post →',
    linkKo: '글 읽기 →',
  }))

  const items = posts.length >= 6
    ? wpItems
    : [
        ...wpItems,
        ...FALLBACK_ITEMS.slice(wpItems.length),
      ]

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
              <span className="en">Beyond the <span className="ipk">Research</span></span>
              <span className="ko"><span className="ipk">연구</span> 너머</span>
            </h2>
            <p className="sec-intro en">Work is not the whole person.</p>
            <p className="sec-intro ko">일이 전부는 아닙니다.</p>
          </div>
        </div>

        {/* ── Beyond grid ── */}
        <div className="byd-grid rise">
          {items.map((item) => (
            <div key={item.id} className="byd-item">
              <a
                href={item.href}
                className="byd-img"
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {item.img ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.img} alt={item.titleEn} loading="lazy" />
                ) : (
                  <div className="ph g-aurora" />
                )}
                <span className="byd-img-lnk en">{item.linkEn}</span>
                <span className="byd-img-lnk ko">{item.linkKo}</span>
              </a>

              <a
                href={item.href}
                className="byd-ta"
                target={item.href.startsWith('http') ? '_blank' : undefined}
                rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              >
                {item.titleEn && <span className="byd-title en">{item.titleEn}</span>}
                {item.titleKo && <span className="byd-title ko">{item.titleKo}</span>}
              </a>

              {item.bodyEn && <p className="byd-body en">{item.bodyEn}</p>}
              {item.bodyKo && <p className="byd-body ko">{item.bodyKo}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
