'use client'

import type { BlogArticle } from '@/data/portfolio'
import styles from './BlogCard.module.scss'

interface BlogCardProps {
  article: BlogArticle
  onRead?: (article: BlogArticle) => void
}

export function BlogCard({ article, onRead }: BlogCardProps) {
  const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <article className={styles.card} id={article.slug}>
      <a
        href={`#${article.slug}`}
        role="button"
        aria-label={`Read article: ${article.title}`}
        className={styles.link}
        onClick={(e) => {
          if (onRead) {
            e.preventDefault()
            onRead(article)
          }
        }}
      >
        <div className={styles.imageWrap}>
          <div
            className={styles.image}
            style={{
              background: `linear-gradient(135deg, ${article.gradient[0]}, ${article.gradient[1]})`,
            }}
          />
          <div className={styles.imagePattern} aria-hidden="true">
            {'{ } < / > :: => [] && || fn() => { } import export const let async await return yield * + - = ! ? : ; . , @ # $ % ^ & ( ) _ ~ ` \\ | " \' '.repeat(12)}
          </div>
          <div className={styles.overlay} />
          <span className={styles.category}>{article.category}</span>
          <span className={styles.arrow} aria-hidden="true">↗</span>
        </div>
        <div className={styles.content}>
          <p className={styles.meta}>
            <span>{formattedDate}</span>
            <span>{article.readTime}</span>
          </p>
          <h3>{article.title}</h3>
          <p className={styles.excerpt}>{article.excerpt}</p>
          <span className={styles.readLink}>
            Read article <span aria-hidden="true">→</span>
          </span>
        </div>
      </a>
    </article>
  )
}
