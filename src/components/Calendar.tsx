import { isKakaoInApp } from '../lib/kakaoInApp'
import styles from './Calendar.module.css'

interface Props {
  date: string
  time: string
  dayOfWeek: string
  venue: string
  hall: string
  address: string
  groomName: string
  brideName: string
}

export default function Calendar({ date, time, dayOfWeek, venue, hall, address, groomName, brideName }: Props) {
  const dateObj = new Date(date + 'T00:00:00')
  const year = dateObj.getFullYear()
  const month = dateObj.getMonth()
  const day = dateObj.getDate()

  const monthNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
  const dayNames = ['일', '월', '화', '수', '목', '금', '토']

  // Build calendar grid
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const weeks: (number | null)[][] = []
  let currentWeek: (number | null)[] = []

  for (let i = 0; i < firstDay; i++) {
    currentWeek.push(null)
  }
  for (let d = 1; d <= daysInMonth; d++) {
    currentWeek.push(d)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  }
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null)
    weeks.push(currentWeek)
  }

  const eventTitle = `💒 ${groomName} ♥ ${brideName} 결혼식`
  const eventLocation = `${venue}${hall ? ' ' + hall : ''} (${address})`

  // Google 캘린더: 2시간 이벤트
  const dtStartG = `${date.replace(/-/g, '')}T${time.replace(':', '')}00`
  const endHour = (parseInt(time.split(':')[0]) + 2).toString().padStart(2, '0')
  const dtEndG = `${date.replace(/-/g, '')}T${endHour}${time.split(':')[1]}00`
  const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventTitle)}&dates=${dtStartG}/${dtEndG}&location=${encodeURIComponent(eventLocation)}&details=${encodeURIComponent(`신랑: ${groomName}\n신부: ${brideName}\n\n장소: ${venue}\n주소: ${address}`)}`

  // 정적 .ics 파일 경로 (빌드 시 vite-plugin-ics가 생성)
  const icsUrl = import.meta.env.BASE_URL + 'wedding.ics'

  const handleAppleCal = () => {
    if (isKakaoInApp()) {
      // 카카오톡 인앱브라우저: 외부 브라우저로 .ics 파일 열기
      window.location.href =
        'kakaotalk://web/openExternal?url=' +
        encodeURIComponent(window.location.origin + icsUrl)
    } else {
      // 일반 브라우저: 직접 다운로드
      const a = document.createElement('a')
      a.href = icsUrl
      a.download = `💒 ${groomName} ♥ ${brideName} 결혼식.ics`
      a.click()
    }
  }

  return (
    <section className={`section ${styles.calendar}`}>
      <p className="section-title">CALENDAR</p>
      <h2 className="section-heading">
        {year}년 {monthNames[month]}월 {day}일 {dayOfWeek}
        <br />
        {time}
      </h2>
      <div className={styles.calendarGrid}>
        <div className={styles.header}>
          {dayNames.map((d, i) => (
            <span key={i} className={i === 0 ? styles.sunday : i === 6 ? styles.saturday : ''}>
              {d}
            </span>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className={styles.week}>
            {week.map((d, di) => (
              <span
                key={di}
                className={`${styles.day} ${d === day ? styles.today : ''} ${di === 0 ? styles.sunday : ''} ${di === 6 ? styles.saturday : ''}`}
              >
                {d || ''}
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className={styles.venueInfo}>
        <p className={styles.venueName}>{venue}</p>
        <p className={styles.hallName}>{hall}</p>
      </div>
      <div className={styles.addButtons}>
        <button onClick={handleAppleCal} className={styles.addBtn}>
          일정 저장 <span className={styles.icsLabel}>(.ics)</span>
        </button>
        <a
          href={googleCalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.addBtn}
          onClick={(e) => {
            if (isKakaoInApp()) {
              e.preventDefault()
              window.location.href =
                'kakaotalk://web/openExternal?url=' + encodeURIComponent(googleCalUrl)
            }
          }}
        >
          구글 캘린더
        </a>
      </div>
      <p className={styles.addHint}>일정 저장은 삼성 캘린더, Apple 캘린더 등 대부분의 캘린더 앱에서 열 수 있습니다.</p>
    </section>
  )
}
