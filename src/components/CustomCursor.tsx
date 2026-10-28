'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './CustomCursor.module.scss'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    let mouseX = -100
    let mouseY = -100
    let ringX = -100
    let ringY = -100
    let animId: number

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }
    }

    const render = () => {
      ringX += (mouseX - ringX) * 0.18
      ringY += (mouseY - ringY) * 0.18

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`
      }

      animId = requestAnimationFrame(render)
    }

    render()

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.tagName === 'CANVAS'
      ) {
        setIsHovered(true)
      } else {
        setIsHovered(false)
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mouseover', handleMouseOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <>
      <div
        ref={dotRef}
        className={`${styles.cursorDot} ${isHovered ? styles.cursorDotHover : ''}`}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className={`${styles.cursorRing} ${isHovered ? styles.cursorRingHover : ''}`}
        aria-hidden="true"
      />
    </>
  )
}
