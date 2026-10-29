'use client'

import styles from './CallToAction.module.scss'

export function CallToAction() {
  return (
    <section className={styles.ctaSection} aria-label="Call to Action">
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.eyebrow}>Let&apos;s Connect</span>
          <h2 className={styles.title}>
            Have a project in mind or looking for a <span>developer</span>?
          </h2>
          <p className={styles.description}>
            I&apos;m open to internship opportunities, junior developer roles, and freelance projects.
            Feel free to reach out anytime!
          </p>
          <div className={styles.buttonGroup}>
            <a href="#contact" className={styles.primaryButton}>
              Get in Touch <span aria-hidden="true">→</span>
            </a>
            <a
              href="mailto:contact@khairul.dev"
              className={styles.secondaryButton}
            >
              Send Email
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
