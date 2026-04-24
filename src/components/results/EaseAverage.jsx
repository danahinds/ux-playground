export function EaseAverage({ values }) {
  const clean = values.filter(v => typeof v === 'number' && !Number.isNaN(v))

  if (clean.length === 0) {
    return <div style={{ fontSize: 36, fontWeight: 600, color: 'var(--fg-3)' }}>—</div>
  }

  const avg = clean.reduce((a, b) => a + b, 0) / clean.length
  const total = clean.length
  const dist = [1, 2, 3, 4, 5].map(n => clean.filter(v => Math.round(v) === n).length)
  const max = Math.max(...dist, 1)

  return (
    <div>
      <div style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1 }}>
        {avg.toFixed(1)}
        <span style={{ fontSize: 17, color: 'var(--fg-3)', fontWeight: 400, marginLeft: 4 }}>/ 5</span>
      </div>
      <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4 }}>
        {total} response{total === 1 ? '' : 's'} · distribution below
      </div>

      <div style={{ marginTop: 14, display: 'grid', gap: 4 }}>
        {dist.map((count, i) => {
          const score = i + 1
          return (
            <div key={score} style={{
              display: 'grid', gridTemplateColumns: '16px 1fr 24px',
              gap: 10, alignItems: 'center',
            }}>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textAlign: 'right' }}>
                {score}
              </span>
              <div style={{ height: 6, background: 'var(--bg-3)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{
                  height: '100%', background: 'var(--accent)',
                  opacity: 0.75, borderRadius: 2,
                  width: `${(count / max) * 100}%`,
                }}/>
              </div>
              <span className="mono" style={{ fontSize: 11, color: 'var(--fg-2)' }}>{count}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
