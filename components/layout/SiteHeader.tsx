import { MobileNavigation } from './MobileNavigation'
import styles from './SiteHeader.module.scss'

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <a className={styles.brand} href="#home" aria-label="Khairul Miya, return to home">KM<span>.</span></a>
      <p className={styles.note}>BCA ’27 <span aria-hidden="true">/</span> Developer in progress</p>
      <MobileNavigation />
    </header>
  )
}
