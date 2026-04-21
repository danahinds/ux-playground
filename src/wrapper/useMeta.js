import { useEffect, useState } from 'react'

const FALLBACK = {
  mode: 'exploration',
  prompt: null,
  tasks: null,
  archived: false,
  schemaVersion: 0,
}

/**
 * Loads /prototypes/<slug>/meta.json. If the file is missing (legacy
 * prototype uploaded before meta.json existed), returns a fallback that
 * treats it as an un-prompted exploration session.
 */
export function useMeta(slug) {
  const [state, setState] = useState({ loading: true, meta: null })

  useEffect(() => {
    if (!slug) {
      setState({ loading: false, meta: null })
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/prototypes/${slug}/meta.json`, { cache: 'no-store' })
        if (cancelled) return
        if (res.ok) {
          const meta = await res.json()
          setState({ loading: false, meta })
        } else {
          setState({ loading: false, meta: { ...FALLBACK, slug } })
        }
      } catch {
        if (!cancelled) setState({ loading: false, meta: { ...FALLBACK, slug } })
      }
    })()

    return () => { cancelled = true }
  }, [slug])

  return state
}
