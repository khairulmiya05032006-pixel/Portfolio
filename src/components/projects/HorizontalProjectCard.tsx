'use client'

import React from 'react'
import type { ProjectItem } from '@/config/portfolio'
import { ProjectPreviewMockup } from './ProjectPreviewMockup'
import styles from './HorizontalProjectCard.module.scss'

export type ProjectData = ProjectItem

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
  const isComingSoon = project.status === 'coming-soon'

  return (
    <article
      id={elementId}
      className={`${styles.card} ${isComingSoon ? styles.cardComingSoon : ''} ${className}`}
      aria-label={`${project.title} project showcase${isComingSoon ? ' (Coming Soon)' : ''}`}
      tabIndex={0}
    >
      {/* Top Bar: Numbering, Category & Status Badge */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <span className={styles.number}>
            {formattedIndex} <span className={styles.numberDivider}>/</span> {formattedTotal}
          </span>
          <span className={styles.categoryBadge}>{project.category}</span>
        </div>

        {isComingSoon && (
          <div className={styles.comingSoonBadge} role="status" aria-label="Status: Coming Soon">
            <span className={styles.badgeGlowAura} aria-hidden="true" />
            <span className={styles.badgeSparkle} aria-hidden="true">✦</span>
            <span>COMING SOON</span>
          </div>
        )}
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
            {isComingSoon ? (
              <div
                className={styles.comingSoonPill}
                role="status"
                aria-label="Project in development: Coming Soon"
              >
                <span>COMING SOON</span>
                <span className={styles.pillSparkle} aria-hidden="true">✦</span>
              </div>
            ) : (
              <>
                {project.liveUrl && project.liveUrl !== '#' && (
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
                    className={
                      project.liveUrl && project.liveUrl !== '#'
                        ? styles.secondaryBtn
                        : styles.primaryBtn
                    }
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
              </>
            )}
          </div>
        </div>

        {/* Right: Visual Preview Mockup with Coming Soon Treatment */}
        <div className={styles.visualWrapper}>
          <div
            className={`${styles.mockupWrapper} ${
              isComingSoon ? styles.mockupWrapperSoftened : ''
            }`}
          >
            <ProjectPreviewMockup
              projectId={project.id}
              title={project.title}
              image={project.image}
            />
          </div>

          {isComingSoon && (
            <div
              className={styles.comingSoonOverlay}
              role="region"
              aria-label="Upcoming Project Preview"
            >
              {/* Subtle ambient lighting */}
              <div className={styles.ambientGlow} aria-hidden="true" />

              <div className={styles.overlayCard}>
                <div className={styles.iconCircle} aria-hidden="true">
                  <svg
                    className={styles.lockIcon}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>

                <div className={styles.badgeSmall}>
                  <span className={styles.sparkleDot} aria-hidden="true">✦</span>
                  <span>COMING SOON</span>
                </div>

                <h4 className={styles.overlayTitle}>
                  <em>Something exciting is in the works.</em>
                </h4>

                <p className={styles.overlayDesc}>
                  Building something worth exploring. Stay tuned.
                </p>

                <div className={styles.statusBar}>
                  <span className={styles.pulseDot} aria-hidden="true" />
                  <span className={styles.statusText}>In Active Development</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default HorizontalProjectCard
