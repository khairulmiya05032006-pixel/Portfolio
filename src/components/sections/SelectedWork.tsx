import { ProjectCard } from '@/components/projects/ProjectCard'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { projects } from '@/data/portfolio'
import styles from './SelectedWork.module.scss'

export function SelectedWork() {
  return (
    <section id="work" className={styles.section} aria-labelledby="work-heading">
      <div className={styles.inner}>
        <SectionHeading eyebrow="03 / Project evidence" decorativeWord="Work" id="work-heading" title={<>Selected <span>work</span></>} />
        <p className={styles.intro}>Learning projects that document the systems and interactions I am exploring.</p>
        <div className={styles.cards}>{projects.map((project) => <ProjectCard key={project.slug} project={project} />)}</div>
      </div>
    </section>
  )
}
