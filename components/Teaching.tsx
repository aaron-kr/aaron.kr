// components/Teaching.tsx
// Static server component — links out to courses.aaron.kr

import Image from 'next/image'

const UNIVERSITIES = [
  { tip: 'Jeonbuk National University',              src: 'https://aaronkr-courses.github.io/assets/img/jbnu-logo-2.png',  alt: 'JBNU'  },
  { tip: 'Korea National University of Transportation', src: 'https://aaronkr-courses.github.io/assets/img/ut-logo.png',   alt: 'UT'    },
  { tip: 'Hanbat National University',               src: 'https://aaronkr-courses.github.io/assets/img/hanbat-logo.png', alt: 'HBU'   },
  { tip: 'Jeonju National University of Education',  src: 'https://aaronkr-courses.github.io/assets/img/jnue-logo.png',   alt: 'JNUE'  },
  { tip: 'Wonkwang University',                      src: 'https://aaronkr-courses.github.io/assets/img/wku-logo.png',    alt: 'WKU'   },
  { tip: 'Daejeon University',                       src: 'https://aaronkr-courses.github.io/assets/img/dju-logo-2.png',  alt: 'DJU'   },
  { tip: 'Jeonju University',                        src: 'https://aaronkr-courses.github.io/assets/img/jju-logo.png',    alt: 'JJU'   },
]

export default function Teaching() {
  return (
    <section className="pad" id="teaching">
      <div className="wrap">
        {/* ── Section header ── */}
        <div className="sec-hdr rise">
          <div className="sec-hdr-txt">
            <div className="sec-lbl bl en">Teaching &amp; Courses</div>
            <div className="sec-lbl bl ko">강의 및 과목</div>
            <h2>
              <a href="https://courses.aaron.kr/" className="sec-h2-link" target="_blank" rel="noopener noreferrer">
                <span className="en">Five Universities, <span className="ib">One Approach</span></span>
                <span className="ko">다섯 개 대학, <span className="ib">하나의 방식</span></span>
              </a>
            </h2>
            <p className="sec-intro en">
              Visual, bilingual, project-based — designed for all levels regardless of English proficiency.
            </p>
            <p className="sec-intro ko">
              시각적, 이중 언어, 프로젝트 중심 — 영어 수준에 관계없이 모두를 위한 수업.
            </p>
          </div>
          <div className="sec-img"><div className="ph g-lab" /></div>
        </div>

        {/* ── Course list ── */}
        <div className="glist rise">
          <div className="gli t-li">
            <div className="tli">
              <div className="tn"><div className="item-num">01</div></div>
              <div className="tc">
                <div className="ri-title en">Artificial Intelligence &amp; Machine Learning</div>
                <div className="ri-title ko">인공지능 &amp; 머신러닝</div>
                <p className="ri-body en">Python, neural networks, CV, deep learning — GitHub Classroom from week one.</p>
                <p className="ri-body ko">Python, 신경망, CV, 딥러닝 — 첫 주부터 GitHub Classroom.</p>
                <div className="tags">
                  <span className="tag b fss"><span>Python</span></span>
                  <span className="tag b fss"><span>ML/DL</span></span>
                  <span className="tag b fss"><span>CV</span></span>
                </div>
              </div>
              <div className="ti g-lab" />
            </div>
          </div>

          <div className="gli t-li">
            <div className="tli">
              <div className="tn"><div className="item-num">02</div></div>
              <div className="tc">
                <div className="ri-title en">IoT &amp; Embedded Systems</div>
                <div className="ri-title ko">IoT &amp; 임베디드 시스템</div>
                <p className="ri-body en">Circuits, microcontrollers, sensors — breadboard to real-world deployment.</p>
                <p className="ri-body ko">회로, 마이크로컨트롤러, 센서 — 브레드보드에서 실제 배포까지.</p>
                <div className="tags">
                  <span className="tag b fss"><span>Arduino</span></span>
                  <span className="tag b fss"><span>Raspberry Pi</span></span>
                  <span className="tag b fss"><span>Circuits</span></span>
                </div>
              </div>
              <div className="ti g-research" />
            </div>
          </div>

          <div className="gli t-li">
            <div className="tli">
              <div className="tn"><div className="item-num">03</div></div>
              <div className="tc">
                <div className="ri-title en">Programming Fundamentals</div>
                <div className="ri-title ko">프로그래밍 기초</div>
                <p className="ri-body en">C, Python, Java, web — clear bilingual instruction for all levels.</p>
                <p className="ri-body ko">C, Python, Java, 웹 — 전 레벨을 위한 명확한 이중 언어 수업.</p>
                <div className="tags">
                  <span className="tag b fss"><span>C / Python</span></span>
                  <span className="tag b fss"><span>Java</span></span>
                  <span className="tag b fss"><span>Web</span></span>
                </div>
              </div>
              <div className="ti g-cs" />
            </div>
          </div>
        </div>

        {/* ── University logos ── */}
        <div className="uni-strip rise">
          <div className="uni-strip-lbl en">University Teaching Experience</div>
          <div className="uni-strip-lbl ko">강의 경험</div>
          {UNIVERSITIES.map((u) => (
            <a key={u.alt} className="uni-logo-wrap" data-tip={u.tip}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={u.src} alt={u.alt} className="uni-logo" />
            </a>
          ))}
        </div>

        <div style={{ marginTop: '1.75rem' }} className="rise">
          <a
            href="https://courses.aaron.kr/"
            className="slink sl-b fs"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex' }}
          >
            <span className="en">View all courses →</span>
            <span className="ko">모든 강의 보기 →</span>
          </a>
        </div>
      </div>
    </section>
  )
}
