import { useState, useEffect } from 'react'
import './Cover.css'

export default function Cover({ onNext }) {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="page cover-page">
      <div className="breaking-news fade-in">
        <span className="breaking-badge blink">[긴급속보]</span>
      </div>

      {showContent && (
        <>
          <h1 className="cover-headline fade-in-delay">
            이창민 (34), 박수진 (31)<br />
            드디어 결혼한다고 함
          </h1>

          <div className="divider fade-in-delay-2" />

          <p className="cover-sub fade-in-delay-2">
            주변인들 &ldquo;축하는 하는데 진짜임?&rdquo; 반응
          </p>

          <p className="cover-notice fade-in-delay-2">
            &ldquo;월요일이라고 놀라지 마세요.&rdquo;<br />
            대체공휴일입니다. 쉬는 날이에요. 오실 수 있습니다.
          </p>

          <p className="cover-date fade-in-delay-3">
            2026. 05. 25 (월) 오후 1시<br />
            <span className="cover-venue">연세대학교 동문회관</span>
          </p>

          <button className="btn fade-in-delay-3" onClick={onNext} style={{ marginTop: 40 }}>
            청첩장 보기
          </button>
        </>
      )}
    </div>
  )
}
