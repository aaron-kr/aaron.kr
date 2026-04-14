// components/Writing.tsx
// Receives WP posts from the server. Falls back to static data if WP is offline.

import type { WPPost } from '@/types/wordpress'
import Link from 'next/link'
import { stripHtml, formatWPDate, wpLinkToPath } from '@/lib/wordpress'

// ── Static fallback posts (from v7 HTML) ──────────────────────────────────────
const FALLBACK_POSTS = [
  { id: 1, title: 'On Physical AI: What Embodied Intelligence Means for Education',       titleKo: '피지컬 AI에 대하여: 체화된 지능이 교육에 의미하는 것', date: '2025 · Research', href: 'https://aaron.kr', italic: false },
  { id: 2, title: 'GitHub Classroom After One Year: What Actually Worked',                titleKo: 'GitHub Classroom 1년 후: 실제로 효과가 있었던 것들',   date: '2024 · Teaching', href: 'https://aaron.kr', italic: false },
  { id: 3, title: 'Twenty Years in Korea: Observations on Education and Culture',         titleKo: '한국에서의 20년: 교육과 문화에 관한 관찰',             date: '2024 · Reflection', href: 'https://aaron.kr', italic: false },
  { id: 4, title: '"A kind \'no\' is kinder than a wishy-washy \'maybe.\'"', titleKo: '', date: 'Aug 2022', href: 'https://aaron.kr/reflection/a-kind-no-is-kinder-than-a-wishy-washy-maybe/', italic: true },
]

interface Props {
  posts: WPPost[]
}

export default function Writing({ posts }: Props) {
  const items =
    posts.length > 0
      ? posts.map((p) => ({
          id: p.id,
          title: stripHtml(p.title.rendered),
          titleKo: '',
          date: formatWPDate(p.date),
          href: wpLinkToPath(p.link),
          italic: false,
        }))
      : FALLBACK_POSTS

  return (
    <section className="pad" id="blog">
      <div className="wrap">
        {/* ── Section header ── */}
        <div className="sec-hdr rise">
          <div className="sec-hdr-txt">
            <div className="sec-lbl en">Writing</div>
            <div className="sec-lbl ko">글쓰기</div>
            <h2>
              <span className="en">From the <em>Notebook</em></span>
              <span className="ko"><em>노트</em>에서</span>
            </h2>
          </div>
        </div>

        {/* ── Post list ── */}
        <div className="blist rise">
          {items.map((item) => (
            <Link key={item.id} href={item.href} className="bi">
              {item.italic ? (
                <span className="bt"><em dangerouslySetInnerHTML={{ __html: item.title }} /></span>
              ) : (
                <>
                  <span className="bt en">{item.title}</span>
                  {item.titleKo && <span className="bt ko">{item.titleKo}</span>}
                </>
              )}
              <span className="bm">{item.date}</span>
            </Link>
          ))}

          {/* All posts link */}
          <a
            href="https://aaron.kr"
            className="bi"
            target="_blank"
            rel="noopener noreferrer"
            style={{ borderBottom: 'none' }}
          >
            <span className="bt" style={{ color: 'var(--teal)', flex: 'none' }}>
              <span className="en">All posts →</span>
              <span className="ko">모든 글 →</span>
            </span>
            <span className="bm" />
          </a>
        </div>
      </div>
    </section>
  )
}
