import fs from "fs-extra";
import { globby } from "globby";
import debug from "debug";
import path from "path";
const _debug = debug(`log:${path.basename(__filename)}`);

const basePath = path.resolve(__dirname, "../images");
const cdnUrl =
  "https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/";

function replaceImageLinks(filePath: string) {
  const fileContent: string = fs.readFileSync(filePath, "utf-8");
  const updatedContent = fileContent.replace(
    /!\[(.*?)\]\((.*?)\)/g,
    (match, p1, p2) => {
      const isRelativePath = !p2.startsWith("http") && !p2.startsWith("//");
      if (isRelativePath) {
        const imagePath = path.join(path.dirname(filePath), p2);
        const cdnLink = cdnUrl + path.relative(basePath, imagePath);
        return `![${p1}](${cdnLink})`;
      } else {
        return match;
      }
    }
  );
  _debug("updatedContent", updatedContent);
  fs.writeFileSync(filePath, updatedContent, "utf-8");
}

async function getFiles(paths: string[]) {
  const findFiles = await globby(paths);
  _debug("findFiles", findFiles);
  for (const file of findFiles) {
    replaceImageLinks(file);
  }
}

async function main() {
  const dirs = [
    "broswer",
    "cs",
    "css",
    "efficency",
    "framework",
    "html",
    "js",
    "miniprogram",
    "others",
  ];
  getFiles(dirs.map((j) => path.resolve(__dirname, "../" + j + "/**/*.md")));
}
main();
