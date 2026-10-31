'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { portfolioConfig } from '@/config/portfolio'
import styles from './Landing.module.scss'

export function Landing() {
  const { profile } = portfolioConfig
  const portraitRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Parallax scroll interaction for mobile portrait
    if (typeof window === 'undefined') return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    let rafId: number | null = null

    const handleScroll = () => {
      if (window.innerWidth > 900) return
      if (rafId !== null) return

      rafId = requestAnimationFrame(() => {
        rafId = null
        const scrollY = window.scrollY
        if (portraitRef.current && scrollY <= 700) {
          // Subtle restrained parallax translation and slight opacity fade
          const translateY = scrollY * 0.12
          const opacity = Math.max(0.35, 1 - scrollY / 550)
          portraitRef.current.style.transform = `translate3d(0, ${translateY}px, 0)`
          portraitRef.current.style.opacity = `${opacity}`
        }
      })
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (rafId !== null) cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <section id="landing" className={styles.landing} aria-label="Hero Section">
      {/* Left Spatial Corridor: Typography, Personal Portrait & CTAs */}
      <div className={styles.corridorLeft}>
        <h1 className={styles.headline}>
          Khairul
          <span className={styles.accentText}>Miya</span>
        </h1>

        {/* Mobile-Only Personal Portrait: Positioned immediately below Name, before Subtitle */}
        <div className={styles.mobilePortraitWrapper}>
          <div ref={portraitRef} className={styles.mobilePortraitContainer}>
            <Image
              src="/mobile_fit_image/ezgif-frame-001.jpg"
              alt="Khairul Miya - Personal Portrait"
              width={540}
              height={960}
              priority
              className={styles.mobilePortraitImage}
            />
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
            <span className={styles.statNum}>Full-Stack</span>
            <span className={styles.statLabel}>Development Focus</span>
          </div>
        </div>
      </div>

      {/* Right Spatial Corridor: Clear for 3D Interactive Rigged Avatar on Desktop */}
      <div className={styles.corridorRight} aria-hidden="true" />
    </section>
  )
}
