import "./CalendarApp.css";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];

// May 2026: starts on Friday (index 5), 31 days
const MAY_START = 5;
const MAY_DAYS = 31;

export default function CalendarApp() {
  const blanks = Array(MAY_START).fill(null);
  const days = Array.from({ length: MAY_DAYS }, (_, i) => i + 1);
  const cells = [...blanks, ...days];

  return (
    <div>
      <div className="cal-header">
        <h2 className="cal-month">2026년 5월</h2>
      </div>

      <div className="cal-grid">
        {DAYS.map((d, i) => (
          <div
            key={d}
            className={`cal-weekday ${i === 0 ? "sun" : i === 6 ? "sat" : ""}`}
          >
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`b${i}`} className="cal-cell" />;
          const isToday = day === 25;
          const isSun = (MAY_START + day - 1) % 7 === 0;
          const isSat = (MAY_START + day - 1) % 7 === 6;
          const isHoliday = day === 5 || day === 25; // 어린이날, 대체공휴일
          return (
            <div
              key={day}
              className={`cal-cell ${isToday ? "selected" : ""} ${isSun || isHoliday ? "holiday" : ""} ${isSat ? "sat" : ""}`}
            >
              <span className="cal-day">{day}</span>
              {day === 25 && <span className="cal-dot" />}
              {day === 5 && <span className="cal-dot green" />}
            </div>
          );
        })}
      </div>

      <div className="cal-event">
        <div className="cal-event-bar" />
        <div className="cal-event-content">
          <div className="cal-event-time">오후 1:00 - 오후 3:00</div>
          <div className="cal-event-title">수진 ♥ 창민 결혼식</div>
          <div className="cal-event-location">연세대학교 동문회관</div>
          <div className="cal-event-note">대체공휴일 (부처님오신날)</div>
        </div>
      </div>

      <div className="cal-event secondary">
        <div className="cal-event-bar green" />
        <div className="cal-event-content">
          <div className="cal-event-time">종일</div>
          <div className="cal-event-title" style={{ color: "#34c759" }}>
            대체공휴일
          </div>
          <div className="cal-event-note">쉬는 날 맞습니다. 진짜로요.</div>
        </div>
      </div>
    </div>
  );
}
