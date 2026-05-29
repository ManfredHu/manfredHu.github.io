/**
 * Estimate reading time for a markdown article.
 *
 * Handles mixed Chinese/English content:
 *   - CJK characters are counted individually and read at ~400 chars/min.
 *   - Non-CJK text is counted as words and read at ~200 words/min.
 * The two estimates are summed and rounded up, with a floor of 1 minute.
 *
 * Code blocks, images, link URLs and HTML tags are stripped first so they
 * don't inflate the count. Pure frontend, no dependencies, no network.
 */

const CJK_CHARS_PER_MINUTE = 400
const WORDS_PER_MINUTE = 200

// Matches CJK unified ideographs, plus common Japanese kana ranges.
const CJK_REGEX = /[\u4e00-\u9fff\u3040-\u30ff\u3400-\u4dbf]/g

export interface ReadingTimeResult {
  /** Estimated reading time in minutes (at least 1). */
  minutes: number
  /** Total counted units: CJK characters + non-CJK words. */
  words: number
}

/**
 * Remove markdown noise that should not contribute to the word count.
 */
function stripMarkdownNoise(body: string): string {
  return (
    body
      // fenced code blocks ``` ... ```
      .replace(/```[\s\S]*?```/g, ' ')
      // inline code `...`
      .replace(/`[^`]*`/g, ' ')
      // images ![alt](url) — drop entirely (alt text is usually not "read")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      // links [text](url) — keep the visible text, drop the URL
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
      // raw HTML tags
      .replace(/<[^>]+>/g, ' ')
      // markdown table pipes and separators
      .replace(/\|/g, ' ')
      // heading markers, blockquote markers, list bullets
      .replace(/^[\s>#*+-]+/gm, ' ')
  )
}

/**
 * Compute reading time and word count for a markdown body
 * (frontmatter should already be removed by the caller).
 */
export function calcReadingTime(body: string): ReadingTimeResult {
  const text = stripMarkdownNoise(body)

  const cjkMatches = text.match(CJK_REGEX)
  const cjkCount = cjkMatches ? cjkMatches.length : 0

  // Remove CJK characters, then count remaining whitespace-delimited words.
  const nonCjkText = text.replace(CJK_REGEX, ' ')
  const wordMatches = nonCjkText.match(/[A-Za-z0-9]+(?:['’-][A-Za-z0-9]+)*/g)
  const wordCount = wordMatches ? wordMatches.length : 0

  const minutesRaw =
    cjkCount / CJK_CHARS_PER_MINUTE + wordCount / WORDS_PER_MINUTE
  const minutes = Math.max(1, Math.ceil(minutesRaw))

  return { minutes, words: cjkCount + wordCount }
}
