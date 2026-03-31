import { useState } from 'react'
import './FortuneApp.css'

const FORTUNES = [
  { tag: 'MBTI', text: 'ENTP 창민 × INTP 수진: 둘 다 NT라서 대화의 90%가 토론입니다. 근데 본인들은 이게 "대화"래요.' },
  { tag: 'MBTI', text: 'P+P 커플의 여행: 공항 도착 후 "어디 갈까?" 시작. 계획은 없지만 추억은 항상 있는 타입.' },
  { tag: 'MBTI', text: 'E(창민)는 밖에서 에너지 충전, I(수진)는 집에서 충전. 결론: 창민이 혼자 나갔다가 영상통화 거는 구조.' },
  { tag: '혈액형', text: 'O형 창민이의 카톡: "어디야? 뭐해? 밥 먹었어?" B형 수진이의 답장: "ㅇㅇ" (3시간 뒤)' },
  { tag: '혈액형', text: 'O형은 서프라이즈 준비하고 B형은 리액션이 쿨함. "깜짝!" "오 ㅋㅋ 고마워~" "...끝?"' },
  { tag: '띠', text: '원숭이띠(창민) + 돼지띠(수진) = 맛집 탐방 궁합 만점. 만나면 인사가 "뭐 먹지?"' },
  { tag: '띠', text: '원숭이가 장난치면 돼지가 진심으로 빵 터짐. 원숭이 자존감 급상승. 무한 반복 시스템.' },
  { tag: '별자리', text: '게자리 창민이가 삐졌을 때: (아무 말 안 함). 황소자리 수진이: (3일 뒤) "왜 그래?" 타이밍의 예술.' },
  { tag: '별자리', text: '게자리 × 황소자리: 둘 다 집이 최고. 주말 계획 = 소파 + 넷플릭스 + 배달. 완벽한 합의.' },
  { tag: '사주', text: '이 커플의 사주를 보니... 금슬이 좋습니다. 특히 같이 밥 먹을 때 시너지가 폭발합니다.' },
  { tag: '사주', text: '신랑의 사주에 "처복"이 가득합니다. 신부의 사주에는 "내가 복"이라고 적혀있습니다.' },
  { tag: '사주', text: '2026년 5월 25일 대체공휴일. 하객도 쉬고 신랑신부도 행복한 천생연분의 날입니다.' },
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

  const tagColors = { 'MBTI': '#af52de', '혈액형': '#ff9500', '띠': '#34c759', '별자리': '#007aff', '사주': '#ff2d55' }
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
          쿠키를 깨면 커플 사주 정보가 나옵니다
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
