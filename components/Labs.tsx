// components/Labs.tsx
// Static server component — links to pailab.io

export default function Labs() {
  return (
    <section className="pad" id="labs">
      <div className="wrap">
        <div className="sec-hdr rise">
          <div className="sec-hdr-txt">
            <div className="sec-lbl en">Online Lab &amp; Experiments</div>
            <div className="sec-lbl ko">온라인 연구실 &amp; 실험</div>
            <h2>
              <a href="https://pailab.io" className="sec-h2-link" target="_blank" rel="noopener noreferrer">
                <span className="en">Running <em>Experiments</em></span>
                <span className="ko"><em>실험</em> 진행 중</span>
              </a>
            </h2>
            <p className="sec-intro en">
              Code notebooks, benchmarks, and investigations — work-in-progress published openly.
            </p>
            <p className="sec-intro ko">
              코드 노트북, 벤치마크, 탐구 — 진행 중인 작업 공개.
            </p>
          </div>
        </div>

        <div className="glist rise">
          <div className="gli l-li">
            <div className="tli">
              <div className="tn"><div className="item-num">01</div></div>
              <div className="tc">
                <div className="l-status ls-on en">Active</div>
                <div className="l-status ls-on ko">진행 중</div>
                <div className="ri-title en">Hangul OCR Benchmark</div>
                <div className="ri-title ko">한글 OCR 벤치마크</div>
                <p className="ri-body en">Transformer vs. CNN on Korean handwriting recognition datasets.</p>
                <p className="ri-body ko">한국어 필기 인식 데이터셋에서 트랜스포머와 CNN 비교.</p>
                <div className="tags">
                  <span className="tag fss"><span>OCR</span></span>
                  <span className="tag fss"><span>Transformer</span></span>
                  <span className="tag b fss"><span>CNN</span></span>
                </div>
                <div className="ri-links">
                  <a href="https://pailab.io" className="ri-lnk" target="_blank" rel="noopener noreferrer">View on PAI Lab →</a>
                </div>
              </div>
              <div className="ti g-aurora" />
            </div>
          </div>

          <div className="gli l-li">
            <div className="tli">
              <div className="tn"><div className="item-num">02</div></div>
              <div className="tc">
                <div className="l-status ls-soon en">Coming Soon</div>
                <div className="l-status ls-soon ko">준비 중</div>
                <div className="ri-title en">Physical AI Interactive Demos</div>
                <div className="ri-title ko">피지컬 AI 인터랙티브 데모</div>
                <p className="ri-body en">Browser-based embodied AI visualizations for classroom use.</p>
                <p className="ri-body ko">교실용 브라우저 기반 체화된 AI 시각화.</p>
                <div className="tags">
                  <span className="tag p fss"><span>Physical AI</span></span>
                  <span className="tag p fss"><span>Interactive</span></span>
                </div>
              </div>
              <div className="ti g-research" />
            </div>
          </div>

          <div className="gli l-li">
            <div className="tli">
              <div className="tn"><div className="item-num">03</div></div>
              <div className="tc">
                <div className="l-status ls-soon en">Coming Soon</div>
                <div className="l-status ls-soon ko">준비 중</div>
                <div className="ri-title en">GitHub Classroom Analysis</div>
                <div className="ri-title ko">GitHub Classroom 분석</div>
                <p className="ri-body en">Assignment patterns and outcomes across five universities.</p>
                <p className="ri-body ko">다섯 개 대학 과제 패턴 및 성과 분석.</p>
                <div className="tags">
                  <span className="tag b fss"><span>GitHub</span></span>
                  <span className="tag p fss"><span>EdTech</span></span>
                  <span className="tag fss"><span>Data</span></span>
                </div>
              </div>
              <div className="ti g-cs" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
