import { useState, useEffect } from 'react'
import './Compatibility.css'

const CATEGORIES = [
  {
    id: 'mbti',
    label: 'MBTI',
    groom: 'ENTP',
    bride: 'INTP',
    score: 95,
    grade: 'S',
    color: '#6c5ce7',
    description: '논쟁을 사랑하는 남자 x 논리로 끝장보는 여자',
    details: [
      'NT 유형끼리 만나면 대화가 끊이질 않음',
      'E와 I의 조합 → 밖에서 에너지 충전 vs 집에서 충전, 서로 존중만 하면 완벽',
      'P끼리 만나면 여행 계획은 영원히 미정',
      '결론: 말싸움은 많지만 이혼 사유는 아님',
    ],
  },
  {
    id: 'blood',
    label: '혈액형',
    groom: 'O형',
    bride: 'B형',
    score: 88,
    grade: 'A',
    color: '#e17055',
    description: '포용력 甲 남자 x 자유로운 영혼의 여자',
    details: [
      'O형 남자의 넓은 품이 B형 여자의 자유를 감싸줌',
      'O형은 리드하고 싶고, B형은 알아서 하고 싶고 → 적절한 긴장감',
      'O형의 질투 + B형의 마이웨이 = 가끔 불꽃 튀지만 그게 재미',
      '결론: 의외로 찰떡궁합, 서로 질리지 않는 조합',
    ],
  },
  {
    id: 'zodiac',
    label: '띠',
    groom: '원숭이띠 (92)',
    bride: '돼지띠 (95)',
    score: 82,
    grade: 'A',
    color: '#00b894',
    description: '영리한 원숭이 x 복덩이 돼지',
    details: [
      '원숭이의 재치와 돼지의 순수함이 만나면 웃음이 끊이지 않음',
      '원숭이가 장난치면 돼지가 진심으로 웃어줌 → 원숭이 신남',
      '둘 다 먹는 거 좋아함 → 맛집 탐방 궁합 만점',
      '결론: 함께 있으면 행복지수가 올라가는 조합',
    ],
  },
  {
    id: 'star',
    label: '별자리',
    groom: '게자리 (7/14)',
    bride: '황소자리 (4/25)',
    score: 85,
    grade: 'A',
    color: '#0984e3',
    description: '집순이 게 x 고집쟁이 소',
    details: [
      '둘 다 안정적인 관계를 추구 → 바람 걱정 제로',
      '게자리의 섬세한 감정 + 황소자리의 든든함 = 최고의 조합',
      '단, 게자리가 삐지면 황소자리가 눈치채기까지 3일 소요',
      '결론: 느리지만 확실한 사랑, 한번 잡으면 안 놓는 커플',
    ],
  },
  {
    id: 'birth',
    label: '출생순서',
    groom: '첫째',
    bride: '둘째',
    score: 90,
    grade: 'S',
    color: '#fdcb6e',
    description: '책임감 만렙 장남 x 눈치 만렙 둘째',
    details: [
      '첫째의 리더십 + 둘째의 유연함 = 역할 분담 완벽',
      '첫째는 결정하고 둘째는 적당히 맞춰주다가 중요한 건 본인이 결정',
      '첫째의 고집 vs 둘째의 처세술 → 둘째가 이기는 구조',
      '결론: 겉으로는 창민이가 가장, 실제로는 수진이가 운영',
    ],
  },
]

const LOADING_STEPS = [
  '커플 데이터 수집 중...',
  'MBTI 유형 분석 중...',
  '혈액형 상성 계산 중...',
  '띠 궁합 조회 중...',
  '별자리 차트 정렬 중...',
  '종합 점수 산출 중...',
]

export default function Compatibility({ onNext }) {
  const [phase, setPhase] = useState('idle')
  const [loadingIdx, setLoadingIdx] = useState(0)
  const [progress, setProgress] = useState(0)
  const [revealedCount, setRevealedCount] = useState(0)

  const startAnalysis = () => {
    setPhase('loading')
    setLoadingIdx(0)
    setProgress(0)
  }

  useEffect(() => {
    if (phase !== 'loading') return

    const msgInterval = setInterval(() => {
      setLoadingIdx((prev) => Math.min(prev + 1, LOADING_STEPS.length - 1))
    }, 600)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2.5
      })
    }, 80)

    const doneTimer = setTimeout(() => {
      setPhase('result')
      setRevealedCount(1)
    }, 4000)

    return () => {
      clearInterval(msgInterval)
      clearInterval(progressInterval)
      clearTimeout(doneTimer)
    }
  }, [phase])

  useEffect(() => {
    if (phase !== 'result' || revealedCount >= CATEGORIES.length) return
    const timer = setTimeout(() => setRevealedCount((c) => c + 1), 400)
    return () => clearTimeout(timer)
  }, [phase, revealedCount])

  const totalScore = Math.round(
    CATEGORIES.reduce((sum, c) => sum + c.score, 0) / CATEGORIES.length
  )

  return (
    <div className="page compat-page">
      <h2>커플 궁합 분석</h2>
      <p className="compat-sub">이창민 x 박수진, 과연 얼마나 맞을까?</p>

      {phase === 'idle' && (
        <div className="compat-profiles fade-in">
          <div className="profile">
            <div className="profile-name">이창민</div>
            <div className="profile-tags">
              <span>ENTP</span>
              <span>O형</span>
              <span>92년생</span>
              <span>첫째</span>
            </div>
          </div>
          <div className="profile-vs">VS</div>
          <div className="profile">
            <div className="profile-name">박수진</div>
            <div className="profile-tags">
              <span>INTP</span>
              <span>B형</span>
              <span>95년생</span>
              <span>둘째</span>
            </div>
          </div>
          <button className="btn btn-solid" onClick={startAnalysis} style={{ marginTop: 40 }}>
            궁합 분석 시작
          </button>
        </div>
      )}

      {phase === 'loading' && (
        <div className="loading-section fade-in">
          <div className="spinner" />
          <p className="loading-msg">{LOADING_STEPS[loadingIdx]}</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
          </div>
          <p className="progress-text">{Math.min(Math.round(progress), 100)}%</p>
        </div>
      )}

      {phase === 'result' && (
        <div className="result-section">
          <div className="total-score fade-in">
            <div className="total-number">{totalScore}<span>점</span></div>
            <div className="total-label">종합 궁합</div>
            <div className="total-comment">
              {totalScore >= 85 ? '이 정도면 그냥 결혼하셔야죠' : '나쁘지 않은데요?'}
            </div>
          </div>

          {CATEGORIES.map((cat, i) => (
            i < revealedCount && (
              <div key={cat.id} className="cat-card fade-in" style={{ '--accent-color': cat.color }}>
                <div className="cat-header">
                  <span className="cat-label" style={{ background: cat.color }}>{cat.label}</span>
                  <div className="cat-matchup">
                    <span>{cat.groom}</span>
                    <span className="cat-x">x</span>
                    <span>{cat.bride}</span>
                  </div>
                </div>
                <div className="cat-score-row">
                  <div className="cat-bar-bg">
                    <div className="cat-bar-fill" style={{ width: `${cat.score}%`, background: cat.color }} />
                  </div>
                  <span className="cat-score">{cat.score}점</span>
                  <span className="cat-grade" style={{ color: cat.color }}>{cat.grade}</span>
                </div>
                <p className="cat-desc">{cat.description}</p>
                <ul className="cat-details">
                  {cat.details.map((d, j) => (
                    <li key={j}>{d}</li>
                  ))}
                </ul>
              </div>
            )
          ))}

          {revealedCount >= CATEGORIES.length && (
            <button className="btn fade-in-delay" onClick={onNext} style={{ marginTop: 32 }}>
              이름 궁합도 볼래?
            </button>
          )}
        </div>
      )}
    </div>
  )
}
