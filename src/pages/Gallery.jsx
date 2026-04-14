import { useState, useEffect } from 'react'
import './Gallery.css'

const PHOTOS = Array.from({ length: 10 }, (_, i) => ({
  src: `/photos/photo${i + 1}.jpg`,
  caption: '',
}))

const TITLE_CARDS = [
  '제1막',
  '두 사람의 이야기가\n시작되었으니...',
  '제2막',
  '사랑이 무르익고...',
  '제3막',
  '함께한 날들...',
  '제4막',
  '설레는 약속...',
  '제5막',
  '드디어, 해피엔딩.',
]

export default function Gallery({ onNext }) {
  const [playing, setPlaying] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showTitleCard, setShowTitleCard] = useState(false)

  // 슬라이드쇼: 타이틀카드 → 사진 → 타이틀카드 → 사진 ...
  const totalSlides = PHOTOS.length + TITLE_CARDS.length
  const isTitle = currentSlide % 2 === 0
  const titleIdx = Math.floor(currentSlide / 2)
  const photoIdx = Math.floor(currentSlide / 2)

  useEffect(() => {
    if (!playing) return
    const duration = isTitle ? 2500 : 3500
    const timer = setTimeout(() => {
      if (currentSlide >= totalSlides - 1) {
        setPlaying(false)
        return
      }
      setCurrentSlide((s) => s + 1)
    }, duration)
    return () => clearTimeout(timer)
  }, [playing, currentSlide, isTitle, totalSlides])

  const startFilm = () => {
    setCurrentSlide(0)
    setPlaying(true)
  }

  return (
    <div className="page gallery-page">
      {!playing ? (
        currentSlide === 0 ? (
          // 시작 전
          <div className="film-intro fade-in">
            <div className="film-border-top" />
            <h2 className="film-main-title">Our Wedding Film</h2>
            <p className="film-subtitle">A Silent Picture in Moving Frames</p>
            <div className="film-reel">
              <span className="reel-icon">[ ◎ ]</span>
            </div>
            <button className="btn btn-solid film-play-btn" onClick={startFilm}>
              상영 시작
            </button>
            <p className="film-hint">* 사진을 무성영화처럼 감상하실 수 있습니다</p>
            <div className="film-border-bottom" />
          </div>
        ) : (
          // 끝난 후
          <div className="film-end fade-in">
            <div className="film-border-top" />
            <h2 className="film-end-title">- Fin -</h2>
            <p className="film-end-sub">...그리고 이야기는 계속됩니다.</p>
            <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>
              <button className="btn" onClick={startFilm}>
                다시 보기
              </button>
              <button className="btn btn-solid" onClick={onNext}>
                결혼식 정보
              </button>
            </div>
            <div className="film-border-bottom" />
          </div>
        )
      ) : (
        // 상영 중
        <div className="film-screen">
          <div className="film-grain" />
          <div className="film-vignette" />
          <div className="film-scratches" />
          <div className="film-strip-left" />
          <div className="film-strip-right" />

          {isTitle ? (
            <div key={`title-${titleIdx}`} className="title-card film-fade">
              <div className="title-card-inner">
                <p>{TITLE_CARDS[titleIdx]}</p>
              </div>
            </div>
          ) : (
            <div key={`photo-${photoIdx}`} className="film-photo film-fade">
              <img src={PHOTOS[photoIdx].src} alt={PHOTOS[photoIdx].caption || `photo ${photoIdx + 1}`} className="film-photo-img" />
            </div>
          )}

          <div className="film-counter">
            {photoIdx + (isTitle ? 0 : 1)} / {PHOTOS.length}
          </div>
        </div>
      )}
    </div>
  )
}
