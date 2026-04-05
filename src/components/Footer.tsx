import { useEffect, useRef } from 'react'
import JSConfetti from 'js-confetti'
import styles from './Footer.module.css'

interface Props {
  groomName: string
  brideName: string
}

export default function Footer({ groomName, brideName }: Props) {
  const confettiRef = useRef<JSConfetti | null>(null)
  const hasPlayed = useRef(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    confettiRef.current = new JSConfetti()

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasPlayed.current) {
          hasPlayed.current = true
          confettiRef.current?.addConfetti({
            emojis: ['🎉', '💐', '💍', '🥂', '❤️'],
            emojiSize: 30,
            confettiNumber: 40,
          })
        }
      },
      { threshold: 0.5 }
    )

    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <footer ref={sectionRef} className={styles.footer}>
      <p className={styles.names}>{groomName} & {brideName}</p>
      <p className={styles.copyright}>Thank you for celebrating with us</p>
    </footer>
  )
}
