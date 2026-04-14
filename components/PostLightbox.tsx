'use client'
// components/PostLightbox.tsx
// Intercepts clicks on .wp-content images and shows a fullscreen gallery.
// Reads figcaption (Gutenberg) or .wp-caption-dd (Classic editor) for captions.

import { useEffect, useState, useCallback } from 'react'

interface LBImage { src: string; alt: string; caption: string }
interface LBState { images: LBImage[]; idx: number }

function captionFor(img: HTMLImageElement): string {
  // Gutenberg: <figure><img><figcaption>...</figcaption></figure>
  const fig = img.closest('figure')
  if (fig) {
    const cap = fig.querySelector('figcaption')
    if (cap?.textContent?.trim()) return cap.textContent.trim()
  }
  // Classic editor: <dl class="wp-caption"><dd class="wp-caption-dd">...</dd></dl>
  const dl = img.closest('.wp-caption')
  if (dl) {
    const dd = dl.querySelector('.wp-caption-dd')
    if (dd?.textContent?.trim()) return dd.textContent.trim()
  }
  return img.alt || ''
}

export default function PostLightbox() {
  const [lb, setLb] = useState<LBState | null>(null)

  const open  = useCallback((images: LBImage[], idx: number) => setLb({ images, idx }), [])
  const close = useCallback(() => setLb(null), [])
  const prev  = useCallback(() => setLb(s => s && s.idx > 0 ? { ...s, idx: s.idx - 1 } : s), [])
  const next  = useCallback(() => setLb(s => s && s.idx < s.images.length - 1 ? { ...s, idx: s.idx + 1 } : s), [])

  useEffect(() => {
    const container = document.querySelector('.wp-content')
    if (!container) return
    const imgs = Array.from(container.querySelectorAll<HTMLImageElement>('img'))
    const imageData: LBImage[] = imgs.map(img => ({
      src:     img.src,
      alt:     img.alt || '',
      caption: captionFor(img),
    }))
    const handlers = imgs.map((img, i) => {
      const h = () => open(imageData, i)
      img.addEventListener('click', h)
      img.style.cursor = 'zoom-in'
      return h
    })
    return () => {
      imgs.forEach((img, i) => {
        img.removeEventListener('click', handlers[i])
        img.style.cursor = ''
      })
    }
  }, [open])

  useEffect(() => {
    if (!lb) return
    const h = (e: KeyboardEvent) => {
      if (e.key === 'Escape')     close()
      if (e.key === 'ArrowLeft')  prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [lb, close, prev, next])

  if (!lb) return null
  const { images, idx } = lb
  const cur = images[idx]

  return (
    <div className="lightbox" onClick={close} role="dialog" aria-modal="true" aria-label="Image viewer">
      <button className="lb-close" onClick={close} aria-label="Close">✕</button>

      <div className="lb-img-wrap" onClick={e => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={cur.src} alt={cur.alt} className="lb-img" />
        {cur.caption && (
          <div className="lb-caption">{cur.caption}</div>
        )}
      </div>

      {images.length > 1 && (
        <>
          <button className="lb-nav lb-prev" onClick={e => { e.stopPropagation(); prev() }}
                  disabled={idx === 0} aria-label="Previous image">‹</button>
          <button className="lb-nav lb-next" onClick={e => { e.stopPropagation(); next() }}
                  disabled={idx === images.length - 1} aria-label="Next image">›</button>
          <div className="lb-counter" aria-live="polite">{idx + 1} / {images.length}</div>
        </>
      )}
    </div>
  )
}
