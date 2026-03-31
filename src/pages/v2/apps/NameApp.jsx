import { useState, useEffect, useRef } from 'react'
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

const NAMES_INTERLEAVED = ['이','박','창','수','민','진']

export default function NameApp() {
  const { rows, result } = calculate()
  // phases: ready, typing, strokes, calculating, boom, done
  const [phase, setPhase] = useState('ready')
  const [typedIdx, setTypedIdx] = useState(0)
  const [displayText, setDisplayText] = useState('0')
  const [visibleRows, setVisibleRows] = useState(0)
  const [shaking, setShaking] = useState(false)
  const [sparkles, setSparkles] = useState([])
  const historyRef = useRef(null)

  const startCalc = () => {
    setPhase('typing')
    setTypedIdx(0)
    setDisplayText('')
  }

  // Phase: typing names one by one
  useEffect(() => {
    if (phase !== 'typing') return
    if (typedIdx >= NAMES_INTERLEAVED.length) {
      setTimeout(() => {
        setPhase('strokes')
        setDisplayText(rows[0].join(' '))
      }, 400)
      return
    }
    const timer = setTimeout(() => {
      setDisplayText((d) => d + NAMES_INTERLEAVED[typedIdx])
      setTypedIdx((i) => i + 1)
    }, 300)
    return () => clearTimeout(timer)
  }, [phase, typedIdx, rows])

  // Phase: show stroke counts then start calculating
  useEffect(() => {
    if (phase !== 'strokes') return
    const timer = setTimeout(() => {
      setPhase('calculating')
      setVisibleRows(1)
    }, 1200)
    return () => clearTimeout(timer)
  }, [phase])

  // Phase: reveal rows one by one
  useEffect(() => {
    if (phase !== 'calculating') return
    if (visibleRows >= rows.length) {
      setTimeout(() => {
        setPhase('boom')
        setDisplayText(result)
        setShaking(true)
        setTimeout(() => setShaking(false), 600)
        // create sparkles
        const newSparkles = Array.from({ length: 12 }, (_, i) => ({
          id: i,
          x: 30 + Math.random() * 40,
          y: 20 + Math.random() * 30,
          delay: Math.random() * 0.5,
          size: 8 + Math.random() * 16,
        }))
        setSparkles(newSparkles)
        setTimeout(() => {
          setPhase('done')
          setSparkles([])
        }, 2000)
      }, 400)
      return
    }
    const timer = setTimeout(() => {
      setDisplayText(rows[visibleRows].join(' '))
      setVisibleRows((v) => v + 1)
    }, 500)
    return () => clearTimeout(timer)
  }, [phase, visibleRows, rows, result])

  const reset = () => {
    setPhase('ready')
    setDisplayText('0')
    setVisibleRows(0)
    setTypedIdx(0)
    setSparkles([])
  }

  return (
    <div className={`calc-app ${shaking ? 'calc-shake' : ''}`}>
      {/* Sparkle particles */}
      {sparkles.map((s) => (
        <div
          key={s.id}
          className="calc-sparkle"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            animationDelay: `${s.delay}s`,
            width: s.size,
            height: s.size,
          }}
        />
      ))}

      {/* Display */}
      <div className="calc-display" ref={historyRef}>
        {phase === 'ready' && (
          <div className="calc-names">
            <span>이창민</span>
            <span className="calc-x">x</span>
            <span>박수진</span>
          </div>
        )}

        {(phase === 'typing') && (
          <div className="calc-typing">
            <span>{displayText}</span>
            <span className="calc-cursor">|</span>
          </div>
        )}

        {(phase === 'strokes' || phase === 'calculating') && (
          <div className="calc-pyramid">
            {rows.slice(0, visibleRows).map((row, ri) => (
              <div key={ri} className="calc-pyramid-row" style={{ animationDelay: `${ri * 0.1}s` }}>
                {row.map((n, ni) => (
                  <span
                    key={ni}
                    className={`calc-pyramid-cell ${ri === rows.length - 1 ? 'final-cell' : ''}`}
                  >
                    {n}
                  </span>
                ))}
              </div>
            ))}
          </div>
        )}

        <div className={`calc-result ${phase === 'done' || phase === 'boom' ? 'final' : ''} ${phase === 'boom' ? 'boom' : ''}`}>
          {phase === 'done' ? result + '%' : displayText}
        </div>

        {phase === 'done' && (
          <div className="calc-comment calc-comment-animate">
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
          <button className="calc-key" disabled={phase !== 'ready'}>이</button>
          <button className="calc-key" disabled={phase !== 'ready'}>창</button>
          <button className="calc-key" disabled={phase !== 'ready'}>민</button>
          <button className="calc-key op" disabled>x</button>
        </div>
        <div className="calc-row">
          <button className="calc-key" disabled={phase !== 'ready'}>박</button>
          <button className="calc-key" disabled={phase !== 'ready'}>수</button>
          <button className="calc-key" disabled={phase !== 'ready'}>진</button>
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
            onClick={phase === 'ready' ? startCalc : phase === 'done' ? reset : undefined}
          >
            {phase === 'done' ? 'C' : '='}
          </button>
        </div>
      </div>
    </div>
  )
}
