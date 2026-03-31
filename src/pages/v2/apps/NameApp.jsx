import { useState, useEffect } from 'react'
import './NameApp.css'

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

function getStrokes(char) {
  return decomposeHangul(char).reduce((s, p) => s + (STROKE_MAP[p] || 0), 0)
}

function calculate() {
  const n1 = '이창민', n2 = '박수진'
  const interleaved = []
  for (let i = 0; i < 3; i++) {
    interleaved.push(getStrokes(n1[i]))
    interleaved.push(getStrokes(n2[i]))
  }
  const rows = [interleaved]
  let cur = interleaved
  while (cur.length > 2) {
    const next = []
    for (let i = 0; i < cur.length - 1; i++) next.push((cur[i] + cur[i+1]) % 10)
    rows.push(next)
    cur = next
  }
  return { rows, result: cur.join('') }
}

export default function NameApp() {
  const [started, setStarted] = useState(false)
  const [visibleRows, setVisibleRows] = useState(1)
  const { rows, result } = calculate()

  useEffect(() => {
    if (!started || visibleRows >= rows.length) return
    const timer = setTimeout(() => setVisibleRows(v => v + 1), 500)
    return () => clearTimeout(timer)
  }, [started, visibleRows, rows.length])

  return (
    <div>
      <div className="ios-card" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: '#8e8e93', marginBottom: 8 }}>획수로 보는 이름 궁합</p>
        <h3>이창민 x 박수진</h3>
      </div>

      {!started ? (
        <button className="ios-btn" onClick={() => setStarted(true)}>궁합 계산하기</button>
      ) : (
        <div className="ios-card">
          {rows.slice(0, visibleRows).map((row, ri) => (
            <div key={ri} className="ios-name-row">
              {row.map((n, ni) => (
                <span
                  key={ni}
                  className={`ios-name-cell ${ri === rows.length - 1 ? 'final' : ''}`}
                >
                  {n}
                </span>
              ))}
            </div>
          ))}
          {visibleRows >= rows.length && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <div className="ios-compat-score">{result}<span>%</span></div>
              <p style={{ fontSize: '0.85rem', color: '#8e8e93', marginTop: 4 }}>
                {Number(result) >= 80 ? '이 정도면 그냥 결혼하세요 (아 맞다 합니다)' : '나쁘지 않은데요?'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
