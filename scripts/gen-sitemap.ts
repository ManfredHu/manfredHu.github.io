/**
 * Generate public/sitemap.xml from config/nav.yml
 * Run: esno scripts/gen-sitemap.ts
 */
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { load } from 'js-yaml'

interface NavNode {
  text: string
  link?: string
  children?: NavNode[]
}

const SITE_URL = 'https://manfredhu.github.io'
const ROOT = resolve(__dirname, '..')

function flattenLinks(nodes: NavNode[]): string[] {
  const links: string[] = []
  for (const node of nodes) {
    if (node.link) {
      links.push(node.link)
    }
    if (node.children) {
      links.push(...flattenLinks(node.children))
    }
  }
  return links
}

const navRaw = readFileSync(resolve(ROOT, 'config/nav.yml'), 'utf-8')
const navNodes = load(navRaw) as NavNode[]
const links = flattenLinks(navNodes)

const today = new Date().toISOString().slice(0, 10)

const urlEntries = [
  // Homepage
  `  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`,
  // Articles (hash URLs)
  ...links.map(
    (link) => `  <url>
    <loc>${SITE_URL}/#${link}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`,
  ),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries.join('\n')}
</urlset>
`

const outPath = resolve(ROOT, 'public/sitemap.xml')
writeFileSync(outPath, sitemap, 'utf-8')
console.log(
  `✓ sitemap.xml generated with ${links.length + 1} URLs → ${outPath}`,
)
