import styles from './Rsvp.module.css'

// 결혼식 종료(2026-06-20) — 참석 의사 접수 마감, 감사 메시지로 대체
export default function Rsvp() {
  return (
    <section className={`section ${styles.rsvp}`}>
      <p className="section-title">THANK YOU</p>
      <h2 className="section-heading">감사합니다</h2>

      <div className={styles.success}>
        <p className={styles.successIcon}>♥</p>
        <p className={styles.successText}>
          귀한 걸음으로 축복해 주신
          <br />
          모든 분들께 진심으로 감사드립니다.
        </p>
        <p className={styles.successSub}>두 사람, 예쁘게 잘 살겠습니다.</p>
      </div>
    </section>
  )
}
