import { useEffect, useState } from 'react'
import {
  viewCounterConfig,
  isViewCounterConfigured,
} from '@/config/viewCounter'

interface ViewCounterProps {
  /** Article path used as the counter key, e.g. "/js/foo". */
  slug?: string
}

function pickCount(data: unknown): number | null {
  if (typeof data === 'number') return data
  if (data && typeof data === 'object') {
    const obj = data as Record<string, unknown>
    for (const key of ['count', 'views', 'total', 'value']) {
      const v = obj[key]
      if (typeof v === 'number') return v
      if (typeof v === 'string' && v.trim() !== '' && !Number.isNaN(Number(v))) {
        return Number(v)
      }
    }
  }
  return null
}

/** Returns true if this slug was already counted within the dedupe window. */
function alreadyCounted(slug: string): boolean {
  if (!viewCounterConfig.dedupe) return false
  try {
    const raw = localStorage.getItem(`viewcount:${slug}`)
    if (!raw) return false
    const ts = Number(raw)
    if (Number.isNaN(ts)) return false
    const ageHours = (Date.now() - ts) / (1000 * 60 * 60)
    return ageHours < viewCounterConfig.dedupeHours
  } catch {
    return false
  }
}

function markCounted(slug: string): void {
  if (!viewCounterConfig.dedupe) return
  try {
    localStorage.setItem(`viewcount:${slug}`, String(Date.now()))
  } catch {
    // ignore storage errors (private mode, quota, etc.)
  }
}

/**
 * Displays a per-article view count fetched from a serverless counter.
 * Renders nothing when the counter is not configured.
 */
export default function ViewCounter({ slug }: ViewCounterProps) {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    if (!isViewCounterConfigured() || !slug) return

    let cancelled = false
    const method = alreadyCounted(slug) ? 'GET' : 'POST'
    const url = `${viewCounterConfig.endpoint}?slug=${encodeURIComponent(slug)}`

    fetch(url, { method })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled) return
        const value = pickCount(data)
        if (value !== null) {
          setCount(value)
          if (method === 'POST') markCounted(slug)
        }
      })
      .catch(() => {
        // Silently ignore: view count is non-critical.
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  if (!isViewCounterConfigured()) return null
  if (count === null) return null

  return (
    <span className="article-views" aria-label="浏览次数">
      👁 {count.toLocaleString()} 次浏览
    </span>
  )
}
