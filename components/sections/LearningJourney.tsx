import { SectionHeading } from '@/components/ui/SectionHeading'
import { learningStages } from '@/data/portfolio'
import styles from './LearningJourney.module.scss'

export function LearningJourney() {
  return (
    <section className={styles.section} aria-labelledby="journey-heading">
      <div className={styles.inner}>
        <SectionHeading eyebrow="04 / Learning journey" decorativeWord="Forward" id="journey-heading" title={<>Still learning.<br /><span>Still building.</span></>} />
        <div className={styles.body}>
          <p>My learning path is shaped by practical stages rather than an invented employment timeline.</p>
          <ol>{learningStages.map((stage, index) => <li key={stage}><span>0{index + 1}</span><p>{stage}</p></li>)}</ol>
        </div>
      </div>
    </section>
  )
}
