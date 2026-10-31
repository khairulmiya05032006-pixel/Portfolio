'use client'

import { useSmoothScroll } from '@/hooks/useSmoothScroll'
import { Navbar } from '@/components/Navbar'
import { BackgroundScrollAnimation } from '@/components/BackgroundScrollAnimation'
import { CustomCursor } from '@/components/CustomCursor'
import { SocialLinks } from '@/components/SocialLinks'
import { Landing } from '@/sections/Landing'
import { MobileCinematicPortrait } from '@/components/portrait/MobileCinematicPortrait'
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
        {/* Mobile-Only Scroll-Driven Cinematic Portrait Animation */}
        <MobileCinematicPortrait />
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
