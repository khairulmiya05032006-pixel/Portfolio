'use client'

import React from 'react'
import { ProjectPreviewMockup } from './ProjectPreviewMockup'
import styles from './HorizontalProjectCard.module.scss'

export interface ProjectData {
  id: string
  slug: string
  title: string
  category: string
  description: string
  technologies: string[]
  liveUrl?: string
  githubUrl?: string
  featured?: boolean
  metrics?: string
  image?: string
}

interface HorizontalProjectCardProps {
  project: ProjectData
  index: number
  total: number
  className?: string
  idPrefix?: string
}

export function HorizontalProjectCard({
  project,
  index,
  total,
  className = '',
  idPrefix,
}: HorizontalProjectCardProps) {
  const formattedIndex = String(index + 1).padStart(2, '0')
  const formattedTotal = String(total).padStart(2, '0')
  const elementId = idPrefix ? `${idPrefix}-${project.slug}` : project.slug

  return (
    <article
      id={elementId}
      className={`${styles.card} ${className}`}
      aria-label={`${project.title} project showcase`}
      tabIndex={0}
    >
      {/* Top Bar: Numbering & Category */}
      <div className={styles.topBar}>
        <span className={styles.number}>
          {formattedIndex} <span className={styles.numberDivider}>/</span> {formattedTotal}
        </span>
        <span className={styles.categoryBadge}>{project.category}</span>
      </div>

      {/* Main Editorial Body: Split Left Info & Right Visual Mockup */}
      <div className={styles.cardBody}>
        {/* Left: Info Section */}
        <div className={styles.infoSection}>
          <div className={styles.infoContent}>
            <h3 className={styles.title}>{project.title}</h3>
            <p className={styles.description}>{project.description}</p>

            {project.metrics && (
              <div className={styles.metricsPill}>
                <span className={styles.metricDot} aria-hidden="true" />
                <span>{project.metrics}</span>
              </div>
            )}

            <div className={styles.techStack} aria-label="Technologies used">
              {project.technologies.map((tech) => (
                <span key={tech} className={styles.techTag}>
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={styles.actions}>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                className={styles.primaryBtn}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View live preview of ${project.title}`}
              >
                <span>Explore Live</span>
                <span className={styles.arrowIcon} aria-hidden="true">
                  ↗
                </span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                className={styles.secondaryBtn}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View source code of ${project.title} on GitHub`}
              >
                <span>Source Code</span>
                <span className={styles.arrowIcon} aria-hidden="true">
                  ↗
                </span>
              </a>
            )}
          </div>
        </div>

        {/* Right: Visual Preview Mockup */}
        <div className={styles.visualWrapper}>
          <ProjectPreviewMockup projectId={project.id} title={project.title} />
        </div>
      </div>
    </article>
  )
}

export default HorizontalProjectCard
