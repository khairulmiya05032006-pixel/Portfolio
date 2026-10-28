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
        <span className={styles.eyebrow}>02 / Who I Am</span>
        <h2 className={styles.title}>
          Engineering with <span>Intent</span> & Architecture
        </h2>

        <div className={styles.contentBody}>
          <p>
            I am a third-year Bachelor of Computer Applications (BCA) student graduating in 2027,
            focused on transforming ideas into robust, responsive, and dependable software systems.
          </p>
          <p>
            My engineering philosophy is rooted in foundational clarity: understanding the browser
            event loop, DOM rendering cycles, and type contracts on the front-end, while building
            modular route-controller-service layers, relational data consistency, and JWT-secured
            endpoints on the back-end.
          </p>
        </div>

        <div className={styles.focusCards}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>01</div>
            <h3>Full-Stack Systems</h3>
            <p>
              Documented production patterns in Node.js, Express, and MySQL through real-world loan
              management architectures.
            </p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>02</div>
            <h3>Modern React & 3D</h3>
            <p>
              Next.js 16 App Router, React 19 Server Components, SCSS modules, Three.js shaders,
              and motion choreography.
            </p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>03</div>
            <h3>Academic Excellence</h3>
            <p>
              Third-year BCA student maintaining high academic rigor in data structures, algorithms,
              and software engineering.
            </p>
          </div>
        </div>

        <div className={styles.signatureRow}>
          <div>
            <span className={styles.sigLabel}>Location</span>
            <span className={styles.sigValue}>{profile.location}</span>
          </div>
          <div>
            <span className={styles.sigLabel}>Expected Degree</span>
            <span className={styles.sigValue}>BCA (Graduating 2027)</span>
          </div>
          <div>
            <span className={styles.sigLabel}>Specialization</span>
            <span className={styles.sigValue}>Full-Stack & Creative Tech</span>
          </div>
        </div>
      </div>
    </section>
  )
}
