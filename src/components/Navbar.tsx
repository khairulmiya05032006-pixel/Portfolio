'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { portfolioConfig } from '@/config/portfolio'
import styles from './Navbar.module.scss'

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`}>
      <nav className={styles.navbar} aria-label="Main Navigation">
        <a href="#landing" className={styles.logo} aria-label="Khairul Miya Home">
          <Image
            src="/images/khairul-portrait-circle.png"
            alt="Khairul Miya"
            width={34}
            height={34}
            className={styles.logoAvatar}
            priority
          />
          <span className={styles.logoInitials}>KM</span>
          <span className={styles.logoDot} />
        </a>

        {/* Desktop Links */}
        <div className={styles.navLinks}>
          {portfolioConfig.navItems.map((item) => (
            <a key={item.href} href={item.href} className={styles.navLink}>
              {item.label}
            </a>
          ))}
        </div>

        <div className={styles.navActions}>
          <a
            href={portfolioConfig.profile.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.resumeBtn}
          >
            Resume <span>↗</span>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className={styles.mobileToggle}
            aria-label="Toggle Navigation Menu"
            aria-expanded={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className={`${styles.bar} ${mobileMenuOpen ? styles.barOpenTop : ''}`} />
            <span className={`${styles.bar} ${mobileMenuOpen ? styles.barOpenBottom : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className={styles.mobileDrawer}>
          {portfolioConfig.navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={styles.mobileNavLink}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}
