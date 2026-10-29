'use client'

import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import styles from './BackgroundScrollAnimation.module.scss'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const TOTAL_FRAMES = 50

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

  const imagesRef = useRef<(HTMLImageElement | null)[]>([])
  const isLoadedRef = useRef<boolean[]>([])
  const currentFrameRef = useRef<number>(0)

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    imagesRef.current = new Array(TOTAL_FRAMES).fill(null)
    isLoadedRef.current = new Array(TOTAL_FRAMES).fill(false)

    // Render frame to canvas with responsive positioning
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
        // On desktop, bias slightly toward the right corridor where the developer avatar sits
        const bias = window.innerWidth > 960 ? 0.65 : 0.5
        offsetX = (cvs.width - drawW) * bias
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

    // 3. Smooth scroll tracking across the whole page
    let trigger: ScrollTrigger | null = null

    // Give DOM a microtask tick to ensure document height is ready
    const timer = setTimeout(() => {
      trigger = ScrollTrigger.create({
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
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
    }, 50)

    const handleResize = () => {
      renderFrame(currentFrameRef.current)
    }

    window.addEventListener('resize', handleResize, { passive: true })

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
      if (trigger) trigger.kill()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`${styles.container} ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.overlay} />
    </div>
  )
}

export default BackgroundScrollAnimation
