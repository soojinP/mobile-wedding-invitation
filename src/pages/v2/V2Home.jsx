import { useState, useEffect, useRef } from 'react'
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

function LockScreen({ onUnlock, onNotifTap }) {
  const [time, setTime] = useState({ h: '', m: '' })
  const [offsetY, setOffsetY] = useState(0)
  const [unlocking, setUnlocking] = useState(false)
  const touchStartY = useRef(null)
  const screenRef = useRef(null)

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

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY
  }

  const handleTouchMove = (e) => {
    if (touchStartY.current === null) return
    const diff = touchStartY.current - e.touches[0].clientY
    if (diff > 0) {
      setOffsetY(Math.min(diff, 300))
    }
  }

  const handleTouchEnd = () => {
    if (offsetY > 120) {
      setUnlocking(true)
      setTimeout(onUnlock, 400)
    } else {
      setOffsetY(0)
    }
    touchStartY.current = null
  }

  const handleClick = () => {
    setUnlocking(true)
    setTimeout(onUnlock, 400)
  }

  const progress = Math.min(offsetY / 200, 1)
  const transform = unlocking
    ? 'translateY(-100%)'
    : `translateY(${-offsetY}px)`
  const opacity = unlocking ? 0 : 1 - progress * 0.3

  return (
    <div
      ref={screenRef}
      className={`lock-screen ${unlocking ? 'unlocking' : ''}`}
      style={{ transform, opacity, transition: unlocking || offsetY === 0 ? 'transform 0.4s ease, opacity 0.4s ease' : 'none' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      <StatusBar />
      <div className="lock-content">
        <div className="lock-date">5월 25일 월요일</div>
        <div className="lock-time">{time.h}:{time.m}</div>

        <div className="lock-now-playing">
          <div className="now-playing-card">
            <div className="now-playing-art"><span>🎵</span></div>
            <div className="now-playing-info">
              <div className="now-playing-title">Welcome to Our Show</div>
              <div className="now-playing-artist">O P Baron</div>
            </div>
            <div className="now-playing-bars">
              <span /><span /><span /><span />
            </div>
          </div>
        </div>

        <div className="lock-notification" onClick={(e) => { e.stopPropagation(); onNotifTap() }}>
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
        <span className="swipe-text">위로 스와이프</span>
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

  const handleNotifTap = () => {
    setUnlocked(true)
    setTimeout(() => onAppClick('invite'), 100)
  }

  return (
    <div className="iphone-frame">
      <div className="iphone-body">
        {!unlocked ? (
          <LockScreen onUnlock={() => setUnlocked(true)} onNotifTap={handleNotifTap} />
        ) : (
          <HomeScreen onAppClick={onAppClick} onSwitchV1={onSwitchV1} />
        )}
      </div>
    </div>
  )
}
