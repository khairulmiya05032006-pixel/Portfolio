'use client'

import { portfolioConfig } from '@/config/portfolio'
import styles from './SocialLinks.module.scss'

export function SocialLinks() {
  const { socials } = portfolioConfig

  return (
    <aside className={styles.socialBar} aria-label="Social Links">
      <div className={styles.lineTop} />
      <ul className={styles.list}>
        {socials.map((s) => (
          <li key={s.platform}>
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.link}
              aria-label={s.platform}
            >
              <span>{s.platform.slice(0, 2).toUpperCase()}</span>
            </a>
          </li>
        ))}
      </ul>
      <div className={styles.lineBottom} />
    </aside>
  )
}
