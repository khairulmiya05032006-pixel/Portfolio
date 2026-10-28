'use client'

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <p
        style={{
          fontFamily: 'monospace',
          fontSize: '0.75rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: '#9e97a8',
          marginBottom: '1rem',
        }}
      >
        Something went wrong
      </p>
      <h1
        style={{
          fontFamily: 'Impact, sans-serif',
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          lineHeight: 0.9,
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
        }}
      >
        Unexpected<br />error.
      </h1>
      <button
        onClick={reset}
        style={{
          padding: '0.75rem 2rem',
          border: '1px solid rgba(255,255,255,0.2)',
          background: 'transparent',
          color: 'inherit',
          cursor: 'pointer',
          fontFamily: 'monospace',
          fontSize: '0.8rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        Try again →
      </button>
    </main>
  )
}
