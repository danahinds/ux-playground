import { useRef, useState } from 'react'

export function TaskOverlay({ tasks, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timings, setTimings] = useState([])
  const startedAtRef = useRef(performance.now())

  const task = tasks[currentIndex]
  const isLast = currentIndex === tasks.length - 1

  const advance = (status) => {
    const durationMs = Math.round(performance.now() - startedAtRef.current)
    const next = [...timings, { id: task.id, status, durationMs }]

    if (isLast) {
      onComplete(next)
      return
    }

    setTimings(next)
    setCurrentIndex(i => i + 1)
    startedAtRef.current = performance.now()
  }

  const btnBase = {
    padding: '10px 18px', fontSize: 14, fontWeight: 600,
    borderRadius: 8, cursor: 'pointer', whiteSpace: 'nowrap',
    border: '1.5px solid transparent',
  }

  return (
    <div style={{
      position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 25,
      background: '#fff', borderTop: '1px solid #e0e0e0',
      boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
      padding: '14px 24px',
      display: 'flex', alignItems: 'center', gap: 16,
      fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 10, letterSpacing: '.12em', color: '#888',
          fontFamily: 'ui-monospace, monospace', textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          Task {currentIndex + 1} of {tasks.length}
        </div>
        <div style={{
          fontSize: 15, lineHeight: 1.4, fontWeight: 500,
          overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {task.prompt}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
        <button
          type="button"
          onClick={() => advance('stuck')}
          style={{
            ...btnBase,
            background: '#fff', color: '#555', borderColor: '#ddd',
          }}
        >
          I'm stuck
        </button>
        <button
          type="button"
          onClick={() => advance('done')}
          style={{
            ...btnBase,
            background: '#111', color: '#fff',
          }}
        >
          {isLast ? 'Finish →' : "Done, next →"}
        </button>
      </div>
    </div>
  )
}
