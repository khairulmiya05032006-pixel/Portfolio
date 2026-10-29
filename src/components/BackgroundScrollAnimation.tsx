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
  const trackRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayLeftRef = useRef<HTMLDivElement>(null)
  const overlayRightRef = useRef<HTMLDivElement>(null)

  const imagesRef = useRef<(HTMLImageElement | null)[]>([])
  const isLoadedRef = useRef<boolean[]>([])
  const currentFrameRef = useRef<number>(0)

  useEffect(() => {
    const container = containerRef.current
    const track = trackRef.current
    const canvas = canvasRef.current
    if (!container || !track || !canvas) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    imagesRef.current = new Array(TOTAL_FRAMES).fill(null)
    isLoadedRef.current = new Array(TOTAL_FRAMES).fill(false)

    // Calculate horizontal shift amount for right/left corridor placement
    const getShiftAmount = () => (window.innerWidth > 768 ? window.innerWidth * 0.15 : 0)

    // Set initial position: Character on the RIGHT, text on the LEFT
    const initialShift = getShiftAmount()
    gsap.set(track, { x: initialShift })

    if (overlayLeftRef.current && overlayRightRef.current) {
      overlayLeftRef.current.style.opacity = '1'
      overlayRightRef.current.style.opacity = '0'
    }

    // Render frame to canvas with full-bleed cover logic
    const renderFrame = (targetIndex: number) => {
      const cvs = canvasRef.current
      if (!cvs) return
      const ctx = cvs.getContext('2d')
      if (!ctx) return

      // Find target image or nearest loaded frame
      let img = imagesRef.current[targetIndex]
      if (!img || !isLoadedRef.current[targetIndex]) {
        for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
          const prev = targetIndex - offset
          if (prev >= 0 && imagesRef.current[prev] && isLoadedRef.current[prev]) {
            img = imagesRef.current[prev]
            break
          }
          const next = targetIndex + offset
          if (next < TOTAL_FRAMES && imagesRef.current[next] && isLoadedRef.current[next]) {
            img = imagesRef.current[next]
            break
          }
        }
      }

      if (!img || !img.complete || img.naturalWidth === 0) return

      // High-DPI support
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = cvs.getBoundingClientRect()
      const displayW = Math.round(rect.width * dpr)
      const displayH = Math.round(rect.height * dpr)

      if (cvs.width !== displayW || cvs.height !== displayH) {
        cvs.width = displayW
        cvs.height = displayH
      }

      const imgW = img.naturalWidth
      const imgH = img.naturalHeight
      const imgRatio = imgW / imgH
      const canvasRatio = cvs.width / cvs.height

      let drawW: number
      let drawH: number
      let offsetX = 0
      let offsetY = 0

      if (canvasRatio > imgRatio) {
        drawW = cvs.width
        drawH = cvs.width / imgRatio
        offsetY = (cvs.height - drawH) / 2
      } else {
        drawH = cvs.height
        drawW = cvs.height * imgRatio
        offsetX = (cvs.width - drawW) / 2
      }

      ctx.clearRect(0, 0, cvs.width, cvs.height)
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH)
    }

    // 1. Preload first frame immediately for instant first-paint
    const frame0 = new Image()
    frame0.src = getFramePath(0)
    frame0.onload = () => {
      imagesRef.current[0] = frame0
      isLoadedRef.current[0] = true
      renderFrame(0)
    }

    // 2. Preload remaining frames in background
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      const img = new Image()
      img.src = getFramePath(i)
      img.onload = () => {
        imagesRef.current[i] = img
        isLoadedRef.current[i] = true
        if (currentFrameRef.current === i) {
          renderFrame(i)
        }
      }
    }

    if (prefersReducedMotion) {
      return
    }

    // 3. ScrollTrigger animations
    let positionTrigger: ScrollTrigger | null = null
    let scrubTrigger: ScrollTrigger | null = null
    let blurTrigger: ScrollTrigger | null = null

    // Give DOM a microtask tick to ensure document height and section elements are ready
    const timer = setTimeout(() => {
      const landingSection = document.getElementById('landing')
      const aboutSection = document.getElementById('about')
      const careerSection = document.getElementById('career')

      // A. Smooth lateral transition: Character RIGHT (Landing) -> Character LEFT (About)
      if (landingSection && aboutSection) {
        positionTrigger = ScrollTrigger.create({
          trigger: landingSection,
          start: 'top top',
          endTrigger: aboutSection,
          end: 'center center',
          scrub: 1.0,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = Math.max(0, Math.min(1, self.progress)) // 0 (Landing) -> 1 (About)
            const shift = getShiftAmount()

            // Interpolate smoothly: +shift (Right) -> -shift (Left)
            const currentX = (1 - 2 * p) * shift
            if (trackRef.current) {
              gsap.set(trackRef.current, { x: currentX })
            }

            // Crossfade reading overlays:
            // p = 0: overlayLeft = 1 (dark on left, clear on right)
            // p = 1: overlayRight = 1 (clear on left, dark on right)
            if (overlayLeftRef.current && overlayRightRef.current) {
              overlayLeftRef.current.style.opacity = (1 - p).toFixed(3)
              overlayRightRef.current.style.opacity = p.toFixed(3)
            }
          },
        })
      }

      // B. Scrub frames across the scroll journey
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
        scrub: 1.0,
        onUpdate: (self) => {
          const progress = Math.max(0, Math.min(1, self.progress))
          const targetIndex = Math.min(
            TOTAL_FRAMES - 1,
            Math.round(progress * (TOTAL_FRAMES - 1))
          )

          if (targetIndex !== currentFrameRef.current) {
            currentFrameRef.current = targetIndex
            renderFrame(targetIndex)
          }
        },
      })

      // C. Smooth blur & fade out as user scrolls into and down past Education (#career)
      blurTrigger = ScrollTrigger.create({
        trigger: careerSection || '#career',
        start: 'top 60%',
        end: 'bottom 10%',
        scrub: 0.8,
        onUpdate: (self) => {
          const p = Math.max(0, Math.min(1, self.progress))
          // Exponential ease for natural blur transition
          const blurAmount = Math.pow(p, 1.2) * 28 // 0px -> 28px
          const opacity = Math.max(0, 1 - p * 1.1) // 1.0 -> 0.0

          if (containerRef.current) {
            containerRef.current.style.filter = `blur(${blurAmount.toFixed(1)}px)`
            containerRef.current.style.opacity = opacity.toFixed(3)
            containerRef.current.style.visibility = opacity <= 0.01 ? 'hidden' : 'visible'
          }
        },
      })
    }, 60)

    const handleResize = () => {
      const shift = getShiftAmount()
      if (positionTrigger && trackRef.current) {
        const p = positionTrigger.progress
        const currentX = (1 - 2 * p) * shift
        gsap.set(trackRef.current, { x: currentX })
      } else if (trackRef.current) {
        gsap.set(trackRef.current, { x: shift })
      }
      renderFrame(currentFrameRef.current)
      ScrollTrigger.refresh()
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      clearTimeout(timer)
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
      <div ref={trackRef} className={styles.canvasTrack}>
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
      <div ref={overlayLeftRef} className={styles.overlayLeft} />
      <div ref={overlayRightRef} className={styles.overlayRight} />
      <div className={styles.vignetteTopBottom} />
    </div>
  )
}

export default BackgroundScrollAnimation
