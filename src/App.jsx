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
import './styles/global.css'

const PAGES = [
  { id: 'cover', component: Cover },
  { id: 'compat', component: Compatibility },
  { id: 'name', component: NameCompat },
  { id: 'gallery', component: Gallery },
  { id: 'info', component: WeddingInfo },
  { id: 'venue', component: VenueMap },
  { id: 'shuttle', component: Shuttle },
  { id: 'gift', component: GiftMoney },
]

function App() {
  const [currentPage, setCurrentPage] = useState(0)

  const goNext = () => {
    if (currentPage < PAGES.length - 1) {
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

  const PageComponent = PAGES[currentPage].component

  return (
    <div className="app">
      <BgmPlayer />
      <PageComponent onNext={goNext} onPrev={goPrev} />
      <Navigation
        current={currentPage}
        total={PAGES.length}
        onNext={goNext}
        onPrev={goPrev}
        onGoTo={(i) => { setCurrentPage(i); window.scrollTo(0, 0) }}
      />
    </div>
  )
}

export default App
