import Link from 'next/link'
import styles from './not-found.module.scss'

export default function NotFound() {
  return <main className={styles.page}><p>404 / Page not found</p><h1>Wrong turn.<br />Back to the work.</h1><Link href="/">Return home <span aria-hidden="true">→</span></Link></main>
}
