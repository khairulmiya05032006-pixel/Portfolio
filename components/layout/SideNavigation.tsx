'use client'

import { useEffect, useState } from 'react'
import { navigation, type NavigationItem } from '@/data/portfolio'
import styles from './SideNavigation.module.scss'

function Icon({ name }: { name: NavigationItem['icon'] }) {
  if (name === 'home') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 10 8-6 8 6v10H4z" /><path d="M9 20v-6h6v6" /></svg>
  if (name === 'profile') return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.8-4 3.2-6 7-6s6.2 2 7 6" /></svg>
  if (name === 'work') return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="7" width="16" height="12" rx="1" /><path d="M9 7V5h6v2M4 12h16M10 12v2h4v-2" /></svg>
  if (name === 'skills') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6 5.6 18.4" /></svg>
  if (name === 'blog') return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v14H4z" /><path d="m5 7 7 6 7-6" /></svg>
}

export function SideNavigation() {
  const [active, setActive] = useState('#home')

  useEffect(() => {
    const sections = navigation.map(({ href }) => document.querySelector(href)).filter((section): section is Element => Boolean(section))
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
      if (visible) setActive(`#${visible.target.id}`)
    }, { rootMargin: '-35% 0px -50% 0px', threshold: [0.05, 0.3] })
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return (
    <nav className={styles.navigation} aria-label="Section navigation">
      <ul>
        {navigation.map((item) => <li key={item.href}><a href={item.href} className={active === item.href ? styles.active : undefined} aria-label={item.label} aria-current={active === item.href ? 'location' : undefined} data-label={item.label}><Icon name={item.icon} /></a></li>)}
      </ul>
    </nav>
  )
}
