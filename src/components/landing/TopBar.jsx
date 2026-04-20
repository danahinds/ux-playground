import { Wordmark, Button } from '../shared'

export const TopBar = ({ onJump }) => (
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
      <Wordmark size={18}/>
      <nav style={{display:'flex',gap:22,marginLeft:24}}>
        {[
          ['How it works','how'],['Try it','demo'],['PM view','dashboard'],['Notes','faq']
        ].map(([l,id])=>(
          <button key={id} onClick={()=>onJump(id)} style={{fontSize:13,color:'var(--fg-2)'}}>{l}</button>
        ))}
      </nav>
      <span style={{flex:1}}/>
      <span className="mono" style={{fontSize:11,color:'var(--fg-3)'}}>v0.4 · internal</span>
      <Button size="sm" variant="outline" icon="terminal">PRD</Button>
      <Button size="sm" icon="zap">New test</Button>
    </div>
  </header>
)
