'use client'

import { portfolioConfig } from '@/config/portfolio'
import { MobileCinematicHero } from '@/components/hero/MobileCinematicHero'
import styles from './Landing.module.scss'

export function Landing() {
  const { profile } = portfolioConfig

  return (
    <section id="landing" className={styles.landing} aria-label="Hero Section">
      {/* Desktop Spatial Corridors: 100% Preserved for Desktop Screens (> 900px) */}
      <div className={styles.desktopLayout}>
        <div className={styles.corridorLeft}>
          <span className={styles.greeting}>PEACE BE UPON YOU. I&apos;M</span>
          <h1 className={styles.headline}>
            Khairul
            <span className={styles.accentText}>Miya</span>
          </h1>

          <p className={styles.tagline}>{profile.tagline}</p>

          <p className={styles.bio}>{profile.bio}</p>

          <div className={styles.ctaGroup}>
            <a href="#work" className={styles.primaryBtn}>
              Explore Work <span aria-hidden="true">↓</span>
            </a>
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.secondaryBtn}
            >
              Download Resume <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statNum}>2027</span>
              <span className={styles.statLabel}>BCA Graduation</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNum}>Full-Stack</span>
              <span className={styles.statLabel}>Development Focus</span>
            </div>
          </div>
        </div>

        {/* Right Spatial Corridor: Dedicated stage for the Developer Avatar */}
        <div className={styles.corridorRight} aria-hidden="true" />
      </div>

      {/* Mobile-Only Reverse Scroll-Driven Cinematic Hero (<= 900px) */}
      <MobileCinematicHero profile={profile} />
    </section>
  )
}
