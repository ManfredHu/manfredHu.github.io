import { useRef, useState } from 'react'

type PreProps = React.HTMLAttributes<HTMLPreElement>

/**
 * Code block wrapper that adds a one-click "copy" button in the top-right
 * corner. The code text is read from the rendered <pre> via a ref, so it
 * works regardless of syntax-highlight markup.
 */
export default function CodeBlock({ children, ...props }: PreProps) {
  const preRef = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<number | null>(null)

  const handleCopy = async () => {
    const text = preRef.current?.innerText ?? ''
    if (!text) return
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for non-secure contexts without the async Clipboard API.
        const ta = document.createElement('textarea')
        ta.value = text
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        document.body.removeChild(ta)
      }
      setCopied(true)
      if (timerRef.current !== null) window.clearTimeout(timerRef.current)
      timerRef.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Ignore copy failures (e.g. permission denied).
    }
  }

  return (
    <div className="code-block">
      <button
        type="button"
        className={`code-copy-btn${copied ? ' code-copy-btn--copied' : ''}`}
        onClick={handleCopy}
        aria-label={copied ? '已复制' : '复制代码'}
      >
        {copied ? '✓ 已复制' : '复制'}
      </button>
      <pre ref={preRef} {...props}>
        {children}
      </pre>
    </div>
  )
}
