import { useState, useRef } from 'react'
import './GalleryApp.css'

const CDN = import.meta.env.VITE_CDN_URL
const PHOTOS = Array.from({ length: 10 }, (_, i) => `${CDN}/photo${i + 1}.jpg`)

export default function GalleryApp() {
  const [selected, setSelected] = useState(null)
  const touchStart = useRef(null)

  const prev = () => setSelected((s) => (s - 1 + PHOTOS.length) % PHOTOS.length)
  const next = () => setSelected((s) => (s + 1) % PHOTOS.length)

  const onTouchStart = (e) => { touchStart.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (touchStart.current === null) return
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) next()
      else prev()
    }
    touchStart.current = null
  }

  return (
    <div>
      <p className="ios-card-title" style={{ padding: '0 4px', marginBottom: 12 }}>
        웨딩 사진
      </p>
      <div className="ios-gallery-grid">
        {PHOTOS.map((src, i) => (
          <div key={i} className="ios-gallery-item" onClick={() => setSelected(i)}>
            <img src={src} alt={`photo ${i + 1}`} />
          </div>
        ))}
      </div>

      {selected !== null && (
        <div
          className="ios-gallery-viewer"
          onClick={() => setSelected(null)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="ios-viewer-header">
            <button onClick={(e) => { e.stopPropagation(); setSelected(null) }}>닫기</button>
            <span>{selected + 1} / {PHOTOS.length}</span>
            <span />
          </div>
          <div className="ios-viewer-body" onClick={(e) => e.stopPropagation()}>
            <img src={PHOTOS[selected]} alt={`photo ${selected + 1}`} key={selected} />
          </div>
          <div className="ios-viewer-hint">좌우로 스와이프</div>
        </div>
      )}
    </div>
  )
}
