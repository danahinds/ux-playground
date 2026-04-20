import { useState, useEffect } from 'react'
import { Card, Icon } from '../shared'
import { IntakeForm } from './IntakeForm'
import { FakePrototype } from './FakePrototype'
import { ThankYou } from './ThankYou'

const useSessionId = () => {
  const [id] = useState(() => {
    const parts = []
    for (let i = 0; i < 4; i++) parts.push(Math.random().toString(36).slice(2,6))
    return parts.join('-')
  })
  return id
}

export const Demo = () => {
  const [view, setView] = useState('intake')
  const [events, setEvents] = useState([])
  const sessionId = useSessionId()

  const push = (e) => setEvents(l => [...l, e])

  const onIntake = (form) => {
    push({ type: 'intake-submit', detail: form, t: Date.now() })
    setView('proto')
  }

  return (
    <Card style={{overflow:'hidden',position:'relative'}}>
      {/* Browser chrome */}
      <div style={{
        display:'flex',alignItems:'center',gap:10,
        padding:'10px 14px',background:'var(--bg-3)',borderBottom:'1px solid var(--border)'
      }}>
        <div style={{display:'flex',gap:6}}>
          <span style={{width:11,height:11,borderRadius:'50%',background:'#ff5f57'}}/>
          <span style={{width:11,height:11,borderRadius:'50%',background:'#febc2e'}}/>
          <span style={{width:11,height:11,borderRadius:'50%',background:'#28c840'}}/>
        </div>
        <div className="mono" style={{
          flex:1, fontSize:11, color:'var(--fg-3)',
          background:'var(--bg-2)', padding:'5px 10px', borderRadius:5,
          border:'1px solid var(--border)',
          display:'flex',alignItems:'center',gap:6
        }}>
          <Icon name="lock" size={11}/>
          playground.uxtg.dev/t?proto=checkout-v3
          <span style={{flex:1}}/>
          <span style={{color:'var(--accent)'}}>{'● REC'}</span>
        </div>
      </div>

      {/* Content area */}
      <div style={{minHeight: 520, position:'relative', background:'var(--bg)'}}>
        {view === 'intake' && <IntakeForm onSubmit={onIntake} sessionId={sessionId}/>}
        {view === 'proto' && (
          <div style={{height:520,position:'relative'}}>
            <FakePrototype onEnd={()=>setView('thanks')} onEvent={push}/>
            <button onClick={()=>setView('thanks')} style={{
              position:'absolute', top:12, right:12,
              background:'rgba(10,10,10,0.85)', color:'#fff',
              padding:'6px 12px', fontSize:12, borderRadius:6,
              border:'1px solid #ffffff20', backdropFilter:'blur(8px)',
              fontFamily:'var(--font-mono)'
            }}>{'End session ✕'}</button>
          </div>
        )}
        {view === 'thanks' && <ThankYou events={events.length} onRestart={()=>{setEvents([]);setView('intake')}}/>}
      </div>
    </Card>
  )
}
