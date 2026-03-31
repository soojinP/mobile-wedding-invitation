import { useState } from 'react'
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
import ShuttleApp from './pages/v2/apps/ShuttleApp'
import GiftApp from './pages/v2/apps/GiftApp'
import MusicApp from './pages/v2/apps/MusicApp'
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
  compat: { title: '궁합', component: CompatApp, dark: false },
  name: { title: '이름궁합', component: NameApp, dark: true },
  gallery: { title: '사진', component: GalleryApp, dark: false },
  venue: { title: '오시는 길', component: VenueApp, dark: false },
  shuttle: { title: '셔틀버스', component: ShuttleApp, dark: false },
  gift: { title: '축의금', component: GiftApp, dark: false },
  music: { title: 'BGM', component: MusicApp, dark: false },
}

function App() {
  const [version, setVersion] = useState('v1')
  const [currentPage, setCurrentPage] = useState(0)
  const [v2App, setV2App] = useState(null)
  const [v2Unlocked, setV2Unlocked] = useState(false)

  const switchToV2 = () => {
    setVersion('v2')
    setV2App(null)
    window.scrollTo(0, 0)
  }

  const switchToV1 = () => {
    setVersion('v1')
    setCurrentPage(0)
    window.scrollTo(0, 0)
  }

  const goNext = () => {
    if (currentPage < V1_PAGES.length - 1) {
      setCurrentPage(currentPage + 1)
      window.scrollTo(0, 0)
    }
  }

  const goPrev = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
      window.scrollTo(0, 0)
    }
  }

  // V2 mode
  if (version === 'v2') {
    if (v2App && V2_APPS[v2App]) {
      const AppContent = V2_APPS[v2App].component
      return (
        <div className="app">
          <BgmPlayer />
          <V2AppShell title={V2_APPS[v2App].title} dark={V2_APPS[v2App].dark} onBack={() => setV2App(null)}>
            <AppContent />
          </V2AppShell>
        </div>
      )
    }
    return (
      <div className="app">
        <BgmPlayer />
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

  return (
    <div className="app">
      <BgmPlayer />
      <PageComponent onNext={goNext} onPrev={goPrev} onSwitchV2={switchToV2} />
      <Navigation
        current={currentPage}
        total={V1_PAGES.length}
        onNext={goNext}
        onPrev={goPrev}
        onGoTo={(i) => { setCurrentPage(i); window.scrollTo(0, 0) }}
      />
    </div>
  )
}

export default App
