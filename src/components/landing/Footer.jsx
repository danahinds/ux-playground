export const Footer = () => (
  <footer style={{borderTop:'1px solid var(--border)',marginTop:40}}>
    <div style={{
      maxWidth:1180, margin:'0 auto', padding:'32px 28px',
      display:'flex', alignItems:'center', gap:24, flexWrap:'wrap',
      color:'var(--fg-3)', fontSize:13,
    }}>
      <span>© 2026 Playground · Dana Sandy</span>
      <span style={{flex:1}}/>
      <div style={{display:'flex',gap:20}}>
        <a href="mailto:danahinds@gmail.com" style={{color:'var(--fg-2)'}}>Email</a>
      </div>
    </div>
  </footer>
)
