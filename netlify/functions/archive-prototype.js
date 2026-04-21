const REPO_OWNER = 'danahinds'
const REPO_NAME = 'ux-playground'
const BRANCH = 'main'
const GITHUB_API = 'https://api.github.com'

const SLUG_RE = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/

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

const b64encode = (text) => Buffer.from(text, 'utf-8').toString('base64')
const b64decode = (b64) => Buffer.from(b64, 'base64').toString('utf-8')

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

  const { slug, archived } = body

  if (!slug || !SLUG_RE.test(slug)) {
    return json({ error: 'Invalid slug.' }, 400)
  }
  if (typeof archived !== 'boolean') {
    return json({ error: '`archived` must be a boolean.' }, 400)
  }

  const path = `public/prototypes/${slug}/meta.json`
  const apiUrl = `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}?ref=${BRANCH}`

  let currentFile
  try {
    const res = await gh(apiUrl, token)
    if (res.status === 404) {
      return json({ error: `No meta.json for "${slug}". Legacy prototypes can't be archived.` }, 404)
    }
    if (!res.ok) throw new Error(`read: ${res.status}`)
    currentFile = await res.json()
  } catch (err) {
    console.error('GitHub API error (read):', err)
    return json({ error: 'Failed to read current meta.json.' }, 502)
  }

  let meta
  try {
    meta = JSON.parse(b64decode(currentFile.content))
  } catch {
    return json({ error: 'meta.json is not valid JSON.' }, 500)
  }

  if (meta.archived === archived) {
    return json({ meta, unchanged: true }, 200)
  }

  meta.archived = archived
  const newContent = JSON.stringify(meta, null, 2) + '\n'

  try {
    const res = await gh(
      `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`,
      token,
      {
        method: 'PUT',
        body: JSON.stringify({
          message: `${archived ? 'archive' : 'unarchive'}: prototype "${slug}"`,
          content: b64encode(newContent),
          sha: currentFile.sha,
          branch: BRANCH,
        }),
      },
    )
    if (!res.ok) {
      const err = await res.text()
      console.error('GitHub API error (write):', err)
      return json({ error: 'Failed to update meta.json.' }, 502)
    }
  } catch (err) {
    console.error('GitHub API error (write):', err)
    return json({ error: 'Failed to update meta.json.' }, 502)
  }

  return json({ meta }, 200)
}

export const config = {
  path: '/.netlify/functions/archive-prototype',
}
