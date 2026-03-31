export default function ShuttleApp() {
  return (
    <div>
      <div className="ios-card" style={{ textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: '#8e8e93' }}>13시 예식</p>
        <h3 style={{ fontSize: '1rem' }}>이대역 3번 출구 앞 ↔ 동문회관</h3>
      </div>

      <div className="ios-card">
        <p className="ios-card-title">이대역 → 동문회관</p>
        <div className="ios-card-row">
          <span className="ios-card-label">12:20</span>
        </div>
        <div className="ios-card-row">
          <span className="ios-card-label">12:40</span>
        </div>
      </div>

      <div className="ios-card">
        <p className="ios-card-title">동문회관(B1) → 이대역</p>
        <div className="ios-card-row">
          <span className="ios-card-label">14:10</span>
        </div>
        <div className="ios-card-row">
          <span className="ios-card-label">14:30</span>
        </div>
      </div>

      <div className="ios-card" style={{ background: 'rgba(255,59,48,0.06)' }}>
        <p style={{ fontSize: '0.8rem', color: '#ff3b30', lineHeight: 1.6 }}>
          좌석이 한정되어 있으니 가급적 일찍 탑승해주세요.
        </p>
      </div>
    </div>
  )
}
