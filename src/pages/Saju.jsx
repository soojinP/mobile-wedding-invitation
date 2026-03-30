import { useState, useEffect } from 'react'
import './Saju.css'

const LOADING_MESSAGES = [
  '만세력 데이터 로딩 중...',
  '이창민님 사주 분석 중...',
  '박수진님 사주 분석 중...',
  '천간 지지 매칭 중...',
  '오행 상생상극 계산 중...',
  '궁합 최종 계산 중...',
]

const GROOM_SAJU = {
  name: '이창민',
  birth: '1992년 7월 14일 辰時 (07:50)',
  pillars: [
    { label: '년주', hanja: '壬申', reading: '임신', element: '수/금' },
    { label: '월주', hanja: '丁未', reading: '정미', element: '화/토' },
    { label: '일주', hanja: '甲子', reading: '갑자', element: '목/수' },
    { label: '시주', hanja: '戊辰', reading: '무진', element: '토/토' },
  ],
  summary: '물처럼 유연하고 금처럼 단단한 남자. 겉으론 순해 보이지만 속은 불(丁)과 나무(甲)가 있어 은근 고집 있음. 본인은 부정할 것임.',
}

const BRIDE_SAJU = {
  name: '박수진',
  birth: '1995년 4월 25일 未時 (14:00)',
  birthNote: '* 제왕절개로 정시 출생, 오차 없는 프리미엄 사주',
  pillars: [
    { label: '년주', hanja: '乙亥', reading: '을해', element: '목/수' },
    { label: '월주', hanja: '庚辰', reading: '경진', element: '금/토' },
    { label: '일주', hanja: '丙寅', reading: '병인', element: '화/목' },
    { label: '시주', hanja: '乙未', reading: '을미', element: '목/토' },
  ],
  summary: '불(丙)의 여자. 밝고 따뜻하지만 한번 화나면 무서움. 나무(乙)가 많아 성장 욕구 강함. 수술실에서 칼(庚)과 함께 등장한 전설의 시작.',
}

const COMPAT_RESULT = {
  score: '92',
  title: '천생연분',
  details: [
    '신랑의 水(수)가 신부의 火(화)를 만나 → 서로 다른 매력에 끌림',
    '신랑의 木(목)이 신부의 火(화)를 살려줌 → 든든한 지원군',
    '신부의 金(금)이 신랑의 木(목)을 깎아줌 → 적절한 잔소리 가능',
    '종합: 안 싸울 수는 없지만 결국 잘 맞는 궁합',
  ],
}

export default function Saju({ onNext }) {
  const [phase, setPhase] = useState('idle') // idle, loading, groom, bride, result
  const [loadingIdx, setLoadingIdx] = useState(0)
  const [progress, setProgress] = useState(0)

  const startAnalysis = () => {
    setPhase('loading')
    setLoadingIdx(0)
    setProgress(0)
  }

  useEffect(() => {
    if (phase !== 'loading') return

    const msgInterval = setInterval(() => {
      setLoadingIdx((prev) => {
        if (prev >= LOADING_MESSAGES.length - 1) {
          clearInterval(msgInterval)
          return prev
        }
        return prev + 1
      })
    }, 700)

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          return 100
        }
        return prev + 2
      })
    }, 80)

    const doneTimer = setTimeout(() => {
      setPhase('groom')
    }, 4500)

    return () => {
      clearInterval(msgInterval)
      clearInterval(progressInterval)
      clearTimeout(doneTimer)
    }
  }, [phase])

  const renderPillars = (data) => (
    <div className="saju-card fade-in">
      <h3>{data.name}</h3>
      <p className="saju-birth">{data.birth}</p>
      {data.birthNote && <p className="saju-birth-note">{data.birthNote}</p>}
      <div className="pillars">
        {data.pillars.map((p) => (
          <div key={p.label} className="pillar">
            <span className="pillar-label">{p.label}</span>
            <span className="pillar-hanja">{p.hanja}</span>
            <span className="pillar-reading">{p.reading}</span>
            <span className="pillar-element">{p.element}</span>
          </div>
        ))}
      </div>
      <p className="saju-summary">{data.summary}</p>
    </div>
  )

  return (
    <div className="page saju-page">
      <h2>사주 궁합</h2>
      <p className="saju-disclaimer">* 본 사주 분석은 재미로만 봐주세요<br />(근데 은근 맞음)</p>

      {phase === 'idle' && (
        <button className="btn btn-solid fade-in" onClick={startAnalysis} style={{ marginTop: 40 }}>
          궁합 분석 시작
        </button>
      )}

      {phase === 'loading' && (
        <div className="loading-section fade-in">
          <div className="spinner" />
          <p className="loading-msg">{LOADING_MESSAGES[loadingIdx]}</p>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <p className="progress-text">{progress}%</p>
        </div>
      )}

      {phase === 'groom' && (
        <div className="fade-in">
          {renderPillars(GROOM_SAJU)}
          <button className="btn" onClick={() => setPhase('bride')} style={{ marginTop: 24 }}>
            신부 사주 보기
          </button>
        </div>
      )}

      {phase === 'bride' && (
        <div className="fade-in">
          {renderPillars(GROOM_SAJU)}
          {renderPillars(BRIDE_SAJU)}
          <button className="btn" onClick={() => setPhase('result')} style={{ marginTop: 24 }}>
            궁합 결과 보기
          </button>
        </div>
      )}

      {phase === 'result' && (
        <div className="fade-in">
          {renderPillars(GROOM_SAJU)}
          {renderPillars(BRIDE_SAJU)}
          <div className="compat-result fade-in-delay">
            <div className="compat-score">{COMPAT_RESULT.score}<span>점</span></div>
            <div className="compat-title">{COMPAT_RESULT.title}</div>
            <div className="divider" />
            <ul className="compat-details">
              {COMPAT_RESULT.details.map((d, i) => (
                <li key={i}>{d}</li>
              ))}
            </ul>
          </div>
          <button className="btn" onClick={onNext} style={{ marginTop: 32 }}>
            이름 궁합도 볼래?
          </button>
        </div>
      )}
    </div>
  )
}
