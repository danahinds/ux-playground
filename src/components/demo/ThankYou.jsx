import { Icon, Button } from '../shared'

export const ThankYou = ({ onRestart, events }) => (
  <div style={{padding:'48px 32px',textAlign:'center',maxWidth:480,margin:'0 auto'}}>
    <div style={{
      width:48,height:48,borderRadius:'50%',background:'var(--accent)',color:'var(--accent-fg)',
      display:'inline-flex',alignItems:'center',justifyContent:'center',marginBottom:18
    }}><Icon name="check" size={22} stroke={2.5}/></div>
    <h2 style={{fontSize:24,fontWeight:600,letterSpacing:'-0.02em'}}>Session recorded.</h2>
    <p style={{color:'var(--fg-2)',margin:'8px 0 24px'}}>
      Thanks. Your {events} events were sent to the PM. You can close this tab.
    </p>
    <Button variant="outline" onClick={onRestart}>
      Restart the demo
    </Button>
  </div>
)
