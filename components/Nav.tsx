'use client'
// components/Nav.tsx

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

// ── Dropdown items for "Beyond" nav link ──────────────────────────────────────
// Keep these in sync with FEATURED_SLUGS in Beyond.tsx.
const BEYOND_ITEMS = [
  { slug: 'sport',   label: 'Sport',   labelKo: '운동' },
  { slug: 'health',  label: 'Health',  labelKo: '건강' },
  { slug: 'music',   label: 'Music',   labelKo: '음악' },
  { slug: 'coffee',  label: 'Coffee',  labelKo: '커피' },
  { slug: 'books',   label: 'Books',   labelKo: '독서' },
  { slug: 'wyoming', label: 'Wyoming', labelKo: '와이오밍' },
]

export default function Nav() {
  const pathname   = usePathname()
  const isHome     = pathname === '/'

  const [mobileOpen,  setMobileOpen]  = useState(false)
  const [beyondOpen,  setBeyondOpen]  = useState(false)
  const [theme,  setTheme]  = useState<'dark' | 'light'>('dark')
  const [lang,   setLang]   = useState<'en' | 'ko'>('en')
  const [aurora, setAurora] = useState<'on' | 'off'>('off')

  // ── Sync from localStorage on mount ───────────────────────────────────────
  useEffect(() => {
    const t = (localStorage.getItem('as_theme')  as 'dark' | 'light') || 'dark'
    const l = (localStorage.getItem('as_lang')   as 'en' | 'ko')      || 'en'
    const a = (localStorage.getItem('as_aurora') as 'on' | 'off')     || 'off'
    setTheme(t); setLang(l); setAurora(a)
  }, [])

  // ── Persist + apply a preference ──────────────────────────────────────────
  function setPref(key: string, value: string, attr: string) {
    localStorage.setItem(key, value)
    document.documentElement.setAttribute(attr, value)
  }

  function toggleTheme()  { const n = theme  === 'dark' ? 'light' : 'dark';  setTheme(n);  setPref('as_theme',  n, 'data-theme') }
  function toggleLang()   { const n = lang   === 'en'   ? 'ko'   : 'en';    setLang(n);   setPref('as_lang',   n, 'data-lang') }
  function toggleAurora() { const n = aurora === 'on'   ? 'off'  : 'on';    setAurora(n); setPref('as_aurora', n, 'data-aurora') }

  // Close Beyond dropdown when clicking outside it
  useEffect(() => {
    if (!beyondOpen) return
    const handler = (e: MouseEvent) => {
      const el = (e.target as Element).closest('.nav-li-drop')
      if (!el) setBeyondOpen(false)
    }
    document.addEventListener('click', handler)
    return () => document.removeEventListener('click', handler)
  }, [beyondOpen])

  function openQR()      { window.dispatchEvent(new Event('openQRModal')) }
  function closeMobile() { setMobileOpen(false) }

  // On homepage: go to section directly.  On other pages: navigate home then section.
  const s = (anchor: string) => isHome ? anchor : `/${anchor}`

  return (
    <>
      <nav aria-label="Primary">
        {/* Logo — always links to homepage */}
        <Link href="/" className="nav-logo" style={{ textDecoration: 'none', color: 'inherit' }}>
          Aaron Snowberger<span>, Ph.D.</span>
        </Link>

        <div className="nav-mid">
          <ul className="nav-ul">
            <li><a href={s('#research')}><span className="en">Research</span><span className="ko">연구</span></a></li>
            <li><a href={s('#teaching')}><span className="en">Teaching</span><span className="ko">교육</span></a></li>
            <li><a href={s('#labs')}>Labs</a></li>
            <li><a href={s('#design')}><span className="en">Design</span><span className="ko">디자인</span></a></li>
            <li><a href={s('#blog')}><span className="en">Writing</span><span className="ko">글쓰기</span></a></li>
            <li className="nav-li-drop">
              <button
                className="nav-dd-trigger"
                onClick={() => setBeyondOpen(o => !o)}
                aria-expanded={beyondOpen}
                aria-haspopup="true"
              >
                <a href={s('#beyond')} onClick={e => e.preventDefault()} tabIndex={-1}>
                  <span className="en">Beyond</span><span className="ko">랩 밖</span>
                </a>
                <svg className={`nav-dd-arrow${beyondOpen ? ' open' : ''}`}
                     width="9" height="9" viewBox="0 0 10 10" fill="none"
                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                     aria-hidden="true">
                  <polyline points="2 3 5 7 8 3"/>
                </svg>
              </button>
              <div className={`nav-dropdown${beyondOpen ? ' open' : ''}`}>
                <a href={s('#beyond')} className="nav-dd-item nav-dd-top"
                   onClick={() => setBeyondOpen(false)}>
                  <span className="en">Beyond the Lab →</span>
                  <span className="ko">랩 밖에서 →</span>
                </a>
                <div className="nav-dd-divider" />
                {BEYOND_ITEMS.map(item => (
                  <Link key={item.slug} href={`/category/${item.slug}`} className="nav-dd-item"
                        onClick={() => setBeyondOpen(false)}>
                    <span className="en">{item.label}</span>
                    <span className="ko">{item.labelKo}</span>
                  </Link>
                ))}
              </div>
            </li>
          </ul>
          <a
            href="https://courses.aaron.kr/"
            className="nav-courses fs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="en">Courses →</span>
            <span className="ko">강의 →</span>
          </a>
        </div>

        <div className="nav-right">
          {/* QR code — homepage only */}
          {isHome && (
            <button
              className="nbtn fs"
              onClick={openQR}
              title="QR Codes"
              aria-label="Show QR codes"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="15" y="15" width="3" height="3" rx=".5"/>
                <rect x="19" y="15" width="2" height="2" rx=".5"/>
                <rect x="15" y="19" width="2" height="2" rx=".5"/>
                <rect x="18" y="18" width="3" height="3" rx=".5"/>
              </svg>
            </button>
          )}

          {/* Aurora — all pages */}
          <button
            className="nbtn aurora-btn fs"
            onClick={toggleAurora}
            aria-pressed={aurora === 'on'}
            aria-label="Toggle aurora effect"
            title="Toggle aurora effect"
          >
            <span aria-hidden="true">✦</span>
          </button>

          {/* Language toggle — homepage only */}
          {isHome && (
            <button
              className="nbtn fs"
              onClick={toggleLang}
              aria-label="Toggle language"
            >
              {lang === 'en' ? '한국어' : 'English'}
            </button>
          )}

          <button
            className="nbtn fs"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span>
          </button>

          <button
            className={`hamburger${mobileOpen ? ' open' : ''}`}
            id="ham"
            aria-label="Menu"
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <nav className={`mob-menu${mobileOpen ? ' open' : ''}`} aria-label="Mobile menu">
        <a href={s('#research')} onClick={closeMobile} className="en">Research</a>
        <a href={s('#research')} onClick={closeMobile} className="ko">연구</a>
        <a href={s('#teaching')} onClick={closeMobile} className="en">Teaching</a>
        <a href={s('#teaching')} onClick={closeMobile} className="ko">교육</a>
        <a href={s('#labs')}     onClick={closeMobile}>Labs</a>
        <a href={s('#design')}   onClick={closeMobile} className="en">Design</a>
        <a href={s('#design')}   onClick={closeMobile} className="ko">디자인</a>
        <a href={s('#blog')}     onClick={closeMobile} className="en">Writing</a>
        <a href={s('#blog')}     onClick={closeMobile} className="ko">글쓰기</a>
        <a href={s('#beyond')}   onClick={closeMobile} className="en">Beyond the Lab</a>
        <a href={s('#beyond')}   onClick={closeMobile} className="ko">랩 밖에서</a>
        {BEYOND_ITEMS.map(item => (
          <Link key={item.slug} href={`/category/${item.slug}`} onClick={closeMobile}
                className="mob-dd-item">
            <span className="en">↳ {item.label}</span>
            <span className="ko">↳ {item.labelKo}</span>
          </Link>
        ))}
        <a
          href="https://courses.aaron.kr/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMobile}
          style={{ color: 'var(--teal)', fontWeight: 700 }}
          className="en"
        >Courses →</a>
        <a
          href="https://courses.aaron.kr/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMobile}
          style={{ color: 'var(--teal)', fontWeight: 700 }}
          className="ko"
        >강의 →</a>
      </nav>
    </>
  )
}
