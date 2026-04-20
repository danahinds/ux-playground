export function PrototypeViewer({ prototype, onEnd }) {
  const src = `/prototypes/${prototype}/index.html`

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10,
      display: 'flex', flexDirection: 'column',
      background: '#fff',
    }}>
      {/* Prototype iframe — full viewport */}
      <iframe
        src={src}
        title={`Prototype: ${prototype}`}
        style={{
          flex: 1, width: '100%', border: 'none',
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
      />

      {/* Floating "End session" button */}
      <button
        onClick={onEnd}
        style={{
          position: 'fixed', top: 16, right: 16, zIndex: 20,
          background: 'rgba(10, 10, 10, 0.88)', color: '#fff',
          padding: '8px 16px', fontSize: 13, fontWeight: 600,
          borderRadius: 8, border: '1px solid rgba(255,255,255,0.15)',
          backdropFilter: 'blur(8px)',
          cursor: 'pointer',
          fontFamily: 'ui-monospace, monospace',
          letterSpacing: '.02em',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
        }}
      >
        End session ✕
      </button>
    </div>
  )
}
