import { useState } from 'react'
import { collection, addDoc, Timestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import styles from './Rsvp.module.css'

type RsvpStatus = 'attending' | 'not_attending' | 'undecided' | null

export default function Rsvp() {
  const [name, setName] = useState('')
  const [status, setStatus] = useState<RsvpStatus>(null)
  const [count, setCount] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim() || !status) return
    setLoading(true)

    try {
      await addDoc(collection(db, 'rsvp'), {
        name: name.trim(),
        status,
        count: status === 'attending' ? count : 0,
        createdAt: Timestamp.now(),
      })
      setSubmitted(true)
    } catch (err) {
      console.error('RSVP 저장 실패:', err)
      alert('전송에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <section className={`section ${styles.rsvp}`}>
        <p className="section-title">RSVP</p>
        <div className={styles.success}>
          <p className={styles.successIcon}>✓</p>
          <p className={styles.successText}>참석 의사가 전달되었습니다.</p>
          <p className={styles.successSub}>감사합니다, {name}님!</p>
        </div>
      </section>
    )
  }

  return (
    <section className={`section ${styles.rsvp}`}>
      <p className="section-title">RSVP</p>
      <h2 className="section-heading">참석 의사 전달</h2>

      <div className={styles.form}>
        <input
          type="text"
          placeholder="성함"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 20))}
          maxLength={20}
          className={styles.input}
        />

        <div className={styles.statusGroup}>
          {[
            { value: 'attending' as const, label: '참석' },
            { value: 'not_attending' as const, label: '불참' },
            { value: 'undecided' as const, label: '미정' },
          ].map((opt) => (
            <button
              key={opt.value}
              className={`${styles.statusBtn} ${status === opt.value ? styles.active : ''}`}
              onClick={() => setStatus(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {status === 'attending' && (
          <div className={styles.countGroup}>
            <label className={styles.countLabel}>참석 인원</label>
            <div className={styles.counter}>
              <button onClick={() => setCount(Math.max(1, count - 1))} className={styles.countBtn}>−</button>
              <span className={styles.countValue}>{count}</span>
              <button onClick={() => setCount(Math.min(10, count + 1))} className={styles.countBtn}>+</button>
            </div>
          </div>
        )}

        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={!name.trim() || !status || loading}
        >
          {loading ? '전송 중...' : '전달하기'}
        </button>
      </div>
    </section>
  )
}
