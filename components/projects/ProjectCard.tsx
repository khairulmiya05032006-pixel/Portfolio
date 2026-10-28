import { TagList } from '@/components/ui/TagList'
import type { Project } from '@/data/portfolio'
import { AmanaFlowDiagram } from './AmanaFlowDiagram'
import styles from './ProjectCard.module.scss'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article id={project.slug} className={`${styles.card} ${project.featured ? styles.featured : ''}`}>
      <div className={styles.topLine} aria-hidden="true" />
      <div className={styles.meta}><span>{project.number}</span><p>{project.context}</p></div>
      <div className={styles.content}>
        <h3>{project.name}</h3>
        <dl>
          <div><dt>What I built</dt><dd>{project.built}</dd></div>
          <div><dt>What I learned</dt><dd>{project.learned}</dd></div>
        </dl>
        <TagList items={project.technologies} />
        {project.featured && <AmanaFlowDiagram />}
      </div>
    </article>
  )
}
