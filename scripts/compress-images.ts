import fs from "fs-extra";
import { globby } from "globby";
import debug from "debug";
import path from "path";
import { exec } from "child_process";
import { promisify } from 'util'
const execSync = promisify(exec)
const _debug = debug(`log:${path.basename(__filename)}`);

const basePath = path.resolve(__dirname, "../");
const compressLevel = 10 // ffmpeg quality support 0-51. The smaller the value, the less compression.

// for ffmpeg support
const handleFileExtArr = [
  'jpg',
  'png',
  'jpeg',
  'gif',
  'bmp',
  'tiff',
  'webp',
  // 'tga',
  // 'ico',
  // 'exr',
  // 'psd',
  // 'dds'
].map(j => "." + j)

;(async() => {
  // get files that will commit
  const res = await execSync("git status --short | awk '{print $2}'")
  const fileList = res.stdout.split("\n").filter(j => {
    if (!j) {
      return false
    }
    const ext = path.extname(j).toLowerCase()
    return handleFileExtArr.includes(ext)
  })
  _debug("fileList", fileList)
  for (const file of fileList) {
    const fromPath = path.resolve(basePath, file)
    const toPath = fromPath
    _debug('fromPath', fromPath)
    // -i input file path
    // -q quality of picture
    // -y override file without confirm
    await execSync(`ffmpeg -i ${fromPath} -q ${compressLevel} ${toPath} -y`)
    _debug('compress image finished', fromPath, toPath)
  }
  await execSync(`git commit -am ${fileList.join(' ')} –no-edit`)
})()