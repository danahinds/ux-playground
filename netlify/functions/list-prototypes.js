const REPO_OWNER = 'danahinds'
const REPO_NAME = 'ux-playground'
const BRANCH = 'main'
const GITHUB_API = 'https://api.github.com'
const NETLIFY_API = 'https://api.netlify.com/api/v1'
const PAGE_SIZE = 100

const json = (body, status) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json' },
})

async function gh(path, token) {
  return fetch(`${GITHUB_API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })
}

async function netlify(path, token) {
  return fetch(`${NETLIFY_API}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
  })
}

async function listAllSubmissions(formId, token) {
  const all = []
  let page = 1
  while (true) {
    const res = await netlify(
      `/forms/${formId}/submissions?per_page=${PAGE_SIZE}&page=${page}`,
      token,
    )
    if (!res.ok) throw new Error(`form ${formId} page ${page}: ${res.status}`)
    const batch = await res.json()
    all.push(...batch)
    if (batch.length < PAGE_SIZE) break
    page++
  }
  return all
}

function fieldsOf(s) {
  return s.data || s.human_fields || {}
}

function decodeContent(base64) {
  const buf = Buffer.from(base64, 'base64')
  return buf.toString('utf-8')
}

export default async (req) => {
  const ghToken = process.env.GITHUB_TOKEN
  if (!ghToken) {
    return json({ error: 'Server misconfigured: missing GITHUB_TOKEN' }, 500)
  }

  // 1. List subdirectories of public/prototypes
  let dirs
  try {
    const res = await gh(
      `/repos/${REPO_OWNER}/${REPO_NAME}/contents/public/prototypes?ref=${BRANCH}`,
      ghToken,
    )
    if (!res.ok) throw new Error(`contents list: ${res.status}`)
    const items = await res.json()
    dirs = Array.isArray(items) ? items.filter(i => i.type === 'dir') : []
  } catch (err) {
    console.error('GitHub API error (list dirs):', err)
    return json({ error: 'Failed to list prototypes.' }, 502)
  }

  // 2. Fetch each meta.json in parallel
  const metas = await Promise.all(dirs.map(async (d) => {
    try {
      const res = await gh(
        `/repos/${REPO_OWNER}/${REPO_NAME}/contents/public/prototypes/${d.name}/meta.json?ref=${BRANCH}`,
        ghToken,
      )
      if (!res.ok) {
        // Legacy prototype without meta.json
        return {
          slug: d.name,
          testName: d.name,
          mode: 'exploration',
          createdAt: null,
          archived: false,
          legacy: true,
        }
      }
      const file = await res.json()
      const meta = JSON.parse(decodeContent(file.content))
      return {
        slug: meta.slug || d.name,
        testName: meta.testName || d.name,
        mode: meta.mode || 'exploration',
        createdAt: meta.createdAt || null,
        archived: !!meta.archived,
        legacy: false,
      }
    } catch (err) {
      console.warn(`meta.json parse failed for ${d.name}:`, err)
      return {
        slug: d.name,
        testName: d.name,
        mode: 'exploration',
        createdAt: null,
        archived: false,
        legacy: true,
      }
    }
  }))

  // 3. Get response counts (optional — only if NETLIFY_API_TOKEN is set)
  const nfToken = process.env.NETLIFY_API_TOKEN
  const siteId = process.env.SITE_ID || process.env.NETLIFY_SITE_ID
  const countsBySlug = new Map()

  if (nfToken && siteId) {
    try {
      const formsRes = await netlify(`/sites/${siteId}/forms`, nfToken)
      if (formsRes.ok) {
        const forms = await formsRes.json()
        const sessionForm = forms.find(f => f.name === 'playground-session')
        if (sessionForm) {
          const subs = await listAllSubmissions(sessionForm.id, nfToken)
          for (const s of subs) {
            const slug = fieldsOf(s).prototype
            if (!slug) continue
            countsBySlug.set(slug, (countsBySlug.get(slug) || 0) + 1)
          }
        }
      }
    } catch (err) {
      console.warn('Response counts unavailable:', err)
    }
  }

  const prototypes = metas
    .map(m => ({ ...m, responseCount: countsBySlug.get(m.slug) || 0 }))
    .sort((a, b) => {
      // Newest first; legacy (no createdAt) at the bottom
      if (!a.createdAt && !b.createdAt) return a.slug.localeCompare(b.slug)
      if (!a.createdAt) return 1
      if (!b.createdAt) return -1
      return b.createdAt.localeCompare(a.createdAt)
    })

  return json({ prototypes }, 200)
}

export const config = {
  path: '/.netlify/functions/list-prototypes',
}
