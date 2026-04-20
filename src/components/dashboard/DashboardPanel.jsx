import { useState } from 'react'
import { Wordmark, Button, Tag, Icon, Card, HeatDot, SparkBar } from '../shared'

export const DashboardPanel = () => {
  const [selected, setSelected] = useState(0)
  const [filter, setFilter] = useState('all')
  const [tab, setTab] = useState('replay')

  const sessions = [
    { id:'4f2a-b9c1', proto:'checkout-v3', age:'25–34', role:'Designer', tech:'Power user', fam:'Weekly', duration:'2:14', events:42, rage:0, dead:1, t:'12m ago', heat:[[.3,.4,.8],[.5,.6,.6],[.7,.3,.4]] },
    { id:'a1c5-02de', proto:'checkout-v3', age:'45–54', role:'Ops Manager', tech:'Get by', fam:'Occasional', duration:'4:08', events:71, rage:3, dead:2, t:'38m ago', heat:[[.5,.6,1],[.48,.62,.9],[.52,.58,.95],[.3,.3,.4]], flag:true },
    { id:'e73b-9102', proto:'checkout-v3', age:'18–24', role:'Student', tech:'Comfortable', fam:'First time', duration:'1:45', events:28, rage:0, dead:0, t:'1h ago', heat:[[.2,.3,.5],[.6,.7,.7]] },
    { id:'c84f-551a', proto:'onboarding-v2', age:'35–44', role:'Engineer', tech:'I build software', fam:'Weekly', duration:'3:22', events:55, rage:1, dead:0, t:'2h ago', heat:[[.4,.5,.6],[.7,.5,.8]] },
    { id:'9b0d-dd71', proto:'checkout-v3', age:'55+', role:'Finance Exec', tech:'Get by', fam:'Occasional', duration:'5:41', events:93, rage:4, dead:3, t:'3h ago', heat:[[.5,.6,1],[.52,.62,1],[.48,.58,.9],[.3,.3,.3]], flag:true },
    { id:'2e4a-7c88', proto:'checkout-v3', age:'25–34', role:'Marketing', tech:'Comfortable', fam:'Weekly', duration:'2:58', events:48, rage:0, dead:1, t:'4h ago', heat:[[.6,.4,.7]] },
  ]

  const filtered = filter === 'all'
    ? sessions
    : filter === 'rage' ? sessions.filter(s => s.rage > 0)
    : filter === '45+'  ? sessions.filter(s => s.age === '45–54' || s.age === '55+')
    : sessions

  const sel = filtered[selected] || filtered[0]
  const barData = [8,12,6,14,22,18,11,9,16,24,19,14,8,11,15,9]

  return (
    <Card style={{overflow:'hidden'}}>
      {/* App chrome */}
      <div style={{
        display:'flex',alignItems:'center',justifyContent:'space-between',
        padding:'10px 14px',background:'var(--bg-3)',borderBottom:'1px solid var(--border)',
      }}>
        <div style={{display:'flex',alignItems:'center',gap:10}}>
          <Wordmark size={15}/>
          <span style={{color:'var(--fg-3)'}}>/</span>
          <span className="mono" style={{fontSize:12,color:'var(--fg-2)'}}>dashboard</span>
          <span style={{color:'var(--fg-3)'}}>/</span>
          <span className="mono" style={{fontSize:12,color:'var(--fg)'}}>checkout-v3</span>
        </div>
        <div style={{display:'flex',gap:6,alignItems:'center'}}>
          <Tag accent size="sm">{'● LIVE · 2 testing now'}</Tag>
          <Button size="sm" variant="secondary" icon="copy">Share</Button>
          <Button size="sm" icon="plus">New test</Button>
        </div>
      </div>

      {/* KPI strip */}
      <div style={{
        display:'grid',gridTemplateColumns:'repeat(4,1fr)',
        borderBottom:'1px solid var(--border)',
      }}>
        {[
          {l:'Sessions', v:'47', d:'+12 today', spark:barData},
          {l:'Avg duration', v:'3:02', d:'+18s vs v2', spark:[10,14,9,12,16,18,15]},
          {l:'Rage clicks', v:'11', d:'3 sessions', bad:true, spark:[2,1,3,2,4,3,1]},
          {l:'Completion', v:'82%', d:'Goal: 80%', good:true, spark:[6,8,7,9,11,10,12]},
        ].map((k,i)=>(
          <div key={i} style={{padding:'14px 18px',borderRight: i<3?'1px solid var(--border)':'none'}}>
            <div className="mono" style={{fontSize:10.5,color:'var(--fg-3)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:6}}>{k.l}</div>
            <div style={{display:'flex',alignItems:'baseline',gap:8,marginBottom:6}}>
              <span style={{fontSize:24,fontWeight:600,letterSpacing:'-0.02em'}}>{k.v}</span>
              <span style={{fontSize:11,color: k.good?'var(--accent)':k.bad?'var(--bad)':'var(--fg-3)',fontFamily:'var(--font-mono)'}}>{k.d}</span>
            </div>
            <SparkBar data={k.spark} max={Math.max(...k.spark)} color={k.bad?'var(--bad)':'var(--accent)'} height={16}/>
          </div>
        ))}
      </div>

      {/* Body: sessions list + replay */}
      <div style={{display:'grid',gridTemplateColumns:'280px 1fr',minHeight:420}}>
        {/* Sessions list */}
        <div style={{borderRight:'1px solid var(--border)',background:'var(--bg-2)'}}>
          <div style={{padding:'10px 12px',borderBottom:'1px solid var(--border)',display:'flex',gap:4}}>
            {['all','rage','45+'].map(f=>(
              <button key={f} onClick={()=>{setFilter(f);setSelected(0)}} className="mono" style={{
                padding:'4px 8px',fontSize:11,textTransform:'uppercase',letterSpacing:'.08em',
                background: filter===f?'var(--bg-3)':'transparent',
                color: filter===f?'var(--fg)':'var(--fg-3)',
                border:'1px solid ' + (filter===f?'var(--border-2)':'transparent'),
                borderRadius:4,
              }}>{f==='all'?'All':f==='rage'?'Rage':'45+'}</button>
            ))}
            <span style={{flex:1}}/>
            <Icon name="filter" size={13}/>
          </div>
          <div style={{maxHeight:420,overflow:'auto'}}>
            {filtered.map((s,i)=>(
              <button key={s.id} onClick={()=>setSelected(i)} style={{
                display:'block',width:'100%',textAlign:'left',
                padding:'10px 12px',
                borderBottom:'1px solid var(--border)',
                background: selected===i?'var(--bg-3)':'transparent',
                borderLeft: '2px solid ' + (selected===i?'var(--accent)':'transparent'),
              }}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                  <span className="mono" style={{fontSize:11,color: selected===i?'var(--fg)':'var(--fg-2)'}}>{s.id}</span>
                  <span className="mono" style={{fontSize:10,color:'var(--fg-3)'}}>{s.t}</span>
                </div>
                <div style={{fontSize:12,color:'var(--fg-2)',marginBottom:6}}>
                  {s.age} · {s.role} · {s.tech}
                </div>
                <div style={{display:'flex',gap:6,alignItems:'center'}}>
                  <span className="mono" style={{fontSize:10,color:'var(--fg-3)'}}>{s.duration}</span>
                  <span className="mono" style={{fontSize:10,color:'var(--fg-3)'}}>·</span>
                  <span className="mono" style={{fontSize:10,color:'var(--fg-3)'}}>{s.events} events</span>
                  {s.rage>0 && <Tag size="sm"><span style={{color:'var(--bad)'}}>{s.rage} rage</span></Tag>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Replay panel */}
        <div style={{display:'flex',flexDirection:'column'}}>
          <div style={{padding:'8px 14px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',gap:8}}>
            {['replay','heatmap','events'].map(t=>(
              <button key={t} onClick={()=>setTab(t)} className="mono" style={{
                padding:'4px 10px',fontSize:11,textTransform:'uppercase',letterSpacing:'.08em',
                color: tab===t?'var(--fg)':'var(--fg-3)',
                borderBottom: '1px solid ' + (tab===t?'var(--accent)':'transparent'),
                paddingBottom:6,
              }}>{t}</button>
            ))}
            <span style={{flex:1}}/>
            <span className="mono" style={{fontSize:11,color:'var(--fg-3)'}}>session {sel.id} · {sel.proto}</span>
          </div>

          <div style={{flex:1,position:'relative',background:'var(--bg-3)',display:'flex',alignItems:'center',justifyContent:'center'}}>
            <div style={{
              width:'86%',height:'80%',background:'#fff',color:'#111',borderRadius:6,
              position:'relative',overflow:'hidden',
              fontFamily:'system-ui,sans-serif',
              boxShadow:'0 10px 40px -10px rgba(0,0,0,0.5)'
            }}>
              <div style={{padding:'20px 24px'}}>
                <div style={{fontSize:9,letterSpacing:'.2em',color:'#888',marginBottom:10,fontFamily:'ui-monospace,monospace'}}>PROTOTYPE · CHECKOUT-V3 · 1/2</div>
                <div style={{fontSize:17,fontWeight:600,marginBottom:6,letterSpacing:'-0.01em'}}>You are part of the solution.</div>
                <div style={{fontSize:10.5,color:'#666',marginBottom:14}}>{"Pick the role that fits how you'll poke at this."}</div>
                <div style={{display:'grid',gap:6,marginBottom:14}}>
                  {[['Skeptic',"I'll click the thing that looks broken first."],['Shortcut-seeker',"Where's the fastest path?"],['Explorer',"I'll read every label."]].map(([n,d],i)=>(
                    <div key={n} style={{padding:'8px 10px',border: i===1?'2px solid #111':'1px solid #ddd',borderRadius:5,fontSize:10,display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:12,height:12,borderRadius:'50%',border: i===1?'2px solid #111':'2px solid #ccc',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                        {i===1 && <div style={{width:5,height:5,borderRadius:'50%',background:'#111'}}/>}
                      </div>
                      <div><div style={{fontWeight:600}}>{n}</div><div style={{color:'#888',fontSize:9,marginTop:1}}>{d}</div></div>
                    </div>
                  ))}
                </div>
                <div style={{background:'#111',color:'#fff',padding:'7px 18px',borderRadius:4,fontSize:10.5,display:'inline-block',fontWeight:600}}>{"I'm in →"}</div>
              </div>

              {tab !== 'events' && sel.heat.map((h,i)=><HeatDot key={i} x={h[0]} y={h[1]} intensity={h[2]} rage={sel.rage>0 && i<sel.rage}/>)}

              {tab==='replay' && (
                <div style={{
                  position:'absolute',left:'52%',top:'62%',
                  transform:'translate(-50%,-50%)',
                  width:18,height:18,
                  pointerEvents:'none'
                }}>
                  <svg viewBox="0 0 24 24" width="18" height="18" style={{filter:'drop-shadow(0 1px 2px rgba(0,0,0,.4))'}}>
                    <path d="M4 4v12l4-3h6L4 4z" fill="#fff" stroke="#000" strokeWidth="1.2"/>
                  </svg>
                </div>
              )}

              {tab==='events' && (
                <div style={{position:'absolute',inset:0,background:'rgba(255,255,255,0.96)',padding:16,fontFamily:'ui-monospace,monospace',fontSize:10,color:'#111',overflow:'auto'}}>
                  {['00:00.0 session.start', '00:01.2 click {x:.3, y:.4}', '00:02.8 click {x:.5, y:.6} → select-plan Pro', '00:04.1 click {x:.52, y:.62}', '00:04.4 click {x:.51, y:.61}', '00:04.7 click {x:.50, y:.62} ⚠ RAGE', '00:06.3 advance → checkout', '00:09.1 input name', '00:12.4 input email', '00:19.8 advance → confirm', '00:22.3 session.end'].map((l,i)=>(
                    <div key={i} style={{padding:'2px 0',opacity: l.includes('RAGE')?1:0.8, color: l.includes('RAGE')?'#d03b1a':'#111',fontWeight:l.includes('RAGE')?600:400}}>{l}</div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Playback controls */}
          <div style={{
            padding:'10px 14px',borderTop:'1px solid var(--border)',
            display:'flex',alignItems:'center',gap:10,background:'var(--bg-2)'
          }}>
            <button style={{width:28,height:28,borderRadius:'50%',background:'var(--accent)',color:'var(--accent-fg)',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Icon name="play" size={12}/>
            </button>
            <span className="mono" style={{fontSize:11,color:'var(--fg-3)'}}>00:42</span>
            <div style={{flex:1,height:4,background:'var(--bg-3)',borderRadius:2,position:'relative'}}>
              <div style={{position:'absolute',left:0,top:0,bottom:0,width:'38%',background:'var(--accent)',borderRadius:2}}/>
              {[15,28,42,55,72].map((p,i)=>(
                <div key={i} style={{position:'absolute',left:`${p}%`,top:-2,width:1.5,height:8,background: i===2?'var(--bad)':'var(--fg-3)'}}/>
              ))}
            </div>
            <span className="mono" style={{fontSize:11,color:'var(--fg-3)'}}>{sel.duration}</span>
            <span style={{width:1,height:16,background:'var(--border-2)'}}/>
            <Button size="sm" variant="ghost" icon="download">Export</Button>
          </div>
        </div>
      </div>

      {/* Segment strip */}
      <div style={{
        padding:'10px 14px',borderTop:'1px solid var(--border)',
        display:'flex',alignItems:'center',gap:10,flexWrap:'wrap',background:'var(--bg-2)',
      }}>
        <span className="mono" style={{fontSize:10.5,color:'var(--fg-3)',textTransform:'uppercase',letterSpacing:'.1em'}}>Segment tags:</span>
        {[
          ['age', sel.age], ['role', sel.role], ['tech', sel.tech], ['familiarity', sel.fam]
        ].map(([k,v])=>(
          <span key={k} className="mono" style={{
            fontSize:11,padding:'3px 8px',
            background:'var(--bg-3)',border:'1px solid var(--border)',borderRadius:4,
            color:'var(--fg-2)'
          }}>
            <span style={{color:'var(--fg-3)'}}>{k}:</span> {v}
          </span>
        ))}
      </div>
    </Card>
  )
}
