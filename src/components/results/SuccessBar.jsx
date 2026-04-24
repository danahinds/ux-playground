const SEGS = [
  { key: 'yes',     label: 'Yes',     color: '#10a37f' },
  { key: 'partial', label: 'Partial', color: '#d97706' },
  { key: 'no',      label: 'No',      color: '#b91c1c' },
]

export function SuccessBar({ counts, activeFilter, onFilter }) {
  const { yes = 0, partial = 0, no = 0 } = counts
  const total = yes + partial + no

  if (total === 0) {
    return <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>No success responses yet.</div>
  }

  const count = (k) => counts[k] || 0
  const pct = (k) => Math.round((count(k) / total) * 100)

  return (
    <div>
      <div style={{
        display: 'flex', height: 34, borderRadius: 6, overflow: 'hidden',
        border: '1px solid var(--border)',
      }}>
        {SEGS.map(s => {
          if (count(s.key) === 0) return null
          const dim = activeFilter && activeFilter !== s.key
          const active = activeFilter === s.key
          return (
            <button
              key={s.key}
              onClick={() => onFilter?.(s.key)}
              aria-label={`Filter to ${s.label}`}
              style={{
                flex: count(s.key), background: s.color,
                color: '#fff', fontFamily: 'var(--font-mono)',
                fontSize: 12, fontWeight: 600,
                opacity: dim ? 0.3 : 1,
                boxShadow: active ? 'inset 0 0 0 2px rgba(255,255,255,0.4)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >{count(s.key)}</button>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
        {SEGS.map(s => {
          const active = activeFilter === s.key
          return (
            <button
              key={s.key}
              onClick={() => onFilter?.(s.key)}
              style={{
                fontSize: 12, color: active ? 'var(--fg)' : 'var(--fg-2)',
                padding: '4px 10px', borderRadius: 4,
                background: active ? 'var(--bg-3)' : 'transparent',
              }}
            >
              <span style={{ color: s.color }}>●</span> {s.label} {count(s.key)}
              <span className="mono" style={{ color: 'var(--fg-3)', fontSize: 11, marginLeft: 4 }}>
                {pct(s.key)}%
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
