'use client'

import { portfolioConfig } from '@/config/portfolio'
import styles from './Career.module.scss'

export function Career() {
  const { career } = portfolioConfig

  return (
    <section id="career" className={styles.career} aria-label="Career & Education Section">
      {/* Anchor for Education */}
      <span id="education" style={{ position: 'absolute', top: '-80px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true" />

      <div className={styles.header}>
        <span className={styles.eyebrow}>04 / Trajectory</span>
        <h2 className={styles.title}>
          Education & <span>Milestones</span>
        </h2>
        <p className={styles.subtitle}>
          My academic foundation and technical project journey as an aspiring full-stack software engineer.
        </p>
      </div>

      <div className={styles.timeline}>
        {career.map((item, index) => (
          <div key={item.id} className={styles.timelineItem}>
            <div className={styles.rail}>
              <div className={styles.node}>
                <span>0{index + 1}</span>
              </div>
              <div className={styles.line} />
            </div>

            <div className={styles.itemContent}>
              <div className={styles.metaRow}>
                <span className={styles.period}>{item.period}</span>
                <span className={styles.typeBadge}>{item.type.toUpperCase()}</span>
              </div>
              <h3 className={styles.roleTitle}>{item.role}</h3>
              <h4 className={styles.companyTitle}>{item.company}</h4>
              <p className={styles.description}>{item.description}</p>
              <div className={styles.techList}>
                {item.technologies.map((tech) => (
                  <span key={tech} className={styles.techBadge}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
