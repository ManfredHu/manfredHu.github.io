import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/styles/global.css'
import App from './App'

// Giscus OAuth callback returns to our origin with ?giscus=<token> and may
// clobber our HashRouter hash (e.g. to #comments) — which HashRouter then
// reads as the route "/comments". Restore the previous article hash that we
// stashed in sessionStorage so the user lands back on the article they were
// reading, while keeping the ?giscus query intact for giscus client.js.
;(function restoreGiscusReturnRoute() {
  if (typeof window === 'undefined') return
  const { search, hash, pathname } = window.location
  if (!search.includes('giscus=')) return
  const looksClobbered =
    hash === '' || hash === '#comments' || hash === '#/comments'
  if (!looksClobbered) return
  const saved = sessionStorage.getItem('lastArticleHash')
  if (saved && saved.startsWith('#/')) {
    window.history.replaceState(null, '', pathname + search + saved)
  }
})()

const rootEl = document.getElementById('root')
if (!rootEl) throw new Error('Root element not found')

createRoot(rootEl).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
