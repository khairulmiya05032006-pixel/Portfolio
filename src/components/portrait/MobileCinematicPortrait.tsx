'use client'

import React, { useEffect, useRef, useState } from 'react'
import styles from './MobileCinematicPortrait.module.scss'

const TOTAL_FRAMES = 40

const getFramePath = (index: number) => {
  const frameNum = String(index + 1).padStart(3, '0')
  return `/images/projects/ezgif-frame-${frameNum}.jpg`
}

export function MobileCinematicPortrait() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<(HTMLImageElement | null)[]>([])
  const isLoadedRef = useRef<boolean[]>([])
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Only run on mobile / tablet screens <= 900px
    if (window.innerWidth > 900) return

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
    // 2. High-Performance Frame Drawing to Canvas
    // -------------------------------------------------------------------------
    const drawFrame = (frameIndex: number) => {
      const ctx = canvas.getContext('2d')
      if (!ctx || canvas.width === 0 || canvas.height === 0) return

      // Find requested image or closest loaded neighbor
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
      const imgAspect = imgW / imgH
      const canvasAspect = cW / cH

      let drawW: number
      let drawH: number

      // In portrait mobile orientation, fit to width so portrait is centered and particles expand edge-to-edge
      if (canvasAspect < imgAspect) {
        drawW = cW
        drawH = cW / imgAspect
      } else {
        drawH = cH
        drawW = cH * imgAspect
      }

      const drawX = Math.round((cW - drawW) * 0.5)
      const drawY = Math.round((cH - drawH) * 0.5)

      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.clearRect(0, 0, cW, cH)
      ctx.drawImage(img, drawX, drawY, drawW, drawH)
    }

    // -------------------------------------------------------------------------
    // 3. Preload Strategy (Instant frame 0 paint + async background preload)
    // -------------------------------------------------------------------------
    const frame0 = new Image()
    frame0.src = getFramePath(0)
    frame0.onload = () => {
      if (isDisposed) return
      imagesRef.current[0] = frame0
      isLoadedRef.current[0] = true
      setIsReady(true)
      drawFrame(0)
    }

    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = getFramePath(i)
      img.onload = () => {
        if (isDisposed) return
        imagesRef.current[i] = img
        isLoadedRef.current[i] = true
      }
    }

    // -------------------------------------------------------------------------
    // 4. Scroll Tracking & Inertial Damping
    // -------------------------------------------------------------------------
    let targetFrame = 0
    let currentFrame = 0
    let isVisible = true

    const updateScrollProgress = () => {
      if (!container || !isVisible) return

      const rect = container.getBoundingClientRect()
      const windowH = window.innerHeight || 800
      const totalScrollable = container.offsetHeight - windowH

      if (totalScrollable <= 0) return

      // Normalized scroll progress through the sticky runway: 0.0 -> 1.0
      const scrolled = -rect.top
      const progress = Math.max(0, Math.min(1, scrolled / totalScrollable))

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
