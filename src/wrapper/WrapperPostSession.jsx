import { useState } from 'react'

export function WrapperPostSession({
  sessionId,
  prototype,
  mode = 'exploration',
  taskTimings = [],
  onSubmit,
}) {
  const [intent, setIntent] = useState('')
  const [success, setSuccess] = useState('')
  const [confusion, setConfusion] = useState('')
  const [ease, setEase] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const valid = intent.trim().length > 0 && success !== ''

  const handleSubmit = async () => {
    if (!valid || submitting) return
    setSubmitting(true)

    const body = new URLSearchParams({
      'form-name': 'playground-session',
      'session-id': sessionId,
      prototype,
      mode,
      intent: intent.trim(),
      success,
      confusion: confusion.trim(),
      ease: ease == null ? '' : String(ease),
      'task-timings': taskTimings.length ? JSON.stringify(taskTimings) : '',
      timestamp: new Date().toISOString(),
      completion: 'manual',
    })

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
    } catch (e) {
      console.warn('Netlify Forms submission failed:', e)
    }

    onSubmit({ intent, success, confusion, ease })
  }

  const Pill = ({ active, onClick, children }) => (
    <button type="button" onClick={onClick} style={{
      padding: '10px 16px', fontSize: 14,
      background: active ? '#111' : '#fff',
      color: active ? '#fff' : '#555',
      border: '1.5px solid ' + (active ? '#111' : '#ddd'),
      borderRadius: 8, fontWeight: active ? 600 : 400,
      cursor: 'pointer', transition: 'all .15s ease',
    }}>{children}</button>
  )

  const EaseDot = ({ n }) => {
    const selected = ease === n
    return (
      <button type="button" onClick={() => setEase(selected ? null : n)} style={{
        width: 40, height: 40, fontSize: 14,
        background: selected ? '#111' : '#fff',
        color: selected ? '#fff' : '#555',
        border: '1.5px solid ' + (selected ? '#111' : '#ddd'),
        borderRadius: '50%', fontWeight: selected ? 600 : 400,
        cursor: 'pointer', transition: 'all .15s ease',
      }}>{n}</button>
    )
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#faf9f5', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111',
    }}>
      <div style={{ maxWidth: 520, width: '100%', padding: '40px 24px' }}>
        <div style={{
          fontSize: 10, letterSpacing: '.15em', color: '#999', marginBottom: 20,
          fontFamily: 'ui-monospace, monospace', textTransform: 'uppercase',
        }}>
          PLAYGROUND · POST-SESSION · ~45 SEC
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>
          A few quick questions.
        </h1>
        <p style={{ color: '#666', marginBottom: 32, fontSize: 15, lineHeight: 1.55 }}>
          Your own words help the team learn faster than any click tracking can.
        </p>

        <div style={{ display: 'grid', gap: 28 }}>
          {/* Intent */}
          <div>
            <label style={{ fontSize: 12, color: '#888', marginBottom: 10, display: 'block', fontFamily: 'ui-monospace, monospace', letterSpacing: '.08em' }}>
              01 · WHAT WERE YOU TRYING TO DO?
            </label>
            <textarea
              value={intent}
              onChange={e => setIntent(e.target.value)}
              placeholder="In your own words…"
              rows={3}
              style={{
                width: '100%', padding: '12px 14px', fontSize: 14,
                border: '1.5px solid #ddd', borderRadius: 8, background: '#fff',
                outline: 'none', color: '#111', resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Success */}
          <div>
            <label style={{ fontSize: 12, color: '#888', marginBottom: 10, display: 'block', fontFamily: 'ui-monospace, monospace', letterSpacing: '.08em' }}>
              02 · DID YOU SUCCEED?
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {[
                { value: 'yes', label: 'Yes' },
                { value: 'partial', label: 'Partially' },
                { value: 'no', label: 'No' },
              ].map(opt => (
                <Pill key={opt.value} active={success === opt.value} onClick={() => setSuccess(opt.value)}>
                  {opt.label}
                </Pill>
              ))}
            </div>
          </div>

          {/* Confusion */}
          <div>
            <label style={{ fontSize: 12, color: '#888', marginBottom: 10, display: 'block', fontFamily: 'ui-monospace, monospace', letterSpacing: '.08em' }}>
              03 · WHAT, IF ANYTHING, CONFUSED YOU? <span style={{ textTransform: 'none', color: '#bbb', letterSpacing: 0 }}>(optional)</span>
            </label>
            <textarea
              value={confusion}
              onChange={e => setConfusion(e.target.value)}
              placeholder="Anything you got stuck on, or skip this…"
              rows={3}
              style={{
                width: '100%', padding: '12px 14px', fontSize: 14,
                border: '1.5px solid #ddd', borderRadius: 8, background: '#fff',
                outline: 'none', color: '#111', resize: 'vertical',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Ease */}
          <div>
            <label style={{ fontSize: 12, color: '#888', marginBottom: 10, display: 'block', fontFamily: 'ui-monospace, monospace', letterSpacing: '.08em' }}>
              04 · HOW EASY WAS IT? <span style={{ textTransform: 'none', color: '#bbb', letterSpacing: 0 }}>(optional — 1 hard, 5 easy)</span>
            </label>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              {[1, 2, 3, 4, 5].map(n => <EaseDot key={n} n={n} />)}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!valid || submitting}
            style={{
              padding: '14px 28px', fontSize: 15, fontWeight: 600,
              background: valid ? '#111' : '#ccc', color: '#fff',
              border: 'none', borderRadius: 8,
              cursor: valid ? 'pointer' : 'not-allowed',
              opacity: submitting ? 0.6 : 1,
            }}
          >
            {submitting ? 'Submitting…' : 'Finish →'}
          </button>
          <span style={{ fontSize: 12, color: '#aaa', fontFamily: 'ui-monospace, monospace' }}>
            {intent.trim() ? '✓' : '○'} intent
            {'  ·  '}
            {success ? '✓' : '○'} success
          </span>
        </div>

        <div style={{
          marginTop: 24, fontSize: 10, color: '#ccc', fontFamily: 'ui-monospace, monospace',
        }}>
          session: {sessionId.slice(0, 12)}…
        </div>
      </div>
    </div>
  )
}
