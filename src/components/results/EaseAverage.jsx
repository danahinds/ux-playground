export function EaseAverage({ values }) {
  const clean = values.filter(v => typeof v === 'number' && !Number.isNaN(v))

  if (clean.length === 0) {
    return <div style={{ fontSize: 28, fontWeight: 600, color: 'var(--fg-3)' }}>—</div>
  }

  const avg = clean.reduce((a, b) => a + b, 0) / clean.length

  return (
    <div>
      <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}>
        {avg.toFixed(1)}
        <span style={{ fontSize: 16, color: 'var(--fg-3)', fontWeight: 400, marginLeft: 4 }}>
          / 5
        </span>
      </div>
      <div style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, fontFamily: 'var(--font-mono)' }}>
        {clean.length} response{clean.length === 1 ? '' : 's'}
      </div>
    </div>
  )
}
