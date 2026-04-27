/**
 * All markdown files under the workspace root, keyed by their relative path.
 * e.g. "./js/2025-7-1.js-map-set-iterator.md"
 *
 * Nav link format: "/js/2025-7-1.js-map-set-iterator"
 * Key format:      "./js/2025-7-1.js-map-set-iterator.md"
 *
 * Conversion: linkToGlobKey("/js/foo") => "./js/foo.md"
 */
export const mdModules = import.meta.glob(
  '/!(node_modules|dist|src|scripts)/**/*.md',
  {
    query: '?raw',
    import: 'default',
    eager: false,
  },
)

/**
 * Convert a nav link like "/js/foo" to the glob key "/js/foo.md"
 */
export function linkToGlobKey(link: string): string {
  // link starts with "/" — glob keys also start with "/"
  return `${link}.md`
}

/**
 * Asynchronously load markdown content by nav link.
 * Returns null if not found.
 */
export async function loadMarkdown(link: string): Promise<string | null> {
  const key = linkToGlobKey(link)
  const loader = mdModules[key]
  if (!loader) {
    console.warn(`[loadMarkdown] No module found for key: ${key}`)
    console.warn(
      'Available keys (sample):',
      Object.keys(mdModules).slice(0, 10),
    )
    return null
  }
  return (await loader()) as string
}
