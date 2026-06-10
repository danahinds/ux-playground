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

async function listFilesRecursive(dirPath, token) {
  const res = await gh(
    `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${dirPath}?ref=${BRANCH}`,
    token,
  )
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`contents list ${dirPath}: ${res.status}`)
  const items = await res.json()
  if (!Array.isArray(items)) throw new Error(`unexpected contents shape for ${dirPath}`)
  const files = []
  for (const item of items) {
    if (item.type === 'file') {
      files.push(item.path)
    } else if (item.type === 'dir') {
      const sub = await listFilesRecursive(item.path, token)
      if (sub) files.push(...sub)
    }
  }
  return files
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

  const { slug } = body
  if (!slug || !SLUG_RE.test(slug)) {
    return json({ error: 'Invalid slug.' }, 400)
  }

  const dirPath = `public/prototypes/${slug}`

  let files
  try {
    files = await listFilesRecursive(dirPath, token)
  } catch (err) {
    console.error('GitHub API error (list):', err)
    return json({ error: 'Failed to list prototype files.' }, 502)
  }
  if (files === null) {
    return json({ error: `Prototype "${slug}" not found.` }, 404)
  }
  if (files.length === 0) {
    return json({ error: `Prototype "${slug}" has no files.` }, 404)
  }

  try {
    const refRes = await gh(`/repos/${REPO_OWNER}/${REPO_NAME}/git/ref/heads/${BRANCH}`, token)
    if (!refRes.ok) throw new Error(`ref read: ${refRes.status}`)
    const ref = await refRes.json()
    const baseCommitSha = ref.object.sha

    const baseCommitRes = await gh(`/repos/${REPO_OWNER}/${REPO_NAME}/git/commits/${baseCommitSha}`, token)
    if (!baseCommitRes.ok) throw new Error(`base commit read: ${baseCommitRes.status}`)
    const baseCommit = await baseCommitRes.json()
    const baseTreeSha = baseCommit.tree.sha

    // sha: null removes the path from the tree
    const treeRes = await gh(`/repos/${REPO_OWNER}/${REPO_NAME}/git/trees`, token, {
      method: 'POST',
      body: JSON.stringify({
        base_tree: baseTreeSha,
        tree: files.map(path => ({ path, mode: '100644', type: 'blob', sha: null })),
      }),
    })
    if (!treeRes.ok) throw new Error(`tree creation: ${treeRes.status}`)
    const tree = await treeRes.json()

    const newCommitRes = await gh(`/repos/${REPO_OWNER}/${REPO_NAME}/git/commits`, token, {
      method: 'POST',
      body: JSON.stringify({
        message: `delete: prototype "${slug}"`,
        tree: tree.sha,
        parents: [baseCommitSha],
      }),
    })
    if (!newCommitRes.ok) throw new Error(`commit creation: ${newCommitRes.status}`)
    const newCommit = await newCommitRes.json()

    const updateRes = await gh(`/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/${BRANCH}`, token, {
      method: 'PATCH',
      body: JSON.stringify({ sha: newCommit.sha, force: false }),
    })
    if (!updateRes.ok) throw new Error(`ref update: ${updateRes.status}`)
  } catch (err) {
    console.error('GitHub API error (delete):', err)
    return json({ error: 'Failed to delete prototype.' }, 502)
  }

  return json({ slug, deleted: files.length }, 200)
}

export const config = {
  path: '/.netlify/functions/delete-prototype',
}
