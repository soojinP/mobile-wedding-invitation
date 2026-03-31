import { useState } from 'react'
import './FortuneApp.css'

const FORTUNES = [
  { tag: '신랑', text: '창민이는 라면 끓일 때 물 양 조절을 못 합니다. 매번 냄비가 넘칩니다.' },
  { tag: '신부', text: '수진이는 화나면 3일간 말을 안 합니다. 그리고 4일째 아무 일 없었다는 듯 말합니다.' },
  { tag: '신랑', text: '창민이는 길치입니다. 네비 켜놓고도 반대로 갑니다.' },
  { tag: '신부', text: '수진이는 잠버릇이 나쁩니다. 이불을 100% 독점합니다.' },
  { tag: '커플', text: '이 커플의 첫 만남: 소개팅이었는데 창민이가 30분 늦었습니다.' },
  { tag: '신랑', text: '창민이의 특기: 아무 노래나 불러달라고 하면 항상 같은 노래를 부릅니다.' },
  { tag: '신부', text: '수진이는 계획형 인간입니다. 여행 계획표가 분 단위입니다.' },
  { tag: '커플', text: '이 커플의 싸움 패턴: 싸우다 배고파지면 자동 화해됩니다.' },
  { tag: '신랑', text: '창민이는 본인이 ENTP인 걸 매우 자랑스러워합니다.' },
  { tag: '신부', text: '수진이가 가장 좋아하는 말: "그건 논리적으로 맞지 않아"' },
  { tag: '커플', text: '이 커플이 제일 많이 하는 말: "뭐 먹지?"' },
  { tag: '신랑', text: '창민이는 사진 찍을 때 표정이 3개뿐입니다.' },
]

function Cookie({ fortune, index, onCrack, cracked }) {
  const [cracking, setCracking] = useState(false)

  const handleClick = () => {
    if (cracked || cracking) return
    setCracking(true)
    setTimeout(() => {
      onCrack(index)
      setCracking(false)
    }, 600)
  }

  const tagColor = fortune.tag === '신랑' ? '#007aff' : fortune.tag === '신부' ? '#ff2d55' : '#ff9500'

  return (
    <div className={`fortune-cookie-wrap ${cracked ? 'opened' : ''}`}>
      {!cracked ? (
        <button
          className={`fortune-cookie ${cracking ? 'cracking' : ''}`}
          onClick={handleClick}
        >
          <div className="cookie-body">
            <div className="cookie-left">🥠</div>
          </div>
          <span className="cookie-label">탭하여 열기</span>
        </button>
      ) : (
        <div className="fortune-paper">
          <div className="paper-inner">
            <span className="fortune-tag" style={{ background: tagColor }}>
              {fortune.tag}
            </span>
            <p className="fortune-text">{fortune.text}</p>
          </div>
          <div className="cookie-crumbs">🥠</div>
        </div>
      )}
    </div>
  )
}

export default function FortuneApp() {
  const [crackedSet, setCrackedSet] = useState(new Set())
  const [shuffled] = useState(() =>
    [...FORTUNES].sort(() => Math.random() - 0.5).slice(0, 6)
  )

  const handleCrack = (idx) => {
    setCrackedSet((prev) => new Set([...prev, idx]))
  }

  return (
    <div>
      <div className="ios-card" style={{ textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.2rem' }}>포춘 쿠키</h3>
        <p style={{ fontSize: '0.8rem', color: '#8e8e93', marginTop: 4 }}>
          쿠키를 깨면 신랑 신부의 비밀이 나옵니다
        </p>
        <p style={{ fontSize: '0.7rem', color: '#c7c7cc', marginTop: 8 }}>
          {crackedSet.size} / {shuffled.length} 개 열림
        </p>
      </div>

      <div className="fortune-grid">
        {shuffled.map((fortune, i) => (
          <Cookie
            key={i}
            fortune={fortune}
            index={i}
            cracked={crackedSet.has(i)}
            onCrack={handleCrack}
          />
        ))}
      </div>

      {crackedSet.size === shuffled.length && (
        <div className="fortune-complete">
          <p>모든 쿠키를 열었습니다!</p>
          <p className="fortune-complete-sub">
            이 정도면 신랑 신부를 꽤 잘 아시는 겁니다
          </p>
        </div>
      )}
    </div>
  )
}
