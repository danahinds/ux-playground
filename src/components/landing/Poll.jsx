import { useState } from 'react'
import { Tag } from '../shared'

const COPY = {
  'use-myself':    { msg: "Good to hear. Want a ping when the next version ships?", email: true,  note: false, btn: "Notify me →" },
  'built-similar': { msg: "I'd love to compare notes. What did you run into?",        email: true,  note: true,  notePh: "one thing you hit (optional)", btn: "Send →" },
  'skeptical':     { msg: "Fair. What's the part that doesn't hold up?",              email: true,  note: true,  notePh: "the weakest claim, in your words", btn: "Send →" },
  'not-for-me':    { msg: "Thanks for the honesty. That's useful on its own.",        email: false, note: false },
}

const OPTIONS = [
  ['use-myself',    "I'd use this myself"],
  ['built-similar', "I've built something like this"],
  ['skeptical',     'Curious but skeptical'],
  ['not-for-me',    'Not for me'],
]

const post = (choice, email, note) => {
  const body = new URLSearchParams()
  body.append('form-name', 'playground-poll')
  body.append('choice', choice || '')
  body.append('email', email || '')
  body.append('note', note || '')
  fetch('/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  }).catch(() => {})
}

export const Poll = () => {
  const [stage, setStage] = useState('question')
  const [choice, setChoice] = useState(null)
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')

  const pick = (c) => {
    setChoice(c)
    if (!COPY[c].email && !COPY[c].note) {
      post(c, '', '')
      setStage('thanks')
    } else {
      setStage('followup')
    }
  }

  const submitFollowup = (e) => {
    e.preventDefault()
    post(choice, email, note)
    setStage('thanks')
  }

  const skip = () => {
    post(choice, '', '')
    setStage('thanks')
  }

  const c = choice && COPY[choice]

  return (
    <div style={{
      background:'var(--bg-2)', border:'1px solid var(--border)',
      borderRadius:14, padding:'32px 34px',
      maxWidth:720, margin:'0 auto', position:'relative',
    }}>
      {stage === 'question' && (
        <>
          <div style={{display:'flex',alignItems:'baseline',gap:12,flexWrap:'wrap',marginBottom:6}}>
            <Tag size="sm">Quick tap</Tag>
          </div>
          <div style={{fontSize:26,fontWeight:600,letterSpacing:'-0.02em',lineHeight:1.2,marginBottom:4}}>
            Could this be useful for you?
          </div>
          <div style={{color:'var(--fg-3)',fontSize:14,fontStyle:'italic',marginBottom:22}}>
            One tap. No typing, promise.
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
            {OPTIONS.map(([k,l]) => (
              <button key={k} onClick={() => pick(k)} style={{
                display:'flex',gap:10,alignItems:'center',
                padding:'13px 16px',
                background:'var(--bg-3)',
                border:'1px solid var(--border-2)',
                borderRadius:10, fontSize:14.5, color:'var(--fg)',
                textAlign:'left', width:'100%',
              }}>
                <span style={{
                  width:14,height:14,borderRadius:'50%',
                  border:'1.5px solid var(--border-2)', flexShrink:0,
                }}/>
                <span>{l}</span>
              </button>
            ))}
          </div>
        </>
      )}

      {stage === 'followup' && c && (
        <>
          <div style={{display:'flex',alignItems:'baseline',gap:12,flexWrap:'wrap',marginBottom:6}}>
            <Tag size="sm">Noted</Tag>
          </div>
          <div style={{fontSize:17,color:'var(--fg)',lineHeight:1.45,marginBottom:16}}>
            {c.msg}
          </div>
          <form onSubmit={submitFollowup} style={{display:'flex',gap:10,flexWrap:'wrap'}}>
            {c.email && (
              <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)}
                placeholder="your@email.com" autoComplete="email" required
                style={{
                  flex:1, minWidth:220,
                  background:'var(--bg-3)', border:'1px solid var(--border-2)',
                  borderRadius:8, padding:'11px 13px',
                  fontSize:14.5, color:'var(--fg)',
                }}/>
            )}
            {c.note && (
              <input type="text" value={note} onChange={(e)=>setNote(e.target.value)}
                placeholder={c.notePh || ''}
                style={{
                  flex:1, minWidth:220,
                  background:'var(--bg-3)', border:'1px solid var(--border-2)',
                  borderRadius:8, padding:'11px 13px',
                  fontSize:14.5, color:'var(--fg)',
                }}/>
            )}
            <button type="submit" style={{
              background:'var(--accent)', color:'var(--accent-fg)',
              padding:'11px 18px', borderRadius:8,
              fontWeight:600, fontSize:14,
            }}>{c.btn || 'Send →'}</button>
          </form>
          <button onClick={skip} style={{
            background:'none', color:'var(--fg-3)',
            fontSize:13, marginTop:10,
            textDecoration:'underline', textDecorationColor:'var(--border-2)', textUnderlineOffset:3,
          }}>No thanks, just wanted to tap.</button>
        </>
      )}

      {stage === 'thanks' && (
        <>
          <div style={{display:'flex',alignItems:'baseline',gap:12,flexWrap:'wrap',marginBottom:6}}>
            <Tag size="sm">Thanks</Tag>
          </div>
          <div style={{fontSize:22,fontWeight:600,letterSpacing:'-0.02em',marginBottom:6}}>
            Got it. <span style={{color:'var(--accent)'}}>Thanks for tapping.</span>
          </div>
          <div style={{color:'var(--fg-2)',fontSize:15}}>
            Every tap genuinely helps shape what I build next.
          </div>
        </>
      )}
    </div>
  )
}
