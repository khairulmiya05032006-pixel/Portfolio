'use client'

import { portfolioConfig } from '@/config/portfolio'
import styles from './WhatIDo.module.scss'

export function WhatIDo() {
  const { services } = portfolioConfig

  return (
    <section id="what-i-do" className={styles.whatIDo} aria-label="What I Do Section">
      <div className={styles.header}>
        <span className={styles.eyebrow}>Capabilities</span>
        <h2 className={styles.title}>
          What I <span>Do & Build</span>
        </h2>
        <p className={styles.subtitle}>
          What I focus on when developing software and building web applications.
        </p>
      </div>

      <div className={styles.grid}>
        {services.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.badge}>{item.subtitle}</div>
            </div>
            <h3 className={styles.cardTitle}>{item.title}</h3>
            <p className={styles.cardDesc}>{item.description}</p>
            <div className={styles.tagsList}>
              {item.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
