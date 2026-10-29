'use client'

import Image from 'next/image'
import { portfolioConfig } from '@/config/portfolio'
import styles from './Landing.module.scss'

export function Landing() {
  const { profile } = portfolioConfig

  return (
    <section id="landing" className={styles.landing} aria-label="Hero Section">
      {/* Left Spatial Corridor: Typography & CTAs (Avatar sits in Right Corridor) */}
      <div className={styles.corridorLeft}>
        <div className={styles.statusPill}>
          <span className={styles.pulseDot} />
          <span>{profile.availability}</span>
        </div>

        <h1 className={styles.headline}>
          Khairul
          <span className={styles.accentText}>Miya</span>
        </h1>

        {/* Mobile Character Image: Positioned gracefully between Name and Paragraph */}
        <div className={styles.mobileImageContainer}>
          <div className={styles.mobileImageWrapper}>
            <Image
              src="/images/projects/ezgif-frame-001.jpg"
              alt="Khairul Miya - Developer Portrait"
              width={640}
              height={420}
              priority
              className={styles.mobileImage}
            />
            <div className={styles.mobileImageOverlay} />
            <div className={styles.mobileImageBadge}>
              <span className={styles.badgeDot} />
              <span>Full-Stack Engineer</span>
            </div>
          </div>
        </div>

        <p className={styles.tagline}>{profile.tagline}</p>

        <p className={styles.bio}>{profile.bio}</p>

        <div className={styles.ctaGroup}>
          <a href="#work" className={styles.primaryBtn}>
            Explore Work <span aria-hidden="true">↓</span>
          </a>
          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className={styles.secondaryBtn}>
            Download Resume <span aria-hidden="true">↗</span>
          </a>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statItem}>
            <span className={styles.statNum}>2027</span>
            <span className={styles.statLabel}>BCA Graduation</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>01</span>
            <span className={styles.statLabel}>Full-Stack System</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNum}>100%</span>
            <span className={styles.statLabel}>Code Dedication</span>
          </div>
        </div>
      </div>

      {/* Right Spatial Corridor: Clear for 3D Interactive Rigged Avatar */}
      <div className={styles.corridorRight} aria-hidden="true" />
    </section>
  )
}
