import { Tag } from '../shared'

export const HowItWorks = () => {
  const steps = [
    { n:'01', k:'DEPLOY', t:'Drop the folder onto Netlify', d:'One folder with your HTML prototype. No build step. Live URL in under a minute.', code:'$ netlify deploy --prod' },
    { n:'02', k:'SHARE', t:'Send testers the intake link', d:'One wrapper serves every prototype via ?proto=. Each tester gets a unique session ID.', code:'playground.uxtg.dev/t\n  ?proto=checkout-v3' },
    { n:'03', k:'OBSERVE', t:'Demographics + behavior, linked', d:'Clarity captures mouse, clicks, rage/dead clicks. Netlify Forms stores the intake. Linked by session ID.', code:'clarity("set", "age", "25-34")\nclarity("set", "role", "designer")' },
    { n:'04', k:'SEGMENT', t:'Filter recordings by tag', d:'"Show me all testers 45+ who rage-clicked" \u2014 one filter, no dashboard to build.', code:'filter: age=45+ AND event=rage' },
  ]
  return (
    <section data-screen-label="how" style={{maxWidth:1200,margin:'0 auto',padding:'72px 32px',borderTop:'1px solid var(--border)'}}>
      <div style={{display:'flex',alignItems:'baseline',gap:16,marginBottom:48}}>
        <Tag>HOW IT WORKS</Tag>
        <h2 style={{fontSize:36,fontWeight:600,letterSpacing:'-0.03em'}}>Four things happen.<span style={{color:'var(--fg-3)'}}>{" That's the whole tool."}</span></h2>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:0,border:'1px solid var(--border)',borderRadius:12,overflow:'hidden'}}>
        {steps.map((s,i)=>(
          <div key={s.n} style={{
            padding:'26px 24px',
            borderRight: i<3?'1px solid var(--border)':'none',
            background: 'var(--bg-2)'
          }}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
              <span className="mono" style={{fontSize:11,color:'var(--accent)'}}>{s.n}</span>
              <span className="mono" style={{fontSize:10.5,color:'var(--fg-3)',textTransform:'uppercase',letterSpacing:'.1em'}}>{s.k}</span>
            </div>
            <h3 style={{fontSize:18,fontWeight:600,letterSpacing:'-0.015em',marginBottom:8,minHeight:50}}>{s.t}</h3>
            <p style={{fontSize:13,color:'var(--fg-2)',lineHeight:1.55,marginBottom:16,minHeight:80}}>{s.d}</p>
            <pre className="mono" style={{
              fontSize:10.5,color:'var(--fg-2)',
              background:'var(--bg-3)',padding:'10px 12px',borderRadius:6,
              border:'1px solid var(--border)',
              whiteSpace:'pre-wrap',margin:0,overflow:'auto'
            }}>{s.code}</pre>
          </div>
        ))}
      </div>
    </section>
  )
}
