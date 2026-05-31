import { useEffect, useRef, useState } from 'react'
import ImageLightbox from '@/components/ImageLightbox'

type MdImageProps = React.ImgHTMLAttributes<HTMLImageElement>

/** If an image hasn't loaded within this window, treat it as failed. */
const LOAD_TIMEOUT = 15000

/**
 * Markdown image that renders progressively (the partially-downloaded
 * image is shown over a shimmer skeleton instead of being hidden until
 * fully loaded), guards against a stuck request with a load timeout, and
 * offers a manual retry on failure.
 */
export default function MdImage({ src, alt, ...props }: MdImageProps) {
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>(
    'loading',
  )
  // Bumped on each retry to force the browser to re-request the image.
  const [attempt, setAttempt] = useState(0)
  const [previewing, setPreviewing] = useState(false)
  const timerRef = useRef<number | null>(null)

  const clearTimer = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  // Reset to loading and arm the timeout whenever the source or retry changes.
  useEffect(() => {
    if (!src) return
    setStatus('loading')
    clearTimer()
    timerRef.current = window.setTimeout(() => {
      setStatus((prev) => (prev === 'loaded' ? prev : 'error'))
    }, LOAD_TIMEOUT)
    return clearTimer
  }, [src, attempt])

  if (!src) return null

  // Absolute URL based on the current origin (protocol + host). Site-relative
  // paths like "/images/foo.png" become "https://host/images/foo.png"; already
  // absolute URLs are returned unchanged.
  let absoluteUrl = src
  try {
    absoluteUrl = new URL(src, window.location.href).href
  } catch {
    absoluteUrl = src
  }

  // Cache-bust on retry so a previously-failed response isn't reused.
  const resolvedSrc =
    attempt === 0
      ? src
      : `${src}${src.includes('?') ? '&' : '?'}_retry=${attempt}`

  const retry = () => setAttempt((a) => a + 1)

  if (status === 'error') {
    return (
      <span className="md-img-error" data-image-url={absoluteUrl}>
        <span
          className="md-img-error-text"
          role="img"
          aria-label={alt || '图片'}
        >
          🖼️ 图片加载失败
        </span>
        <a
          className="md-img-error-url"
          href={absoluteUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={absoluteUrl}
        >
          {absoluteUrl}
        </a>
        <button type="button" className="md-img-retry" onClick={retry}>
          点击重试
        </button>
      </span>
    )
  }

  return (
    <span
      className={`md-img-wrap${status === 'loading' ? ' skeleton' : ''}`}
      data-status={status}
      data-image-url={absoluteUrl}
    >
      <img
        key={attempt}
        src={resolvedSrc}
        alt={alt ?? ''}
        loading="lazy"
        decoding="async"
        className="md-img"
        data-image-url={absoluteUrl}
        onClick={() => status === 'loaded' && setPreviewing(true)}
        onLoad={() => {
          clearTimer()
          setStatus('loaded')
        }}
        onError={() => {
          clearTimer()
          setStatus('error')
        }}
        {...props}
      />
      {previewing && (
        <ImageLightbox
          src={resolvedSrc}
          alt={alt}
          onClose={() => setPreviewing(false)}
        />
      )}
    </span>
  )
}
