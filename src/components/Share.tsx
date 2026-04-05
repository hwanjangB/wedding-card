import { useState } from 'react'
import styles from './Share.module.css'

interface Props {
  title: string
  description: string
  ogImage: string
}

export default function Share({ title, description, ogImage: _ogImage }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handleKakaoShare = () => {
    if (window.Kakao && window.Kakao.isInitialized()) {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title,
          description,
          imageUrl: window.location.origin + '/images/sample1.jpg',
          link: {
            mobileWebUrl: window.location.href,
            webUrl: window.location.href,
          },
        },
        buttons: [
          {
            title: '청첩장 보기',
            link: {
              mobileWebUrl: window.location.href,
              webUrl: window.location.href,
            },
          },
        ],
      })
    } else {
      alert('카카오톡 공유 기능을 사용하려면 카카오 API 키 설정이 필요합니다.')
    }
  }

  return (
    <section className={`section ${styles.share}`}>
      <p className="section-title">SHARE</p>
      <h2 className="section-heading">공유하기</h2>
      <div className={styles.buttons}>
        <button className={styles.kakaoBtn} onClick={handleKakaoShare}>
          <span className={styles.kakaoIcon}>💬</span>
          카카오톡 공유
        </button>
        <button className={styles.linkBtn} onClick={handleCopyLink}>
          <span className={styles.linkIcon}>🔗</span>
          {copied ? '복사 완료!' : '링크 복사'}
        </button>
      </div>
    </section>
  )
}
