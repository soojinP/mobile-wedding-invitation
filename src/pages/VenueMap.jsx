import './VenueMap.css'

const VENUE_NAME = '연세대학교 동문회관'
const VENUE_ADDRESS = '서울특별시 서대문구 연세로 50'
const NAVER_MAP_URL = 'https://map.naver.com/v5/search/%EC%97%B0%EC%84%B8%EB%8C%80%ED%95%99%EA%B5%90%20%EB%8F%99%EB%AC%B8%ED%9A%8C%EA%B4%80'
const KAKAO_MAP_URL = 'https://map.kakao.com/link/search/%EC%97%B0%EC%84%B8%EB%8C%80%ED%95%99%EA%B5%90%20%EB%8F%99%EB%AC%B8%ED%9A%8C%EA%B4%80'

export default function VenueMap({ onNext }) {
  return (
    <div className="page venue-page">
      <h2>오시는 길</h2>

      <div className="venue-card fade-in">
        <h3>{VENUE_NAME}</h3>
        <p className="venue-address">{VENUE_ADDRESS}</p>
      </div>

      <div className="map-placeholder fade-in-delay">
        <p>지도 영역</p>
        <p className="map-note">
          아래 버튼으로 네이버/카카오 지도에서<br />
          정확한 위치를 확인하세요
        </p>
      </div>

      <div className="map-buttons fade-in-delay-2">
        <a href={NAVER_MAP_URL} target="_blank" rel="noopener noreferrer" className="btn map-btn naver-btn">
          네이버 지도
        </a>
        <a href={KAKAO_MAP_URL} target="_blank" rel="noopener noreferrer" className="btn map-btn kakao-btn">
          카카오맵
        </a>
      </div>

      <div className="transport-info fade-in-delay-2">
        <h3>교통 안내</h3>

        <div className="transport-item">
          <span className="transport-label">지하철</span>
          <p>2호선 신촌역 3번 출구에서 도보 약 15분<br />경의중앙선 신촌역 1번 출구에서 도보 약 10분</p>
        </div>

        <div className="transport-item">
          <span className="transport-label">버스</span>
          <p>연세대 정문 하차 / 153, 173, 272, 470, 710 등</p>
        </div>

        <div className="transport-item">
          <span className="transport-label">승용차</span>
          <p>동문회관 주차장 이용<br />2시간 무료 (동문회관으로 출차 시 적용 가능)</p>
        </div>

        <div className="transport-item">
          <span className="transport-label">셔틀버스</span>
          <p>이대역 3번 출구 앞 ↔ 동문회관<br />자세한 시간표는 다음 페이지에서 확인하세요</p>
        </div>
      </div>

      <button className="btn fade-in-delay-3" onClick={onNext} style={{ marginTop: 40 }}>
        셔틀버스 시간표
      </button>
    </div>
  )
}
