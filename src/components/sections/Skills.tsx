import { SectionHeading } from '@/components/ui/SectionHeading'
import { TagList } from '@/components/ui/TagList'
import { SkillFocus } from '@/components/motion/SkillFocus'
import { skillGroups } from '@/data/portfolio'
import styles from './Skills.module.scss'

export function Skills() {
  return (
    <section id="skills" className={styles.section} aria-labelledby="skills-heading">
      <div className={styles.inner}>
        <SectionHeading eyebrow="02 / Capabilities" decorativeWord="Skills" id="skills-heading" title={<>Built for the <span>whole flow.</span></>} />
        <p className={styles.intro}>A practical set of building blocks for shaping a web product from interface to data.</p>
        <div className={styles.focusMap}>
          <div><p className={styles.focusLabel}>Current focus map</p><p className={styles.focusCopy}>The rings draw in when this section enters view. They are visual markers for active learning areas, not percentage-based proficiency claims.</p></div>
          <SkillFocus groups={skillGroups} />
        </div>
        <div className={styles.groups}>
          {skillGroups.map((group) => <article className={styles.group} key={group.title}><span className={styles.number}>{group.number}</span><h3>{group.title}</h3><p>{group.description}</p><TagList items={group.items} /></article>)}
        </div>
      </div>
    </section>
  )
}
