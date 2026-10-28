import type { CSSProperties } from 'react'
import type { TechnicalSkill } from '@/data/portfolio'
import styles from './SkillCircle.module.scss'

type SkillCircleProps = {
  skill: TechnicalSkill
  isAnimated: boolean
  displayValue: number
}

const RADIUS = 42
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function SkillCircle({ skill, isAnimated, displayValue }: SkillCircleProps) {
  const clamped = Math.min(100, Math.max(0, skill.percentage))
  const offset = isAnimated ? CIRCUMFERENCE * (1 - clamped / 100) : CIRCUMFERENCE

  return (
    <div
      className={styles.item}
      role="img"
      aria-label={`${skill.name}: ${clamped} percent`}
    >
      <div className={styles.ringWrap}>
        <svg viewBox="0 0 100 100" className={styles.ring}>
          <circle
            className={styles.track}
            cx="50"
            cy="50"
            r={RADIUS}
          />
          <circle
            className={styles.progress}
            cx="50"
            cy="50"
            r={RADIUS}
            strokeDasharray={`${CIRCUMFERENCE}`}
            strokeDashoffset={`${offset}`}
            style={{ '--progress-color': categoryColor(skill.category) } as CSSProperties}
          />
        </svg>
        <span className={styles.percentage} aria-hidden="true">
          {displayValue}<span className={styles.percent}>%</span>
        </span>
      </div>
      <h3 className={styles.name}>{skill.name}</h3>
      <p className={styles.category}>{skill.category}</p>
    </div>
  )
}

function categoryColor(category: TechnicalSkill['category']): string {
  switch (category) {
    case 'Frontend': return 'var(--color-amber)'
    case 'Backend': return 'var(--color-orange)'
    case 'Database': return '#61dafb'
    case 'Workflow': return '#a6a19a'
  }
}
