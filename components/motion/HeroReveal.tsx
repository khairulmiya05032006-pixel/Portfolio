'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

type HeroRevealProps = { children: ReactNode }

export function HeroReveal({ children }: HeroRevealProps) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.current) return
    const context = gsap.context(() => {
      gsap.from('[data-hero-copy] > *', { autoAlpha: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08, y: 22 })
      gsap.from('[data-hero-portrait]', { clipPath: 'inset(100% 0 0 0)', duration: 0.82, ease: 'power4.inOut', delay: 0.08 })
      gsap.from('[data-portrait-frame]', { duration: 0.48, ease: 'power2.out', scale: 0.94, transformOrigin: 'bottom left', delay: 0.68 })
    }, root)
    return () => context.revert()
  }, [])

  return <div ref={root}>{children}</div>
}
