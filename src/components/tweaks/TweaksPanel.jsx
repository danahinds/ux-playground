export const TweaksPanel = ({ state, onChange }) => {
  const palettes = [
    { id:'graphite', name:'Graphite',  swatch:['#0a0a0a','#00d26a'] },
    { id:'electric', name:'Electric',  swatch:['#07070c','#7c5cff'] },
    { id:'solar',    name:'Solar',     swatch:['#0d0a06','#ffb020'] },
    { id:'cyan',     name:'Cyan',      swatch:['#030a0d','#00e0ff'] },
  ]
  return (
    <div style={{
      position:'fixed', right:20, bottom:20, zIndex:100,
      background:'var(--bg-2)', border:'1px solid var(--border-2)',
      borderRadius:10, padding:14, width:280,
      boxShadow:'0 20px 60px -20px rgba(0,0,0,.6)',
      backdropFilter:'blur(8px)',
    }}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <span className="mono" style={{fontSize:11,color:'var(--fg-3)',textTransform:'uppercase',letterSpacing:'.1em'}}>Tweaks</span>
        <span className="mono" style={{fontSize:10,color:'var(--fg-3)'}}>v0.4</span>
      </div>

      <div style={{marginBottom:14}}>
        <div className="mono" style={{fontSize:10.5,color:'var(--fg-3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8}}>Aesthetic</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
          {[['dark','Dark / mono'],['paper','Paper / grid']].map(([id,l])=>(
            <button key={id} onClick={()=>onChange({aesthetic:id})} style={{
              padding:'8px 10px',fontSize:12,borderRadius:6,
              background: state.aesthetic===id?'var(--accent)':'var(--bg-3)',
              color: state.aesthetic===id?'var(--accent-fg)':'var(--fg-2)',
              border: '1px solid ' + (state.aesthetic===id?'var(--accent)':'var(--border-2)'),
              fontWeight: state.aesthetic===id?600:400,
            }}>{l}</button>
          ))}
        </div>
      </div>

      <div style={{marginBottom:14}}>
        <div className="mono" style={{fontSize:10.5,color:'var(--fg-3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8}}>Palette</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6}}>
          {palettes.map(p=>(
            <button key={p.id} onClick={()=>onChange({palette:p.id})} style={{
              padding:'8px 10px',fontSize:12,borderRadius:6,
              background: state.palette===p.id?'var(--bg-3)':'transparent',
              border:'1px solid ' + (state.palette===p.id?'var(--accent)':'var(--border-2)'),
              color:'var(--fg)',
              display:'flex',alignItems:'center',gap:8,justifyContent:'flex-start'
            }}>
              <span style={{display:'flex'}}>
                <span style={{width:10,height:10,borderRadius:'50%',background:p.swatch[0],border:'1px solid var(--border-2)'}}/>
                <span style={{width:10,height:10,borderRadius:'50%',background:p.swatch[1],marginLeft:-3,border:'1px solid var(--border-2)'}}/>
              </span>
              {p.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mono" style={{fontSize:10.5,color:'var(--fg-3)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:8}}>Hero variant</div>
        <div style={{display:'flex',gap:6}}>
          {['Trails','Terminal','Spec'].map((l,i)=>(
            <button key={i} onClick={()=>onChange({heroVariant:i})} style={{
              flex:1,padding:'8px 6px',fontSize:12,borderRadius:6,
              background: state.heroVariant===i?'var(--accent)':'var(--bg-3)',
              color: state.heroVariant===i?'var(--accent-fg)':'var(--fg-2)',
              border:'1px solid ' + (state.heroVariant===i?'var(--accent)':'var(--border-2)'),
              fontWeight: state.heroVariant===i?600:400,
            }}>{l}</button>
          ))}
        </div>
      </div>
    </div>
  )
}
