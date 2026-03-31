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
    for (let i = 0; i < cur.length - 1; i++) next.push((cur[i] + cur[i + 1]) % 10)
    rows.push(next)
    cur = next
  }
  return { rows, result: cur.join('') }
}

// 계산 과정을 하나씩 보여줄 수식 생성
function getExpressions(rows) {
  const exprs = []
  for (let r = 0; r < rows.length - 1; r++) {
    for (let i = 0; i < rows[r].length - 1; i++) {
      exprs.push({
        a: rows[r][i],
        b: rows[r][i + 1],
        result: rows[r + 1][i],
      })
    }
  }
  return exprs
}

export default function NameApp() {
  const { rows, result } = calculate()
  const expressions = getExpressions(rows)
  const [phase, setPhase] = useState('ready') // ready, calculating, done
  const [displayText, setDisplayText] = useState('0')
  const [exprIdx, setExprIdx] = useState(0)
  const [history, setHistory] = useState([])

  const startCalc = () => {
    setPhase('calculating')
    setExprIdx(0)
    setHistory([])
    setDisplayText('0')
  }

  useEffect(() => {
    if (phase !== 'calculating') return
    if (exprIdx >= expressions.length) {
      setDisplayText(result + '%')
      setPhase('done')
      return
    }
    const expr = expressions[exprIdx]
    const line = `${expr.a} + ${expr.b} = ${(expr.a + expr.b)} → ${expr.result}`

    const timer = setTimeout(() => {
      setDisplayText(String(expr.result))
      setHistory((h) => [...h, line])
      setExprIdx((i) => i + 1)
    }, 250)
    return () => clearTimeout(timer)
  }, [phase, exprIdx, expressions, result])

  return (
    <div className="calc-app">
      {/* Display */}
      <div className="calc-display">
        <div className="calc-history">
          {phase === 'ready' && (
            <div className="calc-names">
              <span>이창민</span>
              <span className="calc-x">x</span>
              <span>박수진</span>
            </div>
          )}
          {history.map((h, i) => (
            <div key={i} className="calc-history-line">{h}</div>
          ))}
        </div>
        <div className={`calc-result ${phase === 'done' ? 'final' : ''}`}>
          {displayText}
        </div>
        {phase === 'done' && (
          <div className="calc-comment">
            {Number(result) >= 80 ? '이 정도면 결혼감입니다' : '나쁘지 않은 수치입니다'}
          </div>
        )}
      </div>

      {/* Keypad */}
      <div className="calc-keypad">
        <div className="calc-row">
          <button className="calc-key func" disabled>AC</button>
          <button className="calc-key func" disabled>+/-</button>
          <button className="calc-key func" disabled>%</button>
          <button className="calc-key op" disabled>/</button>
        </div>
        <div className="calc-row">
          <button className="calc-key">이</button>
          <button className="calc-key">창</button>
          <button className="calc-key">민</button>
          <button className="calc-key op" disabled>x</button>
        </div>
        <div className="calc-row">
          <button className="calc-key">박</button>
          <button className="calc-key">수</button>
          <button className="calc-key">진</button>
          <button className="calc-key op" disabled>-</button>
        </div>
        <div className="calc-row">
          <button className="calc-key" disabled>획</button>
          <button className="calc-key" disabled>수</button>
          <button className="calc-key" disabled>궁</button>
          <button className="calc-key op" disabled>+</button>
        </div>
        <div className="calc-row">
          <button className="calc-key zero" disabled>합</button>
          <button className="calc-key" disabled>.</button>
          <button
            className={`calc-key eq ${phase === 'ready' ? 'pulse' : ''}`}
            onClick={phase === 'ready' ? startCalc : phase === 'done' ? () => { setPhase('ready'); setHistory([]); setDisplayText('0') } : undefined}
          >
            {phase === 'done' ? 'C' : '='}
          </button>
        </div>
      </div>
    </div>
  )
}
