import { useState, useEffect } from 'react'
import { collection, addDoc, query, orderBy, onSnapshot, Timestamp } from 'firebase/firestore'
import { db } from '../lib/firebase'
import styles from './Guestbook.module.css'

interface Message {
  id: string
  name: string
  text: string
  createdAt: string
}

export default function Guestbook() {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [text, setText] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

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

  const handleSubmit = async () => {
    if (!name.trim() || !text.trim() || !password.trim()) return
    setLoading(true)

    try {
      await addDoc(collection(db, 'guestbook'), {
        name: name.trim(),
        text: text.trim(),
        password: password.trim(),
        createdAt: Timestamp.now(),
      })
      setName('')
      setPassword('')
      setText('')
    } catch (err) {
      console.error('방명록 저장 실패:', err)
      alert('저장에 실패했습니다. 잠시 후 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={`section ${styles.guestbook}`}>
      <p className="section-title">GUESTBOOK</p>
      <h2 className="section-heading">축하 메시지</h2>

      <div className={styles.form}>
        <div className={styles.formRow}>
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 20))}
            maxLength={20}
            className={styles.input}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value.slice(0, 20))}
            maxLength={20}
            className={styles.input}
          />
        </div>
        <textarea
          placeholder="축하 메시지를 남겨주세요"
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 400))}
          maxLength={400}
          className={styles.textarea}
          rows={3}
        />
        <button
          className={styles.submitBtn}
          onClick={handleSubmit}
          disabled={!name.trim() || !text.trim() || !password.trim() || loading}
        >
          {loading ? '작성 중...' : '등록'}
        </button>
      </div>

      <div className={styles.messages}>
        {messages.length === 0 && (
          <p className={styles.empty}>아직 메시지가 없습니다. 첫 번째 축하 메시지를 남겨주세요!</p>
        )}
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
