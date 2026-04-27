import { useState } from 'react'

export function WrapperIntake({ sessionId, prototype, onSubmit }) {
  const [form, setForm] = useState({
    'age-range': '',
    'tech-comfort': '',
    familiarity: '',
  })
  const [submitting, setSubmitting] = useState(false)

  const set = (key, value) => setForm(f => ({ ...f, [key]: value }))
  const valid = form['age-range'] && form['tech-comfort'] && form.familiarity

  const handleSubmit = async () => {
    if (!valid || submitting) return
    setSubmitting(true)

    // Build form data for Netlify Forms
    const body = new URLSearchParams({
      'form-name': 'playground-intake',
      'session-id': sessionId,
      prototype,
      'age-range': form['age-range'],
      'tech-comfort': form['tech-comfort'],
      familiarity: form.familiarity,
      timestamp: new Date().toISOString(),
    })

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
    } catch (e) {
      // Don't block the tester if Netlify Forms is unreachable (e.g., local dev)
      console.warn('Netlify Forms submission failed:', e)
    }

    onSubmit(form)
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
          PLAYGROUND · INTAKE · 3 QUESTIONS · ~45 SEC
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>
          Before we start.
        </h1>
        <p style={{ color: '#666', marginBottom: 32, fontSize: 15, lineHeight: 1.55 }}>
          These three questions help us segment your session recording.
          We don't collect your name, email, or IP.
        </p>

        <div style={{ display: 'grid', gap: 28 }}>
          {/* Age range */}
          <div>
            <label style={{ fontSize: 12, color: '#888', marginBottom: 10, display: 'block', fontFamily: 'ui-monospace, monospace', letterSpacing: '.08em' }}>
              01 · AGE RANGE
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['18–24', '25–34', '35–44', '45–54', '55+'].map(a => (
                <Pill key={a} active={form['age-range'] === a} onClick={() => set('age-range', a)}>{a}</Pill>
              ))}
            </div>
          </div>

          {/* Tech comfort */}
          <div>
            <label style={{ fontSize: 12, color: '#888', marginBottom: 10, display: 'block', fontFamily: 'ui-monospace, monospace', letterSpacing: '.08em' }}>
              02 · TECH COMFORT
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['I avoid it', 'Get by', 'Comfortable', 'Power user', 'I build software'].map(a => (
                <Pill key={a} active={form['tech-comfort'] === a} onClick={() => set('tech-comfort', a)}>{a}</Pill>
              ))}
            </div>
          </div>

          {/* Familiarity */}
          <div>
            <label style={{ fontSize: 12, color: '#888', marginBottom: 10, display: 'block', fontFamily: 'ui-monospace, monospace', letterSpacing: '.08em' }}>
              03 · FAMILIAR WITH THIS PRODUCT AREA
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {['Not really', 'A bit', 'Comfortable', 'Very familiar'].map(a => (
                <Pill key={a} active={form.familiarity === a} onClick={() => set('familiarity', a)}>{a}</Pill>
              ))}
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
            {submitting ? 'Starting…' : 'Start the test →'}
          </button>
          <span style={{ fontSize: 12, color: '#aaa', fontFamily: 'ui-monospace, monospace' }}>
            {Object.values(form).filter(Boolean).length}/3
          </span>
        </div>

        <p style={{ marginTop: 20, fontSize: 11, color: '#aaa', lineHeight: 1.5, maxWidth: 440 }}>
          By starting, you consent to mouse-movement and click recording for this session. No audio or video is captured.
        </p>

        <div style={{
          marginTop: 24, fontSize: 10, color: '#ccc', fontFamily: 'ui-monospace, monospace',
        }}>
          session: {sessionId.slice(0, 12)}…
        </div>
      </div>
    </div>
  )
}
