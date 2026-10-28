'use client'

import { useEffect, useRef } from 'react'
import type { BlogArticle } from '@/data/portfolio'
import styles from './ArticleModal.module.scss'

type ArticleModalProps = {
  article: BlogArticle | null
  onClose: () => void
}

export function ArticleModal({ article, onClose }: ArticleModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!article) return

    // Focus the close button when opened
    closeBtnRef.current?.focus()

    // Prevent body scrolling
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [article, onClose])

  if (!article) return null

  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div
      className={styles.backdrop}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-article-title"
    >
      <div className={styles.modal} ref={dialogRef}>
        <header
          className={styles.banner}
          style={{
            background: `linear-gradient(135deg, ${article.gradient[0]}, ${article.gradient[1]})`,
          }}
        >
          <div className={styles.bannerOverlay} />
          <button
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            ref={closeBtnRef}
            aria-label="Close article modal"
          >
            ✕
          </button>
          <div className={styles.bannerContent}>
            <div className={styles.metaRow}>
              <span className={styles.categoryBadge}>{article.category}</span>
              <span className={styles.date}>{formattedDate}</span>
              <span className={styles.dot}>•</span>
              <span className={styles.readTime}>{article.readTime}</span>
            </div>
            <h2 id="modal-article-title" className={styles.title}>
              {article.title}
            </h2>
          </div>
        </header>

        <div className={styles.body}>
          <p className={styles.lead}>{article.excerpt}</p>

          {article.content && (
            <>
              <div className={styles.section}>
                <h3>Overview & Context</h3>
                <p>{article.content.overview}</p>
              </div>

              <div className={styles.section}>
                <h3>Key Architecture & Concepts</h3>
                <ul className={styles.keyPoints}>
                  {article.content.keyPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>

              {article.content.codeExample && (
                <div className={styles.section}>
                  <h3>Code Implementation</h3>
                  <pre className={styles.codeBlock}>
                    <code>{article.content.codeExample}</code>
                  </pre>
                </div>
              )}

              <blockquote className={styles.takeaway}>
                <span className={styles.takeawayLabel}>Core Takeaway</span>
                <p>{article.content.takeaway}</p>
              </blockquote>
            </>
          )}

          <footer className={styles.footer}>
            <button type="button" className={styles.closeFooterBtn} onClick={onClose}>
              Back to articles
            </button>
          </footer>
        </div>
      </div>
    </div>
  )
}
