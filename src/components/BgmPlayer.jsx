import { useState, useEffect, useRef } from 'react'
import './BgmPlayer.css'

// Singleton audios per track
const audios = {}
function getAudio(src) {
  if (!audios[src]) {
    audios[src] = new Audio(src)
    audios[src].loop = true
    audios[src].volume = 0.3
  }
  return audios[src]
}

function stopAll(except) {
  Object.values(audios).forEach(a => {
    if (a !== except && !a.paused) a.pause()
  })
}

export default function BgmPlayer({ src = '/bgm.mp3' }) {
  const [playing, setPlaying] = useState(() => {
    const a = getAudio(src)
    return !a.paused
  })
  const currentSrc = useRef(src)

  // Switch track when src changes
  useEffect(() => {
    if (currentSrc.current !== src) {
      const oldA = getAudio(currentSrc.current)
      const wasPlaying = !oldA.paused
      oldA.pause()
      currentSrc.current = src
      if (wasPlaying) {
        const newA = getAudio(src)
        newA.play().then(() => setPlaying(true)).catch(() => {})
      }
    }
  }, [src])

  useEffect(() => {
    const a = getAudio(src)

    const handleInteraction = () => {
      if (a.paused) {
        stopAll(a)
        a.play().then(() => setPlaying(true)).catch(() => {})
      }
    }
    document.addEventListener('click', handleInteraction, { once: true })

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    a.addEventListener('play', onPlay)
    a.addEventListener('pause', onPause)

    return () => {
      document.removeEventListener('click', handleInteraction)
      a.removeEventListener('play', onPlay)
      a.removeEventListener('pause', onPause)
    }
  }, [src])

  const toggle = (e) => {
    e.stopPropagation()
    const a = getAudio(src)
    if (playing) {
      a.pause()
    } else {
      stopAll(a)
      a.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return (
    <button className={`bgm-btn ${playing ? 'playing' : ''}`} onClick={toggle}>
      {'♪'}
    </button>
  )
}
