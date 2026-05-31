import { useEffect, useState } from 'react'
import Giscus from '@giscus/react'
import { giscusConfig, isGiscusConfigured } from '@/config/giscus'
import './Comments.css'

interface CommentsProps {
  /** Discussion mapping key. Defaults to the current pathname via giscus. */
  term?: string
}

export default function Comments({ term }: CommentsProps) {
  const [loaded, setLoaded] = useState(false)

  // Giscus posts a message from its iframe once it has rendered.
  // Listen for the first such message to hide the loading skeleton.
  useEffect(() => {
    if (!isGiscusConfigured()) return
    setLoaded(false)

    function handleMessage(event: MessageEvent) {
      if (event.origin !== 'https://giscus.app') return
      if (
        event.data &&
        typeof event.data === 'object' &&
        'giscus' in event.data
      ) {
        setLoaded(true)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [term])

  if (!isGiscusConfigured()) {
    if (import.meta.env.DEV) {
      return (
        <section className="comments comments--unconfigured">
          <p>
            💬 评论系统未配置。请在 <code>src/config/giscus.ts</code> 中填入{' '}
            <code>repoId</code> 与 <code>categoryId</code>。
          </p>
        </section>
      )
    }
    return null
  }

  return (
    <section className="comments" aria-label="评论">
      <h2 className="comments-title">评论</h2>
      {!loaded && (
        <div className="comments-skeleton" aria-hidden="true">
          <div className="comments-skeleton-box skeleton" />
          <div className="comments-skeleton-line skeleton" />
          <div className="comments-skeleton-line skeleton" />
          <div className="comments-skeleton-line comments-skeleton-line--short skeleton" />
        </div>
      )}
      <div
        className={
          loaded ? 'comments-frame' : 'comments-frame comments-frame--hidden'
        }
      >
        <Giscus
          id="comments"
          repo={giscusConfig.repo}
          repoId={giscusConfig.repoId}
          category={giscusConfig.category}
          categoryId={giscusConfig.categoryId}
          mapping={term ? 'specific' : giscusConfig.mapping}
          term={term}
          strict={giscusConfig.strict}
          reactionsEnabled={giscusConfig.reactionsEnabled}
          emitMetadata={giscusConfig.emitMetadata}
          inputPosition={giscusConfig.inputPosition}
          theme={giscusConfig.theme}
          lang={giscusConfig.lang}
          loading="lazy"
        />
      </div>
    </section>
  )
}
