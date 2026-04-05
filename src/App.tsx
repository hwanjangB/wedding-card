import { useEffect } from 'react'
import data from './data.json'
import useFadeIn from './hooks/useFadeIn'
import Hero from './components/Hero'
import Greeting from './components/Greeting'
import Calendar from './components/Calendar'
import Gallery from './components/Gallery'
import Location from './components/Location'
import Contact from './components/Contact'
import Account from './components/Account'
import Rsvp from './components/Rsvp'
import Guestbook from './components/Guestbook'
import Share from './components/Share'
import Footer from './components/Footer'

// public/ 폴더 이미지 경로에 base URL prefix 추가
const base = import.meta.env.BASE_URL
const assetUrl = (path: string) => base + path.replace(/^\//, '')

export default function App() {
  useFadeIn()

  useEffect(() => {
    const t = data.theme
    const root = document.documentElement
    root.style.setProperty('--color-primary', t.primary)
    root.style.setProperty('--color-primary-light', t.primaryLight)
    root.style.setProperty('--color-primary-dark', t.primaryDark)
    root.style.setProperty('--color-bg', t.bg)
    root.style.setProperty('--color-bg-section', t.bgSection)
    root.style.setProperty('--color-text', t.text)
    root.style.setProperty('--color-text-light', t.textLight)
    root.style.setProperty('--color-border', t.border)
    root.style.setProperty('--color-accent', t.accent)
    root.style.setProperty('--font-serif', `'${t.font}', 'Noto Serif KR', serif`)

    // 카카오 SDK 초기화
    const kakaoKey = import.meta.env.VITE_KAKAO_JS_KEY
    if (kakaoKey && window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init(kakaoKey)
    }

    // Google Fonts에서 지정한 폰트 로드
    const link = document.createElement('link')
    link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(t.font)}:wght@300;400;500;700&display=swap`
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }, [])

  return (
    <>
      <Hero
        groomName={data.groom.name}
        brideName={data.bride.name}
        date={data.wedding.date}
        time={data.wedding.time}
        dayOfWeek={data.wedding.dayOfWeek}
        venue={data.wedding.venue}
        mainImage={assetUrl(data.mainImage)}
      />

      <div className="fade-in">
        <Greeting
          title={data.greeting.title}
          message={data.greeting.message}
          groom={data.groom}
          bride={data.bride}
        />
      </div>

      <div className="fade-in">
        <Calendar
          date={data.wedding.date}
          time={data.wedding.time}
          dayOfWeek={data.wedding.dayOfWeek}
          venue={data.wedding.venue}
          hall={data.wedding.hall}
          address={data.wedding.address}
          groomName={data.groom.name}
          brideName={data.bride.name}
        />
      </div>

      <div className="fade-in">
        <Gallery images={data.gallery.map(assetUrl)} />
      </div>

      <div className="fade-in">
        <Location
          venue={data.wedding.venue}
          hall={data.wedding.hall}
          address={data.wedding.address}
          lat={data.wedding.lat}
          lng={data.wedding.lng}
          parking={data.wedding.parking}
          transport={data.wedding.transport}
          bus={data.wedding.bus}
          phone={data.wedding.phone}
          naverPlaceId={data.wedding.naverPlaceId}
          kakaoPlaceId={data.wedding.kakaoPlaceId}
          mapImage={data.wedding.mapImage ? assetUrl(data.wedding.mapImage) : undefined}
        />
      </div>

      <div className="fade-in">
        <Contact groom={data.groom} bride={data.bride} />
      </div>

      <div className="fade-in">
        <Account
          groomName={data.groom.name}
          brideName={data.bride.name}
          groomAccounts={data.groom.accounts}
          brideAccounts={data.bride.accounts}
        />
      </div>

      <div className="fade-in">
        <Rsvp />
      </div>

      <div className="fade-in">
        <Guestbook />
      </div>

      <div className="fade-in">
        <Share
          title={data.meta.title}
          description={data.meta.description}
          ogImage={data.meta.ogImage}
        />
      </div>

      <Footer groomName={data.groom.name} brideName={data.bride.name} />
    </>
  )
}
