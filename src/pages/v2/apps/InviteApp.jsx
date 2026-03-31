export default function InviteApp() {
  return (
    <div>
      <div className="ios-card" style={{ textAlign: 'center', padding: '32px 16px' }}>
        <p style={{ fontSize: '0.8rem', color: '#8e8e93', marginBottom: 16 }}>
          소중한 분들을 초대합니다
        </p>
        <h3 style={{ fontSize: '1.6rem', fontWeight: 300, marginBottom: 8 }}>
          이창민 & 박수진
        </h3>
        <p style={{ fontSize: '1rem', color: '#000', fontWeight: 600 }}>
          결혼합니다
        </p>
      </div>

      <div className="ios-card">
        <div className="ios-card-row">
          <span className="ios-card-label">날짜</span>
          <span className="ios-card-value">2026년 5월 25일 (월)</span>
        </div>
        <div className="ios-card-row">
          <span className="ios-card-label">시간</span>
          <span className="ios-card-value">오후 1시</span>
        </div>
        <div className="ios-card-row">
          <span className="ios-card-label">장소</span>
          <span className="ios-card-value">연세대학교 동문회관</span>
        </div>
      </div>

      <div className="ios-card" style={{ background: 'rgba(255,149,0,0.08)' }}>
        <p style={{ fontSize: '0.85rem', color: '#ff9500', fontWeight: 600, marginBottom: 4 }}>
          월요일이지만 쉬는 날입니다
        </p>
        <p style={{ fontSize: '0.8rem', color: '#8e8e93', lineHeight: 1.6 }}>
          대체공휴일이라 빨간 날이에요.<br />
          캘린더 한번 확인해보세요. 진짜입니다.
        </p>
      </div>

      <div className="ios-card">
        <p className="ios-card-title">신랑측</p>
        <div className="ios-card-row">
          <span className="ios-card-label">아버지 이OO / 어머니 OOO</span>
        </div>
        <div className="ios-card-row">
          <span className="ios-card-label">장남 <strong>창민</strong></span>
        </div>
      </div>

      <div className="ios-card">
        <p className="ios-card-title">신부측</p>
        <div className="ios-card-row">
          <span className="ios-card-label">아버지 박OO / 어머니 OOO</span>
        </div>
        <div className="ios-card-row">
          <span className="ios-card-label">차녀 <strong>수진</strong></span>
        </div>
      </div>
    </div>
  )
}
