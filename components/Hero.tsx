// components/Hero.tsx
// Static server component — no WP dependency

import Image from 'next/image'
import EmailLink from './EmailLink'

export default function Hero() {
  return (
    <section id="hero" className="ms" style={{ ['--ms-url' as string]: "url('/img/hangul-papers.jpg')" }}>
      <div className="hero-grid">
        {/* ── Photo column ── */}
        <div className="hero-photo">
          <Image
            src="https://i0.wp.com/files.aaron.kr/media/2025/01/aaron.jpg?fit=460%2C460&ssl=1"
            alt="Aaron Snowberger"
            width={460}
            height={460}
            priority
            style={{ width: '100%', height: 'auto' }}
          />

          <div className="photo-affil">
            <div className="affil-line"><span className="affil-dot"></span>KSPAI</div>
            <div className="affil-line"><span className="affil-dot b"></span>KIICE</div>
            <div className="affil-line"><span className="affil-dot p"></span>KLIFE</div>
          </div>

          <a
            href="https://courses.aaron.kr/"
            className="hero-cta fs"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Student Courses (opens in new tab)"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
              <polyline points="15,3 21,3 21,9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            <span className="en">Student Courses</span>
            <span className="ko">수강생 강의</span>
          </a>
        </div>

        {/* ── Content column ── */}
        <div>
          <div className="hero-eyebrow">
            <div className="ey-line"></div>
            <span className="ey-txt en">Jeonju, South Korea</span>
            <span className="ey-txt ko">전주, 대한민국</span>
          </div>

          <h1>
            <span className="en">Aaron <em>Snowberger</em></span>
            <span className="ko">에런 <em>스노버거</em></span>
          </h1>

          <p className="hero-cred">
            <span className="en">Ph.D. · AI Researcher &amp; Educator · Wyoming</span>
            <span className="ko">공학박사 · AI 연구자 &amp; 교육자 · 와이오밍 출신</span>
          </p>

          <p className="hero-tagline en">
            &ldquo;Bridging East and West through AI research, engineering education,
            and the occasional good Korean pour-over.&rdquo;
          </p>
          <p className="hero-tagline ko">
            &ldquo;AI 연구, 공학 교육, 그리고 가끔 한국 핸드드립 커피 한 잔으로 동서양을 잇습니다.&rdquo;
          </p>

          <p className="hero-bio en">
            Lecturer across five Korean universities in AI, programming, IoT, and circuits.
            Research: handwriting recognition, Physical AI curriculum, CS education.
            Twenty years in Korean academia — still a Wyoming cowboy at heart.
          </p>
          <p className="hero-bio ko">
            다섯 개 한국 대학에서 AI, 프로그래밍, IoT, 회로 강의.
            연구: 필기 인식, 피지컬 AI 교육과정, CS 교육.
            한국 학계 20년 — 마음은 여전히 와이오밍 카우보이.
          </p>

          <div className="srow">
            <a href="https://linkedin.com/in/aaronsnowberger/" className="slink sl-t fs" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn (opens in new tab)">
              <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden="true">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </a>
            <a href="https://github.com/jekkilekki" className="slink sl-t fs" target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in new tab)">
              <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden="true">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
              </svg>
              GitHub
            </a>
            <a href="https://www.researchgate.net/profile/Aaron-Snowberger" className="slink sl-b fs" target="_blank" rel="noopener noreferrer" aria-label="ResearchGate (opens in new tab)">
              <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden="true">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM7 17V7h3a3 3 0 010 6H9v4H7zm12 0h-2l-2-4h-1v4h-2V7h3a3 3 0 011 5.82L19 17z"/>
              </svg>
              ResearchGate
            </a>
            <a href="https://scholar.google.com/citations?user=JCbnnvUAAAAJ" className="slink sl-b fs" target="_blank" rel="noopener noreferrer" aria-label="Google Scholar (opens in new tab)">
              <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden="true">
                <path d="M12 14l9-5-9-5-9 5 9 5z"/>
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
              </svg>
              Scholar
            </a>
            <a href="https://orcid.org/0000-0001-8652-0936" className="slink sl-p fs" target="_blank" rel="noopener noreferrer" aria-label="ORCID profile (opens in new tab)">
              <svg viewBox="0 0 24 24" fill="currentColor" width="13" height="13" aria-hidden="true">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9 7h2v10H9zM13 7h2a5 5 0 010 10h-2z" fill="var(--bg)"/>
              </svg>
              ORCID
            </a>
            <a href="https://kspai.org" className="slink sl-p fs" target="_blank" rel="noopener noreferrer" aria-label="KSPAI (opens in new tab)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" aria-hidden="true">
                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
              </svg>
              KSPAI
            </a>
            <EmailLink className="slink sl-pk fs">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13" aria-hidden="true">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,12 2,6"/>
              </svg>
              Email
            </EmailLink>
          </div>
        </div>
      </div>
    </section>
  )
}
