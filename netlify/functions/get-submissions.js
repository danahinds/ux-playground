const NETLIFY_API = 'https://api.netlify.com/api/v1'
const PAGE_SIZE = 100

const json = (body, status) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json' },
})

async function netlify(path, token) {
  return fetch(`${NETLIFY_API}${path}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
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

function fieldsOf(submission) {
  // Netlify Forms returns custom fields as `data` (preferred) or nested under `human_fields`.
  return submission.data || submission.human_fields || {}
}

function parseTaskTimings(raw) {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export default async (req) => {
  const token = process.env.NETLIFY_API_TOKEN
  if (!token) {
    return json({ error: 'Server misconfigured: missing NETLIFY_API_TOKEN' }, 500)
  }

  const siteId = process.env.SITE_ID || process.env.NETLIFY_SITE_ID
  if (!siteId) {
    return json({ error: 'Server misconfigured: missing SITE_ID' }, 500)
  }

  const url = new URL(req.url)
  const prototype = url.searchParams.get('proto')
  if (!prototype) {
    return json({ error: 'Missing ?proto=<slug> query parameter' }, 400)
  }

  let intakeForm, sessionForm
  try {
    const formsRes = await netlify(`/sites/${siteId}/forms`, token)
    if (!formsRes.ok) throw new Error(`site forms: ${formsRes.status}`)
    const forms = await formsRes.json()
    intakeForm = forms.find(f => f.name === 'playground-intake')
    sessionForm = forms.find(f => f.name === 'playground-session')
    if (!intakeForm || !sessionForm) {
      return json({
        error: 'Forms not yet detected by Netlify. Trigger a deploy first, or wait for the build to finish.',
      }, 503)
    }
  } catch (err) {
    console.error('Netlify API error (forms):', err)
    return json({ error: 'Failed to resolve forms.' }, 502)
  }

  let intakeSubs, sessionSubs
  try {
    [intakeSubs, sessionSubs] = await Promise.all([
      listAllSubmissions(intakeForm.id, token),
      listAllSubmissions(sessionForm.id, token),
    ])
  } catch (err) {
    console.error('Netlify API error (submissions):', err)
    return json({ error: 'Failed to read submissions.' }, 502)
  }

  // Filter by prototype slug, then join by session-id
  const bySessionId = new Map()

  for (const s of intakeSubs) {
    const fields = fieldsOf(s)
    if (fields.prototype !== prototype) continue
    const sid = fields['session-id'] || fields.session_id
    if (!sid) continue
    const entry = bySessionId.get(sid) || { sessionId: sid, intake: null, session: null }
    entry.intake = {
      ageRange: fields['age-range'] || fields.age_range || '',
      techComfort: fields['tech-comfort'] || fields.tech_comfort || '',
      familiarity: fields.familiarity || '',
      timestamp: fields.timestamp || s.created_at,
    }
    bySessionId.set(sid, entry)
  }

  for (const s of sessionSubs) {
    const fields = fieldsOf(s)
    if (fields.prototype !== prototype) continue
    const sid = fields['session-id'] || fields.session_id
    if (!sid) continue
    const entry = bySessionId.get(sid) || { sessionId: sid, intake: null, session: null }
    const easeRaw = fields.ease || ''
    entry.session = {
      mode: fields.mode || 'exploration',
      intent: fields.intent || '',
      success: fields.success || '',
      confusion: fields.confusion || '',
      ease: easeRaw === '' ? null : Number(easeRaw),
      taskTimings: parseTaskTimings(fields['task-timings'] || fields.task_timings),
      timestamp: fields.timestamp || s.created_at,
    }
    bySessionId.set(sid, entry)
  }

  const sessions = Array.from(bySessionId.values()).sort((a, b) => {
    const ta = a.session?.timestamp || a.intake?.timestamp || ''
    const tb = b.session?.timestamp || b.intake?.timestamp || ''
    return tb.localeCompare(ta)
  })

  return json({ prototype, sessions }, 200)
}

export const config = {
  path: '/.netlify/functions/get-submissions',
}
