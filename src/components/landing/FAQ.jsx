import { useState } from 'react'
import { Tag, Icon } from '../shared'

export const FAQ = () => {
  const [open, setOpen] = useState(0)
  const items = [
    ['Only HTML prototypes, for now.',
     "Figma's mirror protocol doesn't cooperate with iframes, and we don't want to own that integration. Export Figma to HTML or use code prototypes. Native-app tests are out of scope \u2014 use Lookback for those."],
    ['No auth on MVP links \u2014 share carefully.',
     "Anyone with the URL can participate. Testers come from our existing recruitment channels, so this is fine for now. Phase 2 adds password gating if link-leak becomes a problem. Don't post test URLs in public Slack channels."],
    ['Mobile: wrapper works, your prototype might not.',
     "Intake and thank-you screens go down to 375px. The prototype itself is your design \u2014 if it's desktop-only, set a viewport-lock message. Phase 2 adds this per-prototype."],
    ['Iframe compatibility \u2014 one edge case to watch.',
     "Prototypes that use top.location or ship X-Frame-Options: DENY won't render inside the wrapper iframe. For those, use direct-link mode (session-ID goes via query param) and you still get the linkage."],
    ['PII policy: don\'t collect it, and redact if it sneaks in.',
     'Intake is age range, tech comfort, familiarity. No names, emails, or IPs. If your prototype has dummy form fields and a tester fills them with real data, redact in Clarity before sharing the recording.'],
    ['Retention & ownership.',
     'Clarity keeps recordings 30 days by default. Netlify Forms keeps submissions indefinitely. Both accounts are owned by UX Testground \u2014 ping the platform team before changing anything on either.'],
  ]
  return (
    <section data-screen-label="faq" style={{maxWidth:900,margin:'0 auto',padding:'72px 32px',borderTop:'1px solid var(--border)'}}>
      <div style={{display:'flex',alignItems:'baseline',gap:16,marginBottom:32}}>
        <Tag>OPERATIONAL NOTES</Tag>
        <h2 style={{fontSize:36,fontWeight:600,letterSpacing:'-0.03em'}}>Things to know before you run a test.</h2>
      </div>
      <div>
        {items.map(([q,a],i)=>(
          <div key={i} style={{borderTop:'1px solid var(--border)',...(i===items.length-1 && {borderBottom:'1px solid var(--border)'})}}>
            <button onClick={()=>setOpen(open===i?-1:i)} style={{
              width:'100%',textAlign:'left',padding:'18px 0',
              display:'flex',alignItems:'center',gap:16,
            }}>
              <span className="mono" style={{fontSize:11,color:'var(--fg-3)'}}>N{String(i+1).padStart(2,'0')}</span>
              <span style={{flex:1,fontSize:16,fontWeight:500}}>{q}</span>
              <span style={{
                display:'inline-flex',transition:'transform .2s',
                transform: open===i?'rotate(45deg)':'rotate(0)'
              }}><Icon name="plus" size={16}/></span>
            </button>
            {open===i && (
              <div style={{paddingBottom:20,paddingLeft:42,color:'var(--fg-2)',fontSize:14,lineHeight:1.6,maxWidth:700}}>
                {a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
