import { useState } from 'react'
import styles from './Account.module.css'

interface AccountInfo {
  bank: string
  number: string
  holder: string
}

interface Props {
  groomName: string
  brideName: string
  groomAccounts: AccountInfo[]
  brideAccounts: AccountInfo[]
}

function AccountGroup({
  title,
  accounts,
}: {
  title: string
  accounts: AccountInfo[]
}) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(idx)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  return (
    <div className={styles.group}>
      <button className={styles.toggle} onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span className={`${styles.arrow} ${open ? styles.arrowUp : ''}`}>▼</span>
      </button>
      {open && (
        <div className={styles.accounts}>
          {accounts.map((acc, i) => (
            <div key={i} className={styles.accountItem}>
              <div className={styles.accountInfo}>
                <span className={styles.bank}>{acc.bank}</span>
                <span className={styles.number}>{acc.number}</span>
                <span className={styles.holder}>{acc.holder}</span>
              </div>
              <button
                className={styles.copyBtn}
                onClick={() => handleCopy(`${acc.bank} ${acc.number}`, i)}
              >
                {copied === i ? '복사 완료!' : '복사'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function Account({ groomName, brideName, groomAccounts, brideAccounts }: Props) {
  return (
    <section className={`section ${styles.account}`}>
      <p className="section-title">GIFT</p>
      <h2 className="section-heading">마음 전하실 곳</h2>
      <p className={styles.subtitle}>축하의 마음을 담아 축의금을 전달해 보세요.</p>
      <AccountGroup
        title={`신랑측 (${groomName})`}
        accounts={groomAccounts}
      />
      <AccountGroup
        title={`신부측 (${brideName})`}
        accounts={brideAccounts}
      />
    </section>
  )
}
