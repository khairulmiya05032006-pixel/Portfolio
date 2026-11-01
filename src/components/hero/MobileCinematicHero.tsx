'use client'

import React, { useEffect, useRef, useState } from 'react'
import type { portfolioConfig } from '@/config/portfolio'
import styles from './MobileCinematicHero.module.scss'

const TOTAL_FRAMES = 37

// Frames: 001.png (ending complete portrait) to 037.png (starting particle wave)
// Located in /mobile_fit_image/
const getFramePath = (index: number) => {
  const frameNum = String(index + 1).padStart(3, '0')
  return `/mobile_fit_image/processed-ezgif-frame-${frameNum}.png`
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
    // 2. High-Performance Frame Drawing (Full-Width to Final Centered Portrait)
    // -------------------------------------------------------------------------
    let lastRenderedFrame = -1
    let lastRenderedProgress = -1
    let lastRenderedEntrance = -1

    const drawFrame = (
      frameIndex: number,
      progress: number,
      entranceZoom: number = 1.0
    ) => {
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
      const dpr = Math.min(window.devicePixelRatio || 1, 2)

      // 1. Initial State (progress = 0):
      // Occupies the ENTIRE mobile viewport width, extending from extreme left to extreme right
      const initialW = cW * entranceZoom
      const initialH = initialW * (imgH / imgW)

      // 2. Final State (progress = 1):
      // Exact dimensions matching Screenshot 2 (centered portrait, width ~250px CSS, constrained by height)
      let finalW = Math.min(250 * dpr, cW * 0.68)
      let finalH = finalW * (imgH / imgW)
      if (finalH > cH * 0.88) {
        finalH = cH * 0.88
        finalW = finalH * (imgW / imgH)
      }

      // 3. Smooth Transition from Full-Width to Final Centered Portrait:
      // Uses smoothstep easing so the transition starts smoothly from full-width
      // and glides gracefully into the exact final dimensions
      const t = Math.max(0, Math.min(1, progress))
      const transitionEase = t * t * (3 - 2 * t)

      const drawW = initialW + (finalW - initialW) * transitionEase
      const drawH = initialH + (finalH - initialH) * transitionEase

      // Symmetrically centered horizontally and vertically
      // At progress = 0: drawW = cW -> drawX = 0 (spans 0 to cW)
      // At progress = 1: drawW = finalW -> drawX = (cW - finalW) / 2 (centered)
      const drawX = (cW - drawW) / 2
      const drawY = (cH - drawH) / 2

      ctx.clearRect(0, 0, cW, cH)
      ctx.drawImage(img, drawX, drawY, drawW, drawH)

      lastRenderedFrame = frameIndex
      lastRenderedProgress = progress
      lastRenderedEntrance = entranceZoom
    }

    // -------------------------------------------------------------------------
    // 3. Preload Strategy: Start with Frame 037 (index 36)
    // -------------------------------------------------------------------------
    const startFrameIndex = TOTAL_FRAMES - 1 // 36 -> processed-ezgif-frame-037.png (horizontal particle wave)

    const startImg = new Image()
    imagesRef.current[startFrameIndex] = startImg

    let entranceStartTime = 0
    let isEntranceActive = true

    const onStartImageLoaded = () => {
      if (isDisposed || isLoadedRef.current[startFrameIndex]) return
      isLoadedRef.current[startFrameIndex] = true
      setIsReady(true)

      // Start the subtle zoom-out entrance animation
      entranceStartTime = performance.now()

      // Immediately render frame 037 at starting full-width
      drawFrame(startFrameIndex, 0, 1.05)

      // Preload subsequent frames in priority batches of 3 to avoid mobile network congestion
      const remainingIndices: number[] = []
      for (let i = startFrameIndex - 1; i >= 0; i--) {
        remainingIndices.push(i)
      }

      const loadNextBatch = () => {
        if (isDisposed || remainingIndices.length === 0) return
        const batch = remainingIndices.splice(0, 3)
        batch.forEach((i) => {
          const frameImg = new Image()
          imagesRef.current[i] = frameImg
          frameImg.onload = () => {
            if (!isDisposed) isLoadedRef.current[i] = true
          }
          frameImg.src = getFramePath(i)
          if (frameImg.complete) {
            isLoadedRef.current[i] = true
          }
        })
        if (remainingIndices.length > 0) {
          if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
            ;(window as unknown as { requestIdleCallback: (cb: () => void) => void }).requestIdleCallback(loadNextBatch)
          } else {
            setTimeout(loadNextBatch, 50)
          }
        }
      }
      loadNextBatch()
    }

    startImg.onload = onStartImageLoaded
    startImg.src = getFramePath(startFrameIndex)
    if (startImg.complete) {
      onStartImageLoaded()
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
        // A. Calculate initial zoom-out entrance (1.05 -> 1.00 over 850ms)
        let entranceZoom = 1.0
        if (isEntranceActive && entranceStartTime > 0) {
          const elapsed = timestamp - entranceStartTime
          const duration = 850
          if (elapsed < duration) {
            const t = elapsed / duration
            const ease = 1 - Math.pow(1 - t, 3)
            entranceZoom = 1.05 - ease * 0.05
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

        // C. REVERSE frame mapping:
        // 0% scroll -> frame index 36 (processed-ezgif-frame-037.png: horizontal particle wave)
        // 100% scroll -> frame index 0 (processed-ezgif-frame-001.png: fully revealed portrait)
        const frameIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.round((1 - p) * (TOTAL_FRAMES - 1)))
        )

        // Draw only when frame index, progress, or entrance zoom changed
        if (
          frameIndex !== lastRenderedFrame ||
          Math.abs(p - lastRenderedProgress) > 0.0008 ||
          Math.abs(entranceZoom - lastRenderedEntrance) > 0.0008
        ) {
          drawFrame(frameIndex, p, entranceZoom)
        }

        // D. Fade out scroll indicator during scroll
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
      const p = Math.max(0, Math.min(1, currentProgress))
      const frameIndex = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round((1 - p) * (TOTAL_FRAMES - 1)))
      )
      drawFrame(frameIndex, p, 1.0)
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
          <span className={styles.greeting}>PEACE BE UPON YOU. I&apos;M</span>
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
