const SUCCESS_STYLES = {
  yes: { label: 'Yes', color: '#10a37f' },
  partial: { label: 'Partial', color: '#d97706' },
  no: { label: 'No', color: '#b91c1c' },
}

function SuccessChip({ value }) {
  const style = SUCCESS_STYLES[value]
  if (!style) return <span style={{ fontSize: 12, color: 'var(--fg-3)' }}>—</span>
  return (
    <span style={{
      fontSize: 11, fontWeight: 600,
      padding: '2px 8px', borderRadius: 4,
      background: style.color, color: '#fff',
    }}>
      {style.label}
    </span>
  )
}

export function PerTesterTable({ sessions }) {
  if (sessions.length === 0) {
    return <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>No testers yet.</div>
  }

  const cell = {
    padding: '10px 12px', fontSize: 13, color: 'var(--fg)',
    borderBottom: '1px solid var(--border)',
    verticalAlign: 'top',
  }
  const head = {
    ...cell,
    fontSize: 11, color: 'var(--fg-3)',
    textTransform: 'uppercase', letterSpacing: '.08em',
    fontFamily: 'var(--font-mono)', fontWeight: 500,
    borderBottom: '1px solid var(--border-2)',
  }

  return (
    <div style={{
      border: '1px solid var(--border)', borderRadius: 8,
      overflow: 'hidden', background: 'var(--bg-2)',
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ ...head, textAlign: 'left' }}>Session</th>
            <th style={{ ...head, textAlign: 'left' }}>Role</th>
            <th style={{ ...head, textAlign: 'left' }}>Age</th>
            <th style={{ ...head, textAlign: 'left' }}>Tech</th>
            <th style={{ ...head, textAlign: 'left' }}>Success</th>
            <th style={{ ...head, textAlign: 'left' }}>Ease</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map(s => {
            const intake = s.intake
            const session = s.session
            return (
              <tr key={s.sessionId}>
                <td style={cell}>
                  <div className="mono" style={{ fontSize: 12 }}>
                    {s.sessionId.slice(0, 12)}…
                  </div>
                  {!session && <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 2 }}>intake only</div>}
                  {session && !intake && <div style={{ fontSize: 10, color: 'var(--fg-3)', marginTop: 2 }}>no intake</div>}
                </td>
                <td style={cell}>{intake?.role || '—'}</td>
                <td style={cell}>{intake?.ageRange || '—'}</td>
                <td style={cell}>{intake?.techComfort || '—'}</td>
                <td style={cell}><SuccessChip value={session?.success} /></td>
                <td style={cell}>{session?.ease ?? '—'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
