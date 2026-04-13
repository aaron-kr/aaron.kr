'use client'
// components/ClientInit.tsx
// Runs once on the client to wire up:
//   1. Scroll progress bar (#prog)
//   2. IntersectionObserver for .rise fade-in elements

import { useEffect } from 'react'

export default function ClientInit() {
  useEffect(() => {
    // ── Scroll progress bar ────────────────────────────────────
    const prog = document.getElementById('prog')
    const onScroll = () => {
      if (!prog) return
      const scrolled = window.scrollY
      const total =
        document.documentElement.scrollHeight - window.innerHeight
      prog.style.width = Math.min((scrolled / total) * 100, 100) + '%'
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // ── IntersectionObserver for .rise elements ───────────────
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('in')
        })
      },
      { threshold: 0.07 }
    )
    document.querySelectorAll('.rise').forEach((el) => observer.observe(el))

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  return null
}
