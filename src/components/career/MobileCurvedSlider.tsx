'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import type { CareerItem } from '@/config/portfolio'
import styles from './MobileCurvedSlider.module.scss'

export interface MobileCareerItem {
  id: string
  period: string
  role: string
  company: string
  description: string
  technologies: string[]
  type: string
}

interface MobileCurvedSliderProps {
  career: MobileCareerItem[]
}

function CareerIcon({ type }: { type: string }) {
  if (type === 'education') {
    return (
      <svg
        className={styles.cardTypeIcon}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 9 3 12 0v-5" />
      </svg>
    )
  }
  return (
    <svg
      className={styles.cardTypeIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

export function MobileCurvedSlider({ career }: MobileCurvedSliderProps) {
  // Duplicate array 4 times for seamless infinite loop calculation
  const loopItems = [...career, ...career, ...career, ...career]
  const itemCount = career.length

  const [activeCenterIndex, setActiveCenterIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const cardElementsRef = useRef<(HTMLDivElement | null)[]>([])

  // Animation & Physics Refs (avoid state updates on each frame)
  const offsetRef = useRef(0)
  const isInteractingRef = useRef(false)
  const isVisibleRef = useRef(false)
  const isReducedMotionRef = useRef(false)
  const resumeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const rafIdRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number>(0)

  // Touch drag tracking
  const touchStartPos = useRef({ x: 0, y: 0 })
  const lastTouchX = useRef(0)
  const isHorizontalSwipe = useRef<boolean | null>(null)

  // Slot sizing
  const getSlotDimensions = useCallback(() => {
    if (!containerRef.current) return { cardWidth: 280, gap: 16, slotWidth: 296 }
    const containerWidth = containerRef.current.clientWidth
    // Card width clamped between 260px and 310px, or 78% of viewport
    const cardWidth = Math.min(310, Math.max(260, Math.round(containerWidth * 0.78)))
    const gap = 16
    return { cardWidth, gap, slotWidth: cardWidth + gap }
  }, [])

  // Update 3D transforms on each card element
  const renderPositions = useCallback(() => {
    if (!containerRef.current || !trackRef.current) return
    const containerWidth = containerRef.current.clientWidth
    const centerX = containerWidth / 2
    const { cardWidth, slotWidth } = getSlotDimensions()
    const setWidth = itemCount * slotWidth

    // Wrap offset seamlessly
    if (offsetRef.current >= 2 * setWidth) {
      offsetRef.current -= setWidth
    } else if (offsetRef.current < setWidth) {
      offsetRef.current += setWidth
    }

    const currentOffset = offsetRef.current
    let closestDist = Infinity
    let closestIndex = 0

    cardElementsRef.current.forEach((el, index) => {
      if (!el) return

      // Center position of this card in track coordinate space
      const cardCenter = index * slotWidth + cardWidth / 2 - currentOffset
      const diff = cardCenter - centerX
      const u = diff / slotWidth // Normalized distance from center

      const absU = Math.abs(u)
      if (absU < closestDist) {
        closestDist = absU
        closestIndex = index % itemCount
      }

      // Hide distant cards outside viewing frustum
      if (absU > 3.2) {
        el.style.opacity = '0'
        el.style.pointerEvents = 'none'
        el.style.transform = 'translate3d(-9999px, 0, 0)'
        return
      }

      // 3D Curved Arc calculations
      // Left cards angle positive rotateY, right cards angle negative rotateY
      const rotY = Math.max(-38, Math.min(38, -u * 22))
      const transZ = Math.max(-160, -absU * 54)
      const scale = Math.max(0.78, 1 - absU * 0.1)
      const opacity = Math.max(0.35, 1 - absU * 0.3)

      const transX = Math.round(cardCenter - cardWidth / 2)

      el.style.opacity = opacity.toFixed(3)
      el.style.pointerEvents = 'auto'
      el.style.zIndex = String(Math.round(100 - absU * 10))
      el.style.transform = `translate3d(${transX}px, 0, ${transZ}px) rotateY(${rotY}deg) scale(${scale})`

      // Highlight active card border & glow
      if (absU < 0.45) {
        el.classList.add(styles.cardActive)
      } else {
        el.classList.remove(styles.cardActive)
      }
    })

    setActiveCenterIndex((prev) => (prev !== closestIndex ? closestIndex : prev))
  }, [getSlotDimensions, itemCount])

  const animateRef = useRef<((time: number) => void) | null>(null)

  // Continuous animation loop using requestAnimationFrame
  const animate = useCallback((time: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = time
    const delta = Math.min(time - lastTimeRef.current, 50) // clamp large frame jumps
    lastTimeRef.current = time

    if (
      isVisibleRef.current &&
      !isInteractingRef.current &&
      !isReducedMotionRef.current
    ) {
      // Auto-scroll velocity: ~38px per second
      const speed = 0.038 * delta
      offsetRef.current += speed
      renderPositions()
    }

    rafIdRef.current = requestAnimationFrame((t) => {
      animateRef.current?.(t)
    })
  }, [renderPositions])

  useEffect(() => {
    animateRef.current = animate
  }, [animate])

  // Setup Observer & Lifecycle
  useEffect(() => {
    // Check reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    isReducedMotionRef.current = motionQuery.matches
    const handleMotionChange = (e: MediaQueryListEvent) => {
      isReducedMotionRef.current = e.matches
    }
    motionQuery.addEventListener('change', handleMotionChange)

    // IntersectionObserver to pause loop off-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting
        if (entry.isIntersecting) {
          renderPositions()
        }
      },
      { threshold: 0.1 }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    // Initialize initial offset centered on set 1
    const { slotWidth } = getSlotDimensions()
    offsetRef.current = itemCount * slotWidth
    renderPositions()

    rafIdRef.current = requestAnimationFrame(animate)

    const handleResize = () => {
      renderPositions()
    }
    window.addEventListener('resize', handleResize)

    return () => {
      motionQuery.removeEventListener('change', handleMotionChange)
      observer.disconnect()
      window.removeEventListener('resize', handleResize)
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current)
      if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    }
  }, [animate, getSlotDimensions, itemCount, renderPositions])

  // Handle user touch interactions
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    touchStartPos.current = { x: touch.clientX, y: touch.clientY }
    lastTouchX.current = touch.clientX
    isHorizontalSwipe.current = null
    isInteractingRef.current = true
    setIsPaused(true)
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    const deltaX = touch.clientX - touchStartPos.current.x
    const deltaY = touch.clientY - touchStartPos.current.y

    // Direction locking: vertical page scroll vs horizontal carousel drag
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 8) {
        isHorizontalSwipe.current = false // Allow normal page scroll
        isInteractingRef.current = false
        setIsPaused(false)
        return
      }
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 8) {
        isHorizontalSwipe.current = true
      }
    }

    if (isHorizontalSwipe.current) {
      const stepX = touch.clientX - lastTouchX.current
      offsetRef.current -= stepX * 1.15
      lastTouchX.current = touch.clientX
      renderPositions()
    }
  }

  const handleTouchEnd = () => {
    isInteractingRef.current = false
    isHorizontalSwipe.current = null

    // Resume auto-scroll after 2.8s of idle
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => {
      setIsPaused(false)
    }, 2800)
  }

  // Jump to card by relative index click
  const handleCardClick = (clickedIndex: number) => {
    if (!containerRef.current) return
    const containerWidth = containerRef.current.clientWidth
    const centerX = containerWidth / 2
    const { cardWidth, slotWidth } = getSlotDimensions()

    const cardCenter = clickedIndex * slotWidth + cardWidth / 2 - offsetRef.current
    const diff = cardCenter - centerX

    // Smoothly nudge to center
    offsetRef.current += diff
    renderPositions()

    // Pause briefly
    isInteractingRef.current = true
    setIsPaused(true)
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => {
      isInteractingRef.current = false
      setIsPaused(false)
    }, 2500)
  }

  // Toggle play/pause
  const togglePause = () => {
    const nextState = !isPaused
    setIsPaused(nextState)
    isInteractingRef.current = nextState
  }

  return (
    <div
      ref={containerRef}
      className={styles.sliderContainer}
      role="region"
      aria-roledescription="3D curved carousel"
      aria-label="Academic and project journey slider"
    >
      {/* 3D Curved Perspective Stage */}
      <div
        className={styles.perspectiveStage}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <div ref={trackRef} className={styles.track3D}>
          {loopItems.map((item, index) => {
            const originalIndex = index % itemCount
            const isActive = activeCenterIndex === originalIndex

            return (
              <div
                key={`${item.id}-${index}`}
                ref={(el) => {
                  cardElementsRef.current[index] = el
                }}
                className={styles.curvedCard}
                onClick={() => handleCardClick(index)}
                role="group"
                aria-roledescription="slide"
                aria-label={`${originalIndex + 1} of ${itemCount}: ${item.role}`}
                tabIndex={isActive ? 0 : -1}
              >
                {/* Card Top Meta */}
                <div className={styles.cardHeader}>
                  <div className={styles.typeTag}>
                    <CareerIcon type={item.type} />
                    <span>{item.type.toUpperCase()}</span>
                  </div>
                  <span className={styles.period}>{item.period}</span>
                </div>

                {/* Role and Organization */}
                <h3 className={styles.roleTitle}>{item.role}</h3>
                <h4 className={styles.companyTitle}>{item.company}</h4>

                {/* Narrative */}
                <p className={styles.description}>{item.description}</p>

                {/* Technologies */}
                <div className={styles.techList}>
                  {item.technologies.map((tech) => (
                    <span key={tech} className={styles.techBadge}>
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Top specular reflection bar */}
                <div className={styles.cardReflection} aria-hidden="true" />
              </div>
            )
          })}
        </div>
      </div>

      {/* Subtle Bottom Controls & Status Indicator */}
      <div className={styles.bottomBar}>
        <div className={styles.counterGroup}>
          <span className={styles.counterActive}>
            {String(activeCenterIndex + 1).padStart(2, '0')}
          </span>
          <span className={styles.counterSep}>/</span>
          <span className={styles.counterTotal}>
            {String(itemCount).padStart(2, '0')}
          </span>
        </div>

        <div className={styles.pipsIndicator} aria-hidden="true">
          {career.map((_, i) => (
            <span
              key={i}
              className={`${styles.pipDot} ${activeCenterIndex === i ? styles.pipDotActive : ''}`}
            />
          ))}
        </div>

        <button
          type="button"
          className={styles.pauseButton}
          onClick={togglePause}
          aria-label={isPaused ? 'Resume auto-scroll' : 'Pause auto-scroll'}
        >
          {isPaused ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          )}
          <span>{isPaused ? 'Paused' : 'Auto'}</span>
        </button>
      </div>
    </div>
  )
}
