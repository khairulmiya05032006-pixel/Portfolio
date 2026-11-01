'use client'

import { portfolioConfig } from '@/config/portfolio'
import styles from './About.module.scss'

export function About() {
  const { profile } = portfolioConfig

  return (
    <section id="about" className={styles.about} aria-label="About Section">
      {/* Left Spatial Corridor: Clear for 3D Camera Rotation to 3/4 View */}
      <div className={styles.corridorLeft} aria-hidden="true" />

      {/* Right Spatial Corridor: About Narrative & Fact Highlights */}
      <div className={styles.corridorRight}>
        <span className={styles.eyebrow}>Who I Am</span>
        <h2 className={styles.title}>
          About <span>Me</span>
        </h2>

        <div className={styles.contentBody}>
          <p>
            I&apos;m Khairul Miya, a BCA student graduating in 2027 with a strong interest in full-stack development.
          </p>
          <p>
            I enjoy turning ideas into practical web applications, with a focus on clean interfaces, responsive experiences, and maintainable code. I work primarily with React, TypeScript, Node.js, and Express, building everything from user-facing features to backend APIs and database-driven functionality.
          </p>
          <p>
            I&apos;m always exploring better ways to solve problems, improve application performance, and build software that delivers real value. My goal is to grow as an engineer while contributing to products that people genuinely find useful.
          </p>
        </div>

        <div className={styles.signatureRow}>
          <div>
            <span className={styles.sigLabel}>Location</span>
            <span className={styles.sigValue}>{profile.location}</span>
          </div>
          <div>
            <span className={styles.sigLabel}>Degree</span>
            <span className={styles.sigValue}>BCA (Graduating 2027)</span>
          </div>
          <div>
            <span className={styles.sigLabel}>Focus</span>
            <span className={styles.sigValue}>Full-Stack Web Development</span>
          </div>
        </div>
      </div>
    </section>
  )
}
