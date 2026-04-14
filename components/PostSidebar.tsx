// components/PostSidebar.tsx
// Sticky sidebar for blog posts: author bio + related posts.
// Server component — no 'use client'.

import Link from 'next/link'
import { stripHtml, formatWPDate, wpLinkToPath } from '@/lib/wordpress'
import type { WPPost } from '@/types/wordpress'

interface Props {
  post:    WPPost
  related: WPPost[]
}

export default function PostSidebar({ post, related }: Props) {
  const author = post.author_card

  return (
    <aside className="post-sidebar">
      {/* ── Author card ── */}
      {author && (
        <div className="sb-author">
          {author.avatar && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={author.avatar} alt={author.name} className="sb-avatar" />
          )}
          <div className="sb-author-name">{author.name}</div>
          {author.description && (
            <p className="sb-author-bio">{author.description.slice(0, 200)}</p>
          )}
          {author.url && (
            <a
              href={author.url}
              target="_blank"
              rel="noopener noreferrer"
              className="sb-author-link"
            >
              Website →
            </a>
          )}
        </div>
      )}

      {/* ── Related posts ── */}
      {related.length > 0 && (
        <div className="sb-related">
          <div className="sb-label">Related</div>
          <ul className="sb-list">
            {related.map(p => (
              <li key={p.id}>
                <Link href={wpLinkToPath(p.link)} className="sb-post-link">
                  <span className="sb-post-title">{stripHtml(p.title.rendered)}</span>
                  <span className="sb-post-date">{formatWPDate(p.date)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  )
}
