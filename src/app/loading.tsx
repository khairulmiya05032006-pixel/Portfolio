export default function Loading() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--color-background, #0a0a0f)',
      }}
    >
      <div
        style={{
          width: '2rem',
          height: '2rem',
          border: '2px solid rgba(255,255,255,0.1)',
          borderTopColor: 'var(--color-accent, #a78bfa)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
