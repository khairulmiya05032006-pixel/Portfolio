'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import type { ServiceItem } from '@/config/portfolio'
import styles from './MobileVerticalSlider.module.scss'

interface MobileVerticalSliderProps {
  services: ServiceItem[]
}

function ServiceIcon({ icon }: { icon: string }) {
  switch (icon) {
    case 'frontend':
      return (
        <svg
          className={styles.iconSvg}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <polyline points="7 8 10 10 7 12" />
          <line x1="13" y1="12" x2="17" y2="12" />
        </svg>
      )
    case 'backend':
      return (
        <svg
          className={styles.iconSvg}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" />
          <line x1="6" y1="18" x2="6.01" y2="18" />
          <path d="M12 6h6" />
          <path d="M12 18h6" />
        </svg>
      )
    case 'database':
      return (
        <svg
          className={styles.iconSvg}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <ellipse cx="12" cy="5" rx="9" ry="3" />
          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
        </svg>
      )
    case 'creative':
    default:
      return (
        <svg
          className={styles.iconSvg}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2l7.5 4.5v9L12 20l-7.5-4.5v-9L12 2z" />
          <path d="M12 2v18" />
          <path d="M12 11l7.5-4.5" />
          <path d="M12 11L4.5 6.5" />
        </svg>
      )
  }
}

export function MobileVerticalSlider({ services }: MobileVerticalSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  const scrollToIndex = useCallback((index: number, smooth = true) => {
    if (index < 0 || index >= services.length) return
    const card = cardRefs.current[index]
    if (card && trackRef.current) {
      card.scrollIntoView({
        behavior: smooth ? 'smooth' : 'auto',
        block: 'center',
        inline: 'nearest',
      })
      setActiveIndex(index)
      setHasInteracted(true)
    }
  }, [services.length])

  // Track active card via IntersectionObserver
  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.55) {
            const index = Number(entry.target.getAttribute('data-index'))
            if (!isNaN(index)) {
              setActiveIndex(index)
              setHasInteracted(true)
            }
          }
        })
      },
      {
        root: track,
        threshold: [0.55, 0.75],
      }
    )

    cardRefs.current.forEach((card) => {
      if (card) observer.observe(card)
    })

    return () => {
      observer.disconnect()
    }
  }, [services])

  // Keyboard navigation when slider is focused
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      scrollToIndex(Math.min(activeIndex + 1, services.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      scrollToIndex(Math.max(activeIndex - 1, 0))
    }
  }

  return (
    <div
      className={styles.sliderContainer}
      role="region"
      aria-roledescription="vertical carousel"
      aria-label="Capabilities and services showcase"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <div className={styles.sliderMain}>
        {/* Vertical Scroll Track */}
        <div
          ref={trackRef}
          className={styles.track}
          aria-live="polite"
        >
          {services.map((item, index) => {
            const isActive = activeIndex === index
            return (
              <div
                key={item.id}
                ref={(el) => {
                  cardRefs.current[index] = el
                }}
                data-index={index}
                className={`${styles.card} ${isActive ? styles.cardActive : styles.cardInactive}`}
                onClick={() => {
                  if (!isActive) scrollToIndex(index)
                }}
                role="group"
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${services.length}: ${item.title}`}
                tabIndex={isActive ? 0 : -1}
              >
                {/* Header row: Index & Subtitle badge */}
                <div className={styles.cardHeader}>
                  <span className={styles.cardIndex}>
                    {String(index + 1).padStart(2, '0')} / {String(services.length).padStart(2, '0')}
                  </span>
                  <span className={styles.badge}>{item.subtitle}</span>
                </div>

                {/* Visual Icon Box */}
                <div className={styles.iconBox}>
                  <ServiceIcon icon={item.icon} />
                </div>

                {/* Service Title */}
                <h3 className={styles.cardTitle}>{item.title}</h3>

                {/* Description */}
                <p className={styles.cardDesc}>{item.description}</p>

                {/* Capabilities Tags */}
                <div className={styles.tagsList}>
                  {item.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Subtle active card decorative accent line */}
                <div className={styles.cardAccentGlow} aria-hidden="true" />
              </div>
            )
          })}
        </div>

        {/* Minimal Vertical Progress Rail */}
        <aside className={styles.progressRail} aria-label="Slider navigation rail">
          <button
            type="button"
            className={styles.navArrow}
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous capability"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="18 15 12 9 6 15" />
            </svg>
          </button>

          <div className={styles.pipsGroup} role="tablist" aria-label="Capability slides">
            {services.map((service, index) => {
              const isSelected = activeIndex === index
              return (
                <button
                  key={service.id}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-label={`Slide ${index + 1}: ${service.title}`}
                  className={`${styles.pip} ${isSelected ? styles.pipActive : ''}`}
                  onClick={() => scrollToIndex(index)}
                />
              )
            })}
          </div>

          <button
            type="button"
            className={styles.navArrow}
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex === services.length - 1}
            aria-label="Next capability"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </aside>
      </div>

      {/* Swipe Cue Indicator on initial view */}
      <div
        className={`${styles.swipeHint} ${hasInteracted ? styles.swipeHintHidden : ''}`}
        aria-hidden="true"
      >
        <span>Swipe vertically to explore</span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="7 13 12 18 17 13" />
          <polyline points="7 6 12 11 17 6" />
        </svg>
      </div>
    </div>
  )
}
