import fs from 'fs-extra'
import { globby } from 'globby'
import debug from 'debug'
import path from 'path'
const _debug = debug(`log:${path.basename(__filename)}`)

const basePath = path.resolve(__dirname, '../images')
// Site-relative prefix. Images live in `/images/` (copied to dist root at
// build time and served at the same path in dev), so same-origin requests
// go through GitHub Pages' own CDN instead of slow raw.githubusercontent.com.
const SITE_IMG_PREFIX = '/images/'
// Legacy CDN links that should be rewritten back to site-relative paths.
// Matches any branch, e.g. .../manfredHu.github.io/master/images/foo.png
const RAW_GH_RE =
  /^https?:\/\/raw\.githubusercontent\.com\/ManfredHu\/manfredHu\.github\.io\/[^/]+\/images\/(.+)$/i

function toSitePath(relativeFromImages: string): string {
  // Normalize Windows separators and avoid double slashes.
  const normalized = relativeFromImages.split(path.sep).join('/')
  return SITE_IMG_PREFIX + normalized.replace(/^\/+/, '')
}

function replaceImageLinks(filePath: string) {
  const fileContent: string = fs.readFileSync(filePath, 'utf-8')
  let changed = false
  const updatedContent = fileContent.replace(
    /!\[(.*?)\]\((.*?)\)/g,
    (match, p1, p2) => {
      // 1) Already a site-relative image path — leave as-is.
      if (p2.startsWith(SITE_IMG_PREFIX)) {
        return match
      }
      // 2) Legacy raw.githubusercontent link → site-relative path.
      const rawMatch = p2.match(RAW_GH_RE)
      if (rawMatch) {
        changed = true
        return `![${p1}](${toSitePath(rawMatch[1])})`
      }
      // 3) Other external links (http/protocol-relative) — leave untouched.
      if (p2.startsWith('http') || p2.startsWith('//')) {
        return match
      }
      // 4) Relative path → resolve against the file, then make site-relative.
      const imagePath = path.join(path.dirname(filePath), p2)
      changed = true
      return `![${p1}](${toSitePath(path.relative(basePath, imagePath))})`
    },
  )
  if (changed) {
    _debug('updatedContent', filePath)
    fs.writeFileSync(filePath, updatedContent, 'utf-8')
  }
}

async function getFiles(paths: string[]) {
  const findFiles = await globby(paths)
  _debug('findFiles', findFiles)
  for (const file of findFiles) {
    replaceImageLinks(file)
  }
}

async function main() {
  // Match the same content set the app serves (see src/utils/mdLoader.ts):
  // every .md outside infra/source folders.
  const root = path.resolve(__dirname, '..')
  await getFiles([
    path.resolve(root, '**/*.md'),
    `!${path.resolve(root, 'node_modules/**')}`,
    `!${path.resolve(root, 'dist/**')}`,
    `!${path.resolve(root, 'src/**')}`,
    `!${path.resolve(root, 'scripts/**')}`,
    `!${path.resolve(root, 'public/**')}`,
    `!${path.resolve(root, 'README.md')}`,
    `!${path.resolve(root, 'readme.md')}`,
  ])
}
main()
