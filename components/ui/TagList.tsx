import styles from './TagList.module.scss'

type TagListProps = { items: readonly string[] }

export function TagList({ items }: TagListProps) {
  return <ul className={styles.list}>{items.map((item) => <li key={item}>{item}</li>)}</ul>
}
