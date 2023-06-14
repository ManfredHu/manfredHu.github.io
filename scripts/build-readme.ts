import fs from 'fs'
import debug from 'debug'
import path from 'path'
import yaml from 'yaml'
import { promisify } from 'util'
import { exec } from 'child_process'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);  // 加载相对时间插件
const execCb = promisify(exec)
const basePath = 'https://github.com/ManfredHu/manfredHu.github.io/blob/master'
const _debug = debug(`log:${path.basename(__filename)}`)
const root = path.resolve(__dirname, '../')
function getFileRealPath(filePath: string) {
  return path.resolve(root, `./${filePath}.md`)
}

// async function getFilesByRank() {
//   const packages = await globby(questionGlob);

//   const fileWithRank = packages.reduce((acc: FilesByRank, cur: string) => {
//     const level = cur.split("/")[1].split("-")[1] as Rank
//     if (!acc[level]) acc[level] = [];
//     acc[level]!.push(cur);
//     return acc;
//   }, allQuestionsWithRank);

//   _debug(fileWithRank)
//   return fileWithRank;
// }

// function genREADMECatalgory(data: FilesByRank) {
//   let text = ''
//   for (const [rank, filePathArr] of Object.entries(data)) {
//     text += toBadgeLink(basePath, rank, String(filePathArr.length), DifficultyColors[rank]) + '<br />'

//     filePathArr.map(i => {
//       const [num, questionRank, questionName] = path.basename(i, '.ts').split('-')
//       text += toBadgeLink(basePath + i, '', `${parseInt(num)}・${questionName}`, DifficultyColors[questionRank])
//     })

//     text += '<br />'.repeat(2)
//   }
//   return text
// }

async function insertInfoReadme(filepath: string, replacedText: string) {
  if (!fs.existsSync(filepath)) return
  let text = fs.readFileSync(filepath, 'utf-8')

  // [\s\S]* match any character, but .* will block with \n
  text = text.replace(
    /<!-- Here with topic and answer list start -->[\s\S]*<!-- Here with topic and answer list end -->/,
    '<!-- Here with topic and answer list start -->' +
      '\n' +
      replacedText +
      '\n' +
      '<!-- Here with topic and answer list end -->'
  )

  fs.writeFileSync(filepath, text, 'utf-8')
}



/**
 * Get File Last Commit Unix Time
 * @param filePath file path
 * @returns unix timestamp last commit
 */
async function getFileLastCommitUnixTime(filePath: string) {
  try {
    const { stdout } = await execCb(
      `git log -1 --pretty=format:"%at" -- ${getFileRealPath(filePath)}`
    )
    return Number(stdout.trim())
  } catch (err) {
    throw err
  }
}

let toc = ''

type TOC = {
  text: string
  link?: string
  children?: TOC[]
}

/**
 * gen TOC
 * @param {TOC} tocList TOC List
 * @param {number} level deep recursion tag
 * @returns {string} TOC string
 */
async function generateTOC(tocList: TOC[], level = 0) {
  for (const obj of tocList) {
    if (obj.text) {
      const prefix = '  '.repeat(level)
      let textLink = prefix
      if (obj.link) {
        if (!fs.existsSync(getFileRealPath(obj.link))) {
          throw new Error(`file ${getFileRealPath(obj.link)} not exist`)
        }
        const commitTime = await getFileLastCommitUnixTime(obj.link)
        const updatTimeStr = `updated ${dayjs.unix(commitTime).fromNow()}`
        textLink += `- [${obj.text}](${basePath}${obj.link}.md) ⌚️${updatTimeStr}\n`
      } else {
        textLink += `- ${obj.text}\n`
      }
      toc += textLink
    }
    if (obj.children) {
      await generateTOC(obj.children, level + 1)
    }
  }

  return toc
}

async function main() {
  const navFilePath = path.resolve(__dirname, '../config/nav.yml')
  const content = await fs.readFileSync(navFilePath, 'utf-8')
  const nav = yaml.parse(content)
  _debug('nav:', JSON.stringify(nav, null, 2))
  const tocStr = await generateTOC(nav)
  _debug('TOC:', tocStr)
  insertInfoReadme(path.resolve(__dirname, '../readme.md'), tocStr)
}
main()
