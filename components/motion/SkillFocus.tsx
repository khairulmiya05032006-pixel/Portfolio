'use client'

import type { CSSProperties } from 'react'
import { useEffect, useRef, useState } from 'react'
import type { SkillGroup } from '@/data/portfolio'
import styles from './SkillFocus.module.scss'

type SkillFocusProps = { groups: SkillGroup[] }

export function SkillFocus({ groups }: SkillFocusProps) {
  const root = useRef<HTMLDivElement>(null)
  const [isDrawn, setIsDrawn] = useState(false)

  useEffect(() => {
    if (!root.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) {
        setIsDrawn(true)
        observer.disconnect()
      }
    }, { threshold: 0.35 })

    observer.observe(root.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={root} className={`${styles.rings} ${isDrawn ? styles.isDrawn : ''}`} aria-label="Current learning focus">
      {groups.map((group, index) => (
        <article className={styles.ring} key={group.title}>
          <svg viewBox="0 0 100 100" role="img" aria-label={`${group.title} current focus`}>
            <circle className={styles.track} cx="50" cy="50" pathLength="1" r="42" />
            <circle className={styles.progress} cx="50" cy="50" pathLength="1" r="42" style={{ '--ring-delay': `${index * 100}ms` } as CSSProperties} />
          </svg>
          <span className={styles.ringNumber}>{group.number}</span>
          <h3>{group.title}</h3>
          <p>Current focus</p>
        </article>
      ))}
    </div>
  )
}
