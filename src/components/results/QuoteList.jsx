export function QuoteList({ title, quotes, emptyLabel = 'No responses yet.' }) {
  const clean = quotes.filter(q => q.text && q.text.trim())

  return (
    <div>
      <h3 style={{
        fontSize: 13, fontWeight: 500, color: 'var(--fg-2)',
        textTransform: 'uppercase', letterSpacing: '.08em',
        fontFamily: 'var(--font-mono)', marginBottom: 12,
      }}>
        {title}
      </h3>
      {clean.length === 0 ? (
        <div style={{ fontSize: 13, color: 'var(--fg-3)' }}>{emptyLabel}</div>
      ) : (
        <div style={{ display: 'grid', gap: 10 }}>
          {clean.map((q, i) => (
            <div key={i} style={{
              padding: '12px 16px',
              background: 'var(--bg-2)', border: '1px solid var(--border)',
              borderRadius: 8,
            }}>
              <div style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--fg)' }}>
                {q.text.trim()}
              </div>
              {q.demographics && (
                <div className="mono" style={{
                  fontSize: 11, color: 'var(--fg-3)', marginTop: 6,
                }}>
                  {q.demographics}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
