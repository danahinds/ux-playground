import { Wordmark } from '../shared'

export const Footer = () => (
  <footer style={{borderTop:'1px solid var(--border)',padding:'48px 32px 32px',marginTop:32}}>
    <div style={{maxWidth:1200,margin:'0 auto'}}>
      <div style={{display:'grid',gridTemplateColumns:'1.5fr 1fr 1fr 1fr',gap:32,marginBottom:40}}>
        <div>
          <Wordmark size={18}/>
          <p style={{color:'var(--fg-2)',fontSize:13,marginTop:12,maxWidth:320,lineHeight:1.55}}>
            Internal tool from UX Testground. A thin layer over Clarity and Netlify
            so PMs can run prototype tests in hours, not weeks.
          </p>
        </div>
        {[
          ['Product',['Demo','Dashboard','How it works','Pricing (spoiler: free)']],
          ['Docs',['Quickstart','The wrapper API','Clarity tags','Migrating off Maze']],
          ['Team',['The PRD','Roadmap','Changelog','Slack']],
        ].map(([h,links])=>(
          <div key={h}>
            <div className="mono" style={{fontSize:10.5,color:'var(--fg-3)',textTransform:'uppercase',letterSpacing:'.1em',marginBottom:14}}>{h}</div>
            {links.map(l => <div key={l} style={{fontSize:13,color:'var(--fg-2)',padding:'4px 0'}}>{l}</div>)}
          </div>
        ))}
      </div>
      <div style={{borderTop:'1px solid var(--border)',paddingTop:18,display:'flex',justifyContent:'space-between',alignItems:'center',flexWrap:'wrap',gap:12}}>
        <span className="mono" style={{fontSize:11,color:'var(--fg-3)'}}>
          {'© 2026 UX Testground · built with Clarity + Netlify · no servers harmed'}
        </span>
        <span className="mono" style={{fontSize:11,color:'var(--fg-3)'}}>
          Draft v0.1 · last updated April 2026
        </span>
      </div>
    </div>
  </footer>
)
