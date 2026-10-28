import { profile } from '@/data/portfolio'
import styles from './Contact.module.scss'

export function Contact() {
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-heading">
      <span className={styles.decorative} aria-hidden="true">Contact</span>
      <div className={styles.inner}>
        <header className={styles.heading}>
          <p className={styles.eyebrow}>06 / Contact</p>
          <h2 id="contact-heading">Get in <span>touch.</span></h2>
        </header>
        <div className={styles.grid}>
          <div className={styles.intro}>
            <p className={styles.kicker}>Don’t be shy.</p>
            <p>{profile.contact}</p>
            <div className={styles.signalList} aria-label="Contact status">
              <p><span aria-hidden="true">01</span> Open to learning and contribution</p>
              <p><span aria-hidden="true">02</span> Useful ideas welcome</p>
            </div>
          </div>
          <div className={styles.contactPanel}>
            <p className={styles.panelLabel}>Contact channel</p>
            <h3>Let’s build the next <span>useful idea.</span></h3>
            <p className={styles.panelCopy}>Authentic contact information will be added here when it is available.</p>
            <div className={styles.placeholderRows} aria-hidden="true"><span /><span /><span /></div>
            <p className={styles.pending}>Contact details coming soon</p>
          </div>
        </div>
      </div>
    </section>
  )
}
