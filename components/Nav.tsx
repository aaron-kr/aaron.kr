'use client'
// components/Nav.tsx

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [theme, setTheme]   = useState<'dark' | 'light'>('dark')
  const [lang, setLang]     = useState<'en' | 'ko'>('en')
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

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    setPref('as_theme', next, 'data-theme')
  }

  function toggleLang() {
    const next = lang === 'en' ? 'ko' : 'en'
    setLang(next)
    setPref('as_lang', next, 'data-lang')
  }

  function toggleAurora() {
    const next = aurora === 'on' ? 'off' : 'on'
    setAurora(next)
    setPref('as_aurora', next, 'data-aurora')
  }

  function openQR() {
    window.dispatchEvent(new Event('openQRModal'))
  }

  function closeMobile() {
    setMobileOpen(false)
  }

  return (
    <>
      <nav>
        <div className="nav-logo">
          Aaron Snowberger<span>, Ph.D.</span>
        </div>

        <div className="nav-mid">
          <ul className="nav-ul">
            <li><a href="#research"><span className="en">Research</span><span className="ko">연구</span></a></li>
            <li><a href="#teaching"><span className="en">Teaching</span><span className="ko">교육</span></a></li>
            <li><a href="#labs">Labs</a></li>
            <li><a href="#design"><span className="en">Design</span><span className="ko">디자인</span></a></li>
            <li><a href="#blog"><span className="en">Writing</span><span className="ko">글쓰기</span></a></li>
            <li><a href="#beyond"><span className="en">Beyond</span><span className="ko">랩 밖</span></a></li>
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

          <button
            className="nbtn aurora-btn fs"
            onClick={toggleAurora}
            aria-pressed={aurora === 'on'}
            title="Toggle aurora effect"
          >
            ✦
          </button>

          <button
            className="nbtn fs"
            onClick={toggleLang}
            aria-label="Toggle language"
          >
            {lang === 'en' ? '한국어' : 'English'}
          </button>

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
        <a href="#research" onClick={closeMobile} className="en">Research</a>
        <a href="#research" onClick={closeMobile} className="ko">연구</a>
        <a href="#teaching" onClick={closeMobile} className="en">Teaching</a>
        <a href="#teaching" onClick={closeMobile} className="ko">교육</a>
        <a href="#labs"     onClick={closeMobile}>Labs</a>
        <a href="#design"   onClick={closeMobile} className="en">Design</a>
        <a href="#design"   onClick={closeMobile} className="ko">디자인</a>
        <a href="#blog"     onClick={closeMobile} className="en">Writing</a>
        <a href="#blog"     onClick={closeMobile} className="ko">글쓰기</a>
        <a href="#beyond"   onClick={closeMobile} className="en">Beyond the Lab</a>
        <a href="#beyond"   onClick={closeMobile} className="ko">랩 밖에서</a>
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
