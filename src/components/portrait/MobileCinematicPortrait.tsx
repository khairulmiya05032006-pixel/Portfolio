'use client'

import React, { useEffect, useRef, useState } from 'react'
import styles from './MobileCinematicPortrait.module.scss'

const TOTAL_FRAMES = 37

// Manifest for the 37 chronologically ordered frames from mobile_fit_image
const getFramePath = (index: number) => {
  const frameNum = String(index + 1).padStart(3, '0')
  return `/mobile_fit_image/processed-ezgif-frame-${frameNum}.png`
}

export function MobileCinematicPortrait() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<(HTMLImageElement | null)[]>([])
  const isLoadedRef = useRef<boolean[]>([])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Only initialize and run on mobile / tablet screens <= 900px
    if (typeof window === 'undefined' || window.innerWidth > 900) return

    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    let isDisposed = false
    let animFrameId: number | null = null

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    imagesRef.current = new Array(TOTAL_FRAMES).fill(null)
    isLoadedRef.current = new Array(TOTAL_FRAMES).fill(false)

    // -------------------------------------------------------------------------
    // 1. High-DPI Canvas Resolution Sizing
    // -------------------------------------------------------------------------
    const updateCanvasSize = () => {
      if (!canvas) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      const w = Math.round((rect.width || window.innerWidth) * dpr)
      const h = Math.round((rect.height || window.innerHeight) * dpr)
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
    }

    updateCanvasSize()

    // -------------------------------------------------------------------------
    // 2. High-Performance Frame Drawing to Canvas (Aspect Contain)
    // -------------------------------------------------------------------------
    const drawFrame = (frameIndex: number) => {
      const ctx = canvas.getContext('2d')
      if (!ctx || canvas.width === 0 || canvas.height === 0) return

      // Find requested image or closest loaded neighbor to prevent blank frames
      let img = imagesRef.current[frameIndex]
      if (!img || !isLoadedRef.current[frameIndex]) {
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          const prev = frameIndex - offset
          if (prev >= 0 && imagesRef.current[prev] && isLoadedRef.current[prev]) {
            img = imagesRef.current[prev]
            break
          }
          const next = frameIndex + offset
          if (next < TOTAL_FRAMES && imagesRef.current[next] && isLoadedRef.current[next]) {
            img = imagesRef.current[next]
            break
          }
        }
      }

      if (!img || !img.complete || img.naturalWidth === 0) return

      const cW = canvas.width
      const cH = canvas.height
      const imgW = img.naturalWidth
      const imgH = img.naturalHeight

      // Scale to fit screen with aspect-ratio contain
      const scale = Math.min(cW / imgW, cH / imgH)
      const drawW = imgW * scale
      const drawH = imgH * scale
      const drawX = (cW - drawW) / 2
      const drawY = (cH - drawH) / 2

      ctx.clearRect(0, 0, cW, cH)
      ctx.drawImage(img, drawX, drawY, drawW, drawH)
    }

    // -------------------------------------------------------------------------
    // 3. Preload & Decode Image Frames
    // -------------------------------------------------------------------------
    // Preload initial frame 0 immediately
    const firstImg = new Image()
    firstImg.src = getFramePath(0)
    imagesRef.current[0] = firstImg

    firstImg.onload = () => {
      if (isDisposed) return
      isLoadedRef.current[0] = true
      setIsReady(true)
      drawFrame(0)

      // Preload subsequent frames in batches to balance network and memory
      for (let i = 1; i < TOTAL_FRAMES; i++) {
        const img = new Image()
        img.src = getFramePath(i)
        imagesRef.current[i] = img
        img.onload = () => {
          if (!isDisposed) isLoadedRef.current[i] = true
        }
      }
    }

    // -------------------------------------------------------------------------
    // 4. Scroll Tracking & Progress Calculation
    // -------------------------------------------------------------------------
    let targetFrame = 0
    let currentFrame = 0
    let isVisible = true

    const updateScrollProgress = () => {
      if (!container) return
      const rect = container.getBoundingClientRect()
      const windowHeight = window.innerHeight || 800

      // The sticky section pins when rect.top <= 0
      // Total scrollable distance through the section runway
      const totalDistance = rect.height - windowHeight
      if (totalDistance <= 0) return

      // Normalized scroll progress [0, 1]
      const scrolled = -rect.top
      const progress = Math.max(0, Math.min(1, scrolled / totalDistance))

      targetFrame = progress * (TOTAL_FRAMES - 1)
    }

    const handleScroll = () => {
      updateScrollProgress()
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    updateScrollProgress()

    // -------------------------------------------------------------------------
    // 5. Visibility Observer & RAF Render Loop
    // -------------------------------------------------------------------------
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) {
          updateScrollProgress()
        }
      },
      { threshold: 0.05 }
    )
    observer.observe(container)

    const renderLoop = () => {
      if (isDisposed) return

      if (isVisible) {
        if (!prefersReducedMotion) {
          // Inertial damping for cinematic smooth scrubbing
          currentFrame += (targetFrame - currentFrame) * 0.18
        } else {
          currentFrame = targetFrame
        }

        const safeIndex = Math.min(
          TOTAL_FRAMES - 1,
          Math.max(0, Math.round(currentFrame))
        )
        drawFrame(safeIndex)
      }

      animFrameId = requestAnimationFrame(renderLoop)
    }

    animFrameId = requestAnimationFrame(renderLoop)

    const handleResize = () => {
      updateCanvasSize()
      updateScrollProgress()
      drawFrame(Math.round(currentFrame))
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
    <section
      ref={containerRef}
      className={styles.animationSection}
      aria-label="Cinematic Mobile Portrait Scroll Animation"
    >
      <div className={styles.stickyStage}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
    </section>
  )
}

export default MobileCinematicPortrait
