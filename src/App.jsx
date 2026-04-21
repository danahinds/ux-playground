import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { TopBar } from './components/landing/TopBar'
import { Hero } from './components/landing/Hero'
import { HowItWorks } from './components/landing/HowItWorks'
import { FAQ } from './components/landing/FAQ'
import { Footer } from './components/landing/Footer'
import { Demo } from './components/demo/Demo'
import { DashboardPanel } from './components/dashboard/DashboardPanel'
import { TweaksPanel } from './components/tweaks/TweaksPanel'
import { Tag, Button, Icon } from './components/shared'
import WrapperPage from './wrapper/WrapperPage'
import UploadPage from './components/upload/UploadPage'
import ResultsPage from './components/results/ResultsPage'

function Showcase() {
  const [tweaks, setTweaks] = useState({ palette: 'graphite', aesthetic: 'dark', heroVariant: 0 })
  const [showTweaks, setShowTweaks] = useState(false)

  useEffect(() => {
    document.body.setAttribute('data-aesthetic', tweaks.aesthetic)
    document.body.setAttribute('data-palette', tweaks.palette)
  }, [tweaks])

  const updateTweaks = (patch) => setTweaks(t => ({ ...t, ...patch }))

  const jump = (id) => {
    const el = document.querySelector(`[data-screen-label="${id}"]`)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div data-screen-label="root">
      <TopBar onJump={jump} />
      <main>
        <div data-screen-label="hero">
          <Hero variant={tweaks.heroVariant} />
        </div>
        <HowItWorks />

        {/* Demo section */}
        <section data-screen-label="demo" style={{maxWidth:1200,margin:'0 auto',padding:'72px 32px',borderTop:'1px solid var(--border)'}}>
          <div style={{display:'flex',alignItems:'baseline',gap:16,marginBottom:16,flexWrap:'wrap'}}>
            <Tag accent>{'● LIVE'}</Tag>
            <h2 style={{fontSize:36,fontWeight:600,letterSpacing:'-0.03em'}}>
              Try the tester flow. <span style={{color:'var(--fg-3)'}}>This is what your testers see.</span>
            </h2>
          </div>
          <p style={{color:'var(--fg-2)',fontSize:15,maxWidth:720,marginBottom:28}}>
            {"Fill the intake, poke around the prototype, end the session. Rage-click the disabled \"I'm in\" button to trigger a capture event."}
          </p>
          <Demo/>
        </section>

        {/* Dashboard section */}
        <section data-screen-label="dashboard" style={{maxWidth:1200,margin:'0 auto',padding:'72px 32px',borderTop:'1px solid var(--border)'}}>
          <div style={{display:'flex',alignItems:'baseline',gap:16,marginBottom:16,flexWrap:'wrap'}}>
            <Tag>PM VIEW</Tag>
            <h2 style={{fontSize:36,fontWeight:600,letterSpacing:'-0.03em'}}>
              What you see back. <span style={{color:'var(--fg-3)'}}>{'Clarity + Netlify, stitched.'}</span>
            </h2>
          </div>
          <p style={{color:'var(--fg-2)',fontSize:15,maxWidth:720,marginBottom:28}}>
            {"Filter by demographic, scrub a replay, check the heatmap, jump to the event log. Each tester's tags appear alongside their recording."}
          </p>
          <DashboardPanel/>
        </section>

        <FAQ />

        {/* Final CTA — quickstart */}
        <section style={{maxWidth:1200,margin:'0 auto',padding:'72px 32px',borderTop:'1px solid var(--border)'}}>
          <div style={{
            padding:'48px 44px', borderRadius:14,
            background:'var(--bg-2)',
            border:'1px solid var(--border-2)', position:'relative', overflow:'hidden',
          }}>
            <div style={{
              position:'absolute',inset:0,
              backgroundImage:'linear-gradient(to right,var(--border) 1px,transparent 1px),linear-gradient(to bottom,var(--border) 1px,transparent 1px)',
              backgroundSize:'32px 32px', opacity:0.3, pointerEvents:'none'
            }}/>
            <div style={{position:'relative',display:'grid',gridTemplateColumns:'1.2fr 1fr',gap:40,alignItems:'center'}}>
              <div>
                <Tag accent>QUICKSTART</Tag>
                <h2 style={{fontSize:38,fontWeight:600,letterSpacing:'-0.03em',marginTop:14,marginBottom:12}}>
                  From folder to live test, <br/>
                  <span className="serif" style={{fontStyle:'italic',fontWeight:400}}>in about ten minutes.</span>
                </h2>
                <p style={{color:'var(--fg-2)',fontSize:15,maxWidth:520,marginBottom:22,lineHeight:1.55}}>
                  The whole onboarding: drop your folder on Netlify, paste the Clarity key,
                  send the link. Ping #playground in Slack if anything feels off.
                </p>
                <div style={{display:'flex',gap:10,flexWrap:'wrap'}}>
                  <Button size="lg" icon="zap" trailing="arrow">Start a test</Button>
                  <Button size="lg" variant="outline" icon="terminal">Open the PRD</Button>
                  <Button size="lg" variant="ghost">#playground</Button>
                </div>
              </div>
              <pre className="mono" style={{
                fontSize:12.5,lineHeight:1.7,color:'var(--fg-2)',
                background:'var(--bg-3)',padding:'20px 22px',borderRadius:10,
                border:'1px solid var(--border)',margin:0,overflow:'auto',
              }}>{`$ mkdir my-test && cd my-test
$ cp ~/Desktop/checkout-v3.html ./
$ echo "CLARITY_ID=abc123" > .env
$ netlify deploy --prod
✓ live at playground.uxtg.dev/t?proto=checkout-v3
$ uxtg share --cohort designers`}</pre>
            </div>
          </div>
        </section>

        <Footer />
      </main>

      {showTweaks && <TweaksPanel state={tweaks} onChange={updateTweaks}/>}

      <button onClick={() => setShowTweaks(s => !s)} style={{
        position:'fixed',right:16,bottom:16,zIndex:40,
        background:'var(--bg-2)',border:'1px solid var(--border)',
        borderRadius:8,padding:'8px 12px',fontSize:11,color:'var(--fg-3)',
        fontFamily:'var(--font-mono)',display:'flex',alignItems:'center',gap:6,
        cursor:'pointer',
      }}>
        <Icon name="sparkles" size={12}/>
        {showTweaks ? 'Hide Tweaks' : 'Toggle Tweaks'}
      </button>
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
      </Routes>
    </BrowserRouter>
  )
}
