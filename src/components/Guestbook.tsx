import { useState, useEffect } from 'react'
import { collection, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import styles from './Guestbook.module.css'

interface Message {
  id: string
  name: string
  text: string
  createdAt: string
}

// 결혼식 종료(2026-06-20) — 방명록 작성 마감. 남겨주신 메시지는 계속 열람 가능.
export default function Guestbook() {
  const [messages, setMessages] = useState<Message[]>([])

  useEffect(() => {
    const q = query(collection(db, 'guestbook'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => {
        const data = doc.data()
        const ts = data.createdAt as Timestamp
        return {
          id: doc.id,
          name: data.name,
          text: data.text,
          createdAt: ts ? ts.toDate().toISOString().split('T')[0] : '',
        }
      })
      setMessages(msgs)
    })
    return () => unsubscribe()
  }, [])

  return (
    <section className={`section ${styles.guestbook}`}>
      <p className="section-title">GUESTBOOK</p>
      <h2 className="section-heading">축하 메시지</h2>

      <p className={styles.closedNotice}>
        남겨주신 따뜻한 축하 메시지, 진심으로 감사드립니다 ♥
      </p>

      <div className={styles.messages}>
        {messages.map((msg) => (
          <div key={msg.id} className={styles.message}>
            <div className={styles.msgHeader}>
              <span className={styles.msgName}>{msg.name}</span>
              <span className={styles.msgDate}>{msg.createdAt}</span>
            </div>
            <p className={styles.msgText}>{msg.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
