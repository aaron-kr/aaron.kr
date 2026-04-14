// components/Breadcrumbs.tsx
// Simple breadcrumb trail. Server component — no 'use client'.
// Usage: <Breadcrumbs crumbs={[{ label: 'Home', href: '/' }, { label: 'Writing', href: '/writing' }, { label: title }]} />

import Link from 'next/link'

export interface Crumb {
  label: string
  href?:  string   // omit for the current (last) item
}

interface Props {
  crumbs: Crumb[]
}

export default function Breadcrumbs({ crumbs }: Props) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {crumbs.map((c, i) => (
        <span key={i} className="bc-item">
          {i > 0 && <span className="bc-sep" aria-hidden="true">›</span>}
          {c.href
            ? <Link href={c.href} className="bc-link">{c.label}</Link>
            : <span className="bc-cur" aria-current="page">{c.label}</span>
          }
        </span>
      ))}
    </nav>
  )
}
