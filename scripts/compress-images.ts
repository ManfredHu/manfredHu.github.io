import { exec } from 'child_process'
import debug from 'debug'
import fs from 'fs'
import _sizeOf from 'image-size'
import path from 'path'
import { promisify } from 'util'
import os from 'os'

// 获取系统临时文件夹的路径
const tempDir = os.tmpdir();

const execSync = promisify(exec)
const sizeOf = promisify(_sizeOf)
const _debug = debug(`log:${path.basename(__filename)}`)

const basePath = path.resolve(__dirname, '../')
const compressLevel = 10 // ffmpeg quality support 0-51. The smaller the value, the less compression.
const widthLimit = 1021 // lock 1012px width because of github picture show limit

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
].map((j) => '.' + j)

async function filterImg(filePaths: string[]) {
  _debug('filterImg filePaths', filePaths)
  const matchExtFiles = filePaths.filter((j) => {
    if (!j) {
      return false
    }
    const ext = path.extname(j).toLowerCase()
    return handleFileExtArr.includes(ext)
  })
  _debug('filterImg matchExtFiles', matchExtFiles)
  const filesWithSize = await Promise.all(
    matchExtFiles.map(async (item) => {
      const rst = fs.statSync(item) // bytes
      const fileSizeInKB = rst.size / 1024 // KB
      const dimensions = await sizeOf(item)
      _debug(`filterImg ${item} dimension: `, dimensions)
      return {
        path: item,
        size: fileSizeInKB,
        unit: 'KB',
        width: dimensions?.width,
        height: dimensions?.height,
        orientation: dimensions?.orientation, // https://exiftool.org/TagNames/EXIF.html#:~:text=0x0112,8%20=%20Rotate%20270%20CW
        type: dimensions?.type,
      }
    })
  )
  _debug('filterImg filesWithSize', filesWithSize)
  // only fileSize > 1M need to be compress
  return filesWithSize.filter(
    (j) => !(j.size < 1024 && j?.width && j?.width <= widthLimit)
  )
}

;(async () => {
  // get new files that will commit, ignore D(delete) R(redirect) files
  const res = await execSync(`git status --short | awk '$1 == "A" || $1 == "M" {print $2}'`)
  const fileList = await filterImg(res.stdout.split('\n'))
  if (fileList.length <= 0) return
  _debug('need compress image fileList:', fileList)
  for (const item of fileList) {
    const file = item.path
    const fromPath = path.resolve(basePath, file)
    const toPath = fromPath
    // 创建目标文件的路径
    const targetPath = path.join(tempDir, path.basename(fromPath));
    fs.copyFileSync(fromPath, targetPath);
    _debug('fromPath', fromPath)
    // -i input file path
    // -q quality of picture
    // -y override file without confirm
    // -vf use Video Filter to crop pictures
    await execSync(`ffmpeg -i ${targetPath} -q ${compressLevel} -vf scale=${widthLimit}:-1 ${toPath} -y`)
    fs.unlinkSync(targetPath)
    _debug('compress image finished', fromPath, toPath)
  }
  await execSync(`git add ${fileList.map(j => j.path).join(' ')}`)
  await execSync(`git commit --amend -–no-edit`)
})()
