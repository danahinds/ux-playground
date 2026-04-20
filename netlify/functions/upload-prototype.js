const REPO_OWNER = 'danahinds'
const REPO_NAME = 'ux-playground'
const BRANCH = 'main'

export default async (req) => {
  // Only accept POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return new Response(JSON.stringify({ error: 'Server misconfigured: missing GITHUB_TOKEN' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  let body
  try {
    body = await req.json()
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const { slug, html } = body

  // Validate slug
  if (!slug || !/^[a-z0-9][a-z0-9-]*[a-z0-9]$/.test(slug) || slug.length > 60) {
    return new Response(JSON.stringify({
      error: 'Invalid test name. Use lowercase letters, numbers, and hyphens (e.g., "checkout-v3"). 2-60 characters.',
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Validate HTML content
  if (!html) {
    return new Response(JSON.stringify({ error: 'No HTML content provided' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Check size (~512KB limit, base64 is ~33% larger than raw)
  if (html.length > 700000) {
    return new Response(JSON.stringify({ error: 'File too large. Maximum size is 512KB.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const filePath = `public/prototypes/${slug}/index.html`
  const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filePath}`

  // Check if prototype already exists
  const checkRes = await fetch(apiUrl, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
    },
  })

  if (checkRes.status === 200) {
    return new Response(JSON.stringify({
      error: `A prototype named "${slug}" already exists. Choose a different name.`,
    }), {
      status: 409,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // Commit the file via GitHub Contents API
  const commitRes = await fetch(apiUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message: `upload: add prototype "${slug}"`,
      content: html,
      branch: BRANCH,
    }),
  })

  if (!commitRes.ok) {
    const err = await commitRes.text()
    console.error('GitHub API error:', err)
    return new Response(JSON.stringify({ error: 'Failed to upload prototype. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(JSON.stringify({
    url: `/t?proto=${slug}`,
    slug,
    status: 'deploying',
    message: `Prototype "${slug}" uploaded. It will be live in ~1-2 minutes.`,
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const config = {
  path: '/.netlify/functions/upload-prototype',
}
