import type { AnchorHTMLAttributes } from 'react'
import styles from './Button.module.scss'

type ButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: React.ReactNode
  tone?: 'primary' | 'secondary'
}

export function Button({ children, className, tone = 'primary', ...props }: ButtonProps) {
  const classes = [styles.button, styles[tone], className].filter(Boolean).join(' ')

  return (
    <a className={classes} {...props}>
      <span>{children}</span>
      <span className={styles.arrow} aria-hidden="true">→</span>
    </a>
  )
}
