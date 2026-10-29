'use client'

import { portfolioConfig } from '@/config/portfolio'
import { ProjectScrollAnimation } from '@/components/projects/ProjectScrollAnimation'
import styles from './Work.module.scss'

export function Work() {
  const { projects } = portfolioConfig

  return (
    <section id="work" className={styles.work} aria-label="Selected Work Section">
      <div className={styles.header}>
        <span className={styles.eyebrow}>05 / Portfolio Evidence</span>
        <h2 className={styles.title}>
          Featured <span>Projects</span>
        </h2>
        <p className={styles.subtitle}>
          Real-world applications, algorithmic interactive utilities, and responsive design systems.
        </p>
      </div>

      {/* Smooth Scroll Kinetic Image Sequence */}
      <ProjectScrollAnimation />

      <div className={styles.projectsList}>
        {projects.map((project, idx) => (
          <article key={project.id} className={styles.projectCard}>
            <div className={styles.cardGlow} aria-hidden="true" />
            <div className={styles.cardHeader}>
              <span className={styles.projectNumber}>0{idx + 1}</span>
              <span className={styles.categoryBadge}>{project.category}</span>
            </div>

            <h3 className={styles.projectTitle}>{project.title}</h3>
            <p className={styles.projectDescription}>{project.description}</p>

            {project.metrics && (
              <div className={styles.metricsPill}>
                <span className={styles.metricDot} />
                <span>{project.metrics}</span>
              </div>
            )}

            <div className={styles.techStack}>
              {project.technologies.map((tech) => (
                <span key={tech} className={styles.techTag}>
                  {tech}
                </span>
              ))}
            </div>

            <div className={styles.actions}>
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  className={styles.linkButton}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Live Preview <span aria-hidden="true">↗</span>
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  className={styles.secondaryLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Source Code <span aria-hidden="true">↗</span>
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
