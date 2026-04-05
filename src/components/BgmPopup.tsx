import { useState, useRef, useEffect } from 'react'
import styles from './BgmPopup.module.css'

interface Props {
  src: string
}

export default function BgmPopup({ src }: Props) {
  const [showPopup, setShowPopup] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    audioRef.current = new Audio(src)
    audioRef.current.loop = true
    return () => {
      audioRef.current?.pause()
    }
  }, [src])

  const handleOn = () => {
    audioRef.current?.play()
    setIsPlaying(true)
    setShowPopup(false)
  }

  const handleOff = () => {
    setIsPlaying(false)
    setShowPopup(false)
  }

  const toggleBgm = () => {
    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      audioRef.current?.play()
      setIsPlaying(true)
    }
  }

  return (
    <>
      {showPopup && (
        <div className={styles.overlay}>
          <div className={styles.popup}>
            <div className={styles.icon}>♪</div>
            <p className={styles.text}>배경음악을 켤까요?</p>
            <div className={styles.buttons}>
              <button className={styles.btnOn} onClick={handleOn}>ON</button>
              <button className={styles.btnOff} onClick={handleOff}>OFF</button>
            </div>
          </div>
        </div>
      )}
      {!showPopup && (
        <button className={styles.toggle} onClick={toggleBgm}>
          {isPlaying ? '♪' : '♪'}
          <span className={isPlaying ? styles.playing : styles.muted}>
            {isPlaying ? '' : ''}
          </span>
          {!isPlaying && <span className={styles.slash}>/</span>}
        </button>
      )}
    </>
  )
}
