import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon, Button, Tag, Card, Wordmark } from '../shared'

function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      // readAsDataURL returns "data:text/html;base64,<content>"
      const base64 = reader.result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function UploadPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState('idle') // idle | uploading | success | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const slug = toSlug(name)
  const valid = slug.length >= 2 && file

  const handleFile = (f) => {
    if (!f) return
    if (!f.name.endsWith('.html') && !f.name.endsWith('.htm')) {
      setError('Please select an HTML file.')
      return
    }
    if (f.size > 512 * 1024) {
      setError('File is too large. Maximum size is 512KB.')
      return
    }
    setError('')
    setFile(f)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    handleFile(f)
  }

  const handleSubmit = async () => {
    if (!valid || status === 'uploading') return
    setStatus('uploading')
    setError('')

    try {
      const html = await fileToBase64(file)

      const res = await fetch('/.netlify/functions/upload-prototype', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, html }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Upload failed. Please try again.')
        setStatus('error')
        return
      }

      setResult(data)
      setStatus('success')
    } catch (e) {
      setError('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  const fullUrl = `${window.location.origin}/t?proto=${slug}`

  const copyLink = () => {
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      color: 'var(--fg)', fontFamily: 'var(--font-sans)',
    }}>
      {/* Header */}
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
        <span className="mono" style={{ fontSize: 13, color: 'var(--fg-2)' }}>upload</span>
      </header>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '48px 24px' }}>
        <Tag accent>NEW TEST</Tag>
        <h1 style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em', marginTop: 14, marginBottom: 8 }}>
          Upload a prototype
        </h1>
        <p style={{ color: 'var(--fg-2)', fontSize: 15, marginBottom: 36, lineHeight: 1.55 }}>
          Drop your HTML file here, name the test, and get a shareable link.
          It goes live in about 1-2 minutes after upload.
        </p>

        {status === 'success' ? (
          /* Success state */
          <Card style={{ padding: 32, textAlign: 'center' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: 'var(--accent)', color: 'var(--accent-fg)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <Icon name="check" size={24} stroke={2.5} />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
              Prototype uploaded
            </h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 14, marginBottom: 24 }}>
              Deploying now. Your link will be live in ~1-2 minutes.
            </p>

            {/* Shareable link */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'var(--bg-3)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 20,
            }}>
              <Icon name="link" size={14} style={{ color: 'var(--fg-3)', flexShrink: 0 }} />
              <span className="mono" style={{
                fontSize: 13, color: 'var(--accent)', flex: 1,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {fullUrl}
              </span>
              <button onClick={copyLink} style={{
                padding: '4px 10px', fontSize: 12, borderRadius: 4,
                background: 'var(--bg-2)', border: '1px solid var(--border-2)',
                color: 'var(--fg-2)', fontFamily: 'var(--font-mono)',
                flexShrink: 0,
              }}>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
              <Button variant="outline" onClick={() => {
                setStatus('idle')
                setFile(null)
                setName('')
                setResult(null)
              }}>
                Upload another
              </Button>
              <Button onClick={() => navigate('/')}>
                Back to home
              </Button>
            </div>
          </Card>
        ) : (
          /* Upload form */
          <div style={{ display: 'grid', gap: 24 }}>
            {/* Test name */}
            <div>
              <label className="mono" style={{
                fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase',
                letterSpacing: '.08em', marginBottom: 8, display: 'block',
              }}>
                Test name
              </label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="e.g. Checkout V3, Onboarding Flow…"
                style={{
                  width: '100%', padding: '12px 14px', fontSize: 15,
                  background: 'var(--bg-2)', border: '1px solid var(--border-2)',
                  borderRadius: 8, color: 'var(--fg)', outline: 'none',
                }}
              />
              {slug && (
                <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 6 }}>
                  Slug: <span style={{ color: 'var(--fg-2)' }}>{slug}</span>
                  {' · '}Link: <span style={{ color: 'var(--accent)' }}>/t?proto={slug}</span>
                </div>
              )}
            </div>

            {/* File drop zone */}
            <div>
              <label className="mono" style={{
                fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase',
                letterSpacing: '.08em', marginBottom: 8, display: 'block',
              }}>
                HTML prototype file
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragging(true) }}
                onDragEnter={() => setDragging(true)}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                style={{
                  border: `2px dashed ${dragging ? 'var(--accent)' : 'var(--border-2)'}`,
                  borderRadius: 10, padding: '36px 24px',
                  textAlign: 'center', cursor: 'pointer',
                  background: dragging ? 'color-mix(in oklch, var(--accent) 5%, var(--bg-2))' : 'var(--bg-2)',
                  transition: 'all .15s ease',
                }}
              >
                {file ? (
                  <div>
                    <Icon name="check" size={20} style={{ color: 'var(--accent)', marginBottom: 8 }} />
                    <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{file.name}</div>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--fg-3)' }}>
                      {(file.size / 1024).toFixed(1)} KB
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setFile(null) }}
                      style={{ marginTop: 10, fontSize: 12, color: 'var(--fg-3)', textDecoration: 'underline' }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <Icon name="download" size={24} style={{ color: 'var(--fg-3)', marginBottom: 10, transform: 'rotate(180deg)' }} />
                    <div style={{ fontSize: 15, color: 'var(--fg-2)', marginBottom: 4 }}>
                      Drag and drop your HTML file here
                    </div>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--fg-3)' }}>
                      or click to browse · max 512KB
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".html,.htm"
                style={{ display: 'none' }}
                onChange={e => handleFile(e.target.files[0])}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: '10px 14px', borderRadius: 8,
                background: 'color-mix(in oklch, var(--bad) 10%, var(--bg-2))',
                border: '1px solid color-mix(in oklch, var(--bad) 30%, transparent)',
                color: 'var(--bad)', fontSize: 13,
              }}>
                {error}
              </div>
            )}

            {/* Submit */}
            <Button
              size="lg"
              icon="zap"
              trailing="arrow"
              onClick={handleSubmit}
              style={{
                opacity: valid && status !== 'uploading' ? 1 : 0.5,
                pointerEvents: valid && status !== 'uploading' ? 'auto' : 'none',
                width: '100%', justifyContent: 'center',
              }}
            >
              {status === 'uploading' ? 'Uploading…' : 'Upload prototype'}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
