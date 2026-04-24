import { useState } from 'react'

const SUCCESS_STYLES = {
  yes:     { label: 'Yes',     color: '#10a37f' },
  partial: { label: 'Partial', color: '#d97706' },
  no:      { label: 'No',      color: '#b91c1c' },
}

function SuccessPill({ value }) {
  const s = SUCCESS_STYLES[value]
  if (!s) return <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>—</span>
  return (
    <span style={{
      fontSize: 11, fontWeight: 600,
      padding: '2px 8px', borderRadius: 4,
      background: s.color, color: '#fff',
    }}>{s.label}</span>
  )
}

function formatMs(ms) {
  if (ms == null) return '—'
  const s = Math.round(ms / 1000)
  if (s < 60) return `${s}s`
  const m = Math.floor(s / 60)
  return `${m}m ${s - m * 60}s`
}

function totalSessionTime(timings) {
  if (!Array.isArray(timings)) return null
  const sum = timings.reduce((a, t) => a + (t.durationMs || 0), 0)
  return sum || null
}

const cell = { padding: '11px 14px', fontSize: 13, color: 'var(--fg)', borderBottom: '1px solid var(--border)' }
const head = {
  ...cell,
  fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)',
  textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500,
  background: 'var(--bg-3)', borderBottom: '1px solid var(--border-2)',
}

function Row({ s, expanded, onToggle }) {
  const intake = s.intake || {}
  const session = s.session
  const totalMs = totalSessionTime(session?.taskTimings)
  const rowBg = expanded ? 'var(--bg-3)' : undefined
  return (
    <>
      <tr
        onClick={onToggle}
        style={{ cursor: 'pointer' }}
      >
        <td style={{ ...cell, width: 28, paddingRight: 0, background: rowBg, color: 'var(--fg-3)' }}>
          <span style={{
            display: 'inline-block', fontSize: 10,
            transition: 'transform 0.15s ease',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0)',
            color: expanded ? 'var(--accent)' : 'var(--fg-3)',
          }}>▸</span>
        </td>
        <td style={{ ...cell, background: rowBg }}>
          <span className="mono" style={{ fontSize: 12 }}>
            {s.sessionId.slice(0, 12)}…
          </span>
        </td>
        <td style={{ ...cell, background: rowBg }}>{intake.ageRange || '—'}</td>
        <td style={{ ...cell, background: rowBg }}>{intake.device || '—'}</td>
        <td style={{ ...cell, background: rowBg }}>{intake.techComfort || '—'}</td>
        <td style={{ ...cell, background: rowBg }}><SuccessPill value={session?.success} /></td>
        <td style={{ ...cell, background: rowBg }}>{session?.ease ?? '—'}</td>
        <td className="mono" style={{ ...cell, background: rowBg, color: 'var(--fg-3)' }}>{formatMs(totalMs)}</td>
      </tr>
      {expanded && (
        <tr style={{ background: 'var(--bg-3)' }}>
          <td colSpan={8} style={{ padding: 0, borderBottom: '1px solid var(--border-2)' }}>
            <div style={{
              display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr',
              gap: 24, padding: '18px 24px',
            }}>
              <div>
                <div className="mono" style={{ fontSize: 10.5, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                  Intent
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                  {session?.intent
                    ? `"${session.intent}"`
                    : <span style={{ color: 'var(--fg-3)', fontStyle: 'italic' }}>(no answer)</span>}
                </div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 10.5, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                  Confusion
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.5 }}>
                  {session?.confusion
                    ? `"${session.confusion}"`
                    : <span style={{ color: 'var(--fg-3)', fontStyle: 'italic' }}>(no answer)</span>}
                </div>
              </div>
              <div>
                <div className="mono" style={{ fontSize: 10.5, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
                  Task timings
                </div>
                <div className="mono" style={{ fontSize: 12, color: 'var(--fg)' }}>
                  {(session?.taskTimings && session.taskTimings.length > 0) ? (
                    session.taskTimings.map((t, i) => (
                      <div key={i}>
                        T{i + 1} ·{' '}
                        <span style={{
                          color: t.status === 'done' ? '#10a37f' : t.status === 'stuck' ? '#ff9f43' : 'var(--fg-3)',
                        }}>{t.status || '—'}</span>
                        {' · '}{formatMs(t.durationMs)}
                      </div>
                    ))
                  ) : (
                    <span style={{ color: 'var(--fg-3)', fontStyle: 'italic' }}>(none)</span>
                  )}
                </div>
              </div>
            </div>
            <a
              href={`https://clarity.microsoft.com/projects/view/dashboard?search=${encodeURIComponent(s.sessionId)}`}
              target="_blank" rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mono"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                margin: '0 24px 18px', padding: '8px 14px',
                fontSize: 12, color: 'var(--accent)',
                background: 'color-mix(in oklch, var(--accent) 10%, transparent)',
                border: '1px solid color-mix(in oklch, var(--accent) 30%, transparent)',
                borderRadius: 5,
              }}
            >↗ View recording in Clarity</a>
          </td>
        </tr>
      )}
    </>
  )
}

export function PerTesterTable({ sessions, successFilter }) {
  const [expandedId, setExpandedId] = useState(null)

  const visible = successFilter
    ? sessions.filter(s => s.session?.success === successFilter)
    : sessions

  if (sessions.length === 0) {
    return <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>No testers yet.</div>
  }

  return (
    <div style={{ border: '1px solid var(--border)', borderRadius: 8, background: 'var(--bg-2)', overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...head, width: 28 }}/>
            <th style={{ ...head, textAlign: 'left' }}>Session</th>
            <th style={{ ...head, textAlign: 'left' }}>Age</th>
            <th style={{ ...head, textAlign: 'left' }}>Device</th>
            <th style={{ ...head, textAlign: 'left' }}>Tech</th>
            <th style={{ ...head, textAlign: 'left' }}>Success</th>
            <th style={{ ...head, textAlign: 'left' }}>Ease</th>
            <th style={{ ...head, textAlign: 'left' }}>Time</th>
          </tr>
        </thead>
        <tbody>
          {visible.map(s => (
            <Row
              key={s.sessionId}
              s={s}
              expanded={expandedId === s.sessionId}
              onToggle={() => setExpandedId(id => id === s.sessionId ? null : s.sessionId)}
            />
          ))}
        </tbody>
      </table>
      {visible.length === 0 && (
        <div style={{ padding: '18px 14px', fontSize: 13, color: 'var(--fg-3)', textAlign: 'center' }}>
          No sessions match the current filter.
        </div>
      )}
    </div>
  )
}
