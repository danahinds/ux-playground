import { useNavigate } from 'react-router-dom'
import { Wordmark, Button } from '../shared'

export const TopBar = ({ onJump }) => {
  const navigate = useNavigate()
  return (
    <header style={{
      position:'sticky', top:0, zIndex:50,
      background:'color-mix(in oklch, var(--bg) 80%, transparent)',
      backdropFilter:'blur(12px) saturate(140%)',
      borderBottom:'1px solid var(--border)',
    }}>
      <div style={{
        maxWidth:1200, margin:'0 auto', padding:'12px 32px',
        display:'flex', alignItems:'center', gap:24
      }}>
        <button onClick={() => navigate('/')} style={{display:'flex',alignItems:'center'}}>
          <Wordmark size={18}/>
        </button>
        <nav style={{display:'flex',gap:22,marginLeft:24}}>
          {[
            ['How it works','how'],['Try it','demo'],['PM view','dashboard'],['Notes','faq']
          ].map(([l,id])=>(
            <button key={id} onClick={()=>onJump(id)} style={{fontSize:13,color:'var(--fg-2)'}}>{l}</button>
          ))}
        </nav>
        <span style={{flex:1}}/>
        <Button size="sm" variant="ghost" icon="grid" onClick={() => navigate('/prototypes')}>
          My tests
        </Button>
        <Button size="sm" icon="zap" onClick={() => navigate('/upload')}>
          New test
        </Button>
      </div>
    </header>
  )
}
