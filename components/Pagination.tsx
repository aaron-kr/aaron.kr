// components/Pagination.tsx
// Page number nav for archive pages.
// Server component — uses Next.js <Link> for prefetching.

import Link from 'next/link'

interface Props {
  currentPage: number
  totalPages:  number
  basePath:    string   // e.g. '/writing' or '/category/code'
}

function pageHref(basePath: string, page: number): string {
  return page === 1 ? basePath : `${basePath}?page=${page}`
}

export default function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null

  // Show at most 7 page buttons: always first + last, up to 3 around current
  const pages: (number | '…')[] = []
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2) {
      pages.push(p)
    } else if (pages[pages.length - 1] !== '…') {
      pages.push('…')
    }
  }

  return (
    <div className="pagination" role="navigation" aria-label="Page navigation">
      {currentPage > 1 && (
        <Link href={pageHref(basePath, currentPage - 1)} className="pg-btn pg-adj" aria-label="Previous page">
          ←
        </Link>
      )}

      {pages.map((p, i) =>
        p === '…' ? (
          <span key={`ellipsis-${i}`} className="pg-ellipsis">…</span>
        ) : (
          <Link
            key={p}
            href={pageHref(basePath, p)}
            className={`pg-btn${p === currentPage ? ' pg-active' : ''}`}
            aria-current={p === currentPage ? 'page' : undefined}
          >
            {p}
          </Link>
        )
      )}

      {currentPage < totalPages && (
        <Link href={pageHref(basePath, currentPage + 1)} className="pg-btn pg-adj" aria-label="Next page">
          →
        </Link>
      )}
    </div>
  )
}
