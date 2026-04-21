import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import JSZip from 'jszip'
import { Icon, Button, Tag, Card, Wordmark } from '../shared'
import { ModeSelector } from './ModeSelector'

function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
}

function contentToBase64(text) {
  const bytes = new TextEncoder().encode(text)
  let binary = ''
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

async function extractHtmlFromZip(file) {
  const zip = await JSZip.loadAsync(file)
  const htmlFiles = []

  zip.forEach((path, entry) => {
    if (!entry.dir && /\.html?$/i.test(path)) {
      htmlFiles.push({ path, entry })
    }
  })

  return htmlFiles
}

export default function UploadPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [name, setName] = useState('')
  const [file, setFile] = useState(null)
  const [htmlContent, setHtmlContent] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState('idle') // idle | picking | uploading | deploying | live | timeout | error
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [zipHtmlFiles, setZipHtmlFiles] = useState([])
  const [selectedZipFile, setSelectedZipFile] = useState(null)
  const [deployAttempts, setDeployAttempts] = useState(0)
  const [mode, setMode] = useState('exploration')
  const [prompt, setPrompt] = useState('')
  const [tasks, setTasks] = useState([''])

  const MAX_DEPLOY_ATTEMPTS = 30
  const POLL_INTERVAL_MS = 5000

  const slug = toSlug(name)
  const testName = name.trim()
  const nonEmptyTasks = tasks.map(t => t.trim()).filter(Boolean)
  const modeValid = mode === 'exploration' || nonEmptyTasks.length > 0
  const valid = slug.length >= 2 && testName.length >= 2 && htmlContent && modeValid

  const handleModeChange = (patch) => {
    if ('mode' in patch) setMode(patch.mode)
    if ('prompt' in patch) setPrompt(patch.prompt)
    if ('tasks' in patch) setTasks(patch.tasks)
  }

  const isZip = (f) => f.name.endsWith('.zip')
  const isHtml = (f) => /\.html?$/i.test(f.name)

  const readHtmlFile = (f) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsText(f)
    })
  }

  const handleFile = async (f) => {
    if (!f) return
    setError('')
    setZipHtmlFiles([])
    setSelectedZipFile(null)
    setHtmlContent(null)

    if (isZip(f)) {
      if (f.size > 10 * 1024 * 1024) {
        setError('Zip file too large. Maximum size is 10MB.')
        return
      }
      setFile(f)
      try {
        const htmlFiles = await extractHtmlFromZip(f)
        if (htmlFiles.length === 0) {
          setError('No HTML files found in this zip.')
          setFile(null)
          return
        }
        if (htmlFiles.length === 1) {
          // Only one HTML file — use it directly
          const content = await htmlFiles[0].entry.async('string')
          setHtmlContent(content)
          setSelectedZipFile(htmlFiles[0].path)
          setStatus('idle')
        } else {
          // Multiple HTML files — let PM pick
          setZipHtmlFiles(htmlFiles)
          setStatus('picking')
        }
      } catch (e) {
        setError('Could not read zip file. Make sure it is a valid zip archive.')
        setFile(null)
      }
    } else if (isHtml(f)) {
      if (f.size > 512 * 1024) {
        setError('File too large. Maximum size is 512KB.')
        return
      }
      setFile(f)
      const content = await readHtmlFile(f)
      setHtmlContent(content)
      setStatus('idle')
    } else {
      setError('Please select an HTML or ZIP file.')
    }
  }

  const handlePickZipFile = async (htmlFile) => {
    try {
      const content = await htmlFile.entry.async('string')
      if (content.length > 512 * 1024) {
        setError(`"${htmlFile.path}" is too large (${(content.length / 1024).toFixed(0)}KB). Maximum is 512KB.`)
        return
      }
      setHtmlContent(content)
      setSelectedZipFile(htmlFile.path)
      setZipHtmlFiles([])
      setStatus('idle')
      setError('')
    } catch (e) {
      setError('Could not extract that file from the zip.')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const handleSubmit = async () => {
    if (!valid || status === 'uploading') return
    setStatus('uploading')
    setError('')

    try {
      const html = contentToBase64(htmlContent)

      const res = await fetch('/.netlify/functions/upload-prototype', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          testName,
          html,
          mode,
          prompt: mode === 'exploration' ? prompt.trim() : null,
          tasks: mode === 'guided' ? nonEmptyTasks : null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Upload failed. Please try again.')
        setStatus('error')
        return
      }

      setResult(data)
      setDeployAttempts(0)
      setStatus('deploying')
    } catch (e) {
      setError('Network error. Please check your connection and try again.')
      setStatus('error')
    }
  }

  // Poll the prototype URL until it responds 200 (Netlify deploy finished)
  useEffect(() => {
    if (status !== 'deploying') return
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/prototypes/${slug}/index.html`, {
          method: 'HEAD', cache: 'no-store',
        })
        if (res.ok) {
          setStatus('live')
          return
        }
      } catch {
        // Network hiccup — keep polling.
      }
      if (deployAttempts + 1 >= MAX_DEPLOY_ATTEMPTS) {
        setStatus('timeout')
      } else {
        setDeployAttempts(a => a + 1)
      }
    }, POLL_INTERVAL_MS)
    return () => clearTimeout(timer)
  }, [status, deployAttempts, slug])

  const retryDeploy = () => {
    setDeployAttempts(0)
    setStatus('deploying')
  }

  const fullUrl = `${window.location.origin}/t?proto=${slug}`

  const copyLink = () => {
    navigator.clipboard.writeText(fullUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetForm = () => {
    setStatus('idle')
    setFile(null)
    setHtmlContent(null)
    setName('')
    setResult(null)
    setZipHtmlFiles([])
    setSelectedZipFile(null)
    setError('')
    setDeployAttempts(0)
    setMode('exploration')
    setPrompt('')
    setTasks([''])
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
          Drop your HTML or ZIP file here, name the test, and get a shareable link.
          It goes live in about 1-2 minutes after upload.
        </p>

        {(status === 'deploying' || status === 'live' || status === 'timeout') ? (
          <Card style={{ padding: 32, textAlign: 'center' }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              background: status === 'live' ? 'var(--accent)' : 'var(--bg-3)',
              color: status === 'live' ? 'var(--accent-fg)' : 'var(--fg-2)',
              border: status === 'live' ? 'none' : '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <Icon
                name={status === 'live' ? 'check' : status === 'timeout' ? 'clock' : 'dot'}
                size={status === 'live' ? 24 : 20}
                stroke={2.5}
              />
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 8 }}>
              {status === 'live' && 'Live now'}
              {status === 'deploying' && 'Deploying…'}
              {status === 'timeout' && 'Still deploying'}
            </h2>
            <p style={{ color: 'var(--fg-2)', fontSize: 14, marginBottom: 24 }}>
              {status === 'live' && 'Your prototype is live and ready to share.'}
              {status === 'deploying' && 'Netlify is building. This usually takes ~1–2 minutes.'}
              {status === 'timeout' && "This is taking longer than expected. Try the preview — if it works, you're good. Otherwise give it another minute."}
            </p>

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

            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              {status === 'live' && (
                <Button icon="eye" onClick={() => window.open(`/t?proto=${slug}`, '_blank')}>
                  Preview
                </Button>
              )}
              {status === 'timeout' && (
                <Button variant="outline" onClick={retryDeploy}>Keep checking</Button>
              )}
              <Button variant="outline" onClick={resetForm}>Upload another</Button>
              <Button variant="ghost" onClick={() => navigate('/')}>Back to home</Button>
            </div>
          </Card>

        ) : status === 'picking' ? (
          /* Zip file picker */
          <Card style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <Icon name="grid" size={16} style={{ color: 'var(--fg-3)' }} />
              <span style={{ fontSize: 15, fontWeight: 500 }}>
                {zipHtmlFiles.length} HTML files found in <span className="mono" style={{ color: 'var(--fg-2)' }}>{file?.name}</span>
              </span>
            </div>
            <p style={{ color: 'var(--fg-2)', fontSize: 13, marginBottom: 16 }}>
              Pick the file testers should see:
            </p>
            <div style={{ display: 'grid', gap: 6 }}>
              {zipHtmlFiles.map((hf) => {
                const nameParts = hf.path.split('/')
                const fileName = nameParts[nameParts.length - 1]
                return (
                  <button
                    key={hf.path}
                    onClick={() => handlePickZipFile(hf)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 14px', borderRadius: 8, textAlign: 'left',
                      background: 'var(--bg-3)', border: '1px solid var(--border)',
                      cursor: 'pointer', transition: 'border-color .15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <Icon name="terminal" size={14} style={{ color: 'var(--fg-3)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 500 }}>{fileName}</div>
                      {nameParts.length > 1 && (
                        <div className="mono" style={{ fontSize: 11, color: 'var(--fg-3)', marginTop: 2 }}>
                          {hf.path}
                        </div>
                      )}
                    </div>
                    <Icon name="chevronRight" size={14} style={{ color: 'var(--fg-3)' }} />
                  </button>
                )
              })}
            </div>
            <button
              onClick={resetForm}
              style={{ marginTop: 14, fontSize: 12, color: 'var(--fg-3)', textDecoration: 'underline' }}
            >
              Cancel and start over
            </button>
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

            {/* Mode selector */}
            <ModeSelector
              mode={mode}
              prompt={prompt}
              tasks={tasks}
              onChange={handleModeChange}
            />

            {/* File drop zone */}
            <div>
              <label className="mono" style={{
                fontSize: 11, color: 'var(--fg-3)', textTransform: 'uppercase',
                letterSpacing: '.08em', marginBottom: 8, display: 'block',
              }}>
                Prototype file
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
                      {selectedZipFile && (
                        <span> · using <span style={{ color: 'var(--fg-2)' }}>{selectedZipFile.split('/').pop()}</span></span>
                      )}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); resetForm() }}
                      style={{ marginTop: 10, fontSize: 12, color: 'var(--fg-3)', textDecoration: 'underline' }}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <Icon name="download" size={24} style={{ color: 'var(--fg-3)', marginBottom: 10, transform: 'rotate(180deg)' }} />
                    <div style={{ fontSize: 15, color: 'var(--fg-2)', marginBottom: 4 }}>
                      Drag and drop your file here
                    </div>
                    <div className="mono" style={{ fontSize: 12, color: 'var(--fg-3)' }}>
                      or click to browse · HTML or ZIP · max 512KB per file
                    </div>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".html,.htm,.zip"
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
