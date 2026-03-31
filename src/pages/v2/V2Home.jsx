import { useState, useEffect } from 'react'
import './V2Home.css'

const APPS = [
  { id: 'invite', icon: '💌', label: '초대장', color: '#ff6b6b' },
  { id: 'compat', icon: '💕', label: '궁합', color: '#c44dff' },
  { id: 'name', icon: '✏️', label: '이름궁합', color: '#ff9f43' },
  { id: 'gallery', icon: '📸', label: '사진', color: '#0abde3' },
  { id: 'venue', icon: '🗺', label: '오시는 길', color: '#10ac84' },
  { id: 'shuttle', icon: '🚌', label: '셔틀버스', color: '#5f27cd' },
  { id: 'gift', icon: '💰', label: '축의금', color: '#ee5a24' },
  { id: 'music', icon: '🎵', label: 'BGM', color: '#e84393' },
]

function StatusBar() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }))
    }
    update()
    const interval = setInterval(update, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="iphone-status-bar">
      <span className="status-time">{time}</span>
      <div className="status-notch" />
      <div className="status-right">
        <span className="status-signal">
          <span /><span /><span /><span />
        </span>
        <span className="status-wifi">wifi</span>
        <span className="status-battery">
          <span className="battery-body"><span className="battery-fill" /></span>
          <span className="battery-cap" />
        </span>
      </div>
    </div>
  )
}

function LockScreen({ onUnlock }) {
  const [time, setTime] = useState({ h: '', m: '' })
  const [swiping, setSwiping] = useState(false)

  useEffect(() => {
    const update = () => {
      const now = new Date()
      setTime({
        h: String(now.getHours()).padStart(2, '0'),
        m: String(now.getMinutes()).padStart(2, '0'),
      })
    }
    update()
    const interval = setInterval(update, 10000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`lock-screen ${swiping ? 'swiping' : ''}`} onClick={() => { setSwiping(true); setTimeout(onUnlock, 400) }}>
      <StatusBar />
      <div className="lock-content">
        <div className="lock-date">5월 25일 월요일</div>
        <div className="lock-time">{time.h}:{time.m}</div>

        <div className="lock-notification">
          <div className="notif-card">
            <div className="notif-header">
              <span className="notif-icon">💌</span>
              <span className="notif-app">초대장</span>
              <span className="notif-when">지금</span>
            </div>
            <div className="notif-title">창민 & 수진 결혼합니다</div>
            <div className="notif-body">2026. 05. 25 (월) 오후 1시 | 연세대학교 동문회관</div>
          </div>
        </div>
      </div>
      <div className="lock-swipe">
        <div className="swipe-bar" />
      </div>
    </div>
  )
}

function HomeScreen({ onAppClick, onSwitchV1 }) {
  return (
    <div className="home-screen">
      <StatusBar />
      <div className="home-content">
        <div className="app-grid">
          {APPS.map((app) => (
            <button key={app.id} className="app-icon-btn" onClick={() => onAppClick(app.id)}>
              <div className="app-icon" style={{ background: app.color }}>
                <span>{app.icon}</span>
              </div>
              <span className="app-label">{app.label}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="home-dock">
        <button className="dock-btn" onClick={onSwitchV1}>
          <span className="dock-icon">🎪</span>
          <span className="dock-label">V1 모드</span>
        </button>
      </div>
      <div className="home-indicator">
        <div className="indicator-bar" />
      </div>
    </div>
  )
}

export default function V2Home({ onSwitchV1, onAppClick }) {
  const [unlocked, setUnlocked] = useState(false)

  return (
    <div className="iphone-frame">
      <div className="iphone-body">
        {!unlocked ? (
          <LockScreen onUnlock={() => setUnlocked(true)} />
        ) : (
          <HomeScreen onAppClick={onAppClick} onSwitchV1={onSwitchV1} />
        )}
      </div>
    </div>
  )
}
