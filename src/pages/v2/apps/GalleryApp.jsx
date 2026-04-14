import { useState } from 'react'
import './GalleryApp.css'

const CDN = import.meta.env.VITE_CDN_URL
const PHOTOS = Array.from({ length: 10 }, (_, i) => `${CDN}/photo${i + 1}.jpg`)

export default function GalleryApp() {
  const [selected, setSelected] = useState(null)

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
        <div className="ios-gallery-viewer" onClick={() => setSelected(null)}>
          <div className="ios-viewer-header">
            <button onClick={() => setSelected(null)}>닫기</button>
            <span>{selected + 1} / {PHOTOS.length}</span>
            <span />
          </div>
          <div className="ios-viewer-body">
            <img src={PHOTOS[selected]} alt={`photo ${selected + 1}`} />
          </div>
          <div className="ios-viewer-nav" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelected(selected > 0 ? selected - 1 : PHOTOS.length - 1)}>
              이전
            </button>
            <button onClick={() => setSelected(selected < PHOTOS.length - 1 ? selected + 1 : 0)}>
              다음
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
