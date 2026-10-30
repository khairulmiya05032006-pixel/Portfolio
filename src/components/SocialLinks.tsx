'use client'

import { portfolioConfig } from '@/config/portfolio'
import { SocialIcon } from './SocialIcon'
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
              title={s.platform}
            >
              <SocialIcon platform={s.platform} className={styles.icon} size={17} />
            </a>
          </li>
        ))}
      </ul>
      <div className={styles.lineBottom} />
    </aside>
  )
}
