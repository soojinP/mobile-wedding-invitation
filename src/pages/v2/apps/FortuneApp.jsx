import { useState } from 'react'
import './FortuneApp.css'

const FORTUNES = [
  { tag: 'MBTI', text: 'ENTP x INTP: NT 유형끼리 만나면 대화가 끊이질 않음. 말싸움은 많지만 이혼 사유는 아님!' },
  { tag: 'MBTI', text: 'E와 I의 조합 — 밖에서 에너지 충전 vs 집에서 충전. 서로 존중만 하면 완벽한 궁합.' },
  { tag: 'MBTI', text: 'P끼리 만나면 여행 계획은 영원히 미정. 그래도 즉흥이 더 재미있는 커플.' },
  { tag: '혈액형', text: 'O형 남자의 넓은 품이 B형 여자의 자유를 감싸줌. 의외로 찰떡궁합!' },
  { tag: '혈액형', text: 'O형의 질투 + B형의 마이웨이 = 가끔 불꽃 튀지만 그게 재미.' },
  { tag: '혈액형', text: 'O형은 리드하고 싶고, B형은 알아서 하고 싶고. 적절한 긴장감이 관계의 비결.' },
  { tag: '띠', text: '원숭이띠 x 돼지띠: 원숭이가 장난치면 돼지가 진심으로 웃어줌. 원숭이 신남!' },
  { tag: '띠', text: '원숭이의 재치와 돼지의 순수함이 만나면 웃음이 끊이지 않는 조합.' },
  { tag: '별자리', text: '게자리 x 황소자리: 둘 다 안정적인 관계 추구. 바람 걱정 제로!' },
  { tag: '별자리', text: '게자리가 삐지면 황소자리가 눈치채기까지 3일 소요. 느리지만 확실한 사랑.' },
  { tag: '출생순서', text: '첫째 x 둘째: 겉으로는 창민이가 가장, 실제로는 수진이가 운영하는 구조.' },
  { tag: '출생순서', text: '첫째의 고집 vs 둘째의 처세술 — 결국 둘째가 이기는 구조입니다.' },
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

  const tagColors = { 'MBTI': '#af52de', '혈액형': '#ff9500', '띠': '#34c759', '별자리': '#007aff', '출생순서': '#ff3b30' }
  const tagColor = tagColors[fortune.tag] || '#8e8e93'

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
          쿠키를 깨면 사주궁합 정보가 나옵니다
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
            종합 궁합 100점, 이 커플 결혼 안 하면 누가 합니까!
          </p>
        </div>
      )}
    </div>
  )
}
