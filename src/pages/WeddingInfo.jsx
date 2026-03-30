import './WeddingInfo.css'

export default function WeddingInfo({ onNext }) {
  return (
    <div className="page info-page">
      <h2>결혼식 안내</h2>

      <div className="info-card fade-in">
        <p className="info-label">날짜</p>
        <p className="info-value">2026년 5월 25일 월요일</p>
        <p className="info-detail">오후 1시</p>
        <p className="info-holiday">대체공휴일 (부처님오신날 대체)</p>
      </div>

      <div className="info-notice fade-in">
        네, 월요일 맞습니다.<br />
        하지만 걱정 마세요 -- 대체공휴일이라 쉬는 날입니다.<br />
        캘린더 확인해보세요. 빨간 날이에요. 진짜로요.
      </div>

      <div className="info-card fade-in-delay">
        <p className="info-label">장소</p>
        <p className="info-value">연세대학교 동문회관</p>
        <p className="info-address">서울특별시 서대문구 연세로 50</p>
      </div>

      <div className="divider fade-in-delay-2" />

      <div className="family-info fade-in-delay-2">
        <div className="family-row">
          <p className="family-side">신랑측</p>
          <p className="family-parents">
            <span className="family-relation">아버지</span> 이OO
            <span className="family-dot"> / </span>
            <span className="family-relation">어머니</span> OOO
          </p>
          <p className="family-child">장남 <strong>창민</strong></p>
        </div>
        <div className="family-row">
          <p className="family-side">신부측</p>
          <p className="family-parents">
            <span className="family-relation">아버지</span> 박OO
            <span className="family-dot"> / </span>
            <span className="family-relation">어머니</span> OOO
          </p>
          <p className="family-child">차녀 <strong>수진</strong></p>
        </div>
      </div>

      <div className="info-quote fade-in-delay-3">
        <p>
          &ldquo;서로 다른 두 사람이<br />
          하나의 길을 걷기로 했습니다.&rdquo;
        </p>
        <p className="quote-small">(솔직히 집 계약이 먼저였지만)</p>
      </div>

      <button className="btn fade-in-delay-3" onClick={onNext} style={{ marginTop: 40 }}>
        오시는 길
      </button>
    </div>
  )
}
