# 1 分钟让你拥有规范的 git log

![change log](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/keepAChangelog.png)

从规范化提交说起，我们现在用的熟悉的 git，可能刚开始会不知道提交的时候要写点什么，后面写多了之后，干脆啥都不写直接提交。
我们通常称为无注释的提交。其实有些情况下的注释，不看好过看，你觉得呢？如下图，是无意思的提交，我就是想提交但是我不知道我应该写一些什么说明。或者是说明已经写多了又没什么作用，懒得写了。

![git log demo first](https://image-static.segmentfault.com/ae/8e/ae8ed4a8a2e4f68791bec018c3e1b689_articlex)
![git log demo second](https://image-static.segmentfault.com/48/fb/48fb949b3bbf3c007464fabef6d39a90_articlex)

我们可以再看下 vue 项目的提交记录。链接可以戳[这里](https://github.com/vuejs/vue/commits/dev)

## vue 的规范化提交

![vue git log](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/vueGitLog.jpg)

这里可以看到其实别人家的注释写的还是很规范的，那么，我们翻下他们的 package.json 看看他们是怎么做的。
可以点击[这里](https://github.com/vuejs/vue/blob/dev/package.json)

找找找，看到了一句。

```json
"scripts": {
    "commit": "git-cz"
}
```

就是运行`npm run commit`的时候实际跑的是`npx git-cz`。那么我们找找看 vue 的 dev 引用

```json
"devDependencies": {
    "commitizen": "^2.9.6",
    "conventional-changelog": "^1.1.3"
}
```

有这么两句，其实是用到了两个包。[commitizen](https://github.com/commitizen/cz-cli)和[conventional-changelog](https://github.com/conventional-changelog/conventional-changelog)

## 规范化提交的好处

那么我们接下来思考一个问题，这么做有什么好处呢？
很显然，这样做可以让人一样看到你的提交说明，比如`fix(ssr): support rendering comment (#9128)`这句，肯定是修复了#9128 这个问题的 ssr 服务端渲染的支持注释的写法。

而且，如果你用的规范化提交下来，你的 changelog 是可以自动生成的。版本发布的时候也不用特意去收集什么版本信息了。你的 commit 就是发布信息。

再者，你的提交时间并不会延长，因为你有小工具，你做的是选择题，而不是填空题。难度大大降低。

1. 他人容易理解你的提交说明，沟通效率高
2. 自动生成 changelog，减少工作量
3. 不会再陷入不知道怎么说明的尴尬境界
4. 提高自己的编程素养，让自己愉悦

## 规范化提交怎么做？

我个人总结了下，其实很简单的。三板斧解决。

### 1.安装 commitizen 和 cz-conventional-changelog

```bash
npm install commitizen cz-conventional-changelog --save-dev
```

如果你要用[conventional-changelog](https://github.com/conventional-changelog/conventional-changelog)也可以

### 2.初始化配置

```bash
npx commitizen init cz-conventional-changelog --save-dev --save-exact
```

### 3.增加 npm run commit 到 script

package.json

```json
"scripts": {
	"commit": "npx git-cz"
}
```

当全部配置完成后，你只需要两句命令就可以代替不知道写什么提交说明的尴尬处境了。

```bash
git add .
npm run commit
```

会有东西让你选择，如下图。
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/gitczDemo.jpg)
