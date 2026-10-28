'use client'

import { useEffect, useRef, useState } from 'react'

export interface MouseState {
  x: number // Normalized [-1, 1]
  y: number // Normalized [-1, 1]
  clientX: number
  clientY: number
}

export function useMouseTracking() {
  const [mouse, setMouse] = useState<MouseState>({ x: 0, y: 0, clientX: 0, clientY: 0 })
  const mouseRef = useRef<MouseState>({ x: 0, y: 0, clientX: 0, clientY: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX / innerWidth) * 2 - 1
      const y = -(e.clientY / innerHeight) * 2 + 1
      const state = { x, y, clientX: e.clientX, clientY: e.clientY }
      mouseRef.current = state
      setMouse(state)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return { mouse, mouseRef }
}
