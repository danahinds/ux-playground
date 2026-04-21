import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, Button, Tag, Wordmark } from '../shared'

function formatDate(iso) {
  if (!iso) return 'Legacy'
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  } catch {
    return 'Legacy'
  }
}

export default function PrototypeIndex() {
  const navigate = useNavigate()
  const [state, setState] = useState({ loading: true, prototypes: [], error: null })
  const [copiedSlug, setCopiedSlug] = useState(null)
  const [pendingSlug, setPendingSlug] = useState(null)
  const [showArchived, setShowArchived] = useState(false)

  const fetchList = async () => {
    setState(s => ({ ...s, loading: true, error: null }))
    try {
      const res = await fetch('/.netlify/functions/list-prototypes')
      const data = await res.json()
      if (!res.ok) {
        setState({ loading: false, prototypes: [], error: data.error || 'Failed to load.' })
        return
      }
      setState({ loading: false, prototypes: data.prototypes || [], error: null })
    } catch {
      setState({ loading: false, prototypes: [], error: 'Network error.' })
    }
  }

  useEffect(() => { fetchList() }, [])

  const copyLink = (slug) => {
    const url = `${window.location.origin}/t?proto=${slug}`
    navigator.clipboard.writeText(url)
    setCopiedSlug(slug)
    setTimeout(() => setCopiedSlug(null), 1600)
  }

  const openPreview = (slug) => {
    window.open(`/t?proto=${slug}`, '_blank')
  }

  const toggleArchive = async (slug, archived) => {
    setPendingSlug(slug)
    // Optimistic update
    setState(s => ({
      ...s,
      prototypes: s.prototypes.map(p => p.slug === slug ? { ...p, archived } : p),
    }))
    try {
      const res = await fetch('/.netlify/functions/archive-prototype', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, archived }),
      })
      if (!res.ok) {
        // Revert
        setState(s => ({
          ...s,
          prototypes: s.prototypes.map(p => p.slug === slug ? { ...p, archived: !archived } : p),
        }))
      }
    } catch {
      setState(s => ({
        ...s,
        prototypes: s.prototypes.map(p => p.slug === slug ? { ...p, archived: !archived } : p),
      }))
    } finally {
      setPendingSlug(null)
    }
  }

  const active = state.prototypes.filter(p => !p.archived)
  const archived = state.prototypes.filter(p => p.archived)

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      color: 'var(--fg)', fontFamily: 'var(--font-sans)',
    }}>
      <header style={{
        borderBottom: '1px solid var(--border)',
        padding: '12px 32px',
        display: 'flex', alignItems: 'center', gap: 16,
        background: 'color-mix(in oklch, var(--bg) 80%, transparent)',
        backdropFilter: 'blur(12px)',
      }}>
        <button onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center' }}>
          <Wordmark size={18} />
        </button>
        <span style={{ color: 'var(--fg-3)' }}>/</span>
        <span className="mono" style={{ fontSize: 13, color: 'var(--fg-2)' }}>prototypes</span>
      </header>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '48px 32px' }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          gap: 16, marginBottom: 28, flexWrap: 'wrap',
        }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em', marginBottom: 6 }}>
              Prototypes
            </h1>
            <p style={{ color: 'var(--fg-2)', fontSize: 14 }}>
              Every test you've uploaded, with response counts and archive controls.
            </p>
          </div>
          <Button icon="plus" onClick={() => navigate('/upload')}>New test</Button>
        </div>

        {state.loading && (
          <div style={{ padding: '40px 0', color: 'var(--fg-3)', fontSize: 14, textAlign: 'center' }}>
            Loading prototypes…
          </div>
        )}

        {state.error && (
          <div style={{
            padding: 20, background: 'var(--bg-2)', border: '1px solid var(--border)',
            borderRadius: 8, color: 'var(--fg-2)', fontSize: 14,
          }}>
            <div style={{ color: '#b91c1c', fontWeight: 500, marginBottom: 6 }}>
              Couldn't load prototypes
            </div>
            <div style={{ marginBottom: 12 }}>{state.error}</div>
            <Button variant="outline" onClick={fetchList}>Retry</Button>
          </div>
        )}

        {!state.loading && !state.error && active.length === 0 && archived.length === 0 && (
          <div style={{
            padding: '60px 30px', textAlign: 'center',
            background: 'var(--bg-2)', border: '1px solid var(--border)', borderRadius: 10,
          }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>No prototypes yet.</h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 14, marginBottom: 18 }}>
              Upload your first test to see it here.
            </p>
            <Button icon="plus" onClick={() => navigate('/upload')}>New test</Button>
          </div>
        )}

        {active.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <SectionHeader label="Active" count={active.length} />
            <div style={{ display: 'grid', gap: 10 }}>
              {active.map(p => (
                <PrototypeRow
                  key={p.slug}
                  proto={p}
                  navigate={navigate}
                  pending={pendingSlug === p.slug}
                  copied={copiedSlug === p.slug}
                  onCopy={() => copyLink(p.slug)}
                  onPreview={() => openPreview(p.slug)}
                  onToggleArchive={() => toggleArchive(p.slug, true)}
                />
              ))}
            </div>
          </div>
        )}

        {archived.length > 0 && (
          <div>
            <button
              onClick={() => setShowArchived(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'transparent', border: 'none', padding: 0,
                color: 'var(--fg-2)', cursor: 'pointer', marginBottom: 12,
              }}
            >
              <Icon name={showArchived ? 'chevronDown' : 'chevronRight'} size={14} />
              <span className="mono" style={{
                fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em',
              }}>
                Archived · {archived.length}
              </span>
            </button>
            {showArchived && (
              <div style={{ display: 'grid', gap: 10 }}>
                {archived.map(p => (
                  <PrototypeRow
                    key={p.slug}
                    proto={p}
                    navigate={navigate}
                    pending={pendingSlug === p.slug}
                    copied={copiedSlug === p.slug}
                    onCopy={() => copyLink(p.slug)}
                    onPreview={() => openPreview(p.slug)}
                    onToggleArchive={() => toggleArchive(p.slug, false)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

function SectionHeader({ label, count }) {
  return (
    <div className="mono" style={{
      fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase',
      letterSpacing: '.08em', marginBottom: 12,
    }}>
      {label} · {count}
    </div>
  )
}

function PrototypeRow({ proto, navigate, pending, copied, onCopy, onPreview, onToggleArchive }) {
  const p = proto
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      padding: '14px 18px',
      background: 'var(--bg-2)', border: '1px solid var(--border)',
      borderRadius: 10,
      opacity: p.archived ? 0.75 : 1,
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate(`/results?proto=${p.slug}`)}
            style={{
              fontSize: 16, fontWeight: 500, color: 'var(--fg)',
              background: 'transparent', border: 'none', padding: 0,
              cursor: 'pointer', textDecoration: 'none',
            }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'var(--fg)'}
          >
            {p.testName}
          </button>
          <Tag>{p.mode === 'guided' ? 'GUIDED' : 'EXPLORATION'}</Tag>
          {p.legacy && <Tag>LEGACY</Tag>}
        </div>
        <div className="mono" style={{
          fontSize: 11, color: 'var(--fg-3)',
          display: 'flex', gap: 12, flexWrap: 'wrap',
        }}>
          <span>/t?proto={p.slug}</span>
          <span>·</span>
          <span>{formatDate(p.createdAt)}</span>
          <span>·</span>
          <span>{p.responseCount} response{p.responseCount === 1 ? '' : 's'}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <IconButton label={copied ? 'Copied' : 'Copy'} icon="copy" onClick={onCopy} />
        <IconButton label="Preview" icon="eye" onClick={onPreview} />
        <IconButton
          label={p.archived ? 'Unarchive' : 'Archive'}
          icon={p.archived ? 'play' : 'pause'}
          onClick={onToggleArchive}
          disabled={pending || p.legacy}
          title={p.legacy ? 'Legacy prototypes (no meta.json) cannot be archived.' : undefined}
        />
      </div>
    </div>
  )
}

function IconButton({ icon, label, onClick, disabled, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        padding: '6px 10px', fontSize: 12, fontWeight: 500,
        background: 'var(--bg-3)', border: '1px solid var(--border)',
        borderRadius: 6, color: 'var(--fg-2)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        fontFamily: 'inherit',
      }}
    >
      <Icon name={icon} size={12} />
      {label}
    </button>
  )
}
