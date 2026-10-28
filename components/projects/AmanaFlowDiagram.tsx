import styles from './AmanaFlowDiagram.module.scss'

const flow = ['Customer records', 'Loan applications', 'Payments', 'Reports'] as const

export function AmanaFlowDiagram() {
  return (
    <figure className={styles.flow} aria-labelledby="amana-flow-caption">
      <figcaption id="amana-flow-caption">Documented system flow</figcaption>
      <ol>{flow.map((step, index) => <li key={step}><span>{step}</span>{index < flow.length - 1 && <i aria-hidden="true">→</i>}</li>)}</ol>
      <p>Each step represents a connected area of the learning project’s documented scope.</p>
    </figure>
  )
}
