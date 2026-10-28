'use client'

import { useState } from 'react'
import { navigation } from '@/data/portfolio'
import styles from './MobileNavigation.module.scss'

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className={styles.mobileNav} aria-label="Mobile navigation">
      <button type="button" className={styles.toggle} aria-expanded={isOpen} aria-controls="mobile-navigation-panel" onClick={() => setIsOpen((open) => !open)}>
        <span className={styles.toggleLabel}>{isOpen ? 'Close' : 'Menu'}</span>
        <span className={styles.lines} aria-hidden="true"><i /><i /></span>
      </button>
      <div id="mobile-navigation-panel" className={`${styles.panel} ${isOpen ? styles.open : ''}`} aria-hidden={!isOpen}>
        <ul>
          {navigation.map((item, index) => (
            <li key={item.href}>
              <a href={item.href} onClick={() => setIsOpen(false)} tabIndex={isOpen ? 0 : -1}>
                <span>0{index + 1}</span>{item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
