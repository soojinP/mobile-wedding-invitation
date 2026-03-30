import { useState, useRef, useEffect } from 'react'
import './BgmPlayer.css'

export default function BgmPlayer() {
  const audioRef = useRef(null)
  const [playing, setPlaying] = useState(false)
  const [firstInteraction, setFirstInteraction] = useState(false)

  useEffect(() => {
    const handleInteraction = () => {
      if (!firstInteraction) {
        setFirstInteraction(true)
        if (audioRef.current) {
          audioRef.current.volume = 0.3
          audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
        }
      }
    }
    document.addEventListener('click', handleInteraction, { once: true })
    return () => document.removeEventListener('click', handleInteraction)
  }, [firstInteraction])

  const toggle = (e) => {
    e.stopPropagation()
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/bgm.mp3" loop preload="auto" />
      <button className={`bgm-btn ${playing ? 'playing' : ''}`} onClick={toggle}>
        {playing ? '♪' : '♪'}
      </button>
    </>
  )
}
