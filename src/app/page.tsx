import { Footer } from '@/components/layout/Footer'
import { SideNavigation } from '@/components/layout/SideNavigation'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { SectionReveal } from '@/components/motion/SectionReveal'
import { About } from '@/components/sections/About'
import { Blog } from '@/components/sections/Blog'
import { Contact } from '@/components/sections/Contact'
import { Hero } from '@/components/sections/Hero'
import { LearningJourney } from '@/components/sections/LearningJourney'
import { LearningNotes } from '@/components/sections/LearningNotes'
import { SelectedWork } from '@/components/sections/SelectedWork'
import { Skills } from '@/components/sections/Skills'
import { TechnicalSkills } from '@/components/sections/TechnicalSkills'
import styles from './page.module.scss'

export default function Home() {
  return (
    <div className={styles.page}>
      <a className={styles.skipLink} href="#main-content">Skip to content</a>
      <div className={styles.grain} aria-hidden="true" />
      <SiteHeader />
      <SideNavigation />
      <main id="main-content">
        <Hero />
        <SectionReveal direction="back"><About /></SectionReveal>
        <SectionReveal><Skills /></SectionReveal>
        <SectionReveal><TechnicalSkills /></SectionReveal>
        <SectionReveal><SelectedWork /></SectionReveal>
        <SectionReveal direction="back"><Blog /></SectionReveal>
        <SectionReveal direction="back"><LearningNotes /></SectionReveal>
        <SectionReveal direction="back"><LearningJourney /></SectionReveal>
        <SectionReveal><Contact /></SectionReveal>
      </main>
      <Footer />
    </div>
  )
}
