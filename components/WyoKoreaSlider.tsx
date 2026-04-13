'use client'
// components/WyoKoreaSlider.tsx

import { useCallback } from 'react'

export default function WyoKoreaSlider() {
  const handleSlider = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    const right = document.getElementById('cmpRight')
    const hdl   = document.getElementById('cmpHdl')
    if (right) right.style.clipPath = `inset(0 0 0 ${v}%)`
    if (hdl)   hdl.style.left = `${v}%`
  }, [])

  return (
    <div id="wyo-korea">
      <div className="cmp-wrap">
        <div className="cmp-l" />
        <div className="cmp-r" id="cmpRight" />
        <div className="cmp-lbl cmp-lbl-l">
          <span className="en">Wyoming</span>
          <span className="ko">와이오밍</span>
        </div>
        <div className="cmp-lbl cmp-lbl-r">
          <span className="en">Korea</span>
          <span className="ko">대한민국</span>
        </div>
        <div className="cmp-hdl" id="cmpHdl" />
        <input
          type="range"
          className="cmp-range"
          id="cmpRange"
          min="0"
          max="100"
          defaultValue="50"
          onChange={handleSlider}
        />
      </div>
      <div className="cmp-sub">
        <p className="cmp-cap en">
          <strong>From Big Sky Country to Land of the Morning Calm</strong> — drag to compare
        </p>
        <p className="cmp-cap ko">
          <strong>빅 스카이 컨트리에서 조용한 아침의 나라로</strong> — 드래그하여 비교
        </p>
      </div>
    </div>
  )
}
