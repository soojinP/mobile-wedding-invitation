import { useState, useRef, useCallback, useEffect } from 'react'
import Cover from './pages/Cover'
import Compatibility from './pages/Compatibility'
import NameCompat from './pages/NameCompat'
import Gallery from './pages/Gallery'
import WeddingInfo from './pages/WeddingInfo'
import VenueMap from './pages/VenueMap'
import Shuttle from './pages/Shuttle'
import GiftMoney from './pages/GiftMoney'
import Navigation from './components/Navigation'
import BgmPlayer from './components/BgmPlayer'
import V2Home from './pages/v2/V2Home'
import V2AppShell from './pages/v2/V2AppShell'
import InviteApp from './pages/v2/apps/InviteApp'
import CompatApp from './pages/v2/apps/CompatApp'
import NameApp from './pages/v2/apps/NameApp'
import GalleryApp from './pages/v2/apps/GalleryApp'
import VenueApp from './pages/v2/apps/VenueApp'
import GiftApp from './pages/v2/apps/GiftApp'
import FortuneApp from './pages/v2/apps/FortuneApp'
import CalendarApp from './pages/v2/apps/CalendarApp'
import GuestbookApp from './pages/v2/apps/GuestbookApp'
import CameraApp from './pages/v2/apps/CameraApp'
import './styles/global.css'

const V1_PAGES = [
  { id: 'cover', component: Cover },
  { id: 'compat', component: Compatibility },
  { id: 'name', component: NameCompat },
  { id: 'gallery', component: Gallery },
  { id: 'info', component: WeddingInfo },
  { id: 'venue', component: VenueMap },
  { id: 'shuttle', component: Shuttle },
  { id: 'gift', component: GiftMoney },
]

const V2_APPS = {
  invite: { title: '초대장', component: InviteApp, dark: false },
  calendar: { title: '캘린더', component: CalendarApp, dark: false },
  compat: { title: '궁합', component: CompatApp, dark: false },
  name: { title: '이름궁합', component: NameApp, dark: true },
  gallery: { title: '사진', component: GalleryApp, dark: false },
  camera: { title: '포토부스', component: CameraApp, dark: true },
  venue: { title: '오시는 길', component: VenueApp, dark: false },
  fortune: { title: '포춘쿠키', component: FortuneApp, dark: false },
  guestbook: { title: '방명록', component: GuestbookApp, dark: false },
  gift: { title: '축의금', component: GiftApp, dark: false },
}

function App() {
  useEffect(() => {
    const block = (e) => {
      if (e.target.tagName === 'IMG') e.preventDefault()
    }
    document.addEventListener('contextmenu', block)
    document.addEventListener('dragstart', block)
    return () => {
      document.removeEventListener('contextmenu', block)
      document.removeEventListener('dragstart', block)
    }
  }, [])

  const [version, setVersion] = useState('v2')
  const [currentPage, setCurrentPage] = useState(0)
  const [pageDir, setPageDir] = useState('next')
  const [animating, setAnimating] = useState(false)
  const [v2App, setV2App] = useState(null)
  const [v2Unlocked, setV2Unlocked] = useState(false)
  const touchStartX = useRef(null)

  const selectVersion = (v) => {
    setVersion(v)
    setV2App(null)
    setCurrentPage(0)
    window.scrollTo(0, 0)
  }

  const switchToV2 = () => selectVersion('v2')
  const switchToV1 = () => selectVersion('v1')
  const changePage = useCallback((newPage, dir) => {
    if (animating) return
    if (newPage < 0 || newPage >= V1_PAGES.length) return
    if (newPage === currentPage) return
    setPageDir(dir)
    setAnimating(true)
    setTimeout(() => {
      setCurrentPage(newPage)
      window.scrollTo(0, 0)
      setTimeout(() => setAnimating(false), 50)
    }, 300)
  }, [animating, currentPage])

  const goNext = () => changePage(currentPage + 1, 'next')
  const goPrev = () => changePage(currentPage - 1, 'prev')

  const handleTouchStart = (e) => { touchStartX.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return
    const diff = touchStartX.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 60) {
      if (diff > 0) goNext()
      else goPrev()
    }
    touchStartX.current = null
  }

  // V2 mode
  if (version === 'v2') {
    if (v2App && V2_APPS[v2App]) {
      const AppContent = V2_APPS[v2App].component
      return (
        <div className="app">
          <BgmPlayer src={version === 'v2' ? '/bgm2.mp3' : '/bgm.mp3'} />
          <V2AppShell title={V2_APPS[v2App].title} dark={V2_APPS[v2App].dark} onBack={() => setV2App(null)}>
            <AppContent />
          </V2AppShell>
        </div>
      )
    }
    return (
      <div className="app">
        <BgmPlayer src={version === 'v2' ? '/bgm2.mp3' : '/bgm.mp3'} />
        <V2Home
          unlocked={v2Unlocked}
          onUnlock={() => setV2Unlocked(true)}
          onSwitchV1={switchToV1}
          onAppClick={(id) => setV2App(id)}
        />
      </div>
    )
  }

  // V1 mode
  const PageComponent = V1_PAGES[currentPage].component
  const pageClass = animating
    ? `page-exit page-exit-${pageDir}`
    : 'page-enter'

  return (
    <div className="app newspaper" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <BgmPlayer src={version === 'v2' ? '/bgm2.mp3' : '/bgm.mp3'} />
      <div className="newspaper-header">
        <div className="newspaper-rule" />
        <h1 className="newspaper-title">The Wedding Times</h1>
        <p className="newspaper-date">2026년 5월 25일 월요일 | 제1호</p>
        <div className="newspaper-rule" />
      </div>
      <div key={currentPage} className={`page-transition ${pageClass}`}>
        <PageComponent onNext={goNext} onPrev={goPrev} onSwitchV2={switchToV2} />
      </div>
      <Navigation
        current={currentPage}
        total={V1_PAGES.length}
        onNext={goNext}
        onPrev={goPrev}
        onGoTo={(i) => changePage(i, i > currentPage ? 'next' : 'prev')}
      />
    </div>
  )
}

export default App
