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
            I am a third-year Bachelor of Computer Applications (BCA) student graduating in 2027,
            passionate about building clean web applications and responsive interfaces.
          </p>
          <p>
            My main focus is on modern full-stack development with React, TypeScript, and Node.js.
            I enjoy creating fast, user-friendly experiences on the front-end and reliable, well-structured
            APIs on the back-end.
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
