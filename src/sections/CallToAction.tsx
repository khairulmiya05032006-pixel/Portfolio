'use client'

import styles from './CallToAction.module.scss'

export function CallToAction() {
  return (
    <section className={styles.ctaSection} aria-label="Call to Action">
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>Let&apos;s Build Together</span>
          <h2 className={styles.title}>
            Have an idea or need an engineering <span>partner</span>?
          </h2>
          <p className={styles.description}>
            I am actively seeking junior engineering opportunities, internships, and ambitious
            freelance projects. Let&apos;s connect and craft something remarkable.
          </p>
          <div className={styles.buttonGroup}>
            <a href="#contact" className={styles.primaryButton}>
              Initiate Conversation <span aria-hidden="true">→</span>
            </a>
            <a
              href="mailto:contact@khairul.dev"
              className={styles.secondaryButton}
            >
              Direct Email
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
