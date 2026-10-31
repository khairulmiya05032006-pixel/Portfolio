'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { portfolioConfig } from '@/config/portfolio'
import styles from './MobileCinematicHero.module.scss'

const TOTAL_FRAMES = 37

// Frames: 001.jpg (ending complete portrait) to 037.jpg (starting particle wave)
// Available in /mobile_fir_image/ and /mobile_fit_image/
const getFramePath = (index: number) => {
  const frameNum = String(index + 1).padStart(3, '0')
  return `/mobile_fir_image/ezgif-frame-${frameNum}.jpg`
}

interface MobileCinematicHeroProps {
  profile: (typeof portfolioConfig)['profile']
}

export function MobileCinematicHero({ profile }: MobileCinematicHeroProps) {
  const runwayRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const indicatorRef = useRef<HTMLDivElement>(null)

  const imagesRef = useRef<(HTMLImageElement | null)[]>([])
  const isLoadedRef = useRef<boolean[]>([])
  const [, setIsReady] = useState(false)

  useEffect(() => {
    // Exclusively mobile implementation (<= 900px)
    if (typeof window === 'undefined' || window.innerWidth > 900) return

    const runway = runwayRef.current
    const canvas = canvasRef.current
    if (!runway || !canvas) return

    let isDisposed = false
    let animFrameId: number | null = null

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    imagesRef.current = new Array(TOTAL_FRAMES).fill(null)
    isLoadedRef.current = new Array(TOTAL_FRAMES).fill(false)

    // -------------------------------------------------------------------------
    // 1. High-DPI Canvas Sizing
    // -------------------------------------------------------------------------
    const updateCanvasSize = () => {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      const w = Math.round(rect.width * dpr)
      const h = Math.round(rect.height * dpr)
      if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w
        canvas.height = h
      }
    }

    updateCanvasSize()

    // -------------------------------------------------------------------------
    // 2. High-Performance Frame Drawing (Aspect Ratio Contain with Zoom)
    // -------------------------------------------------------------------------
    let lastRenderedFrame = -1
    let lastRenderedZoom = -1

    const drawFrame = (frameIndex: number, zoomLevel: number) => {
      const ctx = canvas.getContext('2d')
      if (!ctx || canvas.width === 0 || canvas.height === 0) return

      // Find requested image or closest loaded neighbor to prevent blank flashes
      let img = imagesRef.current[frameIndex]
      if (!img || !isLoadedRef.current[frameIndex]) {
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          const next = frameIndex + offset
          if (next < TOTAL_FRAMES && imagesRef.current[next] && isLoadedRef.current[next]) {
            img = imagesRef.current[next]
            break
          }
          const prev = frameIndex - offset
          if (prev >= 0 && imagesRef.current[prev] && isLoadedRef.current[prev]) {
            img = imagesRef.current[prev]
            break
          }
        }
      }

      if (!img || !img.complete || img.naturalWidth === 0) return

      const cW = canvas.width
      const cH = canvas.height
      const imgW = img.naturalWidth || 1080
      const imgH = img.naturalHeight || 1920

      // Aspect ratio contain with centered zoom origin
      const baseScale = Math.min(cW / imgW, cH / imgH)
      const finalScale = baseScale * zoomLevel
      const drawW = imgW * finalScale
      const drawH = imgH * finalScale
      const drawX = (cW - drawW) / 2
      const drawY = (cH - drawH) / 2

      ctx.clearRect(0, 0, cW, cH)
      ctx.drawImage(img, drawX, drawY, drawW, drawH)

      lastRenderedFrame = frameIndex
      lastRenderedZoom = zoomLevel
    }

    // -------------------------------------------------------------------------
    // 3. Preload Strategy: Start with Frame 037 (index 36)
    // -------------------------------------------------------------------------
    const startFrameIndex = TOTAL_FRAMES - 1 // 36 -> ezgif-frame-037.jpg (horizontal particle wave)

    const startImg = new Image()
    startImg.src = getFramePath(startFrameIndex)
    imagesRef.current[startFrameIndex] = startImg

    let entranceStartTime = 0
    let isEntranceActive = true

    startImg.onload = () => {
      if (isDisposed) return
      isLoadedRef.current[startFrameIndex] = true
      setIsReady(true)

      // Start the subtle zoom-out entrance animation
      entranceStartTime = performance.now()

      // Immediately render frame 037 at starting zoom 1.07
      drawFrame(startFrameIndex, 1.07)

      // Preload subsequent frames in priority order of reverse scroll (35 down to 0)
      for (let i = startFrameIndex - 1; i >= 0; i--) {
        const frameImg = new Image()
        frameImg.src = getFramePath(i)
        imagesRef.current[i] = frameImg
        frameImg.onload = () => {
          if (!isDisposed) isLoadedRef.current[i] = true
        }
      }
    }

    // -------------------------------------------------------------------------
    // 4. Scroll Progress & Reverse Mapping
    // -------------------------------------------------------------------------
    let targetProgress = 0
    let currentProgress = 0
    let isVisible = true

    const updateScrollProgress = () => {
      if (!runway) return
      const rect = runway.getBoundingClientRect()
      const viewportH = window.visualViewport?.height || window.innerHeight || 800

      // Runway scrollable distance
      const totalDistance = rect.height - viewportH
      if (totalDistance <= 0) return

      const scrolled = -rect.top
      const p = Math.max(0, Math.min(1, scrolled / totalDistance))
      targetProgress = p
    }

    const handleScroll = () => {
      updateScrollProgress()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateScrollProgress()

    // -------------------------------------------------------------------------
    // 5. Intersection Observer: Pause loop when off-screen
    // -------------------------------------------------------------------------
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) {
          updateScrollProgress()
        }
      },
      { threshold: 0.01 }
    )
    observer.observe(runway)

    // -------------------------------------------------------------------------
    // 6. RAF Animation Loop: Zoom-Out Entrance + Reverse Scroll Scrubbing
    // -------------------------------------------------------------------------
    const renderLoop = (timestamp: number) => {
      if (isDisposed) return

      if (isVisible) {
        // A. Calculate initial zoom-out entrance (1.07 -> 1.00 over 1050ms)
        let entranceZoom = 1.0
        if (isEntranceActive && entranceStartTime > 0) {
          const elapsed = timestamp - entranceStartTime
          const duration = 1050
          if (elapsed < duration) {
            const t = elapsed / duration
            const ease = 1 - Math.pow(1 - t, 3)
            entranceZoom = 1.07 - ease * 0.07
          } else {
            entranceZoom = 1.0
            isEntranceActive = false
          }
        }

        // B. Smooth progress damping for cinematic scrubbing
        if (!prefersReducedMotion) {
          currentProgress += (targetProgress - currentProgress) * 0.24
        } else {
          currentProgress = targetProgress
        }

        const p = Math.max(0, Math.min(1, currentProgress))

        // C. Calculate scroll-driven zoom-in (1.00 -> 1.04)
        const scrollZoom = 1.0 + p * 0.04

        // D. Combine zoom factors
        const totalZoom = entranceZoom * scrollZoom

        // E. REVERSE frame mapping:
        // 0% scroll -> frame index 36 (ezgif-frame-037.jpg: horizontal particle wave)
        // 100% scroll -> frame index 0 (ezgif-frame-001.jpg: fully revealed portrait)
        const frameIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.round((1 - p) * (TOTAL_FRAMES - 1)))
        )

        // Draw only when frame index or zoom changed
        if (
          frameIndex !== lastRenderedFrame ||
          Math.abs(totalZoom - lastRenderedZoom) > 0.0005
        ) {
          drawFrame(frameIndex, totalZoom)
        }

        // F. Fade out scroll indicator during scroll
        if (indicatorRef.current) {
          const indOpacity = Math.max(0, 1 - p * 3.5)
          indicatorRef.current.style.opacity = `${indOpacity}`
        }
      }

      animFrameId = requestAnimationFrame(renderLoop)
    }

    animFrameId = requestAnimationFrame(renderLoop)

    // -------------------------------------------------------------------------
    // 7. Resize Handler
    // -------------------------------------------------------------------------
    const handleResize = () => {
      updateCanvasSize()
      updateScrollProgress()
      lastRenderedFrame = -1 // Force redraw
    }

    window.addEventListener('resize', handleResize, { passive: true })

    // -------------------------------------------------------------------------
    // Cleanup
    // -------------------------------------------------------------------------
    return () => {
      isDisposed = true
      if (animFrameId) cancelAnimationFrame(animFrameId)
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
    }
  }, [])

  return (
    <div ref={runwayRef} className={styles.mobileRunway}>
      <div className={styles.stickyStage}>
        {/* Top Header Block: Name & Subtitle */}
        <div className={styles.headerBlock}>
          <h1 className={styles.headline}>
            Khairul <span className={styles.accentText}>Miya</span>
          </h1>
          <p className={styles.tagline}>{profile.tagline}</p>
        </div>

        {/* Dedicated Center Area: Canvas Particle-to-Portrait Animation */}
        <div className={styles.canvasContainer}>
          <canvas ref={canvasRef} className={styles.canvas} />
        </div>

        {/* Bottom Action Block: CTAs, Stats & Scroll Indicator */}
        <div className={styles.actionBlock}>
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

          {/* Subtle Scroll Indicator */}
          <div ref={indicatorRef} className={styles.scrollIndicator}>
            <span className={styles.scrollText}>Scroll to reconstruct portrait</span>
            <span className={styles.scrollArrow} aria-hidden="true">
              ↓
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
