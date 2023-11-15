import { exec } from 'child_process'
// import debug from 'debug'
import fs from 'fs'
import convert from 'heic-convert'
import path from 'path'
import { promisify } from 'util'

const execSync = promisify(exec)
// const _debug = debug(`log:${path.basename(__filename)}`)

// const getStagedFiles = async () => {
//   const { stdout } = await execSync(
//     `git status --short | awk '$1 == "A" || $1 == "M" {print $2}'`
//   )
//   return stdout
//     .split('\n')
//     .filter((filePath) => filePath.toLowerCase().endsWith('.heic'))
// }

const replaceImgFile = async (filePath: string) => {
  try {
    if (!filePath || !fs.existsSync(filePath)) {
      throw new TypeError('filePath must be string about exist file path')
    }
    const inputBuffer = await promisify(fs.readFile)(filePath)
    const outputBuffer = await convert({
      buffer: inputBuffer, // the HEIC file buffer
      format: 'JPEG', // output format
      quality: 1, // the jpeg compression quality, between 0 and 1
    })
    const fileName = path.basename(filePath, path.extname(filePath));
    const basePath = path.resolve(path.dirname(filePath), fileName + '.jpg')
    await promisify(fs.writeFile)(basePath, outputBuffer)
    execSync(`rm -f ${filePath}`)
  } catch(err) {
    throw new Error(err)
  }
}


// exec 'DEBUG=* npm run heic-transform' in cmd
;(async () => {
  const filesToProcess = process.argv.slice(2);
  // const stagedHeicFiles = await getStagedFiles()
  // _debug('stagedHeicFiles will be replaced: ', stagedHeicFiles)
  for(const item of filesToProcess) {
    await replaceImgFile(item)
  }
})()
