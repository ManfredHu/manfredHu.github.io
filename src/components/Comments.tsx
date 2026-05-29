import Giscus from '@giscus/react'
import { giscusConfig, isGiscusConfigured } from '@/config/giscus'
import './Comments.css'

interface CommentsProps {
  /** Discussion mapping key. Defaults to the current pathname via giscus. */
  term?: string
}

export default function Comments({ term }: CommentsProps) {
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
    </section>
  )
}
