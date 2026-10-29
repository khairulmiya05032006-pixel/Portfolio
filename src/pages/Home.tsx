'use client'

import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { Navbar } from '@/components/Navbar'
import { BackgroundScrollAnimation } from '@/components/BackgroundScrollAnimation'
import { CustomCursor } from '@/components/CustomCursor'
import { SocialLinks } from '@/components/SocialLinks'
import { Landing } from '@/sections/Landing'
import { About } from '@/sections/About'
import { WhatIDo } from '@/sections/WhatIDo'
import { Career } from '@/sections/Career'
import { Work } from '@/sections/Work'
import { TechStack } from '@/sections/TechStack'
import { CallToAction } from '@/sections/CallToAction'
import { Contact } from '@/sections/Contact'
import styles from './Home.module.scss'

export function Home() {
  // Initialize Lenis + GSAP ScrollTrigger synchronization
  useSmoothScroll()

  return (
    <div className={styles.homeContainer}>
      <CustomCursor />
      <Navbar />
      <SocialLinks />

      {/* Fixed Full-Viewport Background Scroll Image Animation */}
      <BackgroundScrollAnimation />

      {/* Foreground Sections with Intentional Spatial Corridors */}
      <main className={styles.mainContent}>
        <Landing />
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <TechStack />
        <CallToAction />
        <Contact />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p>© {new Date().getFullYear()} Khairul Miya.</p>
          <a href="#landing" className={styles.backToTop}>
            Back to top ↑
          </a>
        </div>
      </footer>
    </div>
  )
}

export default Home
