import { useEffect, useState } from 'react'
import styles from './Hero.module.css'

interface Props {
  groomName: string
  brideName: string
  date: string
  time: string
  dayOfWeek: string
  venue: string
  mainImage: string
}

function getDday(dateStr: string): number {
  const target = new Date(dateStr + 'T00:00:00')
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
}

export default function Hero({ groomName, brideName, date, time, dayOfWeek, venue, mainImage }: Props) {
  const [dday, setDday] = useState(getDday(date))

  useEffect(() => {
    const timer = setInterval(() => setDday(getDday(date)), 60000)
    return () => clearInterval(timer)
  }, [date])

  const dateObj = new Date(date + 'T00:00:00')
  const formattedDate = `${dateObj.getFullYear()}. ${dateObj.getMonth() + 1}. ${dateObj.getDate()}.`

  return (
    <section className={styles.hero}>
      <div className={styles.imageWrap}>
        <img src={mainImage} alt="웨딩 사진" className={styles.image} />
        <div className={styles.overlay} />
      </div>
      <div className={styles.content}>
        <p className={styles.names}>
          <span>{groomName}</span>
          <span className={styles.amp}>&</span>
          <span>{brideName}</span>
        </p>
        <div className={styles.info}>
          <p>{formattedDate} {dayOfWeek} {time}</p>
          <p>{venue}</p>
        </div>
        <div className={styles.dday}>
          {dday > 0 ? `D-${dday}` : dday === 0 ? 'D-Day' : `D+${Math.abs(dday)}`}
        </div>
        <div className={styles.scrollGuide}>
          <span className={styles.scrollArrow}>∨</span>
        </div>
      </div>
    </section>
  )
}
