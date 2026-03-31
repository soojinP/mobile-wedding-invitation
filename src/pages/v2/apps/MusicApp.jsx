import { useState, useRef } from 'react'
import './MusicApp.css'

export default function MusicApp() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.volume = 0.3
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return (
    <div>
      <audio ref={audioRef} src="/bgm.mp3" loop preload="auto" />
      <div className="ios-music-card">
        <div className="ios-music-art">
          <span>🎵</span>
        </div>
        <div className="ios-music-info">
          <p className="ios-music-title">Welcome to Our Show</p>
          <p className="ios-music-artist">O P Baron</p>
        </div>
        <div className="ios-music-controls">
          <button className="ios-music-btn" onClick={toggle}>
            {playing ? '⏸' : '▶️'}
          </button>
        </div>
        <p className="ios-music-note">
          {playing ? '재생 중...' : '재생 버튼을 눌러주세요'}
        </p>
      </div>
    </div>
  )
}
