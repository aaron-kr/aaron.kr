'use client'
// components/ClientInit.tsx
// Runs once on the client to wire up:
//   1. Scroll progress bar (#prog)
//   2. IntersectionObserver for .rise fade-in elements
//   3. highlight.js syntax highlighting on .wp-content code blocks

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

    // ── Syntax highlighting (highlight.js) ───────────────────
    // Only runs if highlight.js is installed: npm install highlight.js
    // and the CSS is imported in app/layout.tsx (see note below).
    import('highlight.js').then((hljs) => {
      // Highlight all <code> blocks with a language class.
      // WP outputs: <code class="language-javascript">...</code>
      hljs.default.highlightAll()

      // Stamp data-language on the parent .wp-block-code for the CSS badge.
      document.querySelectorAll('.wp-content .wp-block-code code').forEach((el) => {
        const lang = Array.from(el.classList)
          .find((c) => c.startsWith('language-'))
          ?.replace('language-', '')
        if (lang) {
          const parent = el.closest('.wp-block-code')
          if (parent) (parent as HTMLElement).dataset.language = lang
        }
      })
    }).catch(() => {
      // highlight.js not installed — code blocks render unstyled. That's fine.
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      observer.disconnect()
    }
  }, [])

  return null
}
