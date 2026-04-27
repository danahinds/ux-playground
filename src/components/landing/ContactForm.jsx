import { useState } from 'react'

const REASONS = [
  ['use-tool',     'Interested in using this tool?',  "You'd like access for a project you're working on."],
  ['get-in-touch', 'Get in touch',          'Consulting, collaboration, or just to say hello.'],
]

const fieldLabel = {
  fontFamily: 'var(--font-mono)', fontSize: 11.5,
  textTransform: 'uppercase', letterSpacing: '0.08em',
  color: 'var(--fg-3)',
}

const inputStyle = {
  background: 'var(--bg-3)', border: '1px solid var(--border-2)',
  borderRadius: 8, padding: '11px 13px',
  fontSize: 15, color: 'var(--fg)', width: '100%',
}

export const ContactForm = () => {
  const [form, setForm] = useState({ name: '', email: '', reason: '', message: '' })
  const [sent, setSent] = useState(false)

  const onChange = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = (e) => {
    e.preventDefault()
    const body = new URLSearchParams()
    body.append('form-name', 'playground-contact')
    Object.entries(form).forEach(([k, v]) => body.append(k, v))
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
    }).finally(() => {
      setSent(true)
      setForm({ name: '', email: '', reason: '', message: '' })
    })
  }

  return (
    <form onSubmit={submit} style={{
      background:'var(--bg-2)', border:'1px solid var(--border)',
      borderRadius:14, padding:28,
      display:'grid', gap:18,
    }}>
      <input type="hidden" name="form-name" value="playground-contact"/>

      <div style={{display:'grid',gap:8}}>
        <label htmlFor="f-name" style={fieldLabel}>Your name</label>
        <input id="f-name" type="text" required autoComplete="name"
          value={form.name} onChange={onChange('name')} style={inputStyle}/>
      </div>

      <div style={{display:'grid',gap:8}}>
        <label htmlFor="f-email" style={fieldLabel}>Email</label>
        <input id="f-email" type="email" required autoComplete="email"
          value={form.email} onChange={onChange('email')} style={inputStyle}/>
      </div>

      <div style={{display:'grid',gap:8}}>
        <label style={fieldLabel}>What brings you here?</label>
        <div style={{display:'grid',gap:8}}>
          {REASONS.map(([val, title, desc]) => {
            const checked = form.reason === val
            return (
              <label key={val} style={{
                display:'flex', gap:12, alignItems:'flex-start',
                padding:'12px 14px',
                background: checked ? 'color-mix(in oklch, var(--accent) 5%, transparent)' : 'var(--bg-3)',
                border:`1px solid ${checked ? 'color-mix(in oklch, var(--accent) 50%, transparent)' : 'var(--border-2)'}`,
                borderRadius:8, cursor:'pointer',
              }}>
                <input type="radio" name="reason" value={val} required
                  checked={checked} onChange={onChange('reason')}
                  style={{
                    appearance:'none',
                    width:16, height:16, flexShrink:0,
                    border:`1.5px solid ${checked ? 'var(--accent)' : 'var(--border-2)'}`,
                    borderRadius:'50%', marginTop:3, position:'relative',
                    background: checked
                      ? 'radial-gradient(circle, var(--accent) 0 4px, transparent 5px)'
                      : 'transparent',
                  }}/>
                <div style={{flex:1}}>
                  <div style={{fontSize:14,fontWeight:500}}>{title}</div>
                  <div style={{fontSize:12.5,color:'var(--fg-3)',marginTop:2}}>{desc}</div>
                </div>
              </label>
            )
          })}
        </div>
      </div>

      <div style={{display:'grid',gap:8}}>
        <label htmlFor="f-msg" style={fieldLabel}>Message</label>
        <textarea id="f-msg" required
          value={form.message} onChange={onChange('message')}
          placeholder="What are you working on? What would you like to test?"
          style={{...inputStyle, minHeight:110, resize:'vertical', fontFamily:'inherit'}}/>
      </div>

      <button type="submit" style={{
        background:'var(--accent)', color:'var(--accent-fg)',
        padding:'13px 22px', borderRadius:10,
        fontWeight:600, fontSize:15, justifySelf:'start',
      }}>Send message →</button>

      {sent && (
        <div style={{
          background:'color-mix(in oklch, var(--accent) 10%, transparent)',
          border:'1px solid color-mix(in oklch, var(--accent) 30%, transparent)',
          color:'var(--accent)',
          padding:'14px 16px', borderRadius:8, fontSize:14,
        }}>
          Thanks — your message is on its way. I'll reply within a day or two.
        </div>
      )}
    </form>
  )
}
