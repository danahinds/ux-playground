import { Icon, Button } from '../shared'

const PROMPT_MAX = 280
const TASK_MAX = 10

export function ModeSelector({ mode, prompt, tasks, onChange }) {
  const setMode = (newMode) => onChange({ mode: newMode })

  const addTask = () => {
    if (tasks.length >= TASK_MAX) return
    onChange({ tasks: [...tasks, ''] })
  }

  const updateTask = (i, value) => {
    const next = [...tasks]
    next[i] = value
    onChange({ tasks: next })
  }

  const removeTask = (i) => {
    if (tasks.length <= 1) return
    onChange({ tasks: tasks.filter((_, idx) => idx !== i) })
  }

  const inputStyle = {
    width: '100%', padding: '12px 14px', fontSize: 14,
    background: 'var(--bg-2)', border: '1px solid var(--border-2)',
    borderRadius: 8, color: 'var(--fg)', outline: 'none',
    fontFamily: 'inherit',
  }

  const labelStyle = {
    fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase',
    letterSpacing: '.08em', marginBottom: 8, display: 'block',
  }

  const ModeButton = ({ value, label, description }) => {
    const active = mode === value
    return (
      <button
        type="button"
        onClick={() => setMode(value)}
        style={{
          flex: 1, padding: '14px 16px', borderRadius: 8,
          background: active ? 'var(--bg-3)' : 'var(--bg-2)',
          border: '1px solid ' + (active ? 'var(--accent)' : 'var(--border-2)'),
          color: 'var(--fg)', textAlign: 'left',
          cursor: 'pointer', transition: 'all .15s ease',
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--fg-3)', lineHeight: 1.4 }}>{description}</div>
      </button>
    )
  }

  return (
    <div>
      <label className="mono" style={labelStyle}>Test mode</label>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <ModeButton
          value="exploration"
          label="Exploration"
          description="Testers explore freely. Optional prompt."
        />
        <ModeButton
          value="guided"
          label="Guided tasks"
          description="Ordered tasks. Use for defined flows."
        />
      </div>

      {mode === 'exploration' ? (
        <div>
          <label className="mono" style={labelStyle}>
            Prompt <span style={{ textTransform: 'none', color: 'var(--fg-3)', letterSpacing: 0 }}>(optional)</span>
          </label>
          <textarea
            value={prompt}
            onChange={e => onChange({ prompt: e.target.value })}
            placeholder="e.g. Explore this as if you were trying to buy something."
            rows={2}
            maxLength={PROMPT_MAX}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
          <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 4, textAlign: 'right' }}>
            {prompt.length} / {PROMPT_MAX}
          </div>
        </div>
      ) : (
        <div>
          <label className="mono" style={labelStyle}>
            Tasks <span style={{ textTransform: 'none', color: 'var(--fg-3)', letterSpacing: 0 }}>({tasks.length} / {TASK_MAX})</span>
          </label>
          <div style={{ display: 'grid', gap: 8, marginBottom: 10 }}>
            {tasks.map((task, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div className="mono" style={{
                  fontSize: 11, color: 'var(--fg-3)', paddingTop: 14, minWidth: 54,
                }}>
                  Task {i + 1}
                </div>
                <textarea
                  value={task}
                  onChange={e => updateTask(i, e.target.value)}
                  placeholder="What should the tester try to do?"
                  rows={1}
                  maxLength={PROMPT_MAX}
                  style={{ ...inputStyle, resize: 'vertical', flex: 1 }}
                />
                {tasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTask(i)}
                    style={{
                      padding: 10, background: 'var(--bg-2)',
                      border: '1px solid var(--border-2)', borderRadius: 6,
                      color: 'var(--fg-3)', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    aria-label={`Remove task ${i + 1}`}
                  >
                    <Icon name="minus" size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
          {tasks.length < TASK_MAX && (
            <Button variant="outline" icon="plus" onClick={addTask}>Add task</Button>
          )}
        </div>
      )}
    </div>
  )
}
