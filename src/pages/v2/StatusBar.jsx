import { useState, useEffect } from 'react'

export default function StatusBar() {
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
