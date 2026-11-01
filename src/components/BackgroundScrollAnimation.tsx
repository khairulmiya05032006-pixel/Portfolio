'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './BackgroundScrollAnimation.module.scss'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const TOTAL_FRAMES = 40

const getFramePath = (index: number) => {
  const frameNum = String(index + 1).padStart(3, '0')
  return `/images/projects/ezgif-frame-${frameNum}.jpg`
}

interface BackgroundScrollAnimationProps {
  className?: string
}

export function BackgroundScrollAnimation({ className = '' }: BackgroundScrollAnimationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayLeftRef = useRef<HTMLDivElement>(null)
  const overlayRightRef = useRef<HTMLDivElement>(null)

  const imagesRef = useRef<(HTMLImageElement | null)[]>([])
  const isLoadedRef = useRef<boolean[]>([])

  useEffect(() => {
    const container = containerRef.current
    const cvs = canvasRef.current
    if (!container || !cvs) return

    // Desktop-only animation: completely avoid loading 40 desktop frames
    // or spinning RAF loops on mobile viewports (<= 900px)
    if (window.innerWidth <= 900) {
      return
    }

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    imagesRef.current = new Array(TOTAL_FRAMES).fill(null)
    isLoadedRef.current = new Array(TOTAL_FRAMES).fill(false)

    // Sizing: set canvas resolution cleanly without forced reflow in render ticks
    const updateCanvasSize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const width = Math.round(window.innerWidth * dpr)
      const height = Math.round(window.innerHeight * dpr)
      if (cvs.width !== width || cvs.height !== height) {
        cvs.width = width
        cvs.height = height
      }
    }

    updateCanvasSize()

    // Smooth state variables for requestAnimationFrame lerp loop
    const LANDING_BIAS = 0.74 // Character in Right Corridor
    const ABOUT_BIAS = 0.22 // Character in Left Corridor

    const getInitialBias = () => (window.innerWidth <= 900 ? 0.5 : LANDING_BIAS)

    let targetFrame = 0
    let currentFrame = 0
    let targetCharBias = getInitialBias()
    let currentCharBias = getInitialBias()
    let targetBlur = 0
    let currentBlur = 0
    let targetOpacity = 1
    let currentOpacity = 1

    let animFrameId: number | null = null

    // Draw frame to canvas with responsive lateral positioning
    const drawFrame = (frameIndex: number, charBias: number) => {
      const ctx = cvs.getContext('2d')
      if (!ctx) return

      // Find target image or nearest loaded frame
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

      const W = cvs.width
      const H = cvs.height
      const imgW = img.naturalWidth
      const imgH = img.naturalHeight

      // Scale proportionally to cover height with a slight margin
      let scale = Math.max(W / imgW, H / imgH) * 1.05
      let drawW = imgW * scale
      let drawH = imgH * scale
      let drawY = (H - drawH) / 2

      // Position character at charBias of canvas width
      // In the source video frames, the character is horizontally centered (0.5 * drawW)
      const charScreenX = W * charBias
      const drawX = charScreenX - drawW * 0.5

      ctx.clearRect(0, 0, W, H)
      ctx.drawImage(img, drawX, drawY, drawW, drawH)
    }

    // High-performance RAF rendering loop with inertial damping
    const renderLoop = () => {
      // Pause drawing on mobile since container is hidden
      if (window.innerWidth <= 900) {
        animFrameId = requestAnimationFrame(renderLoop)
        return
      }

      // Damped lerp for silky smooth 60/120fps motion
      currentFrame += (targetFrame - currentFrame) * 0.14
      currentCharBias += (targetCharBias - currentCharBias) * 0.08
      currentBlur += (targetBlur - currentBlur) * 0.1
      currentOpacity += (targetOpacity - currentOpacity) * 0.1

      const frameIdx = Math.min(
        TOTAL_FRAMES - 1,
        Math.max(0, Math.round(currentFrame))
      )

      drawFrame(frameIdx, currentCharBias)

      // Smoothly update blur & opacity on container
      if (containerRef.current) {
        if (currentBlur > 0.1) {
          containerRef.current.style.filter = `blur(${currentBlur.toFixed(1)}px)`
        } else {
          containerRef.current.style.filter = 'none'
        }
        containerRef.current.style.opacity = currentOpacity.toFixed(3)
        containerRef.current.style.visibility =
          currentOpacity <= 0.01 ? 'hidden' : 'visible'
      }

      // Smoothly crossfade reading overlays:
      // progress: 0 (bias = LANDING_BIAS) -> 1 (bias = ABOUT_BIAS)
      const biasRange = LANDING_BIAS - ABOUT_BIAS
      const scrollRatio =
        biasRange > 0
          ? Math.max(0, Math.min(1, (LANDING_BIAS - currentCharBias) / biasRange))
          : 0

      if (overlayLeftRef.current && overlayRightRef.current) {
        overlayLeftRef.current.style.opacity = (1 - scrollRatio).toFixed(3)
        overlayRightRef.current.style.opacity = scrollRatio.toFixed(3)
      }

      animFrameId = requestAnimationFrame(renderLoop)
    }

    animFrameId = requestAnimationFrame(renderLoop)

    // 1. Preload first frame immediately for instant first-paint
    const frame0 = new Image()
    frame0.src = getFramePath(0)
    frame0.onload = () => {
      imagesRef.current[0] = frame0
      isLoadedRef.current[0] = true
    }

    // 2. Preload remaining frames in background
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = getFramePath(i)
      img.onload = () => {
        imagesRef.current[i] = img
        isLoadedRef.current[i] = true
      }
    }

    if (prefersReducedMotion) {
      return () => {
        if (animFrameId) cancelAnimationFrame(animFrameId)
      }
    }

    // 3. ScrollTrigger Choreography
    let positionTrigger: ScrollTrigger | null = null
    let scrubTrigger: ScrollTrigger | null = null
    let blurTrigger: ScrollTrigger | null = null

    const timer = setTimeout(() => {
      const landingSection = document.getElementById('landing')
      const aboutSection = document.getElementById('about')
      const careerSection = document.getElementById('career')

      // A. Character lateral glide: RIGHT (Landing) -> LEFT (About)
      if (landingSection && aboutSection) {
        positionTrigger = ScrollTrigger.create({
          trigger: landingSection,
          start: 'top top',
          endTrigger: aboutSection,
          end: 'center center',
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = Math.max(0, Math.min(1, self.progress))
            const isMobile = window.innerWidth <= 900
            if (isMobile) {
              targetCharBias = 0.5
            } else {
              targetCharBias = LANDING_BIAS - p * (LANDING_BIAS - ABOUT_BIAS)
            }
          },
        })
      }

      // B. Frame sequence scrub across Landing through Education (#career)
      scrubTrigger = ScrollTrigger.create({
        trigger: document.documentElement,
        start: 'top top',
        end: () => {
          if (careerSection) {
            const rect = careerSection.getBoundingClientRect()
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            return `${scrollTop + rect.bottom} bottom`
          }
          return 'center center'
        },
        scrub: true,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress))
          targetFrame = p * (TOTAL_FRAMES - 1)
        },
      })

      // C. Blur & fade out into Education (#career)
      blurTrigger = ScrollTrigger.create({
        trigger: careerSection || '#career',
        start: 'top 65%',
        end: 'bottom 10%',
        scrub: true,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress))
          targetBlur = Math.pow(p, 1.2) * 28 // 0px -> 28px
          targetOpacity = Math.max(0, 1 - p * 1.1) // 1.0 -> 0.0
        },
      })
    }, 60)

    const handleResize = () => {
      updateCanvasSize()
      const isMobile = window.innerWidth <= 900
      if (isMobile) {
        targetCharBias = 0.5
      } else if (positionTrigger) {
        const p = positionTrigger.progress
        targetCharBias = LANDING_BIAS - p * (LANDING_BIAS - ABOUT_BIAS)
      } else {
        targetCharBias = LANDING_BIAS
      }
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      clearTimeout(timer)
      if (animFrameId) cancelAnimationFrame(animFrameId)
      window.removeEventListener('resize', handleResize)
      if (positionTrigger) positionTrigger.kill()
      if (scrubTrigger) scrubTrigger.kill()
      if (blurTrigger) blurTrigger.kill()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      <div ref={overlayLeftRef} className={styles.overlayLeft} />
      <div ref={overlayRightRef} className={styles.overlayRight} />
      <div className={styles.vignetteTopBottom} />
    </div>
  )
}

export default BackgroundScrollAnimation
