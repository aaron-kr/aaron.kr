// components/PostFooter.tsx
// Full-width colored section after the post body.
// Shows: related posts grid (with featured images) + simple prev/next text links.
// Server component — no 'use client'.

import Link from 'next/link'
import Image from 'next/image'
import { stripHtml, formatWPDate, getFeaturedImage, wpLinkToPath } from '@/lib/wordpress'
import type { WPPost } from '@/types/wordpress'

interface Props {
  prev:    WPPost | null
  next:    WPPost | null
  related: WPPost[]
}

export default function PostFooter({ prev, next, related }: Props) {
  if (!prev && !next && related.length === 0) return null

  return (
    <section className="pf-section">
      <div className="pf-inner">

        {/* ── Related posts ── */}
        {related.length > 0 && (
          <div className="pf-related">
            <div className="pf-label">Continue Reading</div>
            <div className={`pf-grid pf-grid-${related.length}`}>
              {related.map(p => {
                const img = getFeaturedImage(p)
                return (
                  <Link key={p.id} href={wpLinkToPath(p.link)} className="pf-card">
                    {img ? (
                      <Image
                        src={img}
                        alt={stripHtml(p.title.rendered)}
                        className="pf-card-img"
                        width={640}
                        height={360}
                        sizes="(max-width:640px) 100vw, 33vw"
                        style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                        loading="lazy"
                      />
                    ) : (
                      <div className="pf-card-img pf-card-img-ph g-aurora" />
                    )}
                    <span className="pf-card-title">{stripHtml(p.title.rendered)}</span>
                    <span className="pf-card-date">{formatWPDate(p.date)}</span>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Prev / Next ── */}
        {(prev || next) && (
          <div className="pf-adjacents">
            <div className="pf-adj-prev">
              {prev && (
                <>
                  <div className="pf-adj-dir">← Previous</div>
                  <Link href={wpLinkToPath(prev.link)} className="pf-adj-link">
                    {stripHtml(prev.title.rendered)}
                  </Link>
                </>
              )}
            </div>
            <div className="pf-adj-next">
              {next && (
                <>
                  <div className="pf-adj-dir">Next →</div>
                  <Link href={wpLinkToPath(next.link)} className="pf-adj-link">
                    {stripHtml(next.title.rendered)}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  )
}
