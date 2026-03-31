export default function VenueApp() {
  const naverUrl = 'https://map.naver.com/v5/search/%EC%97%B0%EC%84%B8%EB%8C%80%ED%95%99%EA%B5%90%20%EB%8F%99%EB%AC%B8%ED%9A%8C%EA%B4%80'
  const kakaoUrl = 'https://map.kakao.com/link/search/%EC%97%B0%EC%84%B8%EB%8C%80%ED%95%99%EA%B5%90%20%EB%8F%99%EB%AC%B8%ED%9A%8C%EA%B4%80'

  return (
    <div>
      <div className="ios-card" style={{ textAlign: 'center' }}>
        <h3>연세대학교 동문회관</h3>
        <p style={{ color: '#8e8e93', fontSize: '0.8rem' }}>서울특별시 서대문구 연세로 50</p>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
        <a href={naverUrl} target="_blank" rel="noopener noreferrer" className="ios-btn" style={{ textDecoration: 'none', textAlign: 'center', background: '#2db400' }}>
          네이버 지도
        </a>
        <a href={kakaoUrl} target="_blank" rel="noopener noreferrer" className="ios-btn" style={{ textDecoration: 'none', textAlign: 'center', background: '#fee500', color: '#3c1e1e' }}>
          카카오맵
        </a>
      </div>

      <div className="ios-card">
        <p className="ios-card-title">교통 안내</p>
        <div className="ios-card-row">
          <span className="ios-card-label">지하철</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#8e8e93', padding: '0 0 8px', lineHeight: 1.6 }}>
          2호선 신촌역 3번 출구 도보 약 15분<br />
          경의중앙선 신촌역 1번 출구 도보 약 10분
        </p>
        <div className="ios-card-row">
          <span className="ios-card-label">버스</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#8e8e93', padding: '0 0 8px' }}>
          연세대 정문 하차 / 153, 173, 272, 470, 710
        </p>
        <div className="ios-card-row">
          <span className="ios-card-label">승용차</span>
        </div>
        <p style={{ fontSize: '0.8rem', color: '#8e8e93', padding: '0 0 4px', lineHeight: 1.6 }}>
          동문회관 주차장 이용<br />
          2시간 무료 (동문회관으로 출차 시 적용)
        </p>
      </div>
    </div>
  )
}
