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

      <div className="ios-card">
        <p className="ios-card-title">🚌 셔틀버스</p>
        <p style={{ fontSize: '0.8rem', color: '#8e8e93', textAlign: 'center', marginBottom: 12 }}>
          이대역 3번 출구 앞 ↔ 동문회관
        </p>
        <div style={{ display: 'flex', gap: 0 }}>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <p style={{ fontSize: '0.7rem', color: '#007aff', fontWeight: 600, marginBottom: 8 }}>이대역 → 동문회관</p>
            <p style={{ fontSize: '0.95rem', color: '#1c1c1e', marginBottom: 4 }}>12:20</p>
            <p style={{ fontSize: '0.95rem', color: '#1c1c1e' }}>12:40</p>
          </div>
          <div style={{ width: 1, background: '#e5e5ea', margin: '0 8px' }} />
          <div style={{ flex: 1, textAlign: 'center' }}>
            <p style={{ fontSize: '0.7rem', color: '#007aff', fontWeight: 600, marginBottom: 8 }}>동문회관 → 이대역</p>
            <p style={{ fontSize: '0.95rem', color: '#1c1c1e', marginBottom: 4 }}>14:10</p>
            <p style={{ fontSize: '0.95rem', color: '#1c1c1e' }}>14:30</p>
          </div>
        </div>
      </div>

      <div className="ios-card" style={{ background: 'rgba(255,59,48,0.06)' }}>
        <p style={{ fontSize: '0.8rem', color: '#ff3b30', lineHeight: 1.6 }}>
          셔틀버스 좌석이 한정되어 있으니 가급적 일찍 탑승해주세요.
        </p>
      </div>
    </div>
  )
}
