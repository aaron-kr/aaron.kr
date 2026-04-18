'use client'
// components/EmailLink.tsx
// Builds the mailto href at runtime so the full address is never in server-rendered HTML.
// Server HTML gets href="#" — the real address is assembled in the browser via useEffect.

import { useEffect, useRef } from 'react'

interface Props {
  className?: string
  children: React.ReactNode
}

export default function EmailLink({ className, children }: Props) {
  const ref = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (ref.current) {
      // Assemble at runtime: keeps the full address out of the SSR HTML
      ref.current.href = 'mailto:hi\u0040aaron.kr'
    }
  }, [])

  return (
    <a ref={ref} href="#" className={className}>
      {children}
    </a>
  )
}
