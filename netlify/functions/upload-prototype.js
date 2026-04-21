const REPO_OWNER = 'danahinds'
const REPO_NAME = 'ux-playground'
const BRANCH = 'main'
const GITHUB_API = 'https://api.github.com'

const SLUG_MAX = 60
const SLUG_RE = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/
const TEST_NAME_MIN = 2
const TEST_NAME_MAX = 80
const PROMPT_MAX = 280
const TASK_MAX = 10

// Auto-inject Microsoft Clarity into every uploaded prototype so sessions
// INSIDE the iframe are recorded too. Uses the same project as the wrapper
// so the parent + prototype recordings land in one dashboard, correlated
// by the session_id tag (passed in via ?sid= on the iframe URL).
const CLARITY_ID = 'weqc268a3f'

const CLARITY_SNIPPET = `  <!-- Playground: auto-injected Microsoft Clarity for inside-iframe recording -->
  <script type="text/javascript">
    (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window,document,"clarity","script","${CLARITY_ID}");
    (function(){
      var p = new URLSearchParams(window.location.search);
      var sid = p.get('sid');
      if (sid) window.clarity('set', 'session_id', sid);
      var m = window.location.pathname.match(/\\/prototypes\\/([^/]+)\\//);
      if (m) window.clarity('set', 'prototype', m[1]);
      window.clarity('set', 'context', 'prototype');
    })();
  </script>
`

function injectClarity(html) {
  if (/clarity\.ms\/tag/i.test(html)) return html
  if (/<\/head>/i.test(html)) return html.replace(/<\/head>/i, CLARITY_SNIPPET + '</head>')
  if (/<\/body>/i.test(html)) return html.replace(/<\/body>/i, CLARITY_SNIPPET + '</body>')
  return html + '\n' + CLARITY_SNIPPET
}

const json = (body, status) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json' },
})

async function gh(path, token, init = {}) {
  return fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      ...(init.body ? { 'Content-Type': 'application/json' } : {}),
      ...(init.headers || {}),
    },
  })
}

function utf8ToBase64(text) {
  return Buffer.from(text, 'utf-8').toString('base64')
}

export default async (req) => {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405)
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return json({ error: 'Server misconfigured: missing GITHUB_TOKEN' }, 500)
  }

  let body
  try {
    body = await req.json()
  } catch {
    return json({ error: 'Invalid JSON body' }, 400)
  }

  const { slug, testName, html, mode, prompt, tasks } = body

  if (!slug || !SLUG_RE.test(slug) || slug.length > SLUG_MAX) {
    return json({
      error: 'Invalid test name. Use lowercase letters, numbers, and hyphens (e.g., "checkout-v3"). 2–60 characters.',
    }, 400)
  }

  const trimmedName = typeof testName === 'string' ? testName.trim() : ''
  if (trimmedName.length < TEST_NAME_MIN || trimmedName.length > TEST_NAME_MAX) {
    return json({ error: `Test name must be ${TEST_NAME_MIN}–${TEST_NAME_MAX} characters.` }, 400)
  }

  if (!html) {
    return json({ error: 'No HTML content provided' }, 400)
  }

  if (html.length > 700000) {
    return json({ error: 'File too large. Maximum size is 512KB.' }, 400)
  }

  if (mode !== 'exploration' && mode !== 'guided') {
    return json({ error: 'Invalid mode. Must be "exploration" or "guided".' }, 400)
  }

  let normalizedPrompt = null
  let normalizedTasks = null

  if (mode === 'exploration') {
    if (prompt != null) {
      if (typeof prompt !== 'string' || prompt.length > PROMPT_MAX) {
        return json({ error: `Prompt must be ${PROMPT_MAX} characters or fewer.` }, 400)
      }
      const trimmed = prompt.trim()
      normalizedPrompt = trimmed.length ? trimmed : null
    }
  } else {
    if (!Array.isArray(tasks) || tasks.length === 0) {
      return json({ error: 'Guided mode requires at least one task.' }, 400)
    }
    if (tasks.length > TASK_MAX) {
      return json({ error: `Maximum ${TASK_MAX} tasks.` }, 400)
    }
    normalizedTasks = []
    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i]
      if (typeof t !== 'string' || !t.trim()) {
        return json({ error: `Task ${i + 1} is empty.` }, 400)
      }
      if (t.length > PROMPT_MAX) {
        return json({ error: `Task ${i + 1} is too long (max ${PROMPT_MAX} chars).` }, 400)
      }
      normalizedTasks.push({ id: `t${i + 1}`, prompt: t.trim() })
    }
  }

  // Duplicate check — rejects if index.html OR meta.json already exists for this slug.
  const indexPath = `public/prototypes/${slug}/index.html`
  const metaPath = `public/prototypes/${slug}/meta.json`
  const [indexExists, metaExists] = await Promise.all([
    gh(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${indexPath}`, token),
    gh(`/repos/${REPO_OWNER}/${REPO_NAME}/contents/${metaPath}`, token),
  ])
  if (indexExists.status === 200 || metaExists.status === 200) {
    return json({
      error: `A prototype named "${slug}" already exists. Choose a different name.`,
    }, 409)
  }

  const meta = {
    slug,
    testName: trimmedName,
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    mode,
    prompt: normalizedPrompt,
    tasks: normalizedTasks,
    archived: false,
  }
  const metaContentBase64 = utf8ToBase64(JSON.stringify(meta, null, 2) + '\n')

  // Inject Clarity into the uploaded HTML so behaviour inside the iframe is
  // recorded alongside the wrapper, correlated by session_id via ?sid=.
  let indexContentBase64 = html
  try {
    const decoded = Buffer.from(html, 'base64').toString('utf-8')
    const injected = injectClarity(decoded)
    if (injected !== decoded) {
      indexContentBase64 = utf8ToBase64(injected)
    }
  } catch (e) {
    // If injection fails for any reason, fall back to the original HTML.
    console.warn('Clarity injection failed, uploading unmodified:', e)
  }

  try {
    // 1. Create blobs in parallel
    const [indexBlobRes, metaBlobRes] = await Promise.all([
      gh(`/repos/${REPO_OWNER}/${REPO_NAME}/git/blobs`, token, {
        method: 'POST',
        body: JSON.stringify({ content: indexContentBase64, encoding: 'base64' }),
      }),
      gh(`/repos/${REPO_OWNER}/${REPO_NAME}/git/blobs`, token, {
        method: 'POST',
        body: JSON.stringify({ content: metaContentBase64, encoding: 'base64' }),
      }),
    ])
    if (!indexBlobRes.ok || !metaBlobRes.ok) {
      throw new Error(`blob creation failed: ${indexBlobRes.status}/${metaBlobRes.status}`)
    }
    const indexBlob = await indexBlobRes.json()
    const metaBlob = await metaBlobRes.json()

    // 2. Read current branch tip
    const refRes = await gh(`/repos/${REPO_OWNER}/${REPO_NAME}/git/ref/heads/${BRANCH}`, token)
    if (!refRes.ok) throw new Error(`ref read failed: ${refRes.status}`)
    const ref = await refRes.json()
    const baseCommitSha = ref.object.sha

    const baseCommitRes = await gh(`/repos/${REPO_OWNER}/${REPO_NAME}/git/commits/${baseCommitSha}`, token)
    if (!baseCommitRes.ok) throw new Error(`base commit read failed: ${baseCommitRes.status}`)
    const baseCommit = await baseCommitRes.json()
    const baseTreeSha = baseCommit.tree.sha

    // 3. Create tree with both new files on top of the current tree
    const treeRes = await gh(`/repos/${REPO_OWNER}/${REPO_NAME}/git/trees`, token, {
      method: 'POST',
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: [
          { path: indexPath, mode: '100644', type: 'blob', sha: indexBlob.sha },
          { path: metaPath, mode: '100644', type: 'blob', sha: metaBlob.sha },
        ],
      }),
    })
    if (!treeRes.ok) throw new Error(`tree creation failed: ${treeRes.status}`)
    const tree = await treeRes.json()

    // 4. Commit with the base as parent
    const newCommitRes = await gh(`/repos/${REPO_OWNER}/${REPO_NAME}/git/commits`, token, {
      method: 'POST',
      body: JSON.stringify({
        message: `upload: add prototype "${slug}"`,
        tree: tree.sha,
        parents: [baseCommitSha],
      }),
    })
    if (!newCommitRes.ok) throw new Error(`commit creation failed: ${newCommitRes.status}`)
    const newCommit = await newCommitRes.json()

    // 5. Fast-forward the branch
    const updateRes = await gh(`/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/${BRANCH}`, token, {
      method: 'PATCH',
      body: JSON.stringify({ sha: newCommit.sha, force: false }),
    })
    if (!updateRes.ok) throw new Error(`ref update failed: ${updateRes.status}`)
  } catch (err) {
    console.error('GitHub API error:', err)
    return json({ error: 'Failed to upload prototype. Please try again.' }, 500)
  }

  return json({
    url: `/t?proto=${slug}`,
    slug,
    testName: trimmedName,
    mode,
    status: 'deploying',
    message: `Prototype "${slug}" uploaded. It will be live in ~1–2 minutes.`,
  }, 201)
}

export const config = {
  path: '/.netlify/functions/upload-prototype',
}
