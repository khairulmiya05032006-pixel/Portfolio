'use client'

import React, { useMemo } from 'react'
import { SKILLS_CONFIG, type SkillItem } from '@/config/skills'
import { SkillCard } from './SkillCard'
import styles from './SkillGrid.module.scss'

interface SkillGridProps {
  skills?: SkillItem[]
  className?: string
}

export function SkillGrid({ skills = SKILLS_CONFIG, className = '' }: SkillGridProps) {
  // Group skills by designated pyramid row (1 to 6)
  const rows = useMemo(() => {
    const rowMap: Record<number, SkillItem[]> = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
      6: [],
    }

    skills.forEach((skill) => {
      const rowNum = skill.row || 1
      if (!rowMap[rowNum]) {
        rowMap[rowNum] = []
      }
      rowMap[rowNum].push(skill)
    })

    return Object.entries(rowMap)
      .map(([rowNum, items]) => ({
        rowNumber: Number(rowNum),
        items,
      }))
      .filter((group) => group.items.length > 0)
      .sort((a, b) => a.rowNumber - b.rowNumber)
  }, [skills])

  return (
    <div
      className={`${styles.pyramidContainer} ${className}`}
      role="list"
      aria-label="Technology stack skills grid"
    >
      {rows.map(({ rowNumber, items }) => (
        <div
          key={`row-${rowNumber}`}
          className={styles.row}
          data-row={rowNumber}
          role="listitem"
        >
          {items.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      ))}
    </div>
  )
}
