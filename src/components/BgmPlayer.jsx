import { useState, useEffect } from 'react'
import './BgmPlayer.css'

// Singleton audio - survives re-mounts
let audio = null
function getAudio() {
  if (!audio) {
    audio = new Audio('/bgm.mp3')
    audio.loop = true
    audio.volume = 0.3
  }
  return audio
}

export default function BgmPlayer() {
  const [playing, setPlaying] = useState(() => {
    const a = getAudio()
    return !a.paused
  })

  useEffect(() => {
    const a = getAudio()

    const handleInteraction = () => {
      if (a.paused) {
        a.play().then(() => setPlaying(true)).catch(() => {})
      }
    }
    document.addEventListener('click', handleInteraction, { once: true })

    // Sync state if audio is already playing from a previous mount
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    a.addEventListener('play', onPlay)
    a.addEventListener('pause', onPause)

    return () => {
      document.removeEventListener('click', handleInteraction)
      a.removeEventListener('play', onPlay)
      a.removeEventListener('pause', onPause)
    }
  }, [])

  const toggle = (e) => {
    e.stopPropagation()
    const a = getAudio()
    if (playing) {
      a.pause()
    } else {
      a.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return (
    <button className={`bgm-btn ${playing ? 'playing' : ''}`} onClick={toggle}>
      {'♪'}
    </button>
  )
}
