import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { TopBar } from './components/landing/TopBar'
import { Hero } from './components/landing/Hero'
import { Footer } from './components/landing/Footer'
import { Poll } from './components/landing/Poll'
import { ContactForm } from './components/landing/ContactForm'
import { Tag, Button } from './components/shared'
import WrapperPage from './wrapper/WrapperPage'
import UploadPage from './components/upload/UploadPage'
import ResultsPage from './components/results/ResultsPage'
import PrototypeIndex from './components/prototypes/PrototypeIndex'

const SectionHead = ({ chip, title, dim, lede }) => (
  <>
    <div style={{display:'flex',alignItems:'baseline',gap:16,marginBottom:24,flexWrap:'wrap'}}>
      <Tag>{chip}</Tag>
      <h2 style={{fontSize:36,fontWeight:600,letterSpacing:'-0.03em',lineHeight:1.1}}>
        {title}{dim && <> <span style={{color:'var(--fg-3)'}}>{dim}</span></>}
      </h2>
    </div>
    {lede && <p style={{color:'var(--fg-2)',fontSize:16,maxWidth:640,marginBottom:40,lineHeight:1.55}}>{lede}</p>}
  </>
)

const sectionStyle = { maxWidth:1180, margin:'0 auto', padding:'80px 28px', borderTop:'1px solid var(--border)' }

const IconLock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <rect x="4" y="7" width="16" height="13" rx="2"/><path d="M8 7V5a4 4 0 0 1 8 0v2"/>
  </svg>
)
const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
  </svg>
)
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M4 6l8 6 8-6"/><rect x="3" y="5" width="18" height="14" rx="2"/>
  </svg>
)

const PRINCIPLES = [
  [<IconLock key="l"/>,  'Private by default', 'Every share link is password-protected. No public URLs, no indexed reports, no accidental audiences.'],
  [<IconClock key="c"/>, 'Expires in 5 days',  "Tests aren't archives. After five days the link dies and the sessions are purged. Archive sooner if you're done."],
  [<IconMail key="m"/>,  'Results by email',   'A readable digest lands in your inbox — success rate, quotes, where testers got stuck. No dashboard to check.'],
]

const Principles = () => (
  <section data-screen-label="how" id="how" style={sectionStyle}>
    <SectionHead
      chip="Principles"
      title="Built small,"
      dim="on purpose."
      lede="Most testing tools are platforms. This one isn't. It exists to answer a single question — did testers get through? — and then get out of the way."
    />
    <div style={{
      display:'grid', gridTemplateColumns:'repeat(3, 1fr)',
      border:'1px solid var(--border)', borderRadius:12,
      background:'var(--bg-2)', overflow:'hidden',
    }}>
      {PRINCIPLES.map(([icon, title, desc], i) => (
        <div key={title} style={{
          padding:'28px 26px',
          borderRight: i < 2 ? '1px solid var(--border)' : 'none',
        }}>
          <div style={{
            width:36, height:36, borderRadius:8,
            background:'color-mix(in oklch, var(--accent) 10%, transparent)',
            border:'1px solid color-mix(in oklch, var(--accent) 25%, transparent)',
            color:'var(--accent)',
            display:'flex',alignItems:'center',justifyContent:'center',
            marginBottom:16,
          }}>{icon}</div>
          <div style={{fontSize:16,fontWeight:600,marginBottom:6}}>{title}</div>
          <div style={{fontSize:14,color:'var(--fg-2)',lineHeight:1.5}}>{desc}</div>
        </div>
      ))}
    </div>
  </section>
)

const MODES = [
  {
    k:'Mode 01', tag:'Exploration',
    h:'Let them roam.',
    p:<>No task list. Testers explore the prototype freely, with an optional prompt like <em>"try to see if you'd use this."</em> You'll see where they click, where they hesitate, and what they say about the whole thing.</>,
    use:'early concepts, open-ended feedback, first-impressions.',
  },
  {
    k:'Mode 02', tag:'Guided',
    h:'Walk them through.',
    p:<>Up to ten ordered tasks with per-task timing and a persistent task panel. Testers mark each as <em>Done</em> or <em>Stuck</em>. You'll see which steps worked and which ones broke.</>,
    use:'validating a flow, comparing designs, pre-launch QA.',
  },
]

const Modes = () => (
  <section id="modes" style={sectionStyle}>
    <SectionHead
      chip="Two modes"
      title="Pick the kind of test"
      dim="you actually need."
      lede="Most testing tools force one shape of study. Playground has two, because early exploration and late validation are different jobs."
    />
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
      {MODES.map(m => (
        <div key={m.k} style={{
          background:'var(--bg-2)', border:'1px solid var(--border)',
          borderRadius:14, padding:'28px 28px 26px',
          display:'flex', flexDirection:'column', gap:14,
        }}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline'}}>
            <span className="mono" style={{fontSize:11,color:'var(--fg-3)',textTransform:'uppercase',letterSpacing:'0.1em'}}>{m.k}</span>
            <span className="mono" style={{
              fontSize:10.5, padding:'3px 8px', borderRadius:4,
              background:'color-mix(in oklch, var(--accent) 14%, transparent)',
              color:'var(--accent)',
              border:'1px solid color-mix(in oklch, var(--accent) 28%, transparent)',
              textTransform:'uppercase', letterSpacing:'0.06em',
            }}>{m.tag}</span>
          </div>
          <h3 style={{fontSize:22,fontWeight:600,letterSpacing:'-0.02em',lineHeight:1.2}}>{m.h}</h3>
          <p style={{color:'var(--fg-2)',fontSize:14.5,lineHeight:1.55}}>{m.p}</p>
          <div style={{
            fontSize:13, color:'var(--fg-3)',
            paddingTop:14, borderTop:'1px solid var(--border)',
            marginTop:'auto',
          }}>
            <strong style={{color:'var(--fg-2)',fontWeight:500}}>Use when:</strong> {m.use}
          </div>
        </div>
      ))}
    </div>
  </section>
)

const BrowserDots = () => (
  <div style={{display:'flex',gap:6}}>
    <span style={{width:10,height:10,borderRadius:'50%',background:'#ff5f57'}}/>
    <span style={{width:10,height:10,borderRadius:'50%',background:'#febc2e'}}/>
    <span style={{width:10,height:10,borderRadius:'50%',background:'#28c840'}}/>
  </div>
)

const EmailMockup = () => (
  <div style={{
    width:'100%', maxWidth:360,
    background:'#fff', color:'#111',
    borderRadius:10,
    boxShadow:'0 20px 50px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.3)',
    overflow:'hidden',
  }}>
    <div style={{display:'flex',gap:6,alignItems:'center',padding:'10px 14px',background:'#f4f4f4',borderBottom:'1px solid #e5e5e5'}}>
      <BrowserDots/>
      <span className="mono" style={{marginLeft:'auto',fontSize:11,color:'#888'}}>Inbox</span>
    </div>
    <div style={{padding:'14px 18px 10px',borderBottom:'1px solid #eee'}}>
      <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
        <div className="mono" style={{
          width:30,height:30,borderRadius:'50%',
          background:'#00a855',color:'#fff',
          display:'flex',alignItems:'center',justifyContent:'center',
          fontWeight:700,fontSize:13,
        }}>P</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{fontSize:12.5,fontWeight:600,color:'#111'}}>Playground</div>
          <div style={{fontSize:11,color:'#888'}}>reports@playground.test</div>
        </div>
        <div style={{fontSize:11,color:'#aaa'}}>9:14 AM</div>
      </div>
      <div style={{fontSize:15,fontWeight:600,color:'#111',lineHeight:1.35}}>
        Your test is ready · checkout-v3 · 8 sessions
      </div>
    </div>
    <div style={{padding:'16px 18px',fontSize:13,lineHeight:1.55,color:'#333'}}>
      <p style={{marginBottom:10}}>Your 5-day window closed. Here's the summary:</p>
      <div style={{
        display:'grid',gridTemplateColumns:'repeat(3, 1fr)',gap:8,
        padding:10,background:'#f8f8f6',borderRadius:6,marginBottom:12,
      }}>
        {[['8','Sessions'],['75%','Success'],['3.8','Ease']].map(([v,l]) => (
          <div key={l} style={{textAlign:'center'}}>
            <div className="mono" style={{fontSize:15,fontWeight:700,color:'#111'}}>{v}</div>
            <div className="mono" style={{fontSize:9.5,color:'#888',textTransform:'uppercase',letterSpacing:'0.08em',marginTop:2}}>{l}</div>
          </div>
        ))}
      </div>
      <p style={{marginBottom:10}}><strong>Where it broke:</strong> task 2 — apply a discount code. 3 of 8 got stuck.</p>
      <div style={{borderLeft:'2px solid #00a855',padding:'5px 10px',color:'#333',fontSize:12.5,fontStyle:'italic',marginBottom:8}}>
        "I missed the field at first — looked like a label."
        <span className="mono" style={{fontStyle:'normal',color:'#888',fontSize:10.5,display:'block',marginTop:3}}>— Session 04 · guided</span>
      </div>
      <div style={{display:'inline-block',background:'#111',color:'#fff',padding:'8px 14px',borderRadius:6,fontSize:12.5,fontWeight:600,marginTop:6}}>
        View full report →
      </div>
      <div className="mono" style={{fontSize:11,color:'#888',marginTop:10}}>Link expires in 5 days.</div>
    </div>
  </div>
)

const TesterMockup = () => (
  <div style={{
    width:'100%', maxWidth:320,
    background:'#fff', color:'#111',
    borderRadius:10,
    boxShadow:'0 20px 50px rgba(0,0,0,0.45), 0 4px 12px rgba(0,0,0,0.3)',
    overflow:'hidden',
  }}>
    <div style={{display:'flex',gap:6,alignItems:'center',padding:'9px 12px',background:'#f4f4f4',borderBottom:'1px solid #e5e5e5'}}>
      <BrowserDots/>
      <span className="mono" style={{
        marginLeft:'auto', fontSize:10.5, color:'#888',
        padding:'2px 8px', background:'#fff', borderRadius:4,
        maxWidth:170, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap',
      }}>playground.test/t?p=9k3x</span>
    </div>
    <div style={{padding:16}}>
      <div className="mono" style={{
        fontSize:10,color:'#666',letterSpacing:'0.12em',textTransform:'uppercase',
        marginBottom:10,display:'flex',justifyContent:'space-between',alignItems:'center',
      }}>
        <span>Shop-v3</span>
        <span style={{color:'#333',fontWeight:600}}>🛒 Cart · 0</span>
      </div>
      <div style={{border:'1px solid #eee',borderRadius:6,overflow:'hidden',marginBottom:12}}>
        <div style={{
          height:86,
          background:'linear-gradient(135deg, #E8A87C 0%, #C38D5E 55%, #8B5E3C 100%)',
          display:'flex',alignItems:'center',justifyContent:'center',position:'relative',
        }}>
          <span className="mono" style={{
            position:'absolute',top:7,left:7,
            background:'rgba(255,255,255,0.95)',color:'#8B5E3C',
            fontSize:9.5,fontWeight:700,letterSpacing:'0.12em',
            padding:'2px 7px',borderRadius:3,
          }}>NEW</span>
          <span style={{fontSize:44,filter:'drop-shadow(0 3px 5px rgba(0,0,0,0.25))'}}>☕</span>
        </div>
        <div style={{padding:'9px 11px'}}>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'baseline',gap:8,marginBottom:2}}>
            <span style={{fontSize:11.5,fontWeight:600,color:'#111'}}>Mug</span>
            <span style={{fontSize:12.5,fontWeight:700,color:'#111'}}>$32</span>
          </div>
          <div style={{fontSize:10.5,color:'#666',marginBottom:8}}>Terracotta · 12oz</div>
          <div style={{background:'#C0392B',color:'#fff',padding:'7px 10px',borderRadius:5,fontSize:10.5,fontWeight:600,textAlign:'center'}}>
            Add to cart
          </div>
        </div>
      </div>
      <div style={{
        background:'#fff',border:'1px solid #e0e0e0',borderRadius:8,
        padding:'9px 11px',display:'flex',gap:9,alignItems:'center',
        boxShadow:'0 -2px 6px rgba(0,0,0,0.05)',
      }}>
        <div style={{flex:1}}>
          <div className="mono" style={{fontSize:9.5,letterSpacing:'0.1em',color:'#666',textTransform:'uppercase',marginBottom:2}}>
            Task 2 of 3
          </div>
          <div style={{fontSize:11,color:'#111',fontWeight:500,lineHeight:1.35}}>
            Add the ceramic mug to your cart and reach checkout.
          </div>
        </div>
        <div style={{padding:'5px 9px',fontSize:10,background:'#fff',color:'#333',border:'1.5px solid #ccc',borderRadius:5,fontWeight:500}}>Stuck</div>
        <div style={{padding:'5px 9px',fontSize:10,background:'#111',color:'#fff',borderRadius:5,fontWeight:600}}>Done →</div>
      </div>
    </div>
  </div>
)

const BridgeCard = ({ label, pov, povDim, children }) => (
  <div style={{
    background:'var(--bg-2)', border:'1px solid var(--border)',
    borderRadius:14, overflow:'hidden',
    display:'flex', flexDirection:'column',
  }}>
    <div style={{
      padding:'14px 18px 12px', borderBottom:'1px solid var(--border)',
      display:'flex', justifyContent:'space-between', alignItems:'center',
      gap:12, flexWrap:'wrap',
    }}>
      <span className="mono" style={{fontSize:11,color:'var(--fg-3)',textTransform:'uppercase',letterSpacing:'0.1em'}}>{label}</span>
      <span style={{fontSize:13,fontWeight:600,color:'var(--fg)'}}>
        {pov} <span style={{color:'var(--fg-3)',fontWeight:400}}>· {povDim}</span>
      </span>
    </div>
    <div style={{
      padding:22,display:'flex',alignItems:'center',justifyContent:'center',
      minHeight:340,
      background:'linear-gradient(180deg, var(--bg-2) 0%, var(--bg-3) 100%)',
    }}>{children}</div>
  </div>
)

const WhatItLooksLike = () => (
  <section id="what" style={sectionStyle}>
    <SectionHead
      chip="What it looks like"
      title="Two views,"
      dim="one test."
      lede="Here's what each side of the test actually sees — the digest that lands in your inbox, and the prototype your testers run."
    />
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:22}}>
      <BridgeCard label="Your view"  pov="What you get"       povDim="email">   <EmailMockup/></BridgeCard>
      <BridgeCard label="Their view" pov="What testers see"   povDim="browser"> <TesterMockup/></BridgeCard>
    </div>
  </section>
)

const MidCta = () => {
  const navigate = useNavigate()
  return (
    <section style={{padding:'64px 40px',borderTop:'1px solid var(--border)',borderBottom:'1px solid var(--border)'}}>
      <div style={{
        maxWidth:1100, margin:'0 auto',
        display:'flex', justifyContent:'space-between', alignItems:'center',
        gap:32, flexWrap:'wrap',
      }}>
        <div>
          <div className="mono" style={{
            fontSize:12, color:'var(--fg-3)',
            textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:10,
          }}>Ready to try it on your own file?</div>
          <div style={{fontSize:28,fontWeight:600,letterSpacing:'-0.02em',lineHeight:1.2,maxWidth:560}}>
            Upload a prototype, share a link, read the report.
          </div>
        </div>
        <Button size="lg" onClick={() => navigate('/upload')}>Start a test →</Button>
      </div>
    </section>
  )
}

const StickyCta = () => {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <button onClick={() => navigate('/upload')} style={{
      position:'fixed', top:16, right:16, zIndex:50,
      background:'var(--accent)', color:'var(--accent-fg)',
      fontFamily:'var(--font-mono)', fontSize:12, fontWeight:600,
      padding:'9px 14px', borderRadius:999,
      boxShadow:'0 4px 16px rgba(0,0,0,0.25)',
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(-8px)',
      pointerEvents: visible ? 'auto' : 'none',
      transition: 'opacity .2s ease, transform .2s ease',
    }}>Start a test →</button>
  )
}

function Showcase() {
  useEffect(() => {
    document.body.setAttribute('data-aesthetic', 'dark')
    document.body.setAttribute('data-palette', 'graphite')
  }, [])

  const jump = (id) => {
    const el = document.getElementById(id) || document.querySelector(`[data-screen-label="${id}"]`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div data-screen-label="root">
      <StickyCta/>
      <TopBar onJump={jump}/>
      <main>
        <Hero onJump={jump}/>
        <Principles/>
        <Modes/>
        <WhatItLooksLike/>
        <MidCta/>
        <section style={{...sectionStyle,borderTop:'none'}}>
          <Poll/>
        </section>
        <section id="contact" style={sectionStyle}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1.2fr',gap:56,alignItems:'start'}}>
            <div>
              <div style={{display:'flex',alignItems:'baseline',gap:16,marginBottom:18,flexWrap:'wrap'}}>
                <Tag>Contact</Tag>
              </div>
              <h2 style={{fontSize:34,fontWeight:600,letterSpacing:'-0.03em',lineHeight:1.1,marginBottom:18}}>
                Let's talk.<br/>
                <span style={{color:'var(--fg-3)'}}>Pick a reason.</span>
              </h2>
              <p style={{color:'var(--fg-2)',fontSize:15,maxWidth:380,marginBottom:18}}>
                This is a private tool I built and run. Tell me what you're working on and I'll get back to you.
              </p>
              <a href="mailto:danahinds@gmail.com" className="mono" style={{
                fontSize:14, color:'var(--accent)',
                display:'inline-flex',alignItems:'center',gap:6,
              }}>
                <span style={{color:'var(--fg-3)'}}>↳</span>
                danahinds@gmail.com
              </a>
            </div>
            <ContactForm/>
          </div>
        </section>
        <Footer/>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Showcase />} />
        <Route path="/t" element={<WrapperPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="/prototypes" element={<PrototypeIndex />} />
      </Routes>
    </BrowserRouter>
  )
}
