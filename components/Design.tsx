// components/Design.tsx
// Receives WP project posts from the server. Falls back to static data
// if WordPress returns nothing (offline dev, migration window, etc.)

import Link from 'next/link'
import type { WPPost } from '@/types/wordpress'
import { getFeaturedImage, stripHtml, wpLinkToPath } from '@/lib/wordpress'

// ── Configurable: how many portfolio posts to show on the homepage ────────────
// Change this number, then it auto-flows to the WP fetch in app/page.tsx.
export const DESIGN_COUNT = 4

// ── Static fallback data (matches the v7 HTML exactly) ────────────────────────
const FALLBACK_POSTS = [
  { id: 1, title: 'JB Life! 2022 · Vol. 3', subtitle: 'Jeongeup Travel',   img: 'https://files.aaron.kr/media/2025/01/jblife-2022-vol3.jpg', href: 'https://aaron.kr/portfolio' },
  { id: 2, title: '2022 · Vol. 2',          subtitle: 'Slow Summer',       img: 'https://files.aaron.kr/media/2025/01/jblife-2022-vol2.png', href: 'https://aaron.kr/portfolio' },
  { id: 3, title: '2022 · Vol. 1',          subtitle: 'Art &amp; History', img: 'https://files.aaron.kr/media/2025/01/jblife-2022-vol1.png', href: 'https://aaron.kr/portfolio' },
  { id: 4, title: '2021 · Winter',          subtitle: 'Korean Games',      img: 'https://files.aaron.kr/media/2025/01/jblife-2021-winter.jpg', href: 'https://aaron.kr/portfolio' },
]

const CLIENTS = [
  { tip: 'Key To Korean',                          src: 'https://aaronsnowberger.com/wp-content/uploads/2015/05/k2k-client-logo-300x188.png' },
  { tip: 'Korea TESOL',                            src: 'https://aaronsnowberger.com/wp-content/uploads/2015/05/KOTESOL-Logo-2010-GIF-285x300.gif' },
  { tip: 'Jeollabuk-do Center for International Affairs', src: 'https://aaronsnowberger.com/wp-content/uploads/2020/07/1-1%E1%84%90%E1%85%AE%E1%84%86%E1%85%A7%E1%86%BC-300x178.png' },
  { tip: 'Global Prodigy Academy',                 src: 'https://aaronsnowberger.com/wp-content/uploads/2016/06/gpa-logo-black-png-300x93.png' },
  { tip: 'Jeonju University',                      src: 'https://aaronsnowberger.com/wp-content/uploads/2015/05/jju-client-logo-267x300.png' },
  { tip: 'Antioch International Christian Family', src: 'https://aaronsnowberger.com/wp-content/uploads/2015/05/aicf-client-logo-300x297.png' },
  { tip: 'Full Sail University',                   src: 'https://aaronsnowberger.com/wp-content/uploads/2015/05/full-sail-client-logo-300x209.png' },
]

interface Props {
  posts: WPPost[]
}

export default function Design({ posts }: Props) {
  // Build display items: prefer WP data, fall back to static
  const items =
    posts.length > 0
      ? posts.slice(0, DESIGN_COUNT).map((p) => ({
          id: p.id,
          title: stripHtml(p.title.rendered),
          subtitle: stripHtml(p.excerpt.rendered).slice(0, 60),
          img: getFeaturedImage(p) ?? '',
          href: wpLinkToPath(p.link),
        }))
      : FALLBACK_POSTS

  return (
    <section className="pad" id="design">
      <div className="wrap">
        {/* ── Section header ── */}
        <div className="sec-hdr rise">
          <div className="sec-hdr-txt">
            <div className="sec-lbl pu en">Creative Work</div>
            <div className="sec-lbl pu ko">크리에이티브 작업</div>
            <h2>
              <a href="/portfolio" className="sec-h2-link">
                <span className="en">Design &amp; <span className="ip">Visual Work</span></span>
                <span className="ko">디자인 &amp; <span className="ip">시각 작업</span></span>
              </a>
            </h2>
            <p className="sec-intro en">
              Five years as English magazine designer for Jeonbuk Center for
              International Affairs (2018–2022). Freelance branding and web.
            </p>
            <p className="sec-intro ko">
              전북국제교류센터 영문 매거진 디자이너 5년 (2018–2022).
            </p>
          </div>
        </div>

        {/* ── Design grid ── */}
        <div className="d-grid rise">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="di"
            >
              {item.img && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.img} alt={item.title} loading="lazy" />
              )}
              {!item.img && <div className="ph g-aurora" />}
              <div className="di-ov">
                <div
                  className="di-lbl"
                  dangerouslySetInnerHTML={{
                    __html: `${item.title}${item.subtitle ? `<br>${item.subtitle}` : ''}`,
                  }}
                />
              </div>
            </Link>
          ))}
        </div>

        {/* ── Client logos ── */}
        <div className="uni-strip rise">
          <div className="uni-strip-lbl en">Selected Clients</div>
          <div className="uni-strip-lbl ko">선택된 클라이언트</div>
          {CLIENTS.map((c) => (
            <a key={c.tip} className="uni-logo-wrap" data-tip={c.tip}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.src} alt={c.tip} className="uni-logo" loading="lazy" />
            </a>
          ))}
        </div>

        <div style={{ marginTop: '1.75rem' }} className="rise">
          <Link
            href="/portfolio"
            className="slink sl-p fs"
            style={{ display: 'inline-flex' }}
          >
            <span className="en">View all design work →</span>
            <span className="ko">모든 디자인 작업 →</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
