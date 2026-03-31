import { useState } from 'react'
import './FortuneApp.css'

const FORTUNES = [
  { tag: 'MBTI', text: 'ENTP 창민: "이거 어때?" INTP 수진: "근거는?" 매일 반복되는 토론회. 근데 본인들은 이게 대화래요.' },
  { tag: 'MBTI', text: 'P+P 커플의 여행: 공항에서 "어디 갈까?" 시작. 계획은 없지만 추억은 있는 타입.' },
  { tag: 'MBTI', text: 'E는 밖에서 충전, I는 집에서 충전. 결론: 창민이 혼자 나갔다가 수진이한테 영상통화 거는 구조.' },
  { tag: '혈액형', text: 'O형 창민이의 카톡: "어디야? 뭐해? 밥 먹었어?" B형 수진이의 답장: "ㅇㅇ" (3시간 뒤)' },
  { tag: '혈액형', text: 'O형은 서프라이즈를 준비하고 B형은 리액션이 쿨함. 창민: "깜짝!" 수진: "오 ㅋㅋ 고마워~" 창민: "...끝?"' },
  { tag: '혈액형', text: 'B형 여자의 마이웨이를 O형 남자가 뒤에서 묵묵히 서포트하는 구조. 의외로 이게 오래감.' },
  { tag: '띠', text: '원숭이띠 + 돼지띠 = 맛집 탐방 궁합 만점. 둘이 만나면 "뭐 먹지?"가 인사말.' },
  { tag: '띠', text: '원숭이가 장난치면 돼지가 진심으로 빵 터짐. 원숭이 자존감 급상승. 무한 반복.' },
  { tag: '별자리', text: '게자리 창민이가 삐졌을 때: (아무 말 안 함) 황소자리 수진이: (3일 뒤) "왜 그래?" 타이밍의 예술.' },
  { tag: '별자리', text: '게자리 x 황소자리: 둘 다 집이 최고. 주말 계획 = 소파 + 넷플릭스 + 배달. 완벽한 합의.' },
  { tag: '출생순서', text: '장남 창민: "내가 결정할게" 둘째 수진: "그래~ (이미 다 정해놓음)" 실권은 둘째에게.' },
  { tag: '출생순서', text: '첫째의 책임감 + 둘째의 눈치력. 집안일 분담 협상에서 둘째가 항상 이기는 이유가 있음.' },
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
