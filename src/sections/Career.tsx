'use client'

import { portfolioConfig } from '@/config/portfolio'
import { MobileCurvedSlider } from '@/components/career/MobileCurvedSlider'
import styles from './Career.module.scss'

export function Career() {
  const { career } = portfolioConfig

  return (
    <section id="career" className={styles.career} aria-label="Career & Education Section">
      {/* Anchor for Education */}
      <span id="education" style={{ position: 'absolute', top: '-80px', opacity: 0, pointerEvents: 'none' }} aria-hidden="true" />

      <div className={styles.header}>
        <span className={styles.eyebrow}>Education & Experience</span>
        <h2 className={styles.title}>
          Academic & <span>Project Journey</span>
        </h2>
        <p className={styles.subtitle}>
          My academic foundation and key projects developed along the way.
        </p>
      </div>

      {/* Desktop Timeline (Preserved 100% on desktop screens > 768px) */}
      <div className={styles.desktopTimeline}>
        {career.map((item) => (
          <div key={item.id} className={styles.timelineItem}>
            <div className={styles.rail}>
              <div className={styles.node}>
                <span className={styles.dot} />
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

      {/* Mobile-Only 3D Curved Auto-Scrolling Slider (<= 768px) */}
      <div className={styles.mobileSliderWrapper}>
        <MobileCurvedSlider career={career} />
      </div>
    </section>
  )
}
