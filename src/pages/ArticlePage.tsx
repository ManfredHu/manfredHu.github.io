import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import TableOfContents from '@/components/TableOfContents'
import { loadMarkdown } from '@/utils/mdLoader'
import './ArticlePage.css'

type LoadState = 'idle' | 'loading' | 'success' | 'not-found' | 'error'

export default function ArticlePage() {
  const location = useLocation()
  // Hash router: location.pathname is the path after #
  // e.g. "/#/broswer/2021-12-31.broswer-render" → pathname = "/broswer/2021-12-31.broswer-render"
  const link = location.pathname

  const [content, setContent] = useState<string>('')
  const [state, setState] = useState<LoadState>('idle')

  useEffect(() => {
    if (!link || link === '/') return

    setState('loading')
    setContent('')

    loadMarkdown(link)
      .then((md) => {
        if (md === null) {
          setState('not-found')
        } else {
          setContent(md)
          setState('success')
        }
      })
      .catch((err) => {
        console.error('Failed to load markdown:', err)
        setState('error')
      })
  }, [link])

  if (state === 'loading' || state === 'idle') {
    return (
      <div className="article-state">
        <div className="article-spinner" aria-label="加载中..." />
        <p>加载中...</p>
      </div>
    )
  }

  if (state === 'not-found') {
    return (
      <div className="article-state article-state--error">
        <span className="article-state-icon">✦</span>
        <h2>文章未找到</h2>
        <p>
          路径 <code>{link}</code> 对应的文章不存在。
        </p>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="article-state article-state--error">
        <span className="article-state-icon">✖</span>
        <h2>加载失败</h2>
        <p>加载文章时发生错误，请刷新重试。</p>
      </div>
    )
  }

  return (
    <>
      <TableOfContents content={content} skipFirstH1 />
      <article className="article-page">
        <MarkdownRenderer content={content} />
      </article>
    </>
  )
}
