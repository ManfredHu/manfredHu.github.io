import fs from 'fs'
import debug from 'debug'
import path from 'path'
import yaml from 'yaml'

const basePath = 'https://github.com/ManfredHu/manfredHu.github.io/blob/master'
const _debug = debug(`log:${path.basename(__filename)}`)

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
  text = text
    .replace(
      /<!-- Here with topic and answer list start -->[\s\S]*<!-- Here with topic and answer list end -->/,
      '<!-- Here with topic and answer list start -->'
      + '\n'
      + replacedText
      + '\n'
      + '<!-- Here with topic and answer list end -->',
    )

  fs.writeFileSync(filepath, text, 'utf-8')
}

type TOC = {
  text: string,
  link?: string,
  children?: TOC[],
}

let toc = '';
const root = path.resolve(__dirname, '../');
function generateTOC(tocList: TOC[], level = 0) {
  for(const obj of tocList) {
    if (obj.text) {
      const prefix = '  '.repeat(level)
      let textLink = prefix
      if (obj.link) {
        if (!fs.existsSync(path.resolve(root, `./${obj.link}.md`))) {
          throw new Error(`file ${path.resolve(root, `./${obj.link}.md`)} not exist`)
        }
        textLink += `- [${obj.text}](${basePath}${obj.link}.md)\n`;
      } else {
        textLink += `- ${obj.text}\n`
      }
      toc += textLink;
    }
    if (obj.children) {
      generateTOC(obj.children, level + 1);
    }
  }

  return toc;
}

async function main() {
  const navFilePath = path.resolve(__dirname, '../config/nav.yml')
  const content = await fs.readFileSync(navFilePath, 'utf-8')
  const nav = yaml.parse(content)
  _debug('nav:', JSON.stringify(nav, null, 2))
  const tocStr = generateTOC(nav)
  _debug('TOC:', tocStr);
  insertInfoReadme(path.resolve(__dirname, '../readme.md'), tocStr)
}
main()