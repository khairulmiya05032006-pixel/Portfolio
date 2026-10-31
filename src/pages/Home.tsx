'use client'

import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { useMobileScrollReveals } from '@/hooks/useMobileScrollReveals'
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
import { Footer } from '@/components/Footer'
import styles from './Home.module.scss'

export function Home() {
  // Initialize Lenis + GSAP ScrollTrigger synchronization
  useSmoothScroll()
  // Initialize mobile-only scroll-triggered section reveals
  useMobileScrollReveals()

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

      <Footer />
    </div>
  )
}

export default Home
