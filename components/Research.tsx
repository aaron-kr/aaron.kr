// components/Research.tsx
// Static server component — content maintained here, links out to pailab.io

export default function Research() {
  return (
    <section className="pad" id="research">
      <div className="wrap">
        {/* ── Section header ── */}
        <div className="sec-hdr rise">
          <div className="sec-hdr-txt">
            <div className="sec-lbl en">Research &amp; Publications</div>
            <div className="sec-lbl ko">연구 및 논문</div>
            <h2>
              <a href="https://pailab.io" className="sec-h2-link" target="_blank" rel="noopener noreferrer">
                <span className="en">What I Work On</span>
                <span className="ko">연구 분야</span>
              </a>
            </h2>
            <p className="sec-intro en">
              Computer vision, Physical AI, and engineering education — at the
              intersection of intelligent systems and real-world application.
            </p>
            <p className="sec-intro ko">
              컴퓨터 비전, 피지컬 AI, 공학 교육 — 지능 시스템과 실제 적용의 교차점.
            </p>
          </div>
          <div className="sec-img"><div className="ph g-research" /></div>
        </div>

        {/* ── Research items ── */}
        <div className="glist rise">

          {/* Physical AI */}
          <div className="gli">
            <div className="ritem">
              <div className="rm">
                <div className="rm-lbl">
                  <span className="en">Physical AI</span>
                  <span className="ko">피지컬 AI</span>
                  <span className="rm-acc">2025–Present</span>
                </div>
              </div>
              <div className="rc">
                <div className="ri-title en">Physical AI Curriculum Design</div>
                <div className="ri-title ko">피지컬 AI 교육과정 설계</div>
                <p className="ri-body en">
                  Developing university-level curriculum at the frontier of embodied
                  intelligence — where AI leaves the data center and operates in the
                  physical world. Contributing to KSPAI.
                </p>
                <p className="ri-body ko">
                  체화된 지능의 최전선에서 대학 수준의 교육과정 개발. KSPAI에 기여.
                </p>
                <div className="tags">
                  <span className="tag fss"><span>Physical AI</span></span>
                  <span className="tag fss"><span>Embodied Intelligence</span></span>
                  <span className="tag fss"><span>Curriculum</span></span>
                </div>
                <div className="ri-links">
                  <a href="https://pailab.io" className="ri-lnk" target="_blank" rel="noopener noreferrer">PAI Lab →</a>
                  <a href="https://kspai.org" className="ri-lnk" target="_blank" rel="noopener noreferrer">KSPAI →</a>
                </div>
              </div>
              <div className="ri g-aurora" />
            </div>
          </div>

          {/* Handwriting Recognition */}
          <div className="gli">
            <div className="ritem">
              <div className="rm">
                <div className="rm-lbl">
                  <span className="en">Info-Comm Engineering</span>
                  <span className="ko">정보통신공학</span>
                  <span className="rm-acc b en">Ph.D. · Best Thesis</span>
                  <span className="rm-acc b ko">박사 · 우수논문</span>
                </div>
              </div>
              <div className="rc">
                <div className="ri-title en">Handwriting Recognition: Manchu Script &amp; Hangul</div>
                <div className="ri-title ko">필기 인식: 만주어 문자 &amp; 한글</div>
                <p className="ri-body en">
                  Deep learning for historical Manchu script and modern Korean handwriting.
                  Awarded Best Ph.D. Thesis at Hanbat National University.
                </p>
                <p className="ri-body ko">
                  역사적 만주어 문자와 현대 한국어 필기를 위한 딥러닝.
                  한밭대학교 우수 박사학위 논문상.
                </p>
                <div className="tags">
                  <span className="tag b fss"><span>OCR</span></span>
                  <span className="tag b fss"><span>Deep Learning</span></span>
                  <span className="tag b fss"><span>Computer Vision</span></span>
                  <span className="tag b fss"><span>Hangul</span></span>
                </div>
                <div className="ri-links">
                  <a href="https://www.researchgate.net/profile/Aaron-Snowberger" className="ri-lnk b" target="_blank" rel="noopener noreferrer">ResearchGate →</a>
                  <a href="https://scholar.google.com/citations?user=JCbnnvUAAAAJ" className="ri-lnk b" target="_blank" rel="noopener noreferrer">Scholar →</a>
                </div>
              </div>
              <div className="ri g-kr" />
            </div>
          </div>

          {/* CS Education */}
          <div className="gli">
            <div className="ritem">
              <div className="rm">
                <div className="rm-lbl">
                  <span className="en">CS Education</span>
                  <span className="ko">CS 교육</span>
                  <span className="rm-acc b">Several Published</span>
                </div>
              </div>
              <div className="rc">
                <div className="ri-title en">GitHub &amp; Developer Tools in CS Education</div>
                <div className="ri-title ko">CS 교육에서의 GitHub 및 개발자 도구</div>
                <p className="ri-body en">
                  Empirical study integrating GitHub Classroom into university CS workflows.
                  Published in the Journal of Practical Engineering Education.
                </p>
                <p className="ri-body ko">
                  대학 CS 워크플로우에 GitHub Classroom을 통합하는 실증 연구.
                  실용공학교육 저널 게재.
                </p>
                <div className="tags">
                  <span className="tag p fss"><span>EdTech</span></span>
                  <span className="tag p fss"><span>GitHub Classroom</span></span>
                  <span className="tag p fss"><span>CS Education</span></span>
                </div>
              </div>
              <div className="ri g-cs" />
            </div>
          </div>
        </div>

        {/* ── Societies ── */}
        <div className="societies rise">
          <div className="soc-lbl en">Member &amp; Contributor</div>
          <div className="soc-lbl ko">학회 및 기여</div>
          <div className="soc-row">
            {[
              { href: 'https://kiice.org',   name: 'KIICE' },
              { href: 'https://kspai.org',   name: 'KSPAI' },
              { href: 'https://klife.re.kr', name: 'KLIFE' },
              { href: 'https://kipee.or.kr', name: 'KIPEE' },
              { href: 'https://kmms.or.kr',  name: 'KMMS'  },
              { href: 'https://kocos.or.kr', name: 'KOCOS' },
            ].map(({ href, name }) => (
              <a key={name} href={href} className="soc-pill fs" target="_blank" rel="noopener noreferrer">
                {name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
