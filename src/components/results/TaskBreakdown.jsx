function median(nums) {
  if (nums.length === 0) return null
  const sorted = [...nums].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
}

function formatMs(ms) {
  if (ms == null) return '—'
  if (ms < 1000) return `${ms}ms`
  const s = ms / 1000
  if (s < 60) return `${s.toFixed(1)}s`
  const m = Math.floor(s / 60)
  const rem = Math.round(s - m * 60)
  return `${m}m ${rem}s`
}

export function TaskBreakdown({ tasks, sessions }) {
  if (!tasks || tasks.length === 0) return null

  // Build per-task stats
  const stats = tasks.map(task => {
    const entries = []
    for (const s of sessions) {
      const timings = s.session?.taskTimings || []
      const hit = timings.find(t => t.id === task.id)
      if (hit) entries.push(hit)
    }
    const done = entries.filter(e => e.status === 'done').length
    const stuck = entries.filter(e => e.status === 'stuck').length
    const durations = entries.map(e => e.durationMs).filter(d => typeof d === 'number')
    return {
      id: task.id,
      prompt: task.prompt,
      attempted: entries.length,
      done,
      stuck,
      medianMs: median(durations),
    }
  })

  return (
    <div>
      <h3 style={{
        fontSize: 13, fontWeight: 500, color: 'var(--fg-2)',
        textTransform: 'uppercase', letterSpacing: '.08em',
        fontFamily: 'var(--font-mono)', marginBottom: 12,
      }}>
        Per-task breakdown
      </h3>
      <div style={{
        border: '1px solid var(--border)', borderRadius: 8,
        background: 'var(--bg-2)', overflow: 'hidden',
      }}>
        {stats.map((s, i) => {
          const completionPct = s.attempted ? Math.round((s.done / s.attempted) * 100) : 0
          return (
            <div key={s.id} style={{
              padding: '14px 16px',
              borderBottom: i < stats.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', marginBottom: 6 }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>
                  Task {i + 1}
                </span>
                <span style={{ fontSize: 14, color: 'var(--fg)', flex: 1 }}>
                  {s.prompt}
                </span>
              </div>
              <div className="mono" style={{
                display: 'flex', gap: 20, fontSize: 12, color: 'var(--fg-2)',
              }}>
                <span>{s.attempted} attempted</span>
                <span style={{ color: s.done ? '#10a37f' : 'var(--fg-3)' }}>
                  {s.done} done ({completionPct}%)
                </span>
                {s.stuck > 0 && (
                  <span style={{ color: '#d97706' }}>{s.stuck} stuck</span>
                )}
                <span style={{ color: 'var(--fg-3)' }}>
                  median {formatMs(s.medianMs)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
