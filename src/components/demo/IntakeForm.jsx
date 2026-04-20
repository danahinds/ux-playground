import { useState } from 'react'
import { Tag, Button } from '../shared'

export const IntakeForm = ({ onSubmit, sessionId }) => {
  const [form, setForm] = useState({ age: '', device: '', tech: '', fam: '' })
  const valid = Object.values(form).every(v => v)
  const set = (k,v) => setForm(f => ({...f, [k]: v}))

  const Pill = ({ active, onClick, children }) => (
    <button onClick={onClick} style={{
      padding:'8px 12px', fontSize:13,
      background: active ? 'var(--accent)' : 'var(--bg-3)',
      color: active ? 'var(--accent-fg)' : 'var(--fg-2)',
      border: '1px solid ' + (active ? 'var(--accent)' : 'var(--border-2)'),
      borderRadius: 6, fontWeight: active ? 600 : 400,
    }}>{children}</button>
  )

  return (
    <div style={{padding:'32px 28px', maxWidth: 560, margin:'0 auto'}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
        <Tag size="sm">{'INTAKE · 4 QUESTIONS · ~60 SEC'}</Tag>
        <span className="mono" style={{fontSize:11,color:'var(--fg-3)'}}>session: {sessionId.slice(0,9)}…</span>
      </div>
      <h2 style={{fontSize:26,fontWeight:600,letterSpacing:'-0.02em',marginBottom:10}}>Before we start.</h2>
      <p style={{color:'var(--fg-2)',marginBottom:28,fontSize:14,maxWidth:460}}>
        {"These four questions help us segment your session recording. We don't collect your name, email, or IP."}
      </p>

      <div style={{display:'grid',gap:22}}>
        <div>
          <label style={{fontSize:12,color:'var(--fg-2)',marginBottom:8,display:'block',textTransform:'uppercase',letterSpacing:'.08em',fontFamily:'var(--font-mono)'}}>{'01 · Age range'}</label>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {['18–24','25–34','35–44','45–54','55+'].map(a=>
              <Pill key={a} active={form.age===a} onClick={()=>set('age',a)}>{a}</Pill>)}
          </div>
        </div>
        <div>
          <label style={{fontSize:12,color:'var(--fg-2)',marginBottom:8,display:'block',textTransform:'uppercase',letterSpacing:'.08em',fontFamily:'var(--font-mono)'}}>{"02 · Device you're using"}</label>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {['Desktop','Laptop','Tablet','Phone'].map(a=>
              <Pill key={a} active={form.device===a} onClick={()=>set('device',a)}>{a}</Pill>)}
          </div>
        </div>
        <div>
          <label style={{fontSize:12,color:'var(--fg-2)',marginBottom:8,display:'block',textTransform:'uppercase',letterSpacing:'.08em',fontFamily:'var(--font-mono)'}}>{'03 · Tech comfort'}</label>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {['I avoid it','Get by','Comfortable','Power user','I build software'].map(a=>
              <Pill key={a} active={form.tech===a} onClick={()=>set('tech',a)}>{a}</Pill>)}
          </div>
        </div>
        <div>
          <label style={{fontSize:12,color:'var(--fg-2)',marginBottom:8,display:'block',textTransform:'uppercase',letterSpacing:'.08em',fontFamily:'var(--font-mono)'}}>{'04 · Familiar with workflow apps'}</label>
          <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
            {['Not really','A bit','Comfortable','Very familiar'].map(a=>
              <Pill key={a} active={form.fam===a} onClick={()=>set('fam',a)}>{a}</Pill>)}
          </div>
        </div>
      </div>

      <div style={{marginTop:28,display:'flex',alignItems:'center',gap:12}}>
        <Button size="lg" onClick={()=>valid && onSubmit(form)} trailing="arrow"
          style={{opacity: valid?1:0.5, pointerEvents: valid?'auto':'none'}}>
          Start the test
        </Button>
        <span className="mono" style={{fontSize:11,color:'var(--fg-3)'}}>
          {Object.values(form).filter(Boolean).length}/4
        </span>
      </div>
      <div style={{marginTop:18,fontSize:11,color:'var(--fg-3)',lineHeight:1.5,maxWidth:460}}>
        By starting, you consent to mouse-movement and click recording for this session. No audio or video.
      </div>
    </div>
  )
}
