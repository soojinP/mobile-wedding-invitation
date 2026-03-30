import { useState, useEffect } from 'react'
import './NameCompat.css'

// 한글 자모 획수
const STROKE_MAP = {
  'ㄱ': 2, 'ㄴ': 1, 'ㄷ': 3, 'ㄹ': 5, 'ㅁ': 4, 'ㅂ': 4, 'ㅅ': 2,
  'ㅇ': 1, 'ㅈ': 3, 'ㅊ': 4, 'ㅋ': 3, 'ㅌ': 4, 'ㅍ': 4, 'ㅎ': 3,
  'ㅏ': 2, 'ㅑ': 3, 'ㅓ': 2, 'ㅕ': 3, 'ㅗ': 2, 'ㅛ': 3,
  'ㅜ': 2, 'ㅠ': 3, 'ㅡ': 1, 'ㅣ': 1,
  'ㅐ': 3, 'ㅒ': 4, 'ㅔ': 3, 'ㅖ': 4, 'ㅘ': 4, 'ㅙ': 5,
  'ㅚ': 3, 'ㅝ': 4, 'ㅞ': 5, 'ㅟ': 3, 'ㅢ': 2,
  'ㄲ': 4, 'ㄸ': 6, 'ㅃ': 8, 'ㅆ': 4, 'ㅉ': 6,
  'ㄳ': 4, 'ㄵ': 4, 'ㄶ': 4, 'ㄺ': 7, 'ㄻ': 9,
  'ㄼ': 9, 'ㄽ': 7, 'ㄾ': 9, 'ㄿ': 9, 'ㅀ': 8, 'ㅄ': 6,
}

function decomposeHangul(char) {
  const code = char.charCodeAt(0) - 0xAC00
  if (code < 0 || code > 11171) return []
  const cho = Math.floor(code / 588)
  const jung = Math.floor((code % 588) / 28)
  const jong = code % 28

  const CHO = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']
  const JUNG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ']
  const JONG = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ']

  const parts = [CHO[cho], JUNG[jung]]
  if (jong > 0) parts.push(JONG[jong])
  return parts
}

function getCharStrokes(char) {
  const parts = decomposeHangul(char)
  return parts.reduce((sum, p) => sum + (STROKE_MAP[p] || 0), 0)
}

// 이창민 박수진 interleaved
const NAME1 = '이창민'
const NAME2 = '박수진'

function calculateRows() {
  // Interleave: 이 박 창 수 민 진
  const interleaved = []
  for (let i = 0; i < 3; i++) {
    interleaved.push({ char: NAME1[i], strokes: getCharStrokes(NAME1[i]) })
    interleaved.push({ char: NAME2[i], strokes: getCharStrokes(NAME2[i]) })
  }

  const rows = [interleaved.map(c => c.strokes)]

  let current = rows[0]
  while (current.length > 2) {
    const next = []
    for (let i = 0; i < current.length - 1; i++) {
      next.push((current[i] + current[i + 1]) % 10)
    }
    rows.push(next)
    current = next
  }

  return { interleaved, rows }
}

export default function NameCompat({ onNext }) {
  const [step, setStep] = useState(0) // 0: intro, 1: animating rows, 2: result
  const [visibleRow, setVisibleRow] = useState(0)
  const { interleaved, rows } = calculateRows()
  const result = rows[rows.length - 1].join('')

  useEffect(() => {
    if (step !== 1) return
    if (visibleRow >= rows.length) {
      setStep(2)
      return
    }
    const timer = setTimeout(() => setVisibleRow(v => v + 1), 600)
    return () => clearTimeout(timer)
  }, [step, visibleRow, rows.length])

  return (
    <div className="page name-page">
      <h2>이름 궁합</h2>
      <p className="name-sub">획수로 보는 이름 궁합 테스트</p>

      {step === 0 && (
        <div className="name-intro fade-in">
          <div className="name-display">
            <div className="name-col">
              {NAME1.split('').map((c, i) => (
                <div key={i} className="name-char">
                  <span className="char">{c}</span>
                  <span className="stroke">{getCharStrokes(c)}획</span>
                </div>
              ))}
            </div>
            <div className="name-heart">x</div>
            <div className="name-col">
              {NAME2.split('').map((c, i) => (
                <div key={i} className="name-char">
                  <span className="char">{c}</span>
                  <span className="stroke">{getCharStrokes(c)}획</span>
                </div>
              ))}
            </div>
          </div>

          <button className="btn btn-solid" onClick={() => { setStep(1); setVisibleRow(1) }} style={{ marginTop: 32 }}>
            궁합 계산하기
          </button>
        </div>
      )}

      {(step === 1 || step === 2) && (
        <div className="calc-section fade-in">
          <div className="interleaved-row">
            {interleaved.map((c, i) => (
              <div key={i} className="calc-char">
                <span className="calc-name">{c.char}</span>
                <span className="calc-num">{c.strokes}</span>
              </div>
            ))}
          </div>

          {rows.slice(1).map((row, rowIdx) => (
            rowIdx + 1 < visibleRow ? (
              <div key={rowIdx} className="calc-row fade-in">
                {row.map((n, i) => (
                  <span key={i} className={`calc-cell ${rowIdx === rows.length - 2 ? 'final' : ''}`}>
                    {n}
                  </span>
                ))}
              </div>
            ) : null
          ))}

          {step === 2 && (
            <div className="result-section fade-in-delay">
              <div className="result-percent">{result}<span>%</span></div>
              <p className="result-comment">
                {Number(result) >= 80
                  ? '이 정도면 그냥 결혼하세요 (아 맞다 합니다)'
                  : Number(result) >= 50
                  ? '나쁘지 않은데요? 노력하면 됩니다'
                  : '... 그래도 사주 궁합이 좋으니까요'}
              </p>
              <button className="btn" onClick={onNext} style={{ marginTop: 32 }}>
                웨딩 사진 보기
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
