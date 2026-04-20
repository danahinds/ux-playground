import { useState, useRef } from 'react'

export const FakePrototype = ({ onEnd, onEvent }) => {
  const [step, setStep] = useState(0)
  const [plan, setPlan] = useState(null)
  const [rageCount, setRageCount] = useState(0)
  const lastClick = useRef(0)
  const proto = useRef(null)

  const track = (type, detail) => onEvent && onEvent({ type, detail, t: Date.now() })

  const onAreaClick = (e) => {
    if (!proto.current) return
    const r = proto.current.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width)
    const y = ((e.clientY - r.top) / r.height)
    track('click', { x, y })
    const now = Date.now()
    if (now - lastClick.current < 400) {
      setRageCount(c => {
        const n = c + 1
        if (n === 3) track('rage', { x, y })
        return n
      })
    } else setRageCount(0)
    lastClick.current = now
  }

  const roles = [
    { n:'Skeptic', d:"I'll click the thing that looks broken first." },
    { n:'Shortcut-seeker', d:"Where's the fastest path through this?", hot:true },
    { n:'Explorer', d:"I'll read every label before deciding." },
  ]

  const screens = [
    (
      <div style={{padding:'44px 36px',maxWidth:640,margin:'0 auto'}}>
        <div style={{fontSize:11,letterSpacing:'.2em',color:'#888',marginBottom:18,fontFamily:'ui-monospace,monospace'}}>PROTOTYPE · CHECKOUT-V3 · STEP 1 / 2</div>
        <div style={{fontSize:32,fontWeight:600,marginBottom:10,color:'#111',letterSpacing:'-0.02em'}}>You are part of the solution.</div>
        <div style={{color:'#555',marginBottom:28,fontSize:14,lineHeight:1.55}}>
          Every click you make here helps the team pick the right design. Pick the role that fits how you plan to poke at this prototype — there are no wrong answers.
        </div>
        <div style={{display:'grid',gap:10,marginBottom:28}}>
          {roles.map(pl => (
            <div key={pl.n} onClick={()=>{setPlan(pl.n); track('select-role',{role:pl.n})}}
              style={{
                padding:'14px 16px', textAlign:'left', cursor:'pointer',
                border: plan===pl.n ? '2px solid #111' : '1px solid #e5e5e5',
                background: pl.hot ? '#fafafa' : '#fff', borderRadius:8, position:'relative',
                display:'flex', alignItems:'center', gap:14,
              }}>
              <div style={{
                width:22,height:22,borderRadius:'50%',
                border: '2px solid ' + (plan===pl.n ? '#111' : '#d4d4d4'),
                display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0
              }}>
                {plan===pl.n && <div style={{width:10,height:10,borderRadius:'50%',background:'#111'}}/>}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,color:'#111',fontSize:14}}>{pl.n}</div>
                <div style={{fontSize:12.5,color:'#666',marginTop:2}}>{pl.d}</div>
              </div>
              {pl.hot && <div style={{fontSize:10,background:'#111',color:'#fff',padding:'3px 8px',borderRadius:3,letterSpacing:'.1em',fontFamily:'ui-monospace,monospace'}}>MOST PICKED</div>}
            </div>
          ))}
        </div>
        <button
          onClick={()=>{ if(plan){ setStep(1); track('advance',{to:'task'})} else { track('dead-click',{target:'continue-no-role'}) } }}
          style={{
            background: plan?'#111':'#ccc', color:'#fff', border:'none',
            padding:'13px 32px', fontSize:14, fontWeight:600, borderRadius:6,
            cursor: plan?'pointer':'not-allowed'
          }}>
          {"I'm in →"}
        </button>
        {rageCount>=3 && <div style={{marginTop:12,fontSize:11,color:'#d33'}}>{"⚠️ rage-click detected — the team will see this"}</div>}
      </div>
    ),
    (
      <div style={{padding:'44px 36px',maxWidth:640,margin:'0 auto'}}>
        <div style={{fontSize:11,letterSpacing:'.2em',color:'#888',marginBottom:18,fontFamily:'ui-monospace,monospace'}}>PROTOTYPE · CHECKOUT-V3 · STEP 2 / 2</div>
        <div style={{fontSize:26,fontWeight:600,marginBottom:8,color:'#111',letterSpacing:'-0.02em'}}>One sketch, one sentence.</div>
        <div style={{color:'#555',marginBottom:22,fontSize:14,lineHeight:1.55}}>
          {"In your own words: what would make this flow feel obvious? Half-formed thoughts are useful."}
        </div>
        <div style={{marginBottom:14}}>
          <div style={{fontSize:12,color:'#666',marginBottom:6,fontFamily:'ui-monospace,monospace',letterSpacing:'.05em'}}>YOUR TAKE</div>
          <textarea placeholder="e.g. I missed the 'skip' link the first time because it looked like body copy…"
            style={{width:'100%',padding:'12px 14px',border:'1px solid #ddd',borderRadius:6,fontSize:14,minHeight:90,resize:'vertical',fontFamily:'inherit',color:'#111',background:'#fff'}}/>
        </div>
        <div style={{marginBottom:22}}>
          <div style={{fontSize:12,color:'#666',marginBottom:8,fontFamily:'ui-monospace,monospace',letterSpacing:'.05em'}}>CONFIDENCE IN YOUR ANSWER</div>
          <div style={{display:'flex',gap:6}}>
            {['Low','Medium','High','Very high'].map(l=>(
              <div key={l} style={{
                padding:'8px 12px',fontSize:12,background:'#fff',
                border:'1px solid #ddd',borderRadius:6,cursor:'pointer',color:'#333'
              }}>{l}</div>
            ))}
          </div>
        </div>
        <div style={{display:'flex',gap:8}}>
          <button onClick={()=>setStep(0)} style={{padding:'12px 20px',background:'#fff',border:'1px solid #ddd',borderRadius:6,cursor:'pointer',color:'#111'}}>{"← Back"}</button>
          <button onClick={()=>{setStep(2);track('advance',{to:'done'})}} style={{padding:'12px 28px',background:'#111',color:'#fff',border:'none',borderRadius:6,cursor:'pointer',fontWeight:600}}>{"Send it →"}</button>
        </div>
      </div>
    ),
    (
      <div style={{padding:'64px 32px',textAlign:'center',maxWidth:520,margin:'0 auto'}}>
        <div style={{width:56,height:56,borderRadius:'50%',background:'#111',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px',fontSize:26}}>{'✓'}</div>
        <div style={{fontSize:26,fontWeight:600,color:'#111',marginBottom:10,letterSpacing:'-0.02em'}}>Your clicks are already in the pile.</div>
        <div style={{color:'#666',marginBottom:28,fontSize:14,lineHeight:1.55}}>
          A PM will see your session alongside {plan==='Shortcut-seeker'?'12':plan==='Skeptic'?'7':'9'} other {plan?.toLowerCase() || 'tester'}s today. If something you did changes the design, we'll tell you.
        </div>
        <button onClick={onEnd} style={{padding:'12px 24px',background:'#111',color:'#fff',border:'none',borderRadius:6,fontWeight:600,cursor:'pointer'}}>Close the session</button>
      </div>
    )
  ]

  return (
    <div ref={proto} onClick={onAreaClick} style={{
      background:'#fff', color:'#111', fontFamily:'system-ui,-apple-system,sans-serif',
      height:'100%', position:'relative', overflow:'auto',
    }}>
      {screens[step]}
    </div>
  )
}
