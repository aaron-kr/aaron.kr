// components/Footer.tsx
// Static server component

export default function Footer() {
  return (
    <footer className="ms" style={{ ['--ms-url' as string]: "url('/img/hangul-papers.jpg')" }}>
      <div className="foot-inner">

        {/* ── LEFT: info ── */}
        <div className="foot-left">
          <div className="foot-name">
            Aaron Snowberger<span>, Ph.D.</span>
          </div>
          <p className="foot-info en">
            AI Researcher &amp; Educator · Jeonju, Republic of Korea<br />
            Five Korean universities · hi@aaron.kr · aaron.kr
          </p>
          <p className="foot-info ko">
            AI 연구자 &amp; 교육자 · 전주, 대한민국<br />
            다섯 개 한국 대학 · hi@aaron.kr · aaron.kr
          </p>
        </div>

        {/* ── CENTER: Wyoming cowboy logo ── */}
        <div className="foot-center">
          <a
            href="https://en.wikipedia.org/wiki/Wyoming"
            className="wy-logo"
            target="_blank"
            rel="noopener noreferrer"
            title="Wyoming, USA — Big Sky Country"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/img/wyoming_cowboys_no-txt.webp"
              alt="Wyoming Cowboy"
              style={{ maxHeight: '60px' }}
              loading="lazy"
            />
          </a>
        </div>

        {/* ── RIGHT: links ── */}
        <div className="foot-right">
          <div className="foot-links">
            <div className="fl-row">
              <a href="https://linkedin.com/in/aaronsnowberger/" className="fl t" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://github.com/jekkilekki"            className="fl t" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a href="https://courses.aaron.kr/"                className="fl t" target="_blank" rel="noopener noreferrer">Courses</a>
            </div>
            <div className="fl-row">
              <a href="https://www.researchgate.net/profile/Aaron-Snowberger" className="fl b" target="_blank" rel="noopener noreferrer">ResearchGate</a>
              <a href="https://scholar.google.com/citations?user=JCbnnvUAAAAJ" className="fl b" target="_blank" rel="noopener noreferrer">Scholar</a>
              <a href="https://orcid.org/0000-0001-8652-0936"                  className="fl b" target="_blank" rel="noopener noreferrer">ORCID</a>
            </div>
            <div className="fl-row">
              <a href="https://kspai.org"              className="fl p" target="_blank" rel="noopener noreferrer">KSPAI</a>
              <a href="https://m.blog.naver.com/aaron_kr" className="fl p" target="_blank" rel="noopener noreferrer">Naver</a>
              <a href="https://aaron.kr/content"       className="fl p" target="_blank" rel="noopener noreferrer">Blog</a>
            </div>
            <p className="foot-info" style={{ textAlign: 'right', marginTop: '.35rem' }}>
              © {new Date().getFullYear()} Aaron Snowberger
            </p>
          </div>
        </div>

      </div>
    </footer>
  )
}
