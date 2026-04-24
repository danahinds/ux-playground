import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Button, Wordmark } from '../shared'
import { useMeta } from '../../wrapper/useMeta'
import { SuccessBar } from './SuccessBar'
import { EaseAverage } from './EaseAverage'
import { QuoteList } from './QuoteList'
import { PerTesterTable } from './PerTesterTable'
import { TaskBreakdown } from './TaskBreakdown'

function demographicsLine(intake) {
  if (!intake) return ''
  return [intake.ageRange, intake.device, intake.techComfort].filter(Boolean).join(' · ')
}

function ts(s) {
  const t = s?.session?.timestamp ?? s?.intake?.timestamp
  if (!t) return null
  const n = typeof t === 'string' ? Date.parse(t) : t
  return Number.isFinite(n) ? n : null
}

function formatAgo(msAgo) {
  if (msAgo == null) return null
  const s = Math.round(msAgo / 1000)
  if (s < 60) return `${s}s ago`
  const m = Math.floor(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60)
  if (h < 48) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

function formatDate(ms) {
  if (ms == null) return null
  return new Date(ms).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function toCsv(sessions) {
  const header = ['session_id','timestamp','age_range','device','tech_comfort','familiarity','success','ease','intent','confusion','task_timings']
  const esc = (v) => {
    if (v == null) return ''
    const s = String(v).replace(/"/g, '""')
    return /[",\n]/.test(s) ? `"${s}"` : s
  }
  const rows = sessions.map(s => {
    const i = s.intake || {}
    const se = s.session || {}
    const timings = (se.taskTimings || []).map(t => `${t.id || ''}:${t.status || ''}:${t.durationMs ?? ''}`).join('|')
    return [s.sessionId, se.timestamp || i.timestamp || '', i.ageRange, i.device, i.techComfort, i.familiarity, se.success, se.ease, se.intent, se.confusion, timings].map(esc).join(',')
  })
  return [header.join(','), ...rows].join('\n')
}

function downloadCsv(filename, csv) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export default function ResultsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const prototype = searchParams.get('proto')
  const { loading: metaLoading, meta } = useMeta(prototype)

  const [state, setState] = useState({ loading: true, data: null, error: null })
  const [successFilter, setSuccessFilter] = useState(null)
  const [copied, setCopied] = useState(false)

  const fetchData = async () => {
    if (!prototype) return
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const res = await fetch(`/.netlify/functions/get-submissions?proto=${encodeURIComponent(prototype)}`)
      const data = await res.json()
      if (!res.ok) {
        setState({ loading: false, data: null, error: data.error || 'Failed to load results.' })
        return
      }
      setState({ loading: false, data, error: null })
    } catch (e) {
      setState({ loading: false, data: null, error: 'Network error. Try again.' })
    }
  }

  useEffect(() => { fetchData() }, [prototype])

  if (!prototype) {
    return (
      <Shell navigate={navigate}>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 12 }}>No prototype specified</h1>
          <p style={{ color: 'var(--fg-2)', fontSize: 14 }}>
            Add <code>?proto=&lt;slug&gt;</code> to the URL.
          </p>
        </div>
      </Shell>
    )
  }

  if (metaLoading) {
    return <Shell navigate={navigate}><LoadingState label="Loading test details…"/></Shell>
  }

  const testName = meta?.testName || prototype
  const mode = meta?.mode || 'exploration'
  const tasks = meta?.tasks

  if (state.loading) {
    return (
      <Shell navigate={navigate} testName={testName}>
        <LoadingState label="Loading sessions…"/>
      </Shell>
    )
  }

  if (state.error) {
    return (
      <Shell navigate={navigate} testName={testName}>
        <div style={{ padding: 24, background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 14, color: 'var(--fg-2)' }}>
          <div style={{ color: '#b91c1c', fontWeight: 500, marginBottom: 8 }}>Couldn't load results</div>
          <div>{state.error}</div>
          <Button variant="outline" onClick={fetchData} style={{ marginTop: 14 }}>Retry</Button>
        </div>
      </Shell>
    )
  }

  const sessions = state.data?.sessions || []
  const completedSessions = sessions.filter(s => s.session)
  const times = sessions.map(ts).filter(Boolean).sort((a, b) => a - b)
  const earliest = times[0]
  const latest = times[times.length - 1]
  const now = Date.now()

  // Empty state
  if (sessions.length === 0) {
    return (
      <Shell navigate={navigate} testName={testName} prototype={prototype} mode={mode} tasks={tasks} isEmpty>
        <div style={{
          padding: '72px 32px',
          border: '1px dashed var(--border-2)', borderRadius: 12,
          textAlign: 'center', background: 'var(--bg-2)',
          maxWidth: 640, margin: '40px auto',
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'var(--bg-3)', border: '1px solid var(--border)',
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 18, color: 'var(--fg-3)',
          }} className="mono">◦</div>
          <h2 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>
            Nothing to show yet.
          </h2>
          <p style={{ color: 'var(--fg-2)', fontSize: 14, maxWidth: 420, margin: '0 auto 20px', lineHeight: 1.55 }}>
            This page populates as testers complete the flow. Share the link below — results appear here in real time, and you can refresh anytime.
          </p>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 10px 8px 14px',
            background: 'var(--bg-3)', border: '1px solid var(--border)', borderRadius: 7,
          }}>
            <code className="mono" style={{ fontSize: 12, color: 'var(--fg-2)' }}>
              {`${window.location.origin}/t?proto=${prototype}`}
            </code>
            <button onClick={() => {
              navigator.clipboard?.writeText(`${window.location.origin}/t?proto=${prototype}`)
              setCopied(true)
              setTimeout(() => setCopied(false), 1500)
            }} className="mono" style={{
              padding: '4px 10px', borderRadius: 4,
              color: 'var(--accent)',
              background: 'color-mix(in oklch, var(--accent) 10%, transparent)',
              fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600,
            }}>{copied ? 'Copied' : 'Copy'}</button>
          </div>
        </div>
      </Shell>
    )
  }

  const successCounts = {
    yes: completedSessions.filter(s => s.session.success === 'yes').length,
    partial: completedSessions.filter(s => s.session.success === 'partial').length,
    no: completedSessions.filter(s => s.session.success === 'no').length,
  }
  const easeValues = completedSessions.map(s => s.session.ease).filter(e => e != null)
  const intentQuotes = completedSessions.map(s => ({ text: s.session.intent, demographics: demographicsLine(s.intake) }))
  const confusionQuotes = completedSessions.map(s => ({ text: s.session.confusion, demographics: demographicsLine(s.intake) }))

  const exportCsv = () => downloadCsv(`${prototype}-sessions.csv`, toCsv(sessions))

  return (
    <Shell
      navigate={navigate}
      testName={testName}
      prototype={prototype}
      mode={mode}
      tasks={tasks}
      sessionsCount={sessions.length}
      lastAgo={latest ? formatAgo(now - latest) : null}
      openedOn={earliest ? formatDate(earliest) : null}
      onExport={exportCsv}
      isLive
    >
      {successFilter && (
        <FilterBar
          label={{ yes: 'Success = Yes', partial: 'Success = Partial', no: 'Success = No' }[successFilter]}
          visible={sessions.filter(s => s.session?.success === successFilter).length}
          total={successCounts[successFilter]}
          onClear={() => setSuccessFilter(null)}
        />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 32 }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12, marginBottom: 12 }}>
            <span className="mono" style={toplineLabel}>Success (self-reported)</span>
            <span className="mono" style={{ fontSize: 10.5, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Click a segment to filter sessions
            </span>
          </div>
          <SuccessBar
            counts={successCounts}
            activeFilter={successFilter}
            onFilter={(k) => setSuccessFilter(f => f === k ? null : k)}
          />
        </Card>
        <Card>
          <span className="mono" style={toplineLabel}>Ease · avg</span>
          <div style={{ marginTop: 8 }}>
            <EaseAverage values={easeValues}/>
          </div>
        </Card>
      </div>

      {mode === 'guided' && tasks && tasks.length > 0 && (
        <TaskBreakdown tasks={tasks} sessions={sessions}/>
      )}

      <div style={{ marginBottom: 32 }}>
        <div style={{ marginBottom: 10 }}>
          <span className="mono" style={toplineLabel}>Their words</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
          <QuoteList title="What they tried to do" quotes={intentQuotes} emptyLabel="No intent responses yet."/>
          <QuoteList title="What confused them" quotes={confusionQuotes} emptyLabel="No confusion reported yet."/>
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10, gap: 12 }}>
          <span className="mono" style={toplineLabel}>Sessions</span>
          <span className="mono" style={{ fontSize: 10.5, color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Click a row to expand · recordings in Clarity
          </span>
        </div>
        <PerTesterTable sessions={sessions} successFilter={successFilter}/>
        <div style={{ marginTop: 14, fontSize: 12, color: 'var(--fg-3)' }}>
          Session replays live in Microsoft Clarity — search the{' '}
          <span className="mono" style={{ color: 'var(--fg-2)' }}>session_id</span>{' '}
          tag to find a specific recording. Intake answers travel with it as metadata.
        </div>
      </div>
    </Shell>
  )
}

const toplineLabel = {
  fontFamily: 'var(--font-mono)', fontSize: 11,
  color: 'var(--fg-3)', textTransform: 'uppercase', letterSpacing: '0.08em',
}

const Card = ({ children }) => (
  <div style={{
    padding: '22px 24px',
    background: 'var(--bg-2)', border: '1px solid var(--border)',
    borderRadius: 10,
  }}>{children}</div>
)

const Chip = ({ children, accent }) => (
  <span className="mono" style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    fontSize: 11.5, padding: '3px 9px', borderRadius: 4,
    background: accent ? 'color-mix(in oklch, var(--accent) 14%, transparent)' : 'var(--bg-3)',
    color: accent ? 'var(--accent)' : 'var(--fg-2)',
    border: `1px solid ${accent ? 'color-mix(in oklch, var(--accent) 30%, transparent)' : 'var(--border)'}`,
    textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500,
  }}>{children}</span>
)

function FilterBar({ label, visible, total, onClear }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '10px 20px',
      background: 'color-mix(in oklch, var(--accent) 10%, var(--bg-2))',
      border: '1px solid color-mix(in oklch, var(--accent) 25%, transparent)',
      borderRadius: 8, marginBottom: 20,
    }}>
      <span className="mono" style={{ fontSize: 10.5, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 600 }}>
        FILTERED ·
      </span>
      <span style={{ fontSize: 13, color: 'var(--fg)', fontWeight: 500 }}>
        {label} <span className="mono" style={{ color: 'var(--fg-3)', marginLeft: 6, fontWeight: 400 }}>
          showing {visible} of {total}
        </span>
      </span>
      <button onClick={onClear} className="mono" style={{
        marginLeft: 'auto', fontSize: 11, color: 'var(--fg-2)',
        padding: '4px 10px', borderRadius: 4,
        border: '1px solid var(--border-2)',
      }}>Clear filter ✕</button>
    </div>
  )
}

function Shell({ children, navigate, testName, prototype, mode, tasks, sessionsCount, lastAgo, openedOn, onExport, isLive, isEmpty }) {
  useEffect(() => {
    document.body.setAttribute('data-aesthetic', 'dark')
    document.body.setAttribute('data-palette', 'graphite')
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--fg)', fontFamily: 'var(--font-sans)' }}>
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'color-mix(in oklch, var(--bg) 80%, transparent)',
        backdropFilter: 'blur(12px) saturate(140%)',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '12px 32px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <button onClick={() => navigate?.('/')} style={{ display: 'flex', alignItems: 'center' }}>
            <Wordmark size={18}/>
          </button>
          <div className="mono" style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 10, fontSize: 12, color: 'var(--fg-3)' }}>
            <button onClick={() => navigate?.('/prototypes')} style={{ color: 'var(--fg-3)' }}>Results</button>
            <span style={{ color: 'var(--border-2)' }}>/</span>
            <span style={{ color: 'var(--fg)' }}>{testName || '—'}</span>
          </div>
          <span style={{ flex: 1 }}/>
          <Button size="sm" variant="ghost" onClick={() => navigate?.('/prototypes')}>All tests</Button>
          {onExport && (
            <Button size="sm" variant="outline" onClick={onExport}>⤓ Export CSV</Button>
          )}
        </div>
      </header>

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 32px 80px' }}>
        {testName && (
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
            gap: 24, marginBottom: 28, flexWrap: 'wrap',
          }}>
            <div>
              <h1 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.1, marginBottom: 6 }}>
                {testName}
              </h1>
              {prototype && (
                <div className="mono" style={{ color: 'var(--fg-3)', fontSize: 13 }}>
                  /t?proto={prototype}
                  {mode && ` · ${mode} mode`}
                  {tasks && tasks.length > 0 && ` · ${tasks.length} task${tasks.length === 1 ? '' : 's'}`}
                </div>
              )}
              <div style={{ display: 'flex', gap: 14, marginTop: 10, fontSize: 13, color: 'var(--fg-2)', flexWrap: 'wrap' }}>
                {isEmpty ? (
                  <span>No sessions yet</span>
                ) : sessionsCount != null && (
                  <span>
                    <span style={{
                      display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                      background: 'var(--accent)', boxShadow: '0 0 6px var(--accent)',
                      marginRight: 6, verticalAlign: 'middle',
                      animation: 'results-pulse 2s ease-in-out infinite',
                    }}/>
                    {sessionsCount} response{sessionsCount === 1 ? '' : 's'}
                  </span>
                )}
                {lastAgo && <><span style={{ color: 'var(--fg-3)' }}>·</span><span>Last session {lastAgo}</span></>}
                {openedOn && <><span style={{ color: 'var(--fg-3)' }}>·</span><span className="mono" style={{ color: 'var(--fg-3)', fontSize: 12 }}>Opened {openedOn}</span></>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
              {mode && <Chip>{mode === 'guided' ? 'Guided' : 'Exploration'}</Chip>}
              {isLive && <Chip accent>● Live</Chip>}
              {isEmpty && <Chip>● Awaiting responses</Chip>}
            </div>
          </div>
        )}
        {children}
      </main>

      <style>{`
        @keyframes results-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </div>
  )
}

function LoadingState({ label }) {
  return (
    <div style={{ padding: '60px 0', textAlign: 'center', color: 'var(--fg-3)', fontSize: 14 }}>
      {label}
    </div>
  )
}
