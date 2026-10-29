'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { portfolioConfig } from '@/config/portfolio'
import { HorizontalProjectCard } from '@/components/projects/HorizontalProjectCard'
import { ProjectControls } from '@/components/projects/ProjectControls'
import styles from './Work.module.scss'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export function Work() {
  const { projects } = portfolioConfig
  const total = projects.length

  const [currentIndex, setCurrentIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  const sectionRef = useRef<HTMLElement>(null)
  const pinWrapperRef = useRef<HTMLDivElement>(null)
  const horizontalTrackRef = useRef<HTMLDivElement>(null)
  const mobileGalleryRef = useRef<HTMLDivElement>(null)

  const stRef = useRef<ScrollTrigger | null>(null)

  // Navigate on desktop (scrolls window to corresponding vertical position)
  const handleDesktopNav = useCallback(
    (direction: 'prev' | 'next') => {
      const nextIdx = direction === 'next' ? currentIndex + 1 : currentIndex - 1
      if (nextIdx < 0 || nextIdx >= total) return
      const st = stRef.current
      if (!st) return

      const targetProgress = nextIdx / (total - 1)
      const targetScroll = st.start + targetProgress * (st.end - st.start)

      window.scrollTo({
        top: targetScroll,
        behavior: 'smooth',
      })
    },
    [currentIndex, total]
  )

  // Navigate on mobile (smoothly scrolls the horizontal snap container)
  const handleMobileNav = useCallback((direction: 'prev' | 'next') => {
    const el = mobileGalleryRef.current
    if (!el) return
    const firstCard = el.querySelector('article')
    const scrollDelta = firstCard ? firstCard.clientWidth + 20 : 340

    el.scrollBy({
      left: direction === 'next' ? scrollDelta : -scrollDelta,
      behavior: 'smooth',
    })
  }, [])

  // Universal nav handler
  const handleNav = useCallback(
    (direction: 'prev' | 'next') => {
      if (typeof window !== 'undefined') {
        const isMobile = window.innerWidth <= 960
        const prefersReduced = window.matchMedia(
          '(prefers-reduced-motion: reduce)'
        ).matches
        if (isMobile || prefersReduced) {
          handleMobileNav(direction)
          return
        }
      }
      handleDesktopNav(direction)
    },
    [handleDesktopNav, handleMobileNav]
  )

  // Mobile scroll listener to update progress bar
  const handleMobileScroll = useCallback(() => {
    const el = mobileGalleryRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    const currentScroll = el.scrollLeft
    const p = maxScroll > 0 ? Math.max(0, Math.min(1, currentScroll / maxScroll)) : 0
    setProgress(p)
    const idx = Math.min(total - 1, Math.round(p * (total - 1)))
    setCurrentIndex(idx)
  }, [total])

  useEffect(() => {
    const section = sectionRef.current
    const pinWrapper = pinWrapperRef.current
    const horizontalTrack = horizontalTrackRef.current

    if (!section || !pinWrapper || !horizontalTrack) return

    // Check media preferences
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const isMobileBreakpoint = window.innerWidth <= 960

    if (prefersReducedMotion || isMobileBreakpoint) {
      return
    }

    // GSAP Pinned Horizontal Scroll on Desktop
    const ctx = gsap.context(() => {
      const getScrollAmount = () => {
        const distance = Math.max(0, horizontalTrack.scrollWidth - window.innerWidth)
        return -distance
      }

      const tween = gsap.to(horizontalTrack, {
        x: getScrollAmount,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () =>
            `+=${Math.max(
              window.innerHeight * 1.5,
              (horizontalTrack.scrollWidth - window.innerWidth) * 1.25
            )}`,
          pin: pinWrapper,
          pinSpacing: true,
          scrub: 1.0,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = Math.max(0, Math.min(1, self.progress))
            setProgress(p)
            const activeIdx = Math.min(
              total - 1,
              Math.round(p * (total - 1))
            )
            setCurrentIndex(activeIdx)
          },
        },
      })

      if (tween.scrollTrigger) {
        stRef.current = tween.scrollTrigger
      }
    }, section)

    const handleResize = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      ctx.revert()
      stRef.current = null
    }
  }, [total])

  return (
    <section
      ref={sectionRef}
      id="work"
      className={styles.section}
      aria-label="Selected Projects Horizontal Showcase"
    >
      {/* Desktop Mode: Pinned Horizontal Scroll Gallery with Header & Controls */}
      <div ref={pinWrapperRef} className={styles.desktopPinWrapper}>
        <div className={styles.headerContainer}>
          <span className={styles.eyebrow}>
            MY WORK / 01—{String(total).padStart(2, '0')}
          </span>
          <h2 className={styles.title}>
            Selected <span>Projects</span>
          </h2>
          <p className={styles.subtitle}>
            A curated collection of full-stack platforms, client-side interactive
            utilities, and responsive interface systems built with architectural discipline.
          </p>
        </div>

        <div className={styles.trackWindow}>
          <div ref={horizontalTrackRef} className={styles.horizontalTrack}>
            {projects.map((project, idx) => (
              <HorizontalProjectCard
                key={project.id}
                project={project}
                index={idx}
                total={total}
              />
            ))}
          </div>
        </div>

        <ProjectControls
          currentIndex={currentIndex}
          total={total}
          progress={progress}
          onPrev={() => handleNav('prev')}
          onNext={() => handleNav('next')}
          canPrev={currentIndex > 0}
          canNext={currentIndex < total - 1}
        />
      </div>

      {/* Mobile & Touch Mode: Static Header + Native Swipe Gallery + Controls */}
      <div className={styles.mobileWrapper}>
        <div className={styles.headerContainer}>
          <span className={styles.eyebrow}>
            MY WORK / 01—{String(total).padStart(2, '0')}
          </span>
          <h2 className={styles.title}>
            Selected <span>Projects</span>
          </h2>
          <p className={styles.subtitle}>
            A curated collection of full-stack platforms, client-side interactive
            utilities, and responsive interface systems built with architectural discipline.
          </p>
        </div>

        <div
          ref={mobileGalleryRef}
          className={styles.mobileGallery}
          onScroll={handleMobileScroll}
          role="region"
          aria-label="Swipeable projects list"
        >
          {projects.map((project, idx) => (
            <HorizontalProjectCard
              key={`mobile-${project.id}`}
              project={project}
              index={idx}
              total={total}
              idPrefix="mobile"
            />
          ))}
        </div>

        <ProjectControls
          currentIndex={currentIndex}
          total={total}
          progress={progress}
          onPrev={() => handleNav('prev')}
          onNext={() => handleNav('next')}
          canPrev={currentIndex > 0}
          canNext={currentIndex < total - 1}
        />
      </div>
    </section>
  )
}

export default Work
