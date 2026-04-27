import { useEffect, useState } from 'react'
import { slugify } from './MarkdownRenderer'
import './TableOfContents.css'

interface TocItem {
  level: number
  text: string
  id: string
}

function extractHeadings(markdown: string, skipFirstH1: boolean): TocItem[] {
  const lines = markdown.split('\n')
  const items: TocItem[] = []
  let inFrontmatter = false
  let firstH1Skipped = false

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // Handle frontmatter delimiters
    if (i === 0 && line.trim() === '---') {
      inFrontmatter = true
      continue
    }
    if (inFrontmatter && line.trim() === '---') {
      inFrontmatter = false
      continue
    }
    if (inFrontmatter) continue

    const match = line.match(/^(#{1,6})\s+(.+?)(?:\s+#+)?$/)
    if (!match) continue

    const level = match[1].length
    const rawText = match[2].replace(/[`*_[\]()!#]/g, '').trim()
    const id = slugify(rawText)

    // Skip first h1 if it's rendered as article-header-title
    if (level === 1 && skipFirstH1 && !firstH1Skipped) {
      firstH1Skipped = true
      continue
    }

    items.push({ level, text: rawText, id })
  }
  return items
}

interface Props {
  content: string
  skipFirstH1?: boolean
}

export default function TableOfContents({
  content,
  skipFirstH1 = false,
}: Props) {
  const [activeId, setActiveId] = useState<string>('')

  const items = extractHeadings(content, skipFirstH1)
  const minLevel = items.length ? Math.min(...items.map((i) => i.level)) : 2

  // IntersectionObserver to highlight the current heading
  useEffect(() => {
    const headings = document.querySelectorAll<HTMLElement>(
      '.markdown-body h1[id], .markdown-body h2[id], .markdown-body h3[id], ' +
        '.markdown-body h4[id], .markdown-body h5[id], .markdown-body h6[id]',
    )
    if (!headings.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
            break
          }
        }
      },
      { rootMargin: '-8% 0px -80% 0px', threshold: 0 },
    )

    headings.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [content])

  if (items.length === 0) return null

  const handleClick = (id: string) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="toc-widget" role="navigation" aria-label="文章目录">
      <div className="toc-header">
        <span className="toc-header-icon">≡</span>
        <span className="toc-header-label">目录</span>
      </div>
      <ul className="toc-list">
        {items.map((item, idx) => (
          <li key={idx} className="toc-item">
            <button
              className={`toc-link toc-link--h${item.level}${activeId === item.id ? ' toc-link--active' : ''}`}
              style={{ paddingLeft: `${(item.level - minLevel) * 10 + 10}px` }}
              onClick={() => handleClick(item.id)}
              title={item.text}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
