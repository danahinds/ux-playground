export function WrapperThankYou({ sessionId }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#faf9f5', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111',
    }}>
      <div style={{ maxWidth: 480, width: '100%', padding: '40px 24px', textAlign: 'center' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: '#111', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px', fontSize: 28,
        }}>
          ✓
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 10 }}>
          Session recorded.
        </h1>
        <p style={{ color: '#666', fontSize: 15, lineHeight: 1.55, marginBottom: 28 }}>
          Thanks for your time. Your clicks, scrolls, and hesitations were captured
          and linked to your intake answers. A PM will review your session alongside
          others in the cohort.
        </p>
        <p style={{ color: '#999', fontSize: 13, marginBottom: 32 }}>
          You can close this tab now.
        </p>

        <div style={{
          fontSize: 10, color: '#ccc', fontFamily: 'ui-monospace, monospace',
        }}>
          session: {sessionId.slice(0, 12)}…
        </div>
      </div>
    </div>
  )
}
