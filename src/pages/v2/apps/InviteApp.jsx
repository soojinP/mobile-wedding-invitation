import './InviteApp.css'

const CDN = import.meta.env.VITE_CDN_URL

export default function InviteApp() {
  return (
    <div>
      <div className="mail-hero">
        <img src={`${CDN}/photo9.jpg`} alt="창민 & 수진" className="mail-hero-img" />
        <div className="mail-hero-overlay">
          <p className="mail-hero-names">창민 & 수진</p>
        </div>
      </div>
      <div className="mail-message">
        <div className="mail-header">
          <div className="mail-row">
            <span className="mail-label">From:</span>
            <span className="mail-value">이창민 & 박수진</span>
          </div>
          <div className="mail-row">
            <span className="mail-label">To:</span>
            <span className="mail-value">소중한 당신</span>
          </div>
          <div className="mail-row">
            <span className="mail-label">Date:</span>
            <span className="mail-value">2026년 5월 25일 (월) 오후 1시</span>
          </div>
          <div className="mail-row">
            <span className="mail-label">Subject:</span>
            <span className="mail-value subject">저희 결혼합니다 💌</span>
          </div>
        </div>

        <div className="mail-body">
          <p className="mail-greeting">안녕하세요,</p>
          <p>
            저희 두 사람이 사랑과 믿음으로<br />
            한 가정을 이루게 되었습니다.
          </p>
          <p>
            바쁘시더라도 오셔서<br />
            축하해 주시면 감사하겠습니다.
          </p>
          <div className="mail-info">
            <div className="mail-info-row">
              <span>📅</span>
              <span>2026년 5월 25일 (월) 오후 1시</span>
            </div>
            <div className="mail-info-row">
              <span>📍</span>
              <span>연세대학교 동문회관</span>
            </div>
            <div className="mail-info-row">
              <span>💡</span>
              <span>대체공휴일이라 쉬는 날이에요!</span>
            </div>
          </div>
          <div className="mail-parents">
            <div className="mail-parent-side">
              <p className="mail-parent-label">신랑측</p>
              <p>아버지 이OO · 어머니 OOO</p>
              <p>장남 <strong>창민</strong></p>
            </div>
            <div className="mail-parent-side">
              <p className="mail-parent-label">신부측</p>
              <p>아버지 박OO · 어머니 OOO</p>
              <p>차녀 <strong>수진</strong></p>
            </div>
          </div>
          <p className="mail-sign">
            창민 & 수진 드림 💕
          </p>
        </div>
      </div>
    </div>
  )
}
