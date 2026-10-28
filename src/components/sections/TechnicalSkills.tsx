'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { SkillCircle } from '@/components/skills/SkillCircle'
import { technicalSkills } from '@/data/portfolio'
import styles from './TechnicalSkills.module.scss'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export function TechnicalSkills() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)
  const [isVisible, setIsVisible] = useState(() => prefersReducedMotion())
  const [counts, setCounts] = useState<number[]>(() =>
    prefersReducedMotion()
      ? technicalSkills.map((s) => s.percentage)
      : technicalSkills.map(() => 0)
  )

  const animateCounts = useCallback(() => {
    const duration = 1400
    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setCounts(technicalSkills.map((s) => Math.round(s.percentage * eased)))

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [])

  useEffect(() => {
    if (!sectionRef.current || hasAnimated.current) return
    if (prefersReducedMotion()) {
      hasAnimated.current = true
      return
    }

    const target = sectionRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true
          setIsVisible(true)
          animateCounts()
          observer.disconnect()
        }
      },
      { threshold: 0.25 }
    )

    observer.observe(target)
    return () => observer.disconnect()
  }, [animateCounts])

  return (
    <section id="technical-skills" className={styles.section} aria-labelledby="technical-skills-heading" ref={sectionRef}>
      <div className={styles.inner}>
        <SectionHeading
          eyebrow="03 / Proficiency"
          decorativeWord="Technical"
          id="technical-skills-heading"
          title={<>Technical <span>skills.</span></>}
        />
        <p className={styles.intro}>Current learning progress across the technologies I work with regularly.</p>
        <div className={styles.grid}>
          {technicalSkills.map((skill, index) => (
            <SkillCircle
              key={skill.name}
              skill={skill}
              isAnimated={isVisible}
              displayValue={counts[index] ?? 0}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
