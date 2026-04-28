/**
 * Generate public/timestamps.json - last git commit Unix time for each article.
 * Run: esno scripts/gen-timestamps.ts
 */
import { execSync } from 'child_process'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'
import { load } from 'js-yaml'

interface NavNode {
  text: string
  link?: string
  children?: NavNode[]
}

const ROOT = resolve(__dirname, '..')

function flattenLinks(nodes: NavNode[]): string[] {
  const links: string[] = []
  for (const node of nodes) {
    if (node.link) links.push(node.link)
    if (node.children) links.push(...flattenLinks(node.children))
  }
  return links
}

const navRaw = readFileSync(resolve(ROOT, 'config/nav.yml'), 'utf-8')
const navNodes = load(navRaw) as NavNode[]
const links = flattenLinks(navNodes)

const timestamps: Record<string, number> = {}
for (const link of links) {
  // link format: "/broswer/2021-12-31.broswer-render"
  const filePath = resolve(ROOT, `.${link}.md`)
  try {
    const stdout = execSync(
      `git log -1 --pretty=format:"%at" -- "${filePath}"`,
      {
        cwd: ROOT,
        encoding: 'utf-8',
      },
    ).trim()
    if (stdout) timestamps[link] = Number(stdout)
  } catch {
    // skip files not tracked by git
  }
}

const outPath = resolve(ROOT, 'public/timestamps.json')
writeFileSync(outPath, JSON.stringify(timestamps, null, 2), 'utf-8')
console.log(
  `✓ timestamps.json generated for ${Object.keys(timestamps).length} articles → ${outPath}`,
)
