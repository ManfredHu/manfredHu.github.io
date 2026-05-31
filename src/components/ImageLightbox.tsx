import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

interface ImageLightboxProps {
  src: string
  alt?: string
  onClose: () => void
}

const MIN_SCALE = 0.5
const MAX_SCALE = 5
const STEP = 0.25

/**
 * Full-screen image preview overlay with zoom in/out (buttons, wheel and
 * double-click) and drag-to-pan. Implemented without any external library.
 */
export default function ImageLightbox({
  src,
  alt,
  onClose,
}: ImageLightboxProps) {
  const [scale, setScale] = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const dragRef = useRef<{
    dragging: boolean
    startX: number
    startY: number
    originX: number
    originY: number
  }>({ dragging: false, startX: 0, startY: 0, originX: 0, originY: 0 })

  const clamp = (s: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, s))

  const zoomIn = useCallback(() => setScale((s) => clamp(s + STEP)), [])
  const zoomOut = useCallback(() => setScale((s) => clamp(s - STEP)), [])
  const reset = useCallback(() => {
    setScale(1)
    setOffset({ x: 0, y: 0 })
  }, [])

  // Lock background scroll and wire keyboard shortcuts while open.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === '+' || e.key === '=') zoomIn()
      else if (e.key === '-') zoomOut()
      else if (e.key === '0') reset()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, zoomIn, zoomOut, reset])

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setScale((s) => clamp(s + (e.deltaY < 0 ? STEP : -STEP)))
  }

  const onPointerDown = (e: React.PointerEvent) => {
    if (scale <= 1) return
    dragRef.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      originX: offset.x,
      originY: offset.y,
    }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current
    if (!d.dragging) return
    setOffset({
      x: d.originX + (e.clientX - d.startX),
      y: d.originY + (e.clientY - d.startY),
    })
  }

  const onPointerUp = () => {
    dragRef.current.dragging = false
  }

  // Download the image. Fetch as a blob so cross-origin images still save
  // with a sensible filename instead of navigating away.
  const download = useCallback(async () => {
    const filename = src.split('/').pop()?.split('?')[0] || 'image'
    try {
      const res = await fetch(src)
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      // Fallback: open in a new tab if the fetch/download is blocked.
      window.open(src, '_blank', 'noopener,noreferrer')
    }
  }, [src])

  return createPortal(
    <div
      className="img-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={alt || '图片预览'}
      onClick={onClose}
    >
      <div className="img-lightbox-mask" />
      <div
        className="img-lightbox-toolbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={zoomOut}
          aria-label="缩小"
          title="缩小 (-)"
        >
          −
        </button>
        <span className="img-lightbox-scale">{Math.round(scale * 100)}%</span>
        <button
          type="button"
          onClick={zoomIn}
          aria-label="放大"
          title="放大 (+)"
        >
          +
        </button>
        <button
          type="button"
          onClick={reset}
          aria-label="重置"
          title="重置 (0)"
        >
          ⟲
        </button>
        <button
          type="button"
          onClick={download}
          aria-label="下载"
          title="下载图片"
        >
          ↓
        </button>
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭"
          title="关闭 (Esc)"
        >
          ✕
        </button>
      </div>

      <img
        className="img-lightbox-img"
        src={src}
        alt={alt ?? ''}
        draggable={false}
        onClick={(e) => e.stopPropagation()}
        onWheel={onWheel}
        onDoubleClick={() => (scale === 1 ? setScale(2) : reset())}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})`,
          cursor: scale > 1 ? 'grab' : 'zoom-in',
        }}
      />
    </div>,
    document.body,
  )
}
