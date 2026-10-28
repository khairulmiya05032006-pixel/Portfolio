import { SectionHeading } from '@/components/ui/SectionHeading'
import { TagList } from '@/components/ui/TagList'
import { learningNotes } from '@/data/portfolio'
import styles from './LearningNotes.module.scss'

export function LearningNotes() {
  return (
    <section className={styles.section} aria-labelledby="notes-heading">
      <div className={styles.inner}>
        <SectionHeading eyebrow="04 / Learning notes" decorativeWord="Journal" id="notes-heading" title={<>From the <span>build.</span></>} />
        <p className={styles.intro}>Short, project-based notes on the concepts and systems I am working through.</p>
        <div className={styles.grid}>
          {learningNotes.map((note) => (
            <article className={`${styles.card} ${styles[note.treatment]}`} key={note.number}>
              <div className={styles.media} aria-hidden="true">
                <span>{note.number}</span>
                <i />
                <b>{note.treatment === 'signal' ? 'DOM' : note.treatment === 'system' ? 'FLOW' : 'GRID'}</b>
              </div>
              <div className={styles.overlay} aria-hidden="true"><span>Learning note</span></div>
              <div className={styles.copy}>
                <p className={styles.meta}>Learning note / {note.number}</p>
                <h3>{note.title}</h3>
                <p>{note.excerpt}</p>
                <TagList items={note.tags} />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
