import { useEffect, useState } from 'react'
import { isKakaoInApp } from '../lib/kakaoInApp'
import styles from './InAppBanner.module.css'

/**
 * 카카오톡 인앱브라우저 감지 시 자동으로 외부 브라우저로 리다이렉트.
 * 인앱브라우저에서는 .ics 다운로드, 네이버 지도, tmap 딥링크 등이 제한되므로
 * 외부 브라우저에서 여는 것이 가장 확실한 해결책.
 *
 * 자동 리다이렉트가 실패할 경우 수동 버튼을 표시한다.
 */
export default function InAppBanner() {
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    if (!isKakaoInApp()) return

    const currentUrl = window.location.href

    // 외부 브라우저로 자동 리다이렉트
    window.location.href =
      'kakaotalk://web/openExternal?url=' + encodeURIComponent(currentUrl)

    // 리다이렉트 실패 시 (scheme 미지원 등) 수동 버튼 표시
    const timer = setTimeout(() => setShowFallback(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!showFallback) return null

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
      <button className={styles.closeBtn} onClick={() => setShowFallback(false)}>
        ✕
      </button>
    </div>
  )
}
