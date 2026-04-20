/**
 * Microsoft Clarity helpers.
 * Clarity is loaded via a script tag in index.html.
 * These helpers safely call the clarity() API for tagging sessions.
 */

function claritySet(key, value) {
  if (typeof window.clarity === 'function') {
    window.clarity('set', key, value)
  }
}

export function tagSession(sessionId) {
  claritySet('session_id', sessionId)
}

export function tagPrototype(name) {
  claritySet('prototype', name)
}

export function tagDemographics(form) {
  Object.entries(form).forEach(([key, value]) => {
    if (value) claritySet(key, value)
  })
}
