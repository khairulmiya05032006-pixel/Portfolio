import { SectionHeading } from '@/components/ui/SectionHeading'
import { factCards, profile } from '@/data/portfolio'
import styles from './About.module.scss'

export function About() {
  return (
    <section id="about" className={styles.section} aria-labelledby="about-heading">
      <div className={styles.inner}>
        <SectionHeading eyebrow="01 / Background" decorativeWord="Profile" id="about-heading" title={<>About <span>me</span></>} />
        <div className={styles.content}>
          <p className={styles.lede}>{profile.about}</p>
          <p className={styles.detail}>My current focus is JavaScript, React, Node.js, Express, MySQL, authentication, and responsive web interfaces.</p>
        </div>
        <dl className={styles.facts}>
          {factCards.map((fact) => <div key={fact.label}><dt>{fact.value}</dt><dd>{fact.label}</dd></div>)}
        </dl>
      </div>
    </section>
  )
}
