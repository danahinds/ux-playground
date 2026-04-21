export function ClosedScreen({ testName }) {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#faf9f5', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111',
    }}>
      <div style={{ maxWidth: 480, padding: '40px 24px', textAlign: 'center' }}>
        <div style={{
          width: 48, height: 48, borderRadius: '50%',
          background: '#eee', color: '#888',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 20px', fontSize: 24,
        }}>
          —
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>
          This test is closed.
        </h1>
        <p style={{ color: '#666', fontSize: 15, lineHeight: 1.55 }}>
          {testName ? `"${testName}" ` : 'This session '}
          has wrapped up. The team has what they need.
          If you think this is a mistake, reach out to whoever shared this link.
        </p>
      </div>
    </div>
  )
}
