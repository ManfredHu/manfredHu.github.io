// View counter configuration.
//
// This site is a static GitHub Pages app using BrowserRouter. To show a
// per-article view count to visitors, point `endpoint` at a tiny serverless
// counter (e.g. Cloudflare Workers + KV, or a Tencent Cloud function backed by
// a single counter table). The endpoint is expected to:
//
//   POST `${endpoint}?slug=<articlePath>`
//     → increment the counter for that slug and return its new total
//
// Response must be JSON containing the count under one of the keys
// `count`, `views`, `total` or `value`, e.g. `{ "count": 1234 }`.
//
// If `endpoint` is left blank the ViewCounter renders nothing (no UI, no
// network requests), mirroring the giscus "unconfigured" behaviour.

export interface ViewCounterConfig {
  /** Absolute URL of the serverless counter endpoint. Empty = disabled. */
  endpoint: string
  /**
   * When true, repeated views from the same browser within `dedupeHours`
   * are not re-counted (uses localStorage). Set false to count every visit.
   */
  dedupe: boolean
  /** De-duplication window in hours. Only used when `dedupe` is true. */
  dedupeHours: number
}

export const viewCounterConfig: ViewCounterConfig = {
  endpoint: '',
  dedupe: true,
  dedupeHours: 12,
}

export function isViewCounterConfigured(): boolean {
  return Boolean(viewCounterConfig.endpoint)
}
