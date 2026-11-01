'use client'

import { portfolioConfig } from '@/config/portfolio'
import { MobileVerticalSlider } from '@/components/whatido/MobileVerticalSlider'
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
          I build end-to-end web applications and explore AI-powered technologies to create smarter, more useful digital experiences.
        </p>
      </div>

      {/* Desktop Grid Layout (Preserved 100% on desktop screens > 800px) */}
      <div className={styles.desktopGrid}>
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

      {/* Mobile-Only Vertical Card Slider (<= 800px) */}
      <div className={styles.mobileSliderWrapper}>
        <MobileVerticalSlider services={services} />
      </div>
    </section>
  )
}
