'use client'

import React from 'react'
import styles from './ProjectControls.module.scss'

interface ProjectControlsProps {
  currentIndex: number
  total: number
  progress: number // 0 to 1
  onPrev: () => void
  onNext: () => void
  canPrev?: boolean
  canNext?: boolean
  className?: string
}

export function ProjectControls({
  currentIndex,
  total,
  progress,
  onPrev,
  onNext,
  canPrev = true,
  canNext = true,
  className = '',
}: ProjectControlsProps) {
  const currentFormatted = String(currentIndex + 1).padStart(2, '0')
  const totalFormatted = String(total).padStart(2, '0')
  const progressPercent = Math.min(100, Math.max(0, progress * 100))

  return (
    <div className={`${styles.controlsContainer} ${className}`} aria-label="Project gallery controls">
      {/* Progress Bar & Counter */}
      <div className={styles.progressWrapper}>
        <div
          className={styles.progressBar}
          role="progressbar"
          aria-valuenow={Math.round(progressPercent)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Project gallery progress: ${Math.round(progressPercent)}%`}
        >
          <div
            className={styles.progressFill}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span className={styles.progressText}>
          {currentFormatted} / {totalFormatted}
        </span>
      </div>

      {/* Navigation Arrows */}
      <div className={styles.navButtons}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={onPrev}
          disabled={!canPrev}
          aria-label="Previous project"
        >
          ←
        </button>
        <button
          type="button"
          className={styles.navBtn}
          onClick={onNext}
          disabled={!canNext}
          aria-label="Next project"
        >
          →
        </button>
      </div>
    </div>
  )
}

export default ProjectControls
