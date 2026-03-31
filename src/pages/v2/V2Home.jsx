import { useState, useEffect, useRef } from 'react'
import PhoneCall from './PhoneCall'
import './V2Home.css'

const APPS = [
  { id: 'invite', iconType: 'calendar', label: '초대장', color: '#fff' },
  { id: 'compat', iconType: 'hearts', label: '궁합', color: 'linear-gradient(135deg, #ff6b9d, #c44dff)' },
  { id: 'name', iconType: 'calc', label: '이름궁합', color: '#1c1c1e' },
  { id: 'gallery', iconType: 'photos', label: '사진', color: '#fff' },
  { id: 'venue', iconType: 'maps', label: '오시는 길', color: 'linear-gradient(135deg, #4cd964, #5ac8fa)' },
  { id: 'shuttle', iconType: 'transit', label: '셔틀', color: 'linear-gradient(180deg, #007aff, #5856d6)' },
  { id: 'fortune', iconType: 'fortune', label: '포춘쿠키', color: 'linear-gradient(135deg, #ffcc02, #ff9500)' },
  { id: 'guestbook', iconType: 'notes', label: '방명록', color: 'linear-gradient(180deg, #fffc00, #ffcc02)' },
  { id: 'gift', iconType: 'wallet', label: '축의금', color: '#1c1c1e' },
]

function AppIcon({ type }) {
  switch (type) {
    case 'calendar':
      return (
        <div className="icon-calendar">
          <div className="icon-cal-header">월요일</div>
          <div className="icon-cal-day">25</div>
        </div>
      )
    case 'hearts':
      return <div className="icon-inner">💕</div>
    case 'calc':
      return (
        <div className="icon-calc">
          <div className="icon-calc-grid">
            <span style={{background:'#a5a5a5'}} /><span style={{background:'#a5a5a5'}} /><span style={{background:'#ff9f0a'}} />
            <span style={{background:'#333'}} /><span style={{background:'#333'}} /><span style={{background:'#ff9f0a'}} />
            <span style={{background:'#333'}} /><span style={{background:'#333'}} /><span style={{background:'#ff9f0a'}} />
          </div>
        </div>
      )
    case 'photos':
      return (
        <div className="icon-photos">
          <div className="icon-photos-flower">
            <span style={{background:'#ff3b30'}} />
            <span style={{background:'#ff9500'}} />
            <span style={{background:'#ffcc00'}} />
            <span style={{background:'#4cd964'}} />
            <span style={{background:'#5ac8fa'}} />
            <span style={{background:'#007aff'}} />
            <span style={{background:'#5856d6'}} />
            <span style={{background:'#ff2d55'}} />
            <span className="icon-photos-center" />
          </div>
        </div>
      )
    case 'maps':
      return (
        <div className="icon-inner">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 4l-2 8-8 2 8 2 2 8 2-8 8-2-8-2z" fill="#fff" opacity="0.9"/>
          </svg>
        </div>
      )
    case 'transit':
      return <div className="icon-inner" style={{fontSize:'1.4rem',color:'#fff'}}>🚌</div>
    case 'fortune':
      return <div className="icon-inner" style={{fontSize:'1.6rem'}}>🥠</div>
    case 'notes':
      return (
        <div className="icon-notes">
          <div className="icon-notes-lines">
            <span /><span /><span /><span />
          </div>
        </div>
      )
    case 'wallet':
      return (
        <div className="icon-wallet">
          <div className="icon-wallet-cards">
            <span style={{background:'#ff3b30'}} />
            <span style={{background:'#ff9500'}} />
            <span style={{background:'#007aff'}} />
          </div>
        </div>
      )
    default:
      return null
  }
}

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

function DdayWidget() {
  const wedding = new Date(2026, 4, 25)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.ceil((wedding - today) / (1000 * 60 * 60 * 24))
  const dday = diff === 0 ? 'D-Day' : diff > 0 ? `D-${diff}` : `D+${Math.abs(diff)}`

  return (
    <div className="dday-widget">
      <div className="dday-left">
        <span className="dday-label">Wedding Day</span>
        <span className="dday-date">2026. 05. 25</span>
      </div>
      <div className="dday-count">{dday}</div>
    </div>
  )
}

function HomeScreen({ onAppClick, onSwitchV1 }) {
  return (
    <div className="home-screen">
      <StatusBar />
      <div className="home-content">
        <DdayWidget />
        <div className="app-grid">
          {APPS.map((app) => (
            <button key={app.id} className="app-icon-btn" onClick={() => onAppClick(app.id)}>
              <div className="app-icon" style={{ background: app.color }}>
                <AppIcon type={app.iconType} />
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

export default function V2Home({ unlocked, onUnlock, onSwitchV1, onAppClick }) {
  const callDone = useRef(!!sessionStorage.getItem('callDone'))
  const [callPhase, setCallPhase] = useState('none') // none → ringing → done

  useEffect(() => {
    if (unlocked && !callDone.current) {
      callDone.current = true
      sessionStorage.setItem('callDone', '1')
      const t = setTimeout(() => setCallPhase('ringing'), 1000)
      return () => clearTimeout(t)
    }
  }, [unlocked])

  const handleNotifTap = () => {
    onUnlock()
    callDone.current = true
    sessionStorage.setItem('callDone', '1')
    setTimeout(() => onAppClick('invite'), 100)
  }

  const handleCallEnd = () => {
    setCallPhase('done')
  }

  return (
    <div className="iphone-frame">
      <div className="iphone-body">
        {!unlocked ? (
          <LockScreen onUnlock={onUnlock} onNotifTap={handleNotifTap} />
        ) : callPhase === 'ringing' ? (
          <PhoneCall onEnd={handleCallEnd} />
        ) : (
          <HomeScreen onAppClick={onAppClick} onSwitchV1={onSwitchV1} />
        )}
      </div>
    </div>
  )
}
