import { useState } from 'react'

export const Icon = ({ name, size = 16, stroke = 1.5, style }) => {
  const paths = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    arrowDown: <path d="M12 5v14M6 13l6 6 6-6" />,
    check: <path d="M20 6 9 17l-5-5" />,
    x: <path d="M18 6 6 18M6 6l12 12" />,
    play: <path d="M8 5v14l11-7z" />,
    pause: <><path d="M6 4h4v16H6z" /><path d="M14 4h4v16h-4z" /></>,
    dot: <circle cx="12" cy="12" r="4" />,
    plus: <path d="M12 5v14M5 12h14" />,
    minus: <path d="M5 12h14" />,
    link: <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
    search: <><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51h0a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
    zap: <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z" />,
    cursor: <><path d="m13 13 6 6" /><path d="M4 4v12l4-3h6L4 4z" /></>,
    eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    download: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" /></>,
    copy: <><rect x="9" y="9" width="13" height="13" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></>,
    filter: <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />,
    grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></>,
    terminal: <><path d="m4 17 6-6-6-6" /><path d="M12 19h8" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m19 9-5 5-4-4-3 3" /></>,
    lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    chevronRight: <path d="m9 18 6-6-6-6" />,
    chevronDown: <path d="m6 9 6 6 6-6" />,
    clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
    flame: <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />,
    sparkles: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></>,
    logo: <><path d="M3 12 12 3l9 9-9 9z" /><path d="M12 7v10M7 12h10" /></>,
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round"
      style={{display:'inline-block',verticalAlign:'-2px',flexShrink:0, ...(style || {})}}>
      {paths[name]}
    </svg>
  )
}

export const Wordmark = ({ size = 22 }) => (
  <span style={{display:'inline-flex',alignItems:'center',gap:8,fontWeight:600,letterSpacing:'-0.01em',fontSize:size}}>
    <span style={{
      width: size*0.95, height: size*0.95,
      background:'var(--accent)', color:'var(--accent-fg)',
      display:'inline-flex', alignItems:'center', justifyContent:'center',
      fontFamily:'var(--font-mono)', fontWeight:700, fontSize: size*0.55,
      borderRadius: 4, position:'relative',
    }}>
      <span style={{position:'absolute',inset:2,border:'1.5px dashed currentColor',borderRadius:2,opacity:.35}}/>
      P
    </span>
    <span>Playground</span>
    <span className="mono" style={{fontSize:size*0.48,color:'var(--fg-3)',fontWeight:500,marginLeft:4,letterSpacing:0}}>
      /uxtg
    </span>
  </span>
)

export const Button = ({ children, variant = 'primary', size = 'md', icon, trailing, onClick, style: styleProp, ...rest }) => {
  const sizes = {
    sm: { padding: '6px 12px', fontSize: 13, borderRadius: 6, gap: 6 },
    md: { padding: '9px 16px', fontSize: 14, borderRadius: 8, gap: 8 },
    lg: { padding: '13px 22px', fontSize: 15, borderRadius: 10, gap: 10 },
  }
  const variants = {
    primary: { background: 'var(--accent)', color: 'var(--accent-fg)', fontWeight: 600 },
    secondary: { background: 'var(--bg-3)', color: 'var(--fg)', border: '1px solid var(--border-2)' },
    ghost: { background: 'transparent', color: 'var(--fg-2)' },
    outline: { background: 'transparent', color: 'var(--fg)', border: '1px solid var(--border-2)' },
  }
  return (
    <button onClick={onClick} {...rest} style={{
      display:'inline-flex',alignItems:'center',justifyContent:'center',
      transition:'all .15s ease', whiteSpace:'nowrap',
      ...sizes[size], ...variants[variant], ...(styleProp || {})
    }}>
      {icon && <Icon name={icon} size={sizes[size].fontSize} />}
      {children}
      {trailing && <Icon name={trailing} size={sizes[size].fontSize} />}
    </button>
  )
}

export const Tag = ({ children, accent, size = 'md' }) => {
  const sizes = { sm: { padding: '2px 7px', fontSize: 10.5 }, md: { padding: '3px 9px', fontSize: 11.5 } }
  return (
    <span className="mono" style={{
      display:'inline-flex',alignItems:'center',gap:5,
      background: accent ? 'color-mix(in oklch, var(--accent) 14%, transparent)' : 'var(--bg-3)',
      color: accent ? 'var(--accent)' : 'var(--fg-2)',
      border: '1px solid ' + (accent ? 'color-mix(in oklch, var(--accent) 30%, transparent)' : 'var(--border)'),
      borderRadius: 4, textTransform:'uppercase', letterSpacing:'0.06em', fontWeight:500,
      ...sizes[size]
    }}>
      {children}
    </span>
  )
}

export const Card = ({ children, style, ...rest }) => (
  <div {...rest} style={{
    background: 'var(--bg-2)',
    border: '1px solid var(--border)',
    borderRadius: 10,
    ...(style||{})
  }}>{children}</div>
)

export const HeatDot = ({ x, y, intensity, rage }) => (
  <div style={{
    position:'absolute', left: `${x*100}%`, top: `${y*100}%`,
    width: 20+intensity*30, height: 20+intensity*30,
    transform:'translate(-50%,-50%)',
    borderRadius:'50%',
    background: rage
      ? 'radial-gradient(circle, #ff4d4daa, #ff4d4d00 70%)'
      : 'radial-gradient(circle, color-mix(in oklch, var(--accent) 70%, transparent), transparent 70%)',
    pointerEvents:'none',
    mixBlendMode:'screen',
  }}/>
)

export const SparkBar = ({ data, max, color = 'var(--accent)', height = 28 }) => (
  <div style={{display:'flex',alignItems:'flex-end',gap:2,height}}>
    {data.map((v,i)=>(
      <div key={i} style={{
        flex:1, height: `${(v/max)*100}%`, minHeight: 2,
        background: color, opacity: 0.4 + (v/max)*0.6, borderRadius: 1
      }}/>
    ))}
  </div>
)
