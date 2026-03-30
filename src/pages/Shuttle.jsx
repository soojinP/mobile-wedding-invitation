import './Shuttle.css'

const TO_VENUE_SCHEDULE = [
  { time: '12:20', note: '' },
  { time: '12:40', note: '' },
]

const FROM_VENUE_SCHEDULE = [
  { time: '14:10', note: '' },
  { time: '14:30', note: '' },
]

export default function Shuttle({ onNext }) {
  return (
    <div className="page shuttle-page">
      <h2>셔틀버스 안내</h2>
      <p className="shuttle-sub">이대역 3번 출구 앞 ↔ 동문회관</p>
      <p className="shuttle-ceremony">13시 예식</p>

      <div className="shuttle-card fade-in">
        <div className="shuttle-header">
          <span className="shuttle-name">이대역(3번 출구 앞) → 동문회관</span>
        </div>
        <div className="shuttle-times">
          {TO_VENUE_SCHEDULE.map((s, j) => (
            <div key={j} className="shuttle-time-row">
              <span className="shuttle-time">{s.time}</span>
              {s.note && <span className="shuttle-note">{s.note}</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="shuttle-card fade-in-delay">
        <div className="shuttle-header">
          <span className="shuttle-name">동문회관(B1) → 이대역</span>
        </div>
        <div className="shuttle-times">
          {FROM_VENUE_SCHEDULE.map((s, j) => (
            <div key={j} className="shuttle-time-row">
              <span className="shuttle-time">{s.time}</span>
              {s.note && <span className="shuttle-note">{s.note}</span>}
            </div>
          ))}
        </div>
      </div>

      <p className="shuttle-warning fade-in-delay-3">
        * 셔틀버스 좌석이 한정되어 있으니<br />
        가급적 일찍 타주세요<br />
        <span>(안 타도 저희는 괜찮습니다... 라고 하면 거짓말)</span>
      </p>

      <button className="btn fade-in-delay-3" onClick={onNext} style={{ marginTop: 32 }}>
        마음 전하기
      </button>
    </div>
  )
}
