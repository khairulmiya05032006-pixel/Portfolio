import React from 'react'
import type { SkillItem } from '@/config/skills'
import { SkillIcon } from './SkillIcons'
import styles from './SkillCard.module.scss'

interface SkillCardProps {
  skill: SkillItem
  className?: string
  priority?: boolean
}

export function SkillCard({ skill, className = '' }: SkillCardProps) {
  return (
    <div
      className={`${styles.card} ${className}`}
      tabIndex={0}
      role="region"
      aria-label={`${skill.name} technology skill`}
      data-category={skill.category}
    >
      <div className={styles.inner}>
        <div className={styles.glowOverlay} aria-hidden="true" />
        <div className={styles.iconWrapper}>
          <SkillIcon
            name={skill.icon}
            className={styles.icon}
            color="currentColor"
          />
        </div>
        <span className={styles.name} title={skill.name}>
          {skill.name}
        </span>
      </div>
    </div>
  )
}
