import { useNavigate } from 'react-router-dom'
import { Button } from '../shared'

export const Hero = ({ onJump }) => {
  const navigate = useNavigate()
  return (
    <section style={{
      maxWidth:1180, margin:'0 auto', padding:'96px 28px',
    }}>
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
        fontSize:18, color:'var(--fg-2)', maxWidth:560, lineHeight:1.55, marginBottom:32,
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

      <style>{`
        @keyframes playground-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.45; }
        }
      `}</style>
    </section>
  )
}
