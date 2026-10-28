import { profile } from '@/data/portfolio'
import styles from './Footer.module.scss'

export function Footer() {
  return <footer className={styles.footer}><span>{profile.name}</span><span>BCA ’27 / {profile.role}</span><a href="#home">Back to top <span aria-hidden="true">↑</span></a></footer>
}
