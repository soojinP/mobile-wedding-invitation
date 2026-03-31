import './CompatApp.css'

const ITEMS = [
  { label: 'MBTI', groom: 'ENTP', bride: 'INTP', score: 95, color: '#af52de' },
  { label: '혈액형', groom: 'O형', bride: 'B형', score: 88, color: '#ff9500' },
  { label: '띠', groom: '원숭이', bride: '돼지', score: 82, color: '#34c759' },
  { label: '별자리', groom: '게자리', bride: '황소자리', score: 85, color: '#007aff' },
  { label: '출생순서', groom: '첫째', bride: '둘째', score: 90, color: '#ff3b30' },
]

export default function CompatApp() {
  const avg = Math.round(ITEMS.reduce((s, c) => s + c.score, 0) / ITEMS.length)

  return (
    <div>
      <div className="ios-card" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: '#8e8e93', marginBottom: 8 }}>이창민 x 박수진</p>
        <div className="ios-compat-score">{avg}<span>점</span></div>
        <p style={{ fontSize: '0.85rem', color: '#34c759', fontWeight: 600 }}>
          이 정도면 결혼해야죠
        </p>
      </div>

      {ITEMS.map((item, i) => (
        <div key={i} className="ios-card">
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
      ))}
    </div>
  )
}
