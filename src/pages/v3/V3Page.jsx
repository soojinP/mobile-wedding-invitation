import { useState, useEffect, useRef } from 'react'
import './V3Page.css'

const PHOTOS = [
  '/photos/photo1.jpg',
  '/photos/photo2.jpg',
  '/photos/photo3.jpg',
  '/photos/photo4.jpg',
  '/photos/photo5.jpg',
  '/photos/photo6.jpg',
]

const GROOM_ACCOUNTS = [
  { name: '신랑 이창민', bank: 'OO은행', account: '000-0000-0000-00' },
  { name: '신랑 아버지 이OO', bank: 'OO은행', account: '000-0000-0000-00' },
  { name: '신랑 어머니 OOO', bank: 'OO은행', account: '000-0000-0000-00' },
]

const BRIDE_ACCOUNTS = [
  { name: '신부 박수진', bank: 'OO은행', account: '000-0000-0000-00' },
  { name: '신부 아버지 박OO', bank: 'OO은행', account: '000-0000-0000-00' },
  { name: '신부 어머니 OOO', bank: 'OO은행', account: '000-0000-0000-00' },
]

function DdayCounter() {
  const wedding = new Date(2026, 4, 25)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.ceil((wedding - today) / (1000 * 60 * 60 * 24))
  if (diff === 0) return <span className="v3-dday">D-Day</span>
  if (diff > 0) return <span className="v3-dday">D-{diff}</span>
  return <span className="v3-dday">D+{Math.abs(diff)}</span>
}

function FadeSection({ children, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`v3-fade ${visible ? 'v3-visible' : ''} ${className}`}>
      {children}
    </div>
  )
}

function Gallery() {
  const [selected, setSelected] = useState(null)

  return (
    <>
      <div className="v3-gallery-grid">
        {PHOTOS.map((src, i) => (
          <div key={i} className="v3-gallery-item" onClick={() => setSelected(i)}>
            <img src={src} alt={`photo ${i + 1}`} loading="lazy" />
          </div>
        ))}
      </div>
      {selected !== null && (
        <div className="v3-lightbox" onClick={() => setSelected(null)}>
          <img src={PHOTOS[selected]} alt="enlarged" />
          <button className="v3-lightbox-close" onClick={() => setSelected(null)}>x</button>
        </div>
      )}
    </>
  )
}

function AccountSection({ title, accounts }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(null)

  const copy = async (account, idx) => {
    try {
      await navigator.clipboard.writeText(account)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = account
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(idx)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="v3-account-group">
      <button className="v3-account-toggle" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span className={`v3-chevron ${open ? 'open' : ''}`}>&#8250;</span>
      </button>
      {open && (
        <div className="v3-account-list">
          {accounts.map((a, i) => (
            <div key={i} className="v3-account-row">
              <div className="v3-account-info">
                <span className="v3-account-name">{a.name}</span>
                <span className="v3-account-num">{a.bank} {a.account}</span>
              </div>
              <button
                className="v3-copy-btn"
                onClick={() => copy(a.account, i)}
              >
                {copied === i ? '복사됨' : '복사'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Calendar() {
  const DAYS = ['일', '월', '화', '수', '목', '금', '토']
  const MAY_START = 5
  const blanks = Array(MAY_START).fill(null)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const cells = [...blanks, ...days]

  return (
    <div className="v3-calendar">
      <div className="v3-cal-title">2026. 05</div>
      <div className="v3-cal-grid">
        {DAYS.map((d, i) => (
          <div key={d} className={`v3-cal-weekday ${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}`}>{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`b${i}`} className="v3-cal-cell" />
          const isWedding = day === 25
          const isSun = (MAY_START + day - 1) % 7 === 0
          const isSat = (MAY_START + day - 1) % 7 === 6
          return (
            <div key={day} className={`v3-cal-cell ${isWedding ? 'wedding' : ''} ${isSun ? 'sun' : ''} ${isSat ? 'sat' : ''}`}>
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function V3Page({ onSwitchV2 }) {
  return (
    <div className="v3-page">
      {/* Hero */}
      <section className="v3-hero">
        <div className="v3-hero-overlay" />
        <div className="v3-hero-content">
          <p className="v3-hero-label">WEDDING INVITATION</p>
          <h1 className="v3-hero-names">
            <span>이창민</span>
            <span className="v3-amp">&amp;</span>
            <span>박수진</span>
          </h1>
          <p className="v3-hero-date">2026. 05. 25 MON PM 1:00</p>
          <p className="v3-hero-venue">연세대학교 동문회관</p>
          <DdayCounter />
        </div>
        <div className="v3-scroll-hint">
          <span />
        </div>
      </section>

      {/* Greeting */}
      <FadeSection>
        <section className="v3-section">
          <h2 className="v3-section-title">초대합니다</h2>
          <p className="v3-greeting">
            서로 다른 길을 걸어온 두 사람이<br />
            같은 곳을 바라보며 함께 걸어가려 합니다.<br /><br />
            바쁘시더라도 귀한 걸음 하시어<br />
            따뜻한 축복으로 자리를 빛내주시면<br />
            더없는 기쁨이겠습니다.
          </p>
          <div className="v3-parents">
            <div className="v3-parent-row">
              <span className="v3-parent-names">이OO · OOO</span>
              <span className="v3-parent-relation">의 장남 <strong>창민</strong></span>
            </div>
            <div className="v3-parent-row">
              <span className="v3-parent-names">박OO · OOO</span>
              <span className="v3-parent-relation">의 차녀 <strong>수진</strong></span>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* Calendar */}
      <FadeSection>
        <section className="v3-section">
          <Calendar />
          <div className="v3-info-box">
            <div className="v3-info-row">
              <span className="v3-info-icon">&#128197;</span>
              <span>2026년 5월 25일 월요일, 오후 1시</span>
            </div>
            <div className="v3-info-row">
              <span className="v3-info-icon">&#127970;</span>
              <span>연세대학교 동문회관</span>
            </div>
            <div className="v3-info-badge">대체공휴일이라 쉬는 날이에요!</div>
          </div>
        </section>
      </FadeSection>

      {/* Gallery */}
      <FadeSection>
        <section className="v3-section">
          <h2 className="v3-section-title">갤러리</h2>
          <Gallery />
        </section>
      </FadeSection>

      {/* Location */}
      <FadeSection>
        <section className="v3-section">
          <h2 className="v3-section-title">오시는 길</h2>
          <div className="v3-venue-card">
            <p className="v3-venue-name">연세대학교 동문회관</p>
            <p className="v3-venue-addr">서울특별시 서대문구 연세로 50</p>
            <div className="v3-venue-links">
              <a href="https://map.naver.com/v5/search/연세대학교%20동문회관" target="_blank" rel="noreferrer" className="v3-map-btn naver">네이버 지도</a>
              <a href="https://map.kakao.com/link/search/연세대학교%20동문회관" target="_blank" rel="noreferrer" className="v3-map-btn kakao">카카오맵</a>
            </div>
          </div>
          <div className="v3-transport">
            <div className="v3-transport-item">
              <span className="v3-transport-label">지하철</span>
              <p>2호선 신촌역 3번 출구 도보 15분</p>
              <p>경의중앙선 신촌역 1번 출구 도보 10분</p>
            </div>
            <div className="v3-transport-item">
              <span className="v3-transport-label">버스</span>
              <p>연세대학교 정문 하차 / 153, 173, 272, 470, 710</p>
            </div>
            <div className="v3-transport-item">
              <span className="v3-transport-label">주차</span>
              <p>동문회관 주차장 2시간 무료 (동문회관 경유 출차 시)</p>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* Shuttle */}
      <FadeSection>
        <section className="v3-section">
          <h2 className="v3-section-title">셔틀버스</h2>
          <p className="v3-shuttle-route">이대역 3번 출구 앞 &#8596; 동문회관</p>
          <div className="v3-shuttle-table">
            <div className="v3-shuttle-col">
              <span className="v3-shuttle-label">이대역 &#8594; 동문회관</span>
              <span className="v3-shuttle-time">12:20</span>
              <span className="v3-shuttle-time">12:40</span>
            </div>
            <div className="v3-shuttle-divider" />
            <div className="v3-shuttle-col">
              <span className="v3-shuttle-label">동문회관 &#8594; 이대역</span>
              <span className="v3-shuttle-time">14:10</span>
              <span className="v3-shuttle-time">14:30</span>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* Gift */}
      <FadeSection>
        <section className="v3-section">
          <h2 className="v3-section-title">마음 전하실 곳</h2>
          <p className="v3-gift-desc">축하의 마음을 전해주세요</p>
          <AccountSection title="신랑측 계좌번호" accounts={GROOM_ACCOUNTS} />
          <AccountSection title="신부측 계좌번호" accounts={BRIDE_ACCOUNTS} />
        </section>
      </FadeSection>

      {/* Footer */}
      <footer className="v3-footer">
        <p className="v3-footer-names">창민 & 수진</p>
        <p className="v3-footer-date">2026. 05. 25</p>
        <button className="v3-switch-btn" onClick={onSwitchV2}>
          다른 버전으로 보기
        </button>
        <p className="v3-watermark">@podonuna</p>
      </footer>
    </div>
  )
}
