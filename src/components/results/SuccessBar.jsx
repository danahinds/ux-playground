export function SuccessBar({ counts }) {
  const { yes = 0, partial = 0, no = 0 } = counts
  const total = yes + partial + no

  if (total === 0) {
    return (
      <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>No success responses yet.</div>
    )
  }

  const pct = (n) => (n / total) * 100

  const Segment = ({ n, label, color }) => n === 0 ? null : (
    <div
      title={`${label}: ${n}`}
      style={{
        width: `${pct(n)}%`, background: color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 11, fontWeight: 600,
        fontFamily: 'var(--font-mono)',
      }}
    >
      {n}
    </div>
  )

  return (
    <div>
      <div style={{
        display: 'flex', height: 28, borderRadius: 6, overflow: 'hidden',
        border: '1px solid var(--border)', background: 'var(--bg-2)',
      }}>
        <Segment n={yes} label="Yes" color="#10a37f" />
        <Segment n={partial} label="Partial" color="#d97706" />
        <Segment n={no} label="No" color="#b91c1c" />
      </div>
      <div style={{
        display: 'flex', gap: 14, marginTop: 8,
        fontSize: 12, color: 'var(--fg-2)',
      }}>
        <span><span style={{ color: '#10a37f' }}>●</span> Yes {yes}</span>
        <span><span style={{ color: '#d97706' }}>●</span> Partial {partial}</span>
        <span><span style={{ color: '#b91c1c' }}>●</span> No {no}</span>
      </div>
    </div>
  )
}
