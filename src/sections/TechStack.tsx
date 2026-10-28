'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SkillBackground3D } from '@/components/skills/SkillBackground3D'
import { SkillGrid } from '@/components/skills/SkillGrid'
import { SKILLS_CONFIG } from '@/config/skills'
import styles from './TechStack.module.scss'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function TechStack() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const gridWrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const header = headerRef.current
    const gridWrapper = gridWrapperRef.current

    if (!section || !header || !gridWrapper) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    if (prefersReducedMotion) return

    const ctx = gsap.context(() => {
      // 1. Header fade-and-rise entrance
      gsap.fromTo(
        header,
        {
          y: 40,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 78%',
            toggleActions: 'play none none none',
          },
        }
      )

      // 2. Pyramid rows staggered cascade
      const rows = gridWrapper.querySelectorAll('[data-row]')
      if (rows.length > 0) {
        gsap.fromTo(
          rows,
          {
            y: 30,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 72%',
              toggleActions: 'play none none none',
            },
          }
        )
      }
    }, section)

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="tech-stack"
      className={styles.section}
      aria-label="Technologies and Technical Skills"
    >
      {/* Anchor for Navbar link '#skills' */}
      <span id="skills" className={styles.navAnchor} aria-hidden="true" />

      {/* Atmospheric lighting & vignette overlays */}
      <div className={styles.glowCenter} aria-hidden="true" />
      <div className={styles.vignetteOverlay} aria-hidden="true" />

      {/* Real-time 3D Undulating Purple Wireframe Landscape */}
      <SkillBackground3D />

      {/* Foreground Content Container */}
      <div className={styles.container}>
        <header ref={headerRef} className={styles.header}>
          <span className={styles.eyebrow}>05 / Core Capabilities</span>
          <h2 className={styles.title}>TECH STACK</h2>
          <p className={styles.subtitle}>
            A curated ecosystem of modern programming languages, frameworks,
            data layers, and developer tooling I leverage to build resilient
            software.
          </p>
          <div className={styles.countPill}>
            <span className={styles.dot} />
            <span>{SKILLS_CONFIG.length}</span> Verified Technologies
          </div>
        </header>

        {/* Pyramid Grid of Translucent Skill Cards */}
        <div ref={gridWrapperRef} style={{ width: '100%' }}>
          <SkillGrid />
        </div>
      </div>
    </section>
  )
}

export default TechStack
