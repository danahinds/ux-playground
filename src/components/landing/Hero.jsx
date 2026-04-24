import { useNavigate } from 'react-router-dom'
import { Button } from '../shared'

const FLOW = [
  { n:'01', t:'Upload',          d:'Drop in an HTML ZIP of your prototype.',         mini:'prototype.zip', dashed:true },
  { n:'02', t:'Share',            d:'A password-protected link, ready to send.',       mini:'/t?p=9k3x',     accent:true },
  { n:'03', t:'Testers run it',   d:'Full-frame prototype with guided or free tasks.', mini:'▶ session' },
  { n:'04', t:'Results emailed',  d:'A digest by email. Link expires in 5 days.',      mini:'✉ digest' },
]

export const Hero = ({ onJump }) => {
  const navigate = useNavigate()
  return (
    <section style={{
      maxWidth:1180, margin:'0 auto', padding:'96px 28px',
      display:'grid', gridTemplateColumns:'1.1fr 1fr', gap:56, alignItems:'center',
    }}>
      <div>
        <div style={{
          display:'inline-flex',alignItems:'center',gap:8,
          fontFamily:'var(--font-mono)',fontSize:12,color:'var(--fg-3)',
          marginBottom:24,textTransform:'uppercase',letterSpacing:'0.08em',
        }}>
          <span style={{
            width:7,height:7,borderRadius:'50%',background:'var(--accent)',
            boxShadow:'0 0 12px color-mix(in oklch, var(--accent) 60%, transparent)',
            animation:'playground-pulse 2.2s ease-in-out infinite',
          }}/>
          <span>A private usability testing tool</span>
        </div>
        <h1 style={{
          fontSize:'clamp(42px, 5.5vw, 64px)', fontWeight:600,
          letterSpacing:'-0.035em', lineHeight:1.03, marginBottom:24,
        }}>
          Keep UI testing<br/>
          <span className="serif" style={{fontStyle:'italic',fontWeight:400,color:'var(--fg-2)'}}>simple.</span>
        </h1>
        <p style={{
          fontSize:18, color:'var(--fg-2)', maxWidth:520, lineHeight:1.55, marginBottom:32,
        }}>
          Upload an <strong style={{color:'var(--fg)',fontWeight:500}}>HTML prototype</strong>,
          {' '}share a password-protected link, get session results{' '}
          <strong style={{color:'var(--fg)',fontWeight:500}}>emailed to you</strong>.
          {' '}Links auto-expire in five days. No accounts, no dashboards, no residue.
        </p>
        <div style={{display:'flex',gap:12,flexWrap:'wrap'}}>
          <Button onClick={() => navigate('/upload')}>Start a test →</Button>
          <Button variant="outline" onClick={() => onJump('how')}>See how it works</Button>
        </div>
      </div>

      <div style={{display:'grid',gap:10}}>
        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:6}}>
          <span className="mono" style={{fontSize:11,color:'var(--fg-3)',textTransform:'uppercase',letterSpacing:'0.1em'}}>
            The flow
          </span>
          <span style={{flex:1,height:1,background:'var(--border)'}}/>
        </div>
        {FLOW.map(s => (
          <div key={s.n} style={{
            background:'var(--bg-2)', border:'1px solid var(--border)',
            borderRadius:10, padding:'16px 18px',
            display:'flex', gap:16, alignItems:'center',
          }}>
            <span className="mono" style={{
              fontSize:11, color:'var(--accent)',
              width:30, height:30, borderRadius:'50%',
              border:'1px solid color-mix(in oklch, var(--accent) 40%, transparent)',
              background:'color-mix(in oklch, var(--accent) 8%, transparent)',
              display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,
            }}>{s.n}</span>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:3}}>{s.t}</div>
              <div style={{fontSize:13,color:'var(--fg-2)'}}>{s.d}</div>
            </div>
            <div className="mono" style={{
              width:96, flexShrink:0,
              padding:'8px 10px',
              background:'var(--bg-3)',
              border: `1px ${s.dashed?'dashed':'solid'} ${s.accent?'color-mix(in oklch, var(--accent) 30%, transparent)':'var(--border)'}`,
              borderRadius:6, fontSize:10.5,
              color: s.accent ? 'var(--accent)' : 'var(--fg-3)',
              display:'flex',alignItems:'center',justifyContent:'center',minHeight:36,
            }}>{s.mini}</div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes playground-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </section>
  )
}
