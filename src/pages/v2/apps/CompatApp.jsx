import { useState, useEffect } from 'react'
import './CompatApp.css'

const ITEMS = [
  { label: 'MBTI', groom: 'ENTP', bride: 'INTP', score: 95, color: '#af52de' },
  { label: '혈액형', groom: 'O형', bride: 'B형', score: 88, color: '#ff9500' },
  { label: '띠', groom: '원숭이', bride: '돼지', score: 82, color: '#34c759' },
  { label: '별자리', groom: '게자리', bride: '황소자리', score: 85, color: '#007aff' },
  { label: '출생순서', groom: '첫째', bride: '둘째', score: 90, color: '#ff3b30' },
]

const BONUSES = [
  { label: '서로 좋아하는 마음', score: 5, emoji: '💕' },
  { label: '대체공휴일에 결혼하는 센스', score: 3, emoji: '🗓' },
  { label: '이 청첩장 끝까지 본 하객의 응원', score: 2, emoji: '👏' },
  { label: '기자단 특별 보정 (결혼하니까)', score: 2, emoji: '🎁' },
]

const BASE_SCORE = Math.round(ITEMS.reduce((s, c) => s + c.score, 0) / ITEMS.length)

export default function CompatApp() {
  const [revealed, setRevealed] = useState(0)
  const [bonusPhase, setBonusPhase] = useState(false)
  const [bonusCount, setBonusCount] = useState(0)
  const [displayScore, setDisplayScore] = useState(null)
  const [perfect, setPerfect] = useState(false)
  const [started, setStarted] = useState(false)

  // Reveal items one by one
  useEffect(() => {
    if (!started) return
    if (revealed < ITEMS.length) {
      const t = setTimeout(() => setRevealed(c => c + 1), 400)
      return () => clearTimeout(t)
    }
    if (revealed === ITEMS.length && !displayScore) {
      const t = setTimeout(() => setDisplayScore(BASE_SCORE), 600)
      return () => clearTimeout(t)
    }
  }, [started, revealed, displayScore])

  // After score shows, start bonus phase
  useEffect(() => {
    if (displayScore && !bonusPhase && displayScore === BASE_SCORE) {
      const t = setTimeout(() => setBonusPhase(true), 1500)
      return () => clearTimeout(t)
    }
  }, [displayScore, bonusPhase])

  // Reveal bonuses one by one
  useEffect(() => {
    if (!bonusPhase) return
    if (bonusCount >= BONUSES.length) {
      const t = setTimeout(() => setPerfect(true), 600)
      return () => clearTimeout(t)
    }
    const t = setTimeout(() => {
      setBonusCount(c => c + 1)
      setDisplayScore(s => Math.min(s + BONUSES[bonusCount].score, 100))
    }, 700)
    return () => clearTimeout(t)
  }, [bonusPhase, bonusCount])

  return (
    <div>
      <div className="ios-card" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: '#8e8e93', marginBottom: 8 }}>이창민 x 박수진</p>
        {!started ? (
          <button className="compat-start-btn" onClick={() => { setStarted(true); setRevealed(1) }}>
            궁합 분석 시작
          </button>
        ) : displayScore ? (
          <>
            <div className={`ios-compat-score ${perfect ? 'perfect' : ''}`}>
              {displayScore}<span>점</span>
            </div>
            {!bonusPhase && (
              <p className="compat-comment fade-in">
                {BASE_SCORE}점... 나쁘진 않은데 뭔가 아쉽군요
              </p>
            )}
            {bonusPhase && !perfect && (
              <p className="compat-comment bonus fade-in">
                잠깐, 보너스 점수가 남아있습니다!
              </p>
            )}
            {perfect && (
              <p className="compat-comment perfect fade-in">
                만점! 이 커플 결혼 안 하면 누가 합니까
              </p>
            )}
          </>
        ) : (
          <div className="compat-loading">
            <div className="compat-spinner" />
            <p style={{ fontSize: '0.8rem', color: '#8e8e93', marginTop: 8 }}>점수 산출 중...</p>
          </div>
        )}
      </div>

      {/* Bonus section */}
      {bonusPhase && (
        <div className={`ios-card bonus-card fade-in ${perfect ? 'bonus-perfect' : ''}`}>
          <p className="bonus-card-title">보너스 점수 추가 발견!</p>
          {BONUSES.map((b, i) => (
            i < bonusCount && (
              <div key={i} className="bonus-row fade-in">
                <span className="bonus-row-emoji">{b.emoji}</span>
                <span className="bonus-row-label">{b.label}</span>
                <span className="bonus-row-score">+{b.score}</span>
              </div>
            )
          ))}
          {perfect && (
            <div className="bonus-final fade-in">
              최종: <strong>100점 (SSS)</strong>
            </div>
          )}
        </div>
      )}

      {started && ITEMS.map((item, i) => (
        i < revealed && (
          <div key={i} className="ios-card fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span className="ios-compat-badge" style={{ background: item.color }}>{item.label}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: item.color }}>{item.score}점</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 8, fontSize: '0.85rem' }}>
              <span>{item.groom}</span>
              <span style={{ color: '#c7c7cc' }}>x</span>
              <span>{item.bride}</span>
            </div>
            <div className="ios-compat-bar">
              <div style={{ width: `${item.score}%`, background: item.color }} />
            </div>
          </div>
        )
      ))}
    </div>
  )
}
