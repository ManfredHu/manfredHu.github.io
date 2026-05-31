import './ArticleSkeleton.css'

/**
 * Skeleton placeholder shown while an article's markdown is loading,
 * mimicking the real article layout (title, meta, paragraphs) to reduce
 * perceived loading time.
 */
export default function ArticleSkeleton() {
  return (
    <article className="article-skeleton" aria-label="加载中" aria-busy="true">
      <div className="article-skeleton-title skeleton" />
      <div className="article-skeleton-meta">
        <span className="article-skeleton-pill skeleton" />
        <span className="article-skeleton-pill skeleton" />
        <span className="article-skeleton-pill article-skeleton-pill--wide skeleton" />
      </div>
      <div className="article-skeleton-divider" />

      {[0, 1, 2].map((block) => (
        <div className="article-skeleton-block" key={block}>
          <div className="article-skeleton-line skeleton" />
          <div className="article-skeleton-line skeleton" />
          <div className="article-skeleton-line skeleton" />
          <div className="article-skeleton-line article-skeleton-line--short skeleton" />
        </div>
      ))}

      <div className="article-skeleton-image skeleton" />

      <div className="article-skeleton-block">
        <div className="article-skeleton-line skeleton" />
        <div className="article-skeleton-line skeleton" />
        <div className="article-skeleton-line article-skeleton-line--short skeleton" />
      </div>
    </article>
  )
}
