import { useState } from 'react'
import './GalleryApp.css'

const PHOTOS = [
  '/photos/photo1.jpg',
  '/photos/photo2.jpg',
  '/photos/photo3.jpg',
  '/photos/photo4.jpg',
  '/photos/photo5.jpg',
  '/photos/photo6.jpg',
]

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
            <div className="ios-gallery-placeholder">
              <span>{i + 1}</span>
            </div>
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
            <div className="ios-viewer-placeholder">
              Photo {selected + 1}
            </div>
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
