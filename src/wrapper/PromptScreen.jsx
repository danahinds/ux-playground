export function PromptScreen({ prompt, onStart }) {
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
          PLAYGROUND · YOUR PROMPT
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 20 }}>
          Here's what to try.
        </h1>

        <blockquote style={{
          margin: 0, padding: '20px 24px',
          background: '#fff', border: '1.5px solid #ddd', borderRadius: 10,
          fontSize: 17, lineHeight: 1.55, color: '#333',
          fontStyle: 'italic',
        }}>
          {prompt}
        </blockquote>

        <p style={{ color: '#666', marginTop: 20, fontSize: 14, lineHeight: 1.55 }}>
          Explore however feels natural. There are no wrong answers —
          the team wants to see how a real person reacts to this.
        </p>

        <button
          type="button"
          onClick={onStart}
          style={{
            marginTop: 28, padding: '14px 28px', fontSize: 15, fontWeight: 600,
            background: '#111', color: '#fff',
            border: 'none', borderRadius: 8, cursor: 'pointer',
          }}
        >
          Start →
        </button>
      </div>
    </div>
  )
}
