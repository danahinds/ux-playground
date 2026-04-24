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

function computeStats(tasks, sessions) {
  return tasks.map((task, i) => {
    const entries = []
    for (const s of sessions) {
      const timings = s.session?.taskTimings || []
      const hit = timings.find(t => t.id === task.id)
      if (hit) entries.push(hit)
    }
    const done = entries.filter(e => e.status === 'done').length
    const stuck = entries.filter(e => e.status === 'stuck').length
    const durations = entries.map(e => e.durationMs).filter(d => typeof d === 'number')
    const attempted = entries.length
    const completionPct = attempted ? Math.round((done / attempted) * 100) : 0
    return {
      idx: i + 1,
      id: task.id,
      prompt: task.prompt,
      attempted, done, stuck,
      completionPct,
      medianMs: median(durations),
    }
  })
}

function findBottleneck(stats) {
  if (stats.length === 0) return null
  // Pick the task with lowest completion rate that is also below 80%.
  const sorted = [...stats].sort((a, b) => a.completionPct - b.completionPct)
  const worst = sorted[0]
  if (!worst || worst.completionPct >= 80) return null
  return worst
}

function bottleneckText(worst, others) {
  if (!worst) return null
  const parts = []
  parts.push(`${worst.completionPct}% completion`)
  if (others.length) {
    const otherRange = [Math.min(...others.map(o => o.completionPct)), Math.max(...others.map(o => o.completionPct))]
    if (otherRange[0] === otherRange[1]) parts.push(`vs ${otherRange[0]}% on other tasks`)
    else parts.push(`vs ${otherRange[0]}–${otherRange[1]}% on other tasks`)
  }
  if (worst.medianMs != null && others.length) {
    const otherMedians = others.map(o => o.medianMs).filter(m => m != null)
    if (otherMedians.length) {
      const otherMed = Math.min(...otherMedians)
      if (otherMed > 0) {
        const ratio = worst.medianMs / otherMed
        if (ratio >= 2) parts.push(`median time is ${ratio.toFixed(1)}× longer`)
      }
    }
  }
  if (worst.stuck > 0) {
    parts.push(`${worst.stuck} tester${worst.stuck === 1 ? '' : 's'} pressed "I'm stuck"`)
  }
  return parts.join('. ')
}

export function TaskBreakdown({ tasks, sessions }) {
  if (!tasks || tasks.length === 0) return null

  const stats = computeStats(tasks, sessions)
  const worst = findBottleneck(stats)
  const others = stats.filter(s => s.id !== worst?.id)
  const bodyText = bottleneckText(worst, others)

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
        <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Per-task breakdown
        </span>
      </div>

      {worst && (
        <div style={{
          padding: '14px 18px',
          background: 'var(--bg-2)',
          border: '1px solid var(--border)',
          borderLeft: '3px solid var(--accent)',
          borderRadius: 6,
          marginBottom: 14,
          lineHeight: 1.55,
        }}>
          <span style={{ fontWeight: 600, color: 'var(--fg)', fontSize: 14.5, marginRight: 6 }}>
            Task {worst.idx} is the bottleneck.
          </span>
          <span style={{ fontSize: 13.5, color: 'var(--fg-2)' }}>{bodyText}.</span>
        </div>
      )}

      <div style={{
        border: '1px solid var(--border)', borderRadius: 8,
        background: 'var(--bg-2)', overflow: 'hidden',
      }}>
        {stats.map((s, i) => {
          const danger = worst && s.id === worst.id
          return (
            <div key={s.id} style={{
              padding: '14px 18px',
              borderBottom: i < stats.length - 1 ? '1px solid var(--border)' : 'none',
              background: danger ? 'color-mix(in oklch, #ff9f43 6%, transparent)' : 'transparent',
              borderLeft: danger ? '2px solid #ff9f43' : '2px solid transparent',
            }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 6 }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>Task {s.idx}</span>
                <span style={{ fontSize: 14, flex: 1 }}>{s.prompt}</span>
                <span className="mono" style={{
                  fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.08em',
                  padding: '2px 7px', borderRadius: 3, fontWeight: 500,
                  background: danger
                    ? 'color-mix(in oklch, #ff9f43 20%, transparent)'
                    : 'color-mix(in oklch, #10a37f 18%, transparent)',
                  color: danger ? '#ff9f43' : '#14b88a',
                }}>
                  {danger ? 'Bottleneck' : 'Healthy'}
                </span>
              </div>
              <div className="mono" style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--fg-2)', flexWrap: 'wrap' }}>
                <span>{s.attempted} attempted</span>
                <span style={{ color: '#10a37f' }}>{s.done} done · {s.completionPct}%</span>
                {s.stuck > 0 && <span style={{ color: '#ff9f43' }}>{s.stuck} stuck</span>}
                <span style={{ color: 'var(--fg-3)' }}>median {formatMs(s.medianMs)}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
