import { useState, useEffect } from 'react'
import { Tag, Button, Icon, HeatDot } from '../shared'

const HeroVisualTrails = () => {
  const [ticks, setTicks] = useState(0)
  useEffect(() => {
    const h = setInterval(() => setTicks(t => t + 1), 50)
    return () => clearInterval(h)
  }, [])

  const cursors = [
    { speed: 1.0, offset: 0, color: 'var(--accent)' },
    { speed: 1.3, offset: 2.1, color: '#ff9f43' },
    { speed: 0.8, offset: 4.7, color: '#7c5cff' },
  ]
  const path = (t, ph) => {
    const u = (t * 0.015 * ph.speed + ph.offset) % (Math.PI * 2)
    return { x: 50 + 28 * Math.cos(u), y: 50 + 22 * Math.sin(u*1.3) }
  }

  return (
    <div style={{
      aspectRatio:'16/10', position:'relative',
      background:'var(--bg-2)', border:'1px solid var(--border)', borderRadius:12,
      overflow:'hidden'
    }}>
      <div style={{position:'absolute',inset:0,
        backgroundImage:'linear-gradient(to right,var(--border) 1px,transparent 1px),linear-gradient(to bottom,var(--border) 1px,transparent 1px)',
        backgroundSize:'32px 32px', opacity:0.4}}/>

      <div style={{
        position:'absolute', left:'8%', top:'12%', right:'8%', bottom:'12%',
        background:'#fff', borderRadius:8, padding:'16px 20px', color:'#111',
        boxShadow:'0 20px 60px -20px rgba(0,0,0,.6)',overflow:'hidden'
      }}>
        <div style={{fontSize:9,letterSpacing:'.2em',color:'#888',marginBottom:8,fontFamily:'ui-monospace,monospace'}}>PROTOTYPE · CHECKOUT-V3</div>
        <div style={{fontSize:16,fontWeight:600,marginBottom:4,letterSpacing:'-0.01em'}}>You are part of the solution.</div>
        <div style={{fontSize:10,color:'#666',marginBottom:10}}>Pick the role that fits how you'll poke at this.</div>
        <div style={{display:'grid',gap:5}}>
          {[['Skeptic',false],['Shortcut-seeker',true],['Explorer',false]].map(([n,on])=>(
            <div key={n} style={{padding:'6px 8px',border: on?'2px solid #111':'1px solid #ddd',borderRadius:4,fontSize:10,display:'flex',alignItems:'center',gap:6}}>
              <div style={{width:10,height:10,borderRadius:'50%',border: on?'2px solid #111':'2px solid #ccc',display:'flex',alignItems:'center',justifyContent:'center'}}>
                {on && <div style={{width:4,height:4,borderRadius:'50%',background:'#111'}}/>}
              </div>
              <span style={{fontWeight:600}}>{n}</span>
            </div>
          ))}
        </div>
        <div style={{background:'#111',color:'#fff',padding:'5px 14px',borderRadius:3,fontSize:10,display:'inline-block',marginTop:10,fontWeight:600}}>{"I'm in →"}</div>
      </div>

      {[[.32,.45,.9,false],[.51,.62,1,true],[.72,.5,.6,false],[.45,.3,.5,false]].map((h,i)=>(
        <HeatDot key={i} x={h[0]} y={h[1]} intensity={h[2]} rage={h[3]}/>
      ))}

      {cursors.map((c,i)=>{
        const p = path(ticks, c)
        return (
          <div key={i} style={{
            position:'absolute', left:`${p.x}%`, top:`${p.y}%`,
            transform:'translate(-2px,-2px)', pointerEvents:'none',
            transition:'left .04s linear, top .04s linear'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24">
              <path d="M4 4v12l4-3h6L4 4z" fill={c.color} stroke="#000" strokeWidth="1"/>
            </svg>
            <span style={{
              marginLeft:14,padding:'2px 6px',fontSize:10,
              background:c.color,color:'#000',borderRadius:3,
              fontFamily:'var(--font-mono)',fontWeight:600
            }}>t-{i+1}</span>
          </div>
        )
      })}

      <div style={{position:'absolute',top:12,left:12,display:'flex',alignItems:'center',gap:6,
        background:'rgba(0,0,0,.6)',padding:'4px 8px',borderRadius:4,fontFamily:'var(--font-mono)',fontSize:10,color:'var(--accent)'}}>
        <span style={{width:6,height:6,borderRadius:'50%',background:'var(--accent)',boxShadow:'0 0 6px var(--accent)'}}/>
        REC · 3 LIVE SESSIONS
      </div>
    </div>
  )
}

const HeroVisualTerminal = () => {
  const [lines, setLines] = useState([])
  useEffect(() => {
    const all = [
      { t: '$', c: 'uxtg deploy ./checkout-v3' },
      { t: '\u2713', c: 'uploaded 8 files \u00b7 142 kB', color:'var(--accent)' },
      { t: '\u2713', c: 'live at playground.uxtg.dev/t?proto=checkout-v3', color:'var(--accent)' },
      { t: ' ', c: '' },
      { t: '$', c: 'uxtg watch' },
      { t: '\u2192', c: '[session 4f2a-b9c1] intake submitted { age: "25\u201334", tech: "power-user" }' },
      { t: '\u2192', c: '[session 4f2a-b9c1] click at (0.52, 0.61) \u2192 select-plan Pro' },
      { t: '\u2192', c: '[session a1c5-02de] intake submitted { age: "45\u201354", tech: "get-by" }' },
      { t: '!', c: '[session a1c5-02de] RAGE CLICK \u00b7 3 clicks in 0.4s at (0.52, 0.62)', color:'var(--bad)' },
      { t: '\u2192', c: '[session a1c5-02de] dead-click on "Continue" (no-plan)', color:'var(--warn)' },
      { t: '\u2192', c: '[session e73b-9102] session completed \u00b7 1m 45s', color:'var(--accent)' },
      { t: ' ', c: '' },
      { t: '\u258c', c: '', blink:true },
    ]
    let i = 0
    const h = setInterval(() => {
      if (i <= all.length) { setLines(all.slice(0, i)); i++ }
      else { i = 3 }
    }, 400)
    return () => clearInterval(h)
  }, [])

  return (
    <div style={{
      aspectRatio:'16/10', background:'var(--bg-2)',
      border:'1px solid var(--border)', borderRadius:12, overflow:'hidden',
      display:'flex', flexDirection:'column'
    }}>
      <div style={{padding:'10px 14px',borderBottom:'1px solid var(--border)',display:'flex',gap:10,alignItems:'center',background:'var(--bg-3)'}}>
        <div style={{display:'flex',gap:5}}>
          <span style={{width:10,height:10,borderRadius:'50%',background:'#ff5f57'}}/>
          <span style={{width:10,height:10,borderRadius:'50%',background:'#febc2e'}}/>
          <span style={{width:10,height:10,borderRadius:'50%',background:'#28c840'}}/>
        </div>
        <span className="mono" style={{fontSize:11,color:'var(--fg-3)'}}>~/checkout-v3 — uxtg</span>
      </div>
      <div className="mono" style={{padding:'16px 18px',fontSize:12.5,lineHeight:1.7,flex:1,overflow:'hidden'}}>
        {lines.map((l,i)=>(
          <div key={i} style={{display:'flex',gap:10}}>
            <span style={{color:'var(--fg-3)',width:14}}>{l.t}</span>
            <span style={{color: l.color || 'var(--fg-2)'}}>
              {l.c}
              {l.blink && <span style={{animation:'blink 1s infinite',color:'var(--accent)'}}>{'\u2588'}</span>}
            </span>
          </div>
        ))}
        <style>{`@keyframes blink{50%{opacity:0}}`}</style>
      </div>
    </div>
  )
}

const HeroVisualAnnotated = () => (
  <div style={{
    aspectRatio:'16/10', background:'var(--bg-2)',
    border:'1px solid var(--border)', borderRadius:12, overflow:'hidden',
    position:'relative', padding:'40px 56px',
  }}>
    <div style={{position:'absolute',inset:0,
      backgroundImage:'linear-gradient(to right,var(--border) 1px,transparent 1px),linear-gradient(to bottom,var(--border) 1px,transparent 1px)',
      backgroundSize:'24px 24px', opacity:0.35}}/>

    <div style={{
      position:'relative', background:'#fff', color:'#111', borderRadius:6, padding:'18px 22px',
      boxShadow:'0 10px 40px -10px rgba(0,0,0,.5)', height:'100%'
    }}>
      <div style={{fontSize:9,letterSpacing:'.2em',color:'#888',marginBottom:8,fontFamily:'ui-monospace,monospace'}}>PROTOTYPE · CHECKOUT-V3 · 1/2</div>
      <div style={{fontSize:20,fontWeight:600,marginBottom:6,letterSpacing:'-0.02em'}}>You are part of the solution.</div>
      <div style={{fontSize:11,color:'#666',marginBottom:14}}>Pick the role that fits how you'll poke at this.</div>
      <div style={{display:'grid',gap:8}}>
        {[['Skeptic',false],['Shortcut-seeker',true],['Explorer',false]].map(([n,on])=>(
          <div key={n} style={{padding:'8px 10px',border: on?'2px solid #111':'1px solid #ddd',borderRadius:5,fontSize:11,display:'flex',alignItems:'center',gap:8}}>
            <div style={{width:12,height:12,borderRadius:'50%',border: on?'2px solid #111':'2px solid #ccc',display:'flex',alignItems:'center',justifyContent:'center'}}>
              {on && <div style={{width:5,height:5,borderRadius:'50%',background:'#111'}}/>}
            </div>
            <span style={{fontWeight:600}}>{n}</span>
          </div>
        ))}
      </div>

      <div style={{position:'absolute',top:-16,left:-40,fontFamily:'var(--font-mono)',fontSize:10,color:'var(--fg-3)'}}>
        <span style={{color:'var(--accent)'}}>{'●'}</span> 142 clicks
      </div>
      <div style={{position:'absolute',bottom:-18,right:-20,fontFamily:'var(--font-mono)',fontSize:10,color:'var(--fg-3)'}}>
        {'3.4s avg dwell →'}
      </div>
      <div style={{position:'absolute',top:'40%',right:-70,fontFamily:'var(--font-mono)',fontSize:10,color:'var(--bad)',whiteSpace:'nowrap'}}>
        {'← 7 rage clicks'}
      </div>
    </div>

    {[['tl','0,0'],['tr','1920,0'],['bl','0,1080'],['br','1920,1080']].map(([pos,v])=>{
      const s = {position:'absolute',fontFamily:'var(--font-mono)',fontSize:9,color:'var(--fg-3)'}
      if(pos==='tl'){s.top=6;s.left=8}
      if(pos==='tr'){s.top=6;s.right=8}
      if(pos==='bl'){s.bottom=6;s.left=8}
      if(pos==='br'){s.bottom=6;s.right=8}
      return <span key={pos} style={s}>{v}</span>
    })}
  </div>
)

const HERO_VISUALS = [HeroVisualTrails, HeroVisualTerminal, HeroVisualAnnotated]
const HERO_TAGS = ['live.capture', 'terminal.feed', 'annotated.spec']

export const Hero = ({ variant }) => {
  const Visual = HERO_VISUALS[variant % HERO_VISUALS.length]
  return (
    <section style={{maxWidth:1200,margin:'0 auto',padding:'72px 32px 48px',position:'relative'}}>
      <div style={{display:'grid',gridTemplateColumns:'1.05fr 1fr',gap:48,alignItems:'center'}}>
        <div>
          <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:22}}>
            <Tag accent>{'● internal tool · v0.4'}</Tag>
            <span className="mono" style={{fontSize:11,color:'var(--fg-3)'}}>
              UX Testground / handbook
            </span>
          </div>
          <h1 style={{
            fontSize:'clamp(42px, 6vw, 68px)', fontWeight:600,
            letterSpacing:'-0.035em', lineHeight:1.02, marginBottom:22,
          }}>
            Drop a prototype,<br/>
            <span style={{color:'var(--fg-3)'}}>get real sessions back</span><br/>
            <span className="serif" style={{fontStyle:'italic',fontWeight:400}}>by lunch.</span>
          </h1>
          <p style={{
            fontSize:17, color:'var(--fg-2)', maxWidth:500, lineHeight:1.55,
            marginBottom:28, textWrap:'pretty'
          }}>
            The Playground is the internal wrapper PMs and designers use to run
            unmoderated prototype tests. It's a thin layer over Clarity and Netlify
            Forms — we built it so iteration cycles measure in hours, not weeks.
          </p>
          <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:28}}>
            <Button size="lg" icon="zap" trailing="arrow">Start a test</Button>
            <Button size="lg" variant="ghost" icon="terminal">Open the PRD</Button>
          </div>

          <div style={{
            display:'flex',gap:32,paddingTop:22,borderTop:'1px solid var(--border)'
          }}>
            {[
              ['~10 min','PM time to a shareable link'],
              ['<5 min','tester completion'],
              ['47','sessions this week'],
              ['3','PMs on the tool'],
            ].map(([v,l])=>(
              <div key={l}>
                <div style={{fontSize:18,fontWeight:600,letterSpacing:'-0.01em'}}>{v}</div>
                <div className="mono" style={{fontSize:10.5,color:'var(--fg-3)',textTransform:'uppercase',letterSpacing:'.08em',marginTop:2}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
            <span className="mono" style={{fontSize:10.5,color:'var(--fg-3)',textTransform:'uppercase',letterSpacing:'.08em'}}>
              HERO.{HERO_TAGS[variant % HERO_VISUALS.length]}
            </span>
            <span style={{flex:1,height:1,background:'var(--border)'}}/>
            <span className="mono" style={{fontSize:10.5,color:'var(--fg-3)'}}>
              {String(variant + 1).padStart(2,'0')}/{String(HERO_VISUALS.length).padStart(2,'0')}
            </span>
          </div>
          <Visual/>
        </div>
      </div>
    </section>
  )
}
