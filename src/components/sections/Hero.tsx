import Image from 'next/image'
import { HeroReveal } from '@/components/motion/HeroReveal'
import { Button } from '@/components/ui/Button'
import { profile } from '@/data/portfolio'
import styles from './Hero.module.scss'

export function Hero() {
  return (
    <HeroReveal>
      <section id="home" className={styles.hero} aria-labelledby="hero-title">
        <div className={styles.portraitColumn}>
          <div className={styles.portraitFrame} data-portrait-frame aria-hidden="true" />
          <div className={styles.portrait} data-hero-portrait>
            <Image src="/images/khairul-portrait.png" alt="Khairul Miya wearing a dark suit" fill priority sizes="(max-width: 980px) 100vw, 44vw" className={styles.image} />
            <span className={styles.portraitLabel}>Khairul Miya / BCA ’27</span>
          </div>
        </div>
        <div className={styles.copy} data-hero-copy>
          <p className={styles.eyebrow}>Hello, I’m</p>
          <h1 id="hero-title">Khairul<br /><span>Miya.</span></h1>
          <p className={styles.role}>{profile.role}</p>
          <p className={styles.introduction}>{profile.introduction}</p>
          <div className={styles.actions}>
            <Button href="#work">Explore my work</Button>
            <Button href="#about" tone="secondary">About me</Button>
          </div>
        </div>
        <p className={styles.index} aria-hidden="true"><span>01</span> / 05</p>
      </section>
    </HeroReveal>
  )
}
