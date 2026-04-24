import { useNavigate } from 'react-router-dom'
import { Wordmark, Button } from '../shared'

export const TopBar = ({ onJump }) => {
  const navigate = useNavigate()
  const items = [
    ['How it works', 'how'],
    ['Contact', 'contact'],
  ]
  return (
    <header style={{
      position:'sticky', top:0, zIndex:50,
      background:'color-mix(in oklch, var(--bg) 82%, transparent)',
      backdropFilter:'blur(14px) saturate(140%)',
      borderBottom:'1px solid var(--border)',
    }}>
      <div style={{
        maxWidth:1180, margin:'0 auto', padding:'14px 28px',
        display:'flex', alignItems:'center', gap:20
      }}>
        <button onClick={() => navigate('/')} style={{display:'flex',alignItems:'center'}}>
          <Wordmark size={17}/>
        </button>
        <span style={{flex:1}}/>
        <nav style={{display:'flex',gap:22}} className="main-nav">
          {items.map(([l,id])=>(
            <button key={id} onClick={()=>onJump(id)} style={{fontSize:14,color:'var(--fg-2)'}}>{l}</button>
          ))}
          <button onClick={()=>navigate('/prototypes')} style={{fontSize:14,color:'var(--fg-2)'}}>My tests</button>
        </nav>
        <Button size="md" onClick={() => onJump('contact')}>Get in touch</Button>
      </div>
    </header>
  )
}
