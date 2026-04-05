import styles from './Greeting.module.css'

interface Parent {
  name: string
}

interface Person {
  name: string
  father: Parent
  mother: Parent
  fatherTitle: string
  motherTitle: string
}

interface Props {
  title: string
  message: string
  groom: Person
  bride: Person
}

export default function Greeting({ title, message, groom, bride }: Props) {
  return (
    <section className={`section ${styles.greeting}`}>
      <p className="section-title">INVITATION</p>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.divider}>❀</div>
      <p className={styles.message}>
        {message.split('\n').map((line, i) => (
          <span key={i}>
            {line}
            <br />
          </span>
        ))}
      </p>
      <div className={styles.parents}>
        <p>
          <span className={styles.parentNames}>
            {groom.father.name} · {groom.mother.name}
          </span>
          <span className={styles.relation}>의 아들 </span>
          <span className={styles.childName}>{groom.name}</span>
        </p>
        <p>
          <span className={styles.parentNames}>
            {bride.father.name} · {bride.mother.name}
          </span>
          <span className={styles.relation}>의 딸 </span>
          <span className={styles.childName}>{bride.name}</span>
        </p>
      </div>
    </section>
  )
}
