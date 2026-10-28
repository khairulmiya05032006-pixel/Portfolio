'use client'

import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

type SectionRevealProps = { children: ReactNode; direction?: 'forward' | 'back' }

export function SectionReveal({ children, direction = 'forward' }: SectionRevealProps) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !root.current) return
    const context = gsap.context(() => {
      gsap.from(root.current, { autoAlpha: 0, duration: 0.68, ease: 'power3.out', scrollTrigger: { trigger: root.current, start: 'top 84%', once: true }, x: direction === 'forward' ? 24 : -24 })
    }, root)
    return () => context.revert()
  }, [direction])

  return <div ref={root}>{children}</div>
}
