import { useEffect } from 'react'

const SITE_NAME = "ManfredHu's Blog"
const SITE_URL = 'https://manfredhu.github.io'
const DEFAULT_DESC =
  'ManfredHu 的个人博客，分享前端技术、计算机科学、效率工具与生活随笔。'
const DEFAULT_IMAGE = `${SITE_URL}/images/myself/manfredhu128.png`

interface SEOOptions {
  title?: string
  description?: string
  /** Path portion, e.g. "/js/foo". Will be appended as hash URL. */
  path?: string
  image?: string
  type?: 'website' | 'article'
}

function setMeta(
  selector: string,
  attr: string,
  value: string,
  attrName: string,
) {
  let el = document.querySelector<HTMLMetaElement>(selector)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attrName, attr)
    document.head.appendChild(el)
  }
  el.setAttribute('content', value)
}

function setNameMeta(name: string, content: string) {
  setMeta(`meta[name="${name}"]`, name, content, 'name')
}

function setPropertyMeta(property: string, content: string) {
  setMeta(`meta[property="${property}"]`, property, content, 'property')
}

export function useSEO({
  title,
  description,
  path,
  image,
  type = 'website',
}: SEOOptions) {
  useEffect(() => {
    const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME
    const pageDesc = description || DEFAULT_DESC
    const pageUrl = path ? `${SITE_URL}/#${path}` : SITE_URL
    const pageImage = image || DEFAULT_IMAGE

    document.title = pageTitle

    // Standard meta
    setNameMeta('description', pageDesc)

    // Open Graph
    setPropertyMeta('og:title', pageTitle)
    setPropertyMeta('og:description', pageDesc)
    setPropertyMeta('og:url', pageUrl)
    setPropertyMeta('og:image', pageImage)
    setPropertyMeta('og:type', type)

    // Twitter
    setNameMeta('twitter:title', pageTitle)
    setNameMeta('twitter:description', pageDesc)
    setNameMeta('twitter:image', pageImage)

    return () => {
      document.title = SITE_NAME
      setNameMeta('description', DEFAULT_DESC)
      setPropertyMeta('og:title', SITE_NAME)
      setPropertyMeta('og:description', DEFAULT_DESC)
      setPropertyMeta('og:url', SITE_URL)
      setPropertyMeta('og:image', DEFAULT_IMAGE)
      setPropertyMeta('og:type', 'website')
      setNameMeta('twitter:title', SITE_NAME)
      setNameMeta('twitter:description', DEFAULT_DESC)
      setNameMeta('twitter:image', DEFAULT_IMAGE)
    }
  }, [title, description, path, image, type])
}

/** Strip markdown formatting and return first ~155 chars as excerpt. */
export function extractExcerpt(markdownBody: string): string {
  const lines = markdownBody.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    // skip headings, blank lines, fenced code, and html tags
    if (
      !trimmed ||
      trimmed.startsWith('#') ||
      trimmed.startsWith('```') ||
      trimmed.startsWith('<') ||
      trimmed.startsWith('|') ||
      trimmed.startsWith('>')
    ) {
      continue
    }
    // Strip common markdown inline syntax
    const plain = trimmed
      .replace(/!\[.*?\]\(.*?\)/g, '')
      .replace(/\[([^\]]+)\]\(.*?\)/g, '$1')
      .replace(/`{1,3}[^`]+`{1,3}/g, '')
      .replace(/[*_~]{1,3}([^*_~]+)[*_~]{1,3}/g, '$1')
      .replace(/\s+/g, ' ')
      .trim()
    if (plain.length > 20) {
      return plain.length > 155 ? plain.slice(0, 152) + '...' : plain
    }
  }
  return DEFAULT_DESC
}
