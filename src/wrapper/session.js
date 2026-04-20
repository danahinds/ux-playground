/**
 * Generate a unique session ID for linking Netlify Forms + Clarity data.
 */
export function generateSessionId() {
  const parts = []
  for (let i = 0; i < 4; i++) {
    parts.push(Math.random().toString(36).slice(2, 6))
  }
  return parts.join('-')
}
