'use client'
// components/Nav.tsx

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export default function Nav() {
  const pathname   = usePathname()
  const isHome     = pathname === '/'

  const [mobileOpen, setMobileOpen] = useState(false)
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

  function openQR()      { window.dispatchEvent(new Event('openQRModal')) }
  function closeMobile() { setMobileOpen(false) }

  // On homepage: go to section directly.  On other pages: navigate home then section.
  const s = (anchor: string) => isHome ? anchor : `/${anchor}`

  return (
    <>
      <nav>
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
            <li><a href={s('#beyond')}><span className="en">Beyond</span><span className="ko">랩 밖</span></a></li>
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
            title="Toggle aurora effect"
          >
            ✦
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
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? '☀' : '☾'}
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
      <nav className={`mob-menu${mobileOpen ? ' open' : ''}`}>
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
