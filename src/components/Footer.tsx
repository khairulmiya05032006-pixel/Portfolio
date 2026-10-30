'use client'

import React, { useState, useCallback } from 'react'
import styles from './Footer.module.scss'

const WORD = 'khairul'

export function Footer() {
  const [activeWaveIndex, setActiveWaveIndex] = useState<number | null>(null)

  const handleScrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    if (typeof window !== 'undefined') {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }

  // Playful wave animation across letters when clicked
  const handleWordClick = useCallback((clickedIndex: number) => {
    const letters = WORD.split('')
    letters.forEach((_, idx) => {
      const distance = Math.abs(idx - clickedIndex)
      setTimeout(() => {
        setActiveWaveIndex(idx)
        setTimeout(() => {
          setActiveWaveIndex((curr) => (curr === idx ? null : curr))
        }, 300)
      }, distance * 65)
    })
  }, [])

  return (
    <footer className={styles.footer} aria-label="Site Footer">
      <div className={styles.topBar}>
        <div className={styles.brandCol}>
          <a href="#landing" className={styles.brand} aria-label="Khairul Miya Home">
            <span>khairul</span>
            <span className={styles.brandDot}>.</span>
          </a>
        </div>

        <div className={styles.centerCol}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} Khairul Miya — Full-Stack Developer
          </p>
        </div>

        <div className={styles.actionCol}>
          <a
            href="#landing"
            onClick={handleScrollToTop}
            className={styles.backToTop}
            aria-label="Scroll back to top of page"
          >
            <span>Back to top</span>
            <span className={styles.arrow} aria-hidden="true">
              ↑
            </span>
          </a>
        </div>
      </div>

      {/* Giant Interactive Letter Showcase */}
      <div
        className={styles.giantWordContainer}
        role="presentation"
        aria-hidden="true"
      >
        <div className={styles.giantWord}>
          {WORD.split('').map((char, index) => {
            const isWaveActive = activeWaveIndex === index
            return (
              <span
                key={`${char}-${index}`}
                className={`${styles.letter} ${isWaveActive ? styles.letterWave : ''}`}
                data-char={char}
                onClick={() => handleWordClick(index)}
              >
                {char}
              </span>
            )
          })}
        </div>
      </div>
    </footer>
  )
}

export default Footer
