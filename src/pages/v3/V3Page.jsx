import { useState, useEffect, useRef, useCallback } from 'react'
import './V3Page.css'

const PHOTOS = Array.from({ length: 10 }, (_, i) => `/photos/photo${i + 1}.jpg`)

const GROOM_ACCOUNTS = [
  { name: '신랑 이창민', bank: 'OO은행', account: '000-0000-0000-00' },
  { name: '신랑 아버지 이OO', bank: 'OO은행', account: '000-0000-0000-00' },
  { name: '신랑 어머니 OOO', bank: 'OO은행', account: '000-0000-0000-00' },
]

const BRIDE_ACCOUNTS = [
  { name: '신부 박수진', bank: 'OO은행', account: '000-0000-0000-00' },
  { name: '신부 아버지 박OO', bank: 'OO은행', account: '000-0000-0000-00' },
  { name: '신부 어머니 OOO', bank: 'OO은행', account: '000-0000-0000-00' },
]

/* ─── Particle Canvas (petal + sparkle + ring) ─── */
function ParticleCanvas() {
  const canvasRef = useRef(null)
  const particles = useRef([])
  const raf = useRef(null)
  const mouse = useRef({ x: -1, y: -1 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let w, h

    const resize = () => {
      w = canvas.width = window.innerWidth
      h = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const onMove = (e) => {
      const cx = e.touches ? e.touches[0].clientX : e.clientX
      const cy = e.touches ? e.touches[0].clientY : e.clientY
      mouse.current = { x: cx, y: cy }
      // spawn burst particles on touch/move
      for (let i = 0; i < 3; i++) {
        particles.current.push({
          x: cx + (Math.random() - 0.5) * 30,
          y: cy + (Math.random() - 0.5) * 30,
          size: 2 + Math.random() * 4,
          speedY: -1 - Math.random() * 2,
          speedX: (Math.random() - 0.5) * 3,
          rotation: Math.random() * 360,
          rotSpeed: -2 + Math.random() * 4,
          opacity: 0.8 + Math.random() * 0.2,
          type: 'burst',
          hue: 30 + Math.random() * 30,
          life: 1,
          decay: 0.015 + Math.random() * 0.01,
        })
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: true })

    const createParticle = () => ({
      x: Math.random() * w,
      y: -20 - Math.random() * 100,
      size: 3 + Math.random() * 8,
      speedY: 0.4 + Math.random() * 1.0,
      speedX: -0.4 + Math.random() * 0.8,
      rotation: Math.random() * 360,
      rotSpeed: -1.5 + Math.random() * 3,
      opacity: 0.3 + Math.random() * 0.6,
      type: Math.random() > 0.6 ? 'sparkle' : Math.random() > 0.5 ? 'ring' : 'petal',
      hue: 330 + Math.random() * 40,
      life: 1,
      decay: 0,
    })

    for (let i = 0; i < 50; i++) {
      const p = createParticle()
      p.y = Math.random() * h
      particles.current.push(p)
    }

    const drawPetal = (p) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      ctx.globalAlpha = p.opacity * p.life
      ctx.fillStyle = `hsl(${p.hue}, 65%, 80%)`
      ctx.beginPath()
      // heart-like petal
      ctx.moveTo(0, -p.size * 0.3)
      ctx.bezierCurveTo(p.size * 0.5, -p.size, p.size, -p.size * 0.2, 0, p.size * 0.5)
      ctx.bezierCurveTo(-p.size, -p.size * 0.2, -p.size * 0.5, -p.size, 0, -p.size * 0.3)
      ctx.fill()
      ctx.restore()
    }

    const drawSparkle = (p) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.rotate((p.rotation * Math.PI) / 180)
      const flicker = 0.4 + 0.6 * Math.sin(Date.now() * 0.008 + p.x + p.y)
      ctx.globalAlpha = p.opacity * flicker * p.life
      const s = p.size * 0.5
      // 4-point star
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, s)
      gradient.addColorStop(0, '#fff')
      gradient.addColorStop(0.3, '#ffe4c9')
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.moveTo(0, -s * 1.5)
      ctx.lineTo(s * 0.2, -s * 0.2)
      ctx.lineTo(s * 1.5, 0)
      ctx.lineTo(s * 0.2, s * 0.2)
      ctx.lineTo(0, s * 1.5)
      ctx.lineTo(-s * 0.2, s * 0.2)
      ctx.lineTo(-s * 1.5, 0)
      ctx.lineTo(-s * 0.2, -s * 0.2)
      ctx.closePath()
      ctx.fill()
      ctx.restore()
    }

    const drawRing = (p) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.globalAlpha = p.opacity * 0.4 * p.life
      ctx.strokeStyle = `hsl(${p.hue}, 50%, 75%)`
      ctx.lineWidth = 0.5
      ctx.beginPath()
      ctx.arc(0, 0, p.size, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }

    const drawBurst = (p) => {
      ctx.save()
      ctx.translate(p.x, p.y)
      ctx.globalAlpha = p.opacity * p.life
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, p.size)
      gradient.addColorStop(0, `hsla(${p.hue}, 80%, 75%, 1)`)
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(0, 0, p.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, w, h)
      const alive = []
      particles.current.forEach((p) => {
        p.y += p.speedY
        p.x += p.speedX + Math.sin(p.y * 0.008 + p.rotation) * 0.5
        p.rotation += p.rotSpeed
        if (p.decay > 0) {
          p.life -= p.decay
          p.speedY -= 0.02 // float up
          if (p.life <= 0) return
        }
        if (p.y > h + 30 && p.decay === 0) {
          Object.assign(p, createParticle())
        }
        if (p.type === 'sparkle') drawSparkle(p)
        else if (p.type === 'ring') drawRing(p)
        else if (p.type === 'burst') drawBurst(p)
        else drawPetal(p)
        alive.push(p)
      })
      particles.current = alive
      raf.current = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="v3-particle-canvas" />
}

/* ─── Scroll Progress Bar ─── */
function ScrollProgress() {
  const ref = useRef(null)
  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      if (ref.current) ref.current.style.transform = `scaleX(${progress})`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return <div className="v3-scroll-progress"><div ref={ref} className="v3-scroll-bar" /></div>
}

/* ─── 3D Tilt Photo Card ─── */
function TiltCard({ src, index }) {
  const cardRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const handleMove = useCallback((clientX, clientY) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (clientX - rect.left) / rect.width - 0.5
    const y = (clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(600px) rotateY(${x * 20}deg) rotateX(${-y * 20}deg) scale3d(1.05, 1.05, 1.05)`
    const shine = el.querySelector('.v3-card-shine')
    if (shine) {
      shine.style.background = `radial-gradient(circle at ${(x + 0.5) * 100}% ${(y + 0.5) * 100}%, rgba(255,255,255,0.35) 0%, transparent 50%)`
    }
  }, [])

  const handleLeave = useCallback(() => {
    const el = cardRef.current
    if (!el) return
    el.style.transform = ''
    const shine = el.querySelector('.v3-card-shine')
    if (shine) shine.style.background = 'transparent'
  }, [])

  const onMouseMove = (e) => handleMove(e.clientX, e.clientY)
  const onTouchMove = (e) => handleMove(e.touches[0].clientX, e.touches[0].clientY)

  const directions = ['from-left', 'from-right', 'from-bottom', 'from-top']
  const dir = directions[index % 4]

  return (
    <div
      ref={cardRef}
      className={`v3-tilt-card ${dir} ${visible ? 'v3-card-visible' : ''}`}
      style={{ transitionDelay: `${index * 0.15}s` }}
      onMouseMove={onMouseMove}
      onMouseLeave={handleLeave}
      onTouchMove={onTouchMove}
      onTouchEnd={handleLeave}
    >
      <div className="v3-card-shine" />
      <img src={src} alt={`photo ${index + 1}`} loading="lazy" />
      <div className="v3-card-border" />
    </div>
  )
}

/* ─── Cinematic Photo Strip (auto-scroll + touch) ─── */
function PhotoStrip({ photos, onSelect }) {
  const stripRef = useRef(null)
  const trackRef = useRef(null)

  useEffect(() => {
    const el = stripRef.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const progress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight))
      el.style.setProperty('--scroll', progress)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={stripRef} className="v3-photo-strip">
      <div ref={trackRef} className="v3-strip-track">
        {[...photos, ...photos].map((src, i) => (
          <div key={i} className="v3-strip-item" onClick={() => onSelect(i % photos.length)}>
            <img src={src} alt={`strip ${(i % photos.length) + 1}`} loading="lazy" />
            <div className="v3-strip-glow" />
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Full-screen Photo Reveal ─── */
function PhotoReveal({ src, direction = 'left' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.2 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`v3-photo-reveal ${direction} ${visible ? 'revealed' : ''}`}>
      <div className="v3-reveal-mask" />
      <img src={src} alt="feature" loading="lazy" />
    </div>
  )
}

/* ─── Parallax Section ─── */
function ParallaxPhoto({ src, children }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const offset = (rect.top / window.innerHeight) * 50
      el.style.setProperty('--prlx', `${offset}px`)
      const scale = 1 + Math.max(0, 1 - rect.top / window.innerHeight) * 0.1
      el.style.setProperty('--prlx-scale', scale)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div ref={ref} className="v3-parallax-photo">
      <div className="v3-parallax-img" style={{ backgroundImage: `url(${src})` }} />
      <div className="v3-parallax-overlay" />
      <div className="v3-parallax-content">{children}</div>
    </div>
  )
}

/* ─── Fade Section with stagger ─── */
function FadeSection({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`v3-fade ${visible ? 'v3-visible' : ''} ${className}`} style={{ transitionDelay: `${delay}s` }}>
      {children}
    </div>
  )
}

/* ─── Animated D-Day Counter ─── */
function DdayCounter() {
  const wedding = new Date(2026, 4, 25)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const diff = Math.ceil((wedding - today) / (1000 * 60 * 60 * 24))
  const [count, setCount] = useState(0)

  useEffect(() => {
    const target = diff > 0 ? diff : Math.abs(diff)
    if (target === 0) { setCount(0); return }
    let frame = 0
    const totalFrames = 60
    const tick = () => {
      frame++
      const progress = 1 - Math.pow(1 - frame / totalFrames, 3)
      setCount(Math.round(target * progress))
      if (frame < totalFrames) requestAnimationFrame(tick)
    }
    const timer = setTimeout(tick, 1800)
    return () => clearTimeout(timer)
  }, [diff])

  if (diff === 0) return <span className="v3-dday">D-Day</span>
  if (diff > 0) return <span className="v3-dday">D-{count}</span>
  return <span className="v3-dday">D+{count}</span>
}

/* ─── Calendar ─── */
function Calendar() {
  const DAYS = ['일', '월', '화', '수', '목', '금', '토']
  const MAY_START = 5
  const blanks = Array(MAY_START).fill(null)
  const days = Array.from({ length: 31 }, (_, i) => i + 1)
  const cells = [...blanks, ...days]
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={`v3-calendar ${visible ? 'v3-cal-visible' : ''}`}>
      <div className="v3-cal-title">2026. 05</div>
      <div className="v3-cal-grid">
        {DAYS.map((d, i) => (
          <div key={d} className={`v3-cal-weekday ${i === 0 ? 'sun' : i === 6 ? 'sat' : ''}`}>{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={`b${i}`} className="v3-cal-cell" />
          const isWedding = day === 25
          const isSun = (MAY_START + day - 1) % 7 === 0
          const isSat = (MAY_START + day - 1) % 7 === 6
          const cellDelay = visible ? (i * 0.02) : 0
          return (
            <div
              key={day}
              className={`v3-cal-cell ${isWedding ? 'wedding' : ''} ${isSun ? 'sun' : ''} ${isSat ? 'sat' : ''} ${visible ? 'pop' : ''}`}
              style={{ animationDelay: `${cellDelay}s` }}
            >
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ─── Account Section ─── */
function AccountSection({ title, accounts }) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(null)

  const copy = async (account, idx) => {
    try {
      await navigator.clipboard.writeText(account)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = account
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(idx)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="v3-account-group">
      <button className="v3-account-toggle" onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span className={`v3-chevron ${open ? 'open' : ''}`}>&#8250;</span>
      </button>
      {open && (
        <div className="v3-account-list">
          {accounts.map((a, i) => (
            <div key={i} className="v3-account-row" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="v3-account-info">
                <span className="v3-account-name">{a.name}</span>
                <span className="v3-account-num">{a.bank} {a.account}</span>
              </div>
              <button className="v3-copy-btn" onClick={() => copy(a.account, i)}>
                {copied === i ? '복사됨' : '복사'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Lightbox ─── */
function Lightbox({ photos, selected, onClose }) {
  const [current, setCurrent] = useState(selected)
  const startX = useRef(null)

  useEffect(() => { setCurrent(selected) }, [selected])

  if (selected === null) return null

  const prev = () => setCurrent((c) => (c - 1 + photos.length) % photos.length)
  const next = () => setCurrent((c) => (c + 1) % photos.length)

  const onTouchStart = (e) => { startX.current = e.touches[0].clientX }
  const onTouchEnd = (e) => {
    if (startX.current === null) return
    const diff = startX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 50) {
      if (diff > 0) next()
      else prev()
    }
    startX.current = null
  }

  return (
    <div className="v3-lightbox" onClick={onClose} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className="v3-lightbox-inner" onClick={(e) => e.stopPropagation()}>
        <img src={photos[current]} alt="enlarged" key={current} />
        <div className="v3-lightbox-counter">{current + 1} / {photos.length}</div>
      </div>
      <button className="v3-lightbox-close" onClick={onClose}>&#10005;</button>
      <button className="v3-lightbox-arrow left" onClick={(e) => { e.stopPropagation(); prev() }}>&#8249;</button>
      <button className="v3-lightbox-arrow right" onClick={(e) => { e.stopPropagation(); next() }}>&#8250;</button>
    </div>
  )
}

/* ═══════════════════════════════════════════
   MAIN V3 PAGE
   ═══════════════════════════════════════════ */
export default function V3Page({ onSwitchV2 }) {
  const [lightbox, setLightbox] = useState(null)
  const heroRef = useRef(null)

  useEffect(() => {
    const onScroll = () => {
      if (!heroRef.current) return
      const y = window.scrollY
      heroRef.current.style.setProperty('--hero-scroll', `${y * 0.5}px`)
      heroRef.current.style.setProperty('--hero-opacity', `${Math.max(0, 1 - y / 500)}`)
      heroRef.current.style.setProperty('--hero-scale', `${1 + y * 0.0003}`)
      heroRef.current.style.setProperty('--hero-blur', `${Math.min(8, y * 0.01)}px`)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="v3-page">
      <ParticleCanvas />
      <ScrollProgress />

      {/* ── HERO ── */}
      <section ref={heroRef} className="v3-hero">
        <div className="v3-hero-bg" style={{ backgroundImage: `url(${PHOTOS[0]})` }} />
        <div className="v3-hero-overlay" />
        <div className="v3-hero-vignette" />
        <div className="v3-hero-content">
          <p className="v3-hero-label anim-fade-down">W E D D I N G&nbsp;&nbsp;I N V I T A T I O N</p>
          <div className="v3-hero-line anim-scale-x" />
          <h1 className="v3-hero-names anim-fade-up">
            <span className="v3-name-groom">창민</span>
            <span className="v3-amp-circle">
              <svg viewBox="0 0 40 40" className="v3-ring-svg">
                <circle cx="20" cy="20" r="18" />
              </svg>
              <svg viewBox="0 0 40 40" className="v3-ring-svg ring2">
                <circle cx="20" cy="20" r="14" />
              </svg>
              &amp;
            </span>
            <span className="v3-name-bride">수진</span>
          </h1>
          <div className="v3-hero-line anim-scale-x" style={{ animationDelay: '0.7s' }} />
          <p className="v3-hero-date anim-fade-up-delay">2026. 05. 25 MON PM 1:00</p>
          <p className="v3-hero-venue anim-fade-up-delay2">연세대학교 동문회관</p>
          <DdayCounter />
        </div>
        <div className="v3-scroll-hint">
          <div className="v3-scroll-mouse">
            <div className="v3-scroll-dot" />
          </div>
          <span className="v3-scroll-text">SCROLL</span>
        </div>
      </section>

      {/* ── WAVE DIVIDER ── */}
      <div className="v3-wave-divider">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,60 C200,120 400,0 600,60 C800,120 1000,0 1200,60 L1200,120 L0,120 Z" />
        </svg>
      </div>

      {/* ── GREETING ── */}
      <FadeSection>
        <section className="v3-section v3-greeting-section">
          <div className="v3-ornament-line">
            <span /><span className="v3-ornament-diamond" /><span />
          </div>
          <h2 className="v3-section-title v3-shimmer">초대합니다</h2>
          <p className="v3-greeting">
            서로 다른 길을 걸어온 두 사람이<br />
            같은 곳을 바라보며 함께 걸어가려 합니다.<br /><br />
            바쁘시더라도 귀한 걸음 하시어<br />
            따뜻한 축복으로 자리를 빛내주시면<br />
            더없는 기쁨이겠습니다.
          </p>
          <div className="v3-parents">
            <div className="v3-parent-row">
              <span className="v3-parent-names">이OO · OOO</span>
              <span className="v3-parent-relation">의 장남 <strong>창민</strong></span>
            </div>
            <div className="v3-parent-row">
              <span className="v3-parent-names">박OO · OOO</span>
              <span className="v3-parent-relation">의 차녀 <strong>수진</strong></span>
            </div>
          </div>
          <div className="v3-ornament-line">
            <span /><span className="v3-ornament-diamond" /><span />
          </div>
        </section>
      </FadeSection>

      {/* ── PHOTO SHOWCASE ── */}

      {/* Full reveal photo */}
      <PhotoReveal src={PHOTOS[1]} direction="left" />

      {/* 3D Tilt Grid */}
      <FadeSection>
        <section className="v3-section">
          <h2 className="v3-section-title v3-shimmer">우리의 순간들</h2>
          <div className="v3-tilt-grid">
            {PHOTOS.slice(1, 5).map((src, i) => (
              <div key={i} onClick={() => setLightbox(i + 1)}>
                <TiltCard src={src} index={i} />
              </div>
            ))}
          </div>
        </section>
      </FadeSection>

      {/* Horizontal scroll strip */}
      <div className="v3-strip-section">
        <div className="v3-strip-glow-bg" />
        <PhotoStrip photos={PHOTOS} onSelect={setLightbox} />
      </div>

      {/* Parallax cinematic */}
      <ParallaxPhoto src={PHOTOS[5]}>
        <p className="v3-parallax-text">
          <span className="v3-text-line anim-text-reveal">Forever</span>
          <span className="v3-text-amp">&</span>
          <span className="v3-text-line anim-text-reveal" style={{ animationDelay: '0.5s' }}>Always</span>
        </p>
      </ParallaxPhoto>

      {/* Second reveal photo */}
      <PhotoReveal src={PHOTOS[6]} direction="right" />

      {/* More 3D cards in masonry */}
      <FadeSection>
        <section className="v3-section">
          <div className="v3-masonry">
            {PHOTOS.slice(6, 10).map((src, i) => (
              <div key={i} className={`v3-masonry-item item-${i}`} onClick={() => setLightbox(i + 6)}>
                <TiltCard src={src} index={i} />
              </div>
            ))}
          </div>
        </section>
      </FadeSection>

      {/* ── CALENDAR ── */}
      <FadeSection>
        <section className="v3-section">
          <h2 className="v3-section-title v3-shimmer">날짜</h2>
          <Calendar />
          <div className="v3-info-box">
            <div className="v3-info-row">
              <span className="v3-info-icon">&#128197;</span>
              <span>2026년 5월 25일 월요일, 오후 1시</span>
            </div>
            <div className="v3-info-row">
              <span className="v3-info-icon">&#127970;</span>
              <span>연세대학교 동문회관</span>
            </div>
            <div className="v3-info-badge">대체공휴일이라 쉬는 날이에요!</div>
          </div>
        </section>
      </FadeSection>

      {/* ── LOCATION ── */}
      <FadeSection>
        <section className="v3-section">
          <h2 className="v3-section-title v3-shimmer">오시는 길</h2>
          <div className="v3-venue-card">
            <p className="v3-venue-name">연세대학교 동문회관</p>
            <p className="v3-venue-addr">서울특별시 서대문구 연세로 50</p>
            <div className="v3-venue-links">
              <a href="https://map.naver.com/v5/search/연세대학교%20동문회관" target="_blank" rel="noreferrer" className="v3-map-btn naver">네이버 지도</a>
              <a href="https://map.kakao.com/link/search/연세대학교%20동문회관" target="_blank" rel="noreferrer" className="v3-map-btn kakao">카카오맵</a>
            </div>
          </div>
          <div className="v3-transport">
            <div className="v3-transport-item">
              <span className="v3-transport-label">지하철</span>
              <p>2호선 신촌역 3번 출구 도보 15분</p>
              <p>경의중앙선 신촌역 1번 출구 도보 10분</p>
            </div>
            <div className="v3-transport-item">
              <span className="v3-transport-label">버스</span>
              <p>연세대학교 정문 하차 / 153, 173, 272, 470, 710</p>
            </div>
            <div className="v3-transport-item">
              <span className="v3-transport-label">셔틀</span>
              <p>이대역 3번 출구 앞 &#8596; 동문회관</p>
              <p>이대역 &#8594; 동문회관: 12:20 / 12:40</p>
              <p>동문회관 &#8594; 이대역: 14:10 / 14:30</p>
            </div>
            <div className="v3-transport-item">
              <span className="v3-transport-label">주차</span>
              <p>동문회관 주차장 2시간 무료 (동문회관 경유 출차 시)</p>
            </div>
          </div>
        </section>
      </FadeSection>

      {/* ── GIFT ── */}
      <FadeSection>
        <section className="v3-section">
          <h2 className="v3-section-title v3-shimmer">마음 전하실 곳</h2>
          <p className="v3-gift-desc">축하의 마음을 전해주세요</p>
          <AccountSection title="신랑측 계좌번호" accounts={GROOM_ACCOUNTS} />
          <AccountSection title="신부측 계좌번호" accounts={BRIDE_ACCOUNTS} />
        </section>
      </FadeSection>

      {/* ── FOOTER ── */}
      <footer className="v3-footer">
        <div className="v3-footer-rings">
          <svg viewBox="0 0 80 40" className="v3-footer-ring-svg">
            <circle cx="30" cy="20" r="16" />
            <circle cx="50" cy="20" r="16" />
          </svg>
        </div>
        <p className="v3-footer-names">창민 &amp; 수진</p>
        <p className="v3-footer-date">2026. 05. 25</p>
        <button className="v3-switch-btn" onClick={onSwitchV2}>다른 버전으로 보기</button>
        <p className="v3-watermark">@podonuna</p>
      </footer>

      {/* Lightbox */}
      <Lightbox photos={PHOTOS} selected={lightbox} onClose={() => setLightbox(null)} />
    </div>
  )
}
