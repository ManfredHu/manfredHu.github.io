import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeHighlight from 'rehype-highlight'
import rehypeKatex from 'rehype-katex'
import rehypeRaw from 'rehype-raw'
import 'katex/dist/katex.min.css'
import '@/styles/markdown.css'
import type { Components } from 'react-markdown'

interface MarkdownRendererProps {
  content: string
}

interface Frontmatter {
  title?: string
  tags?: string[]
  [key: string]: unknown
}

/**
 * Strip YAML frontmatter from markdown and extract fields.
 * Returns { frontmatter, body } where body has the --- block removed.
 */
function parseFrontmatter(raw: string): {
  frontmatter: Frontmatter
  body: string
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!match) return { frontmatter: {}, body: raw }

  const yamlBlock = match[1]
  const body = raw.slice(match[0].length)
  const frontmatter: Frontmatter = {}

  // Simple line-by-line YAML parser for scalar strings and arrays
  const lines = yamlBlock.split('\n')
  let currentKey: string | null = null
  for (const line of lines) {
    const scalarMatch = line.match(/^(\w+):\s*(.+)/)
    const keyOnlyMatch = line.match(/^(\w+):\s*$/)
    const listItemMatch = line.match(/^\s+-\s+(.+)/)

    if (scalarMatch) {
      currentKey = scalarMatch[1]
      frontmatter[currentKey] = scalarMatch[2].replace(/^['"]|['"]$/g, '')
    } else if (keyOnlyMatch) {
      currentKey = keyOnlyMatch[1]
      frontmatter[currentKey] = []
    } else if (listItemMatch && currentKey) {
      const arr = frontmatter[currentKey]
      if (Array.isArray(arr)) {
        arr.push(listItemMatch[1].replace(/^['"]|['"]$/g, ''))
      }
    }
  }

  return { frontmatter, body }
}

/** Convert React children tree to plain text for generating heading IDs. */
function nodeToText(node: React.ReactNode): string {
  if (typeof node === 'string') return node
  if (typeof node === 'number') return String(node)
  if (Array.isArray(node)) return node.map(nodeToText).join('')
  if (
    node !== null &&
    typeof node === 'object' &&
    'props' in (node as object)
  ) {
    return nodeToText(
      (node as { props: { children?: React.ReactNode } }).props.children,
    )
  }
  return ''
}

/** Generate a URL-friendly anchor ID from heading text. */
export function slugify(text: string): string {
  return text
    .replace(/[`*_[\]()!#]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-zA-Z0-9\u4e00-\u9fff\u3040-\u30ff-]/g, '')
    .toLowerCase()
}

const baseComponents: Components = {
  img({ src, alt, ...props }) {
    return <img src={src} alt={alt ?? ''} loading="lazy" {...props} />
  },
  a({ href, children, ...props }) {
    const isExternal = href?.startsWith('http')
    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {children}
      </a>
    )
  },
}

function makeComponents(suppressFirstH1: boolean): Components {
  let h1Seen = false
  return {
    ...baseComponents,
    h1({ children, ...props }) {
      if (suppressFirstH1 && !h1Seen) {
        h1Seen = true
        return null
      }
      return (
        <h1 id={slugify(nodeToText(children))} {...props}>
          {children}
        </h1>
      )
    },
    h2({ children, ...props }) {
      return (
        <h2 id={slugify(nodeToText(children))} {...props}>
          {children}
        </h2>
      )
    },
    h3({ children, ...props }) {
      return (
        <h3 id={slugify(nodeToText(children))} {...props}>
          {children}
        </h3>
      )
    },
    h4({ children, ...props }) {
      return (
        <h4 id={slugify(nodeToText(children))} {...props}>
          {children}
        </h4>
      )
    },
    h5({ children, ...props }) {
      return (
        <h5 id={slugify(nodeToText(children))} {...props}>
          {children}
        </h5>
      )
    },
    h6({ children, ...props }) {
      return (
        <h6 id={slugify(nodeToText(children))} {...props}>
          {children}
        </h6>
      )
    },
  }
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const { frontmatter, body } = parseFrontmatter(content)
  const tags = frontmatter.tags as string[] | undefined
  const hasFrontmatterTitle = Boolean(frontmatter.title)

  return (
    <div className="markdown-body">
      {hasFrontmatterTitle && (
        <div className="article-header">
          <h1 className="article-header-title">
            {frontmatter.title as string}
          </h1>
          {tags && tags.length > 0 && (
            <div className="article-header-tags">
              {tags.map((tag) => (
                <span key={tag} className="article-tag">
                  {tag}
                </span>
              ))}
            </div>
          )}
          <hr className="article-header-divider" />
        </div>
      )}
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeHighlight, rehypeKatex]}
        components={makeComponents(hasFrontmatterTitle)}
      >
        {body}
      </ReactMarkdown>
    </div>
  )
}
