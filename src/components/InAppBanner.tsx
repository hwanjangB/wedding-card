import { useState } from 'react'
import { isKakaoInApp } from '../lib/kakaoInApp'
import styles from './InAppBanner.module.css'

/**
 * 카카오톡 인앱브라우저 감지 시 외부 브라우저로 열기를 안내하는 배너.
 * 일정 저장, 길찾기 등 일부 기능이 인앱에서 제한되므로 안내한다.
 */
export default function InAppBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (!isKakaoInApp() || dismissed) return null

  const handleOpen = () => {
    window.location.href =
      'kakaotalk://web/openExternal?url=' +
      encodeURIComponent(window.location.href)
  }

  return (
    <div className={styles.banner}>
      <span className={styles.text}>
        일부 기능이 제한될 수 있어요
      </span>
      <button className={styles.openBtn} onClick={handleOpen}>
        브라우저로 열기
      </button>
      <button className={styles.closeBtn} onClick={() => setDismissed(true)}>
        ✕
      </button>
    </div>
  )
}
