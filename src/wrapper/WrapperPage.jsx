import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { generateSessionId } from './session'
import { tagSession, tagPrototype, tagDemographics } from './clarity'
import { WrapperIntake } from './WrapperIntake'
import { PrototypeViewer } from './PrototypeViewer'
import { WrapperPostSession } from './WrapperPostSession'
import { WrapperThankYou } from './WrapperThankYou'

export default function WrapperPage() {
  const [searchParams] = useSearchParams()
  const prototype = searchParams.get('proto')
  const sessionId = useMemo(() => generateSessionId(), [])
  const [view, setView] = useState('intake') // intake | proto | postsession | thanks

  // Tag Clarity with session ID on mount
  useState(() => {
    tagSession(sessionId)
    if (prototype) tagPrototype(prototype)
  })

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

  const handleIntakeSubmit = (form) => {
    tagDemographics(form)
    setView('proto')
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
      {view === 'proto' && (
        <PrototypeViewer
          prototype={prototype}
          onEnd={() => setView('postsession')}
        />
      )}
      {view === 'postsession' && (
        <WrapperPostSession
          sessionId={sessionId}
          prototype={prototype}
          onSubmit={() => setView('thanks')}
        />
      )}
      {view === 'thanks' && (
        <WrapperThankYou sessionId={sessionId} />
      )}
    </>
  )
}
