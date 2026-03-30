import { useState } from 'react'
import './Gallery.css'

// 사진 파일들을 public/photos/ 에 넣으세요
// 예: photo1.jpg, photo2.jpg, ...
const PHOTOS = [
  { src: '/photos/photo1.jpg', caption: '' },
  { src: '/photos/photo2.jpg', caption: '' },
  { src: '/photos/photo3.jpg', caption: '' },
  { src: '/photos/photo4.jpg', caption: '' },
  { src: '/photos/photo5.jpg', caption: '' },
  { src: '/photos/photo6.jpg', caption: '' },
]

export default function Gallery({ onNext }) {
  const [selected, setSelected] = useState(null)

  return (
    <div className="page gallery-page">
      <h2>우리의 이야기</h2>
      <p className="gallery-sub">웨딩 사진</p>

      <div className="gallery-grid fade-in-delay">
        {PHOTOS.map((photo, i) => (
          <div
            key={i}
            className="gallery-item"
            onClick={() => setSelected(i)}
          >
            <div className="gallery-placeholder">
              <span>{i + 1}</span>
              <p>사진을 넣어주세요</p>
            </div>
          </div>
        ))}
      </div>

      {selected !== null && (
        <div className="lightbox" onClick={() => setSelected(null)}>
          <div className="lightbox-inner" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-placeholder">
              <span>Photo {selected + 1}</span>
            </div>
            {PHOTOS[selected].caption && (
              <p className="lightbox-caption">{PHOTOS[selected].caption}</p>
            )}
            <div className="lightbox-nav">
              <button
                onClick={() => setSelected(selected > 0 ? selected - 1 : PHOTOS.length - 1)}
              >
                이전
              </button>
              <button onClick={() => setSelected(null)}>닫기</button>
              <button
                onClick={() => setSelected(selected < PHOTOS.length - 1 ? selected + 1 : 0)}
              >
                다음
              </button>
            </div>
          </div>
        </div>
      )}

      <button className="btn fade-in-delay-2" onClick={onNext} style={{ marginTop: 40 }}>
        결혼식 정보 보기
      </button>
    </div>
  )
}
