import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Tag, Button, Wordmark } from '../shared'
import { useMeta } from '../../wrapper/useMeta'
import { SuccessBar } from './SuccessBar'
import { EaseAverage } from './EaseAverage'
import { QuoteList } from './QuoteList'
import { PerTesterTable } from './PerTesterTable'
import { TaskBreakdown } from './TaskBreakdown'

function demographicsLine(intake) {
  if (!intake) return ''
  return [intake.role, intake.ageRange, intake.techComfort].filter(Boolean).join(' · ')
}

export default function ResultsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const prototype = searchParams.get('proto')
  const { loading: metaLoading, meta } = useMeta(prototype)

  const [state, setState] = useState({ loading: true, data: null, error: null })

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
      <Shell>
        <div style={{ textAlign: 'center', padding: '80px 20px' }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, marginBottom: 12 }}>
            No prototype specified
          </h1>
          <p style={{ color: 'var(--fg-2)', fontSize: 14 }}>
            Add <code>?proto=&lt;slug&gt;</code> to the URL.
          </p>
        </div>
      </Shell>
    )
  }

  if (metaLoading) {
    return <Shell><LoadingState label="Loading test details…" /></Shell>
  }

  const testName = meta?.testName || prototype
  const mode = meta?.mode || 'exploration'

  if (state.loading) {
    return (
      <Shell navigate={navigate} testName={testName} mode={mode} prototype={prototype}>
        <LoadingState label="Loading sessions…" />
      </Shell>
    )
  }

  if (state.error) {
    return (
      <Shell navigate={navigate} testName={testName} mode={mode} prototype={prototype}>
        <div style={{
          padding: 24, background: 'var(--bg-2)', border: '1px solid var(--border)',
          borderRadius: 8, fontSize: 14, color: 'var(--fg-2)',
        }}>
          <div style={{ color: '#b91c1c', fontWeight: 500, marginBottom: 8 }}>
            Couldn't load results
          </div>
          <div>{state.error}</div>
          <Button variant="outline" onClick={fetchData} style={{ marginTop: 14 }}>Retry</Button>
        </div>
      </Shell>
    )
  }

  const sessions = state.data?.sessions || []

  if (sessions.length === 0) {
    return (
      <Shell navigate={navigate} testName={testName} mode={mode} prototype={prototype}>
        <EmptyState />
      </Shell>
    )
  }

  // Aggregates
  const completedSessions = sessions.filter(s => s.session)
  const successCounts = {
    yes: completedSessions.filter(s => s.session.success === 'yes').length,
    partial: completedSessions.filter(s => s.session.success === 'partial').length,
    no: completedSessions.filter(s => s.session.success === 'no').length,
  }
  const easeValues = completedSessions.map(s => s.session.ease).filter(e => e != null)

  const intentQuotes = completedSessions.map(s => ({
    text: s.session.intent,
    demographics: demographicsLine(s.intake),
  }))
  const confusionQuotes = completedSessions.map(s => ({
    text: s.session.confusion,
    demographics: demographicsLine(s.intake),
  }))

  return (
    <Shell navigate={navigate} testName={testName} mode={mode} prototype={prototype}>
      {/* At-a-glance */}
      <div style={{
        display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24, marginBottom: 40,
      }}>
        <div>
          <div className="mono" style={{
            fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase',
            letterSpacing: '.08em', marginBottom: 10,
          }}>
            Success (self-reported) · {completedSessions.length} testers
          </div>
          <SuccessBar counts={successCounts} />
        </div>
        <div>
          <div className="mono" style={{
            fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase',
            letterSpacing: '.08em', marginBottom: 10,
          }}>
            Ease · avg
          </div>
          <EaseAverage values={easeValues} />
        </div>
      </div>

      {/* Guided breakdown */}
      {mode === 'guided' && meta?.tasks && (
        <div style={{ marginBottom: 40 }}>
          <TaskBreakdown tasks={meta.tasks} sessions={sessions} />
        </div>
      )}

      {/* Quotes */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, marginBottom: 40,
      }}>
        <QuoteList title="What they tried to do" quotes={intentQuotes} emptyLabel="No intent responses yet." />
        <QuoteList title="What confused them" quotes={confusionQuotes} emptyLabel="No confusion reported yet." />
      </div>

      {/* Per-tester table */}
      <div>
        <h3 style={{
          fontSize: 13, fontWeight: 500, color: 'var(--fg-2)',
          textTransform: 'uppercase', letterSpacing: '.08em',
          fontFamily: 'var(--font-mono)', marginBottom: 12,
        }}>
          Sessions
        </h3>
        <PerTesterTable sessions={sessions} />
        <div style={{ marginTop: 10, fontSize: 12, color: 'var(--fg-3)' }}>
          Find a session recording in Microsoft Clarity by searching for the <span className="mono">session_id</span> tag.
        </div>
      </div>
    </Shell>
  )
}

function Shell({ children, navigate, testName, mode, prototype }) {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      color: 'var(--fg)', fontFamily: 'var(--font-sans)',
    }}>
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '12px 32px',
        display: 'flex', alignItems: 'center', gap: 16,
        background: 'color-mix(in oklch, var(--bg) 80%, transparent)',
        backdropFilter: 'blur(12px)',
      }}>
        <button onClick={() => navigate?.('/')} style={{ display: 'flex', alignItems: 'center' }}>
          <Wordmark size={18} />
        </button>
        <span style={{ color: 'var(--fg-3)' }}>/</span>
        <span className="mono" style={{ fontSize: 13, color: 'var(--fg-2)' }}>results</span>
      </header>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 32px' }}>
        {testName && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10, flexWrap: 'wrap' }}>
              <Tag>{mode === 'guided' ? 'GUIDED' : 'EXPLORATION'}</Tag>
              {prototype && (
                <span className="mono" style={{ fontSize: 11, color: 'var(--fg-3)' }}>
                  /t?proto={prototype}
                </span>
              )}
            </div>
            <h1 style={{
              fontSize: 34, fontWeight: 600, letterSpacing: '-0.03em', marginBottom: 32,
            }}>
              {testName}
            </h1>
          </>
        )}
        {children}
      </div>
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

function EmptyState() {
  return (
    <div style={{
      padding: '60px 30px', textAlign: 'center',
      background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 10,
    }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>No sessions yet.</h2>
      <p style={{ color: 'var(--fg-2)', fontSize: 14 }}>
        Share the tester link. Responses will appear here once the first tester finishes.
      </p>
    </div>
  )
}
