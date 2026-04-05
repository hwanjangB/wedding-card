import { useState } from 'react'
import styles from './Contact.module.css'

interface Person {
  name: string
  phone: string
  father: { name: string; phone: string }
  mother: { name: string; phone: string }
}

interface Props {
  groom: Person
  bride: Person
}

function ContactItem({ label, name, phone }: { label: string; name: string; phone: string }) {
  return (
    <div className={styles.item}>
      <span className={styles.label}>{label}</span>
      <span className={styles.name}>{name}</span>
      <div className={styles.actions}>
        <a href={`tel:${phone}`} className={styles.actionBtn} title="전화">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </a>
        <a href={`sms:${phone}`} className={styles.actionBtn} title="문자">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </a>
      </div>
    </div>
  )
}

function ContactGroup({ title, person, role }: { title: string; person: Person; role: string }) {
  const [showParents, setShowParents] = useState(false)

  return (
    <div className={styles.group}>
      <ContactItem label={role} name={person.name} phone={person.phone} />
      <button className={styles.parentToggle} onClick={() => setShowParents(!showParents)}>
        <span>{title} 혼주</span>
        <span className={`${styles.arrow} ${showParents ? styles.arrowUp : ''}`}>▼</span>
      </button>
      {showParents && (
        <div className={styles.parentList}>
          <ContactItem label="아버지" name={person.father.name} phone={person.father.phone} />
          <ContactItem label="어머니" name={person.mother.name} phone={person.mother.phone} />
        </div>
      )}
    </div>
  )
}

export default function Contact({ groom, bride }: Props) {
  return (
    <section className={`section ${styles.contact}`}>
      <p className="section-title">CONTACT</p>
      <h2 className="section-heading">연락하기</h2>

      <ContactGroup title="신랑측" person={groom} role="신랑" />
      <ContactGroup title="신부측" person={bride} role="신부" />
    </section>
  )
}
