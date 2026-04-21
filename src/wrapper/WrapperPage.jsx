import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { generateSessionId } from './session'
import { tagSession, tagPrototype, tagMode, tagDemographics } from './clarity'
import { useMeta } from './useMeta'
import { WrapperIntake } from './WrapperIntake'
import { PromptScreen } from './PromptScreen'
import { PrototypeViewer } from './PrototypeViewer'
import { TaskOverlay } from './TaskOverlay'
import { WrapperPostSession } from './WrapperPostSession'
import { WrapperThankYou } from './WrapperThankYou'
import { ClosedScreen } from './ClosedScreen'

export default function WrapperPage() {
  const [searchParams] = useSearchParams()
  const prototype = searchParams.get('proto')
  const sessionId = useMemo(() => generateSessionId(), [])
  const { loading, meta } = useMeta(prototype)
  const [view, setView] = useState('intake') // intake | prompt | proto | postsession | thanks
  const [taskTimings, setTaskTimings] = useState([])

  useEffect(() => {
    if (!prototype) return
    tagSession(sessionId)
    tagPrototype(prototype)
  }, [prototype, sessionId])

  useEffect(() => {
    if (meta?.mode) tagMode(meta.mode)
  }, [meta?.mode])

  // No prototype specified
  if (!prototype) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#faf9f5', fontFamily: 'system-ui, -apple-system, sans-serif', color: '#111',
      }}>
        <div style={{ maxWidth: 480, padding: '40px 24px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 12 }}>
            No prototype specified
          </h1>
          <p style={{ color: '#666', fontSize: 15, lineHeight: 1.55, marginBottom: 24 }}>
            This link is missing the <code style={{
              background: '#f0f0f0', padding: '2px 6px', borderRadius: 4, fontSize: 13,
              fontFamily: 'ui-monospace, monospace',
            }}>?proto=</code> parameter.
          </p>
          <p style={{ color: '#999', fontSize: 13 }}>
            Ask the PM who shared this link to check the URL.
          </p>
        </div>
      </div>
    )
  }

  if (loading) return null

  if (meta?.archived) {
    return <ClosedScreen testName={meta.testName} />
  }

  const mode = meta?.mode || 'exploration'
  const isGuided = mode === 'guided' && Array.isArray(meta?.tasks) && meta.tasks.length > 0
  const hasPrompt = mode === 'exploration' && typeof meta?.prompt === 'string' && meta.prompt.trim().length > 0

  const handleIntakeSubmit = (form) => {
    tagDemographics(form)
    setView(hasPrompt ? 'prompt' : 'proto')
  }

  const handleTaskComplete = (timings) => {
    setTaskTimings(timings)
    setView('postsession')
  }

  return (
    <>
      {view === 'intake' && (
        <WrapperIntake
          sessionId={sessionId}
          prototype={prototype}
          onSubmit={handleIntakeSubmit}
        />
      )}
      {view === 'prompt' && (
        <PromptScreen
          prompt={meta.prompt}
          onStart={() => setView('proto')}
        />
      )}
      {view === 'proto' && (
        <>
          <PrototypeViewer
            prototype={prototype}
            sessionId={sessionId}
            onEnd={isGuided ? null : () => setView('postsession')}
          />
          {isGuided && (
            <TaskOverlay
              tasks={meta.tasks}
              onComplete={handleTaskComplete}
            />
          )}
        </>
      )}
      {view === 'postsession' && (
        <WrapperPostSession
          sessionId={sessionId}
          prototype={prototype}
          mode={mode}
          taskTimings={taskTimings}
          onSubmit={() => setView('thanks')}
        />
      )}
      {view === 'thanks' && (
        <WrapperThankYou sessionId={sessionId} />
      )}
    </>
  )
}
