import type { ReactNode } from 'react'
import styles from './SectionHeading.module.scss'

type SectionHeadingProps = {
  eyebrow: string
  decorativeWord: string
  title: ReactNode
  id: string
}

export function SectionHeading({ eyebrow, decorativeWord, title, id }: SectionHeadingProps) {
  return (
    <header className={styles.heading}>
      <span className={styles.decorative} aria-hidden="true">{decorativeWord}</span>
      <p className={styles.eyebrow}>{eyebrow}</p>
      <h2 id={id}>{title}</h2>
    </header>
  )
}
