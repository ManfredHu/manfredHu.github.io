
# zen·工作环境搭建之git篇之Lazygit

这是git工具的最终篇，主要是Lazygit已经满足日常开发几乎所有要求了

1. 足够轻量，不占用系统资源，特别是内存
2. 足够便捷，包含日常操作而不需要打一堆命令
3. 快捷键齐全，最好切个分支1s内完成

git本身的命令行工具比较薄弱，交互太烂。而VSCode的git管理工具偶尔失灵，比如大文件diff的时候经常卡住，毕竟是个GUI软件，IDE要兼顾的东西太多了，大文件要先AST解析一遍再高亮代码解析肯定不如纯命令行响应速度快。

图形化的软件如SourceTree，腾讯内的UGit，其实都挺好用。网上能下到的也挺多的，比如[fork](https://fork.dev/)。但是要长期开启一个软件其实还不是非常方便，所以会用终端图形化git管理工具会非常高效，且保证你在每个公司都能一套配置打天下

## [Lazygit（推荐）](https://github.com/jesseduffield/lazygit)
一个比tig更好用的git图形化工具

> 中文文档: [https://gitcode.gitcode.host/docs-cn/lazygit-docs-cn/Config.html](https://gitcode.gitcode.host/docs-cn/lazygit-docs-cn/Config.html)

### brew安装
```bash
brew install lazygit
```

其他安装方式请自行查阅文档

`~/.bashrc`设置别名，执行完`source`一下生效

```bash
alias lg="lazygit"
```

## 帮助 & 查阅快捷键

`x` 快捷键可以调出help面板，一些功能的快捷键也可以快速找到

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/FWYBZg.png)

## 使用

### 区块切换 1-5/tab
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/fuvNdT.png)

- 数字`1-5`在区块间切换
- `tab`区块切换
- `h/l`也可以在上一个/下一个区块间切换
- `q`退出
- `x`菜单


`[]`(中括号键)可以在Branches面板里切换

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/9DcKdQ.png)

### 新建和切换分支/分支同步远端
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/LkMaen.png)
branch区块，`n`就可以创建新的分支，输入分支名就好了


![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/jVgIyf.png)

- `P`可以推送分支,`git push`
- `p`可以拉取分支,`git pull`
- 选择分支后 `f` 可以同步远端修改,`git fetch`

比如我们经常需要rebase主分支（假设是master，那么可以很快操作），选择master后按`f`即可完成拉取。再按`r`即可进行rebase

### git add
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/131FOv.png)

- j(▲)/k(▼)在文件树上下切换
- H/L在文件树左右移动，主要针对窗口显示不下的情况

对应操作如下

- a: add staged
- d: unstaged

如果要针对某一行做add，可以回车进入文件，选中某行后空格做**add staged**操作。同理`a`可以选中单文件全部修改，一起操作，跟VSCode里git面板操作一样一样的。

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/g0ccv8.png)

也可以**tab**切换面板，用 **`d`** 做unstaged操作
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/e0HzC3.png)

### 如何add某一行？

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/BNoPLY.png)

可以enter进入文件详情后
- 选择需要的行选中按空格add
- V进入visual模式（vim操作），可以j/k选择需要的行，然后一起按空格进行行批量添加

如果需要取消可以到Staged Changes部分，同理选择一行或者V选择多行，按**d**就可以进行unstatged操作了。

### 如何放弃某行修改
文件详情里，Unstaged Changes面板中，选中对应的代码行后`d`删除这一行的修改，回车确认即可，有提醒可以注意下

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/alB9Z4.png)

选中文件后按 **`d`**，则可以放弃一个文件的全部修改

### 如何放弃全部修改
files区块，按 **`d`** 即可

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/fgZCBd.png)

更加多的功能

`D`会有更多的功能，比如需要删除文件并且清除git记录，如图所示第一个会将本地的文件回退到上一次commit的状态，并且所有的git操作也清空。

如果需要直接清空本地修改，选第一个选项 **nuke working tree**，本地修改都会还原
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/srFKF5.png)

### 如何unadd
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/Z06YfB.png)

tab可以切换到Stage视图，然后**空格**或者**d**取消add操作，同理可以**V**选中多行操作

### git commit
block聚焦Files（第二块），直接输入**c**就可以了，会弹出输入框输入commit message后直接提交

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/nwKWS9.png)

### Amend Commit

同理，`git commit --amend`可以通过 **`A`** 来实现

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/cpEH4k.png)

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/wYRthh.png)

### Revert Commit
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/ClEaRf.png)

选中commit后 **t** 可以revert commit，即创建一个新的commit抵消原有的commit，内容完全一致commit保留
一般是提交公共分支后需要回退修改之类的操作，rebase会让协作的同学很麻烦（比如大家改到了同个地方），而convert不会。主干分支原则上不允许rebase，回退需要保留记录，此时用revert最合适。

### checkout branch
选中分支后`<space>`空格键检出，最简单的方式了。当然如果本地有未提交的代码，会有提示，Lazygit可以将本地的文件自动stash，然后在新分支apply。
对应操作：https://www.youtube.com/watch?v=CPLdltN7wgE&t=613s

也可以选中分支后按`F`，就是`git reset`，配合soft/mixed/hard选项，省略敲命令的过程

也可以按`c`输入分支名检出

### branch merge
在源分支(from) -> 目标分支(target)操作过程中，可以通过选择待合并分支后，按 `M` 进行merge操作

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/0lktrz.png)

### git reset
移动到4 Commits视图，输入**g**就可以了

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/rm9z8p.png)

也可以到commit面板的的Reflog检出，比如reset后Commit面板没有的

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/tsCQKp.png)

按`g`可以检出
### cherry pick
> cherry-pick 基本概念 [ruanyifeng git-cherry-pick](https://www.ruanyifeng.com/blog/2020/04/git-cherry-pick.html) 可以看下

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/2Ii41U.png)

到Commit区块后，空格就可以应用选择的commit了。注意这里cherry-pick时候本地不能有没有提交的内容

#### 把某个commit应用到其他分支

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/nMYUM8.png)

比如把上图test分支最新的commit合入master分支，可以这么操作

1. 选择commit后`c(copy commit)/C(copy commit range)`，都是cherry-pick的操作
2. 按**3**回到Branch面板按**空格**切换分支到master
3. 按**4**到Commits面板，按`v`粘贴

通过如上三步可以把一个commit同步到不同分支

#### 把某行修改做修改

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/tbAT6q.png)

如上，Commit面板选择commit回车选择文件回车，选定范围后`Control+p`调出面板，可以把patch还原，也可以移动到工作区或者新的commit
### rebase interactive

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/JPNJet.png)

处理rebase信息后`m`可以选择continue或者skip等继续操作


比如下面常见case，需要删除一个commit但是保留内容变更
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/rpLBIv.png)
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/db35798e-0be6-4628-ad6b-6d6c4b6999ea.jpeg)
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/kNfPWe.png)
可以发现最后fixup合并的内容都到5这个commit里了, rebase后的内容推送remote需要用`push -f`

### Rebase
选择分支后按`r`就可以rebase branch了，如下图等价于`git rebase master`。如果有冲突可以解决冲突后回车continue

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/RNrXOl.png)

同时，选中commit的时候`control+j/k`可以移动commit的上下位置。rebase的含义如下

- **p**, pick <提交> = 使用提交
- **r**, reword <提交> = 使用提交，但修改提交说明
- **e**, edit <提交> = 使用提交，进入 shell 以便进行提交修补
- **s**, squash <提交> = 使用提交，但融合到前一个提交
- **f**, fixup <提交> = 类似于 "squash"，但丢弃提交说明日志
- **x**, exec <命令> = 使用 shell 运行命令（此行剩余部分）
- **b**, break = 在此处停止（使用 'git rebase --continue' 继续变基）
- **d**, drop <提交> = 删除提交

### 合并commit - fixup or Squash
[如何借助fixup与autosquash让Git分支保持整洁](http://lazybios.com/2017/01/git-tip-keep-your-branch-clean-with-fixup-and-autosquash/)

fixup和squash区别：fixup是合并相邻两次commit,squash一般是合并一大片commit
#### fixup
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/aiXHll.png)
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/QHUqrG.png)
可以看到跟`git commit --fixup <commitId>`效果是一样的

123
#### Squash
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/l1DDMr.png)
可以看到跟`git rebase -i --autosquash <commitId>`效果是一样的

### push/pull
- p: pull files
- P: push files

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/WWZUVG.png)

### Stash/Pop Stash
比如像暂存一些东西方便去其他分支做bugfix之类的

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/LO7AlY.png)

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/PcPlXu.png)

- 也可以 **`g`** 取出来stash的东西（会删除stash）
- 如果不希望删除可以按 **空格**，则可以取出stash而不删除
- 可以直接 **`d`** 删除某个stash

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/VBc0EV.png)

### 回滚代码
通过commit面板找到需要回滚的部分，然后`d`回滚这次的修改


### 查看某个文件的修改历史 filtering
追责或者想找出谁修改了某个文件的时候特别有用

在Commit面板选择文件后`ctrl+s`，会输出对这个文件所有修改的记录

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/PZh1r1.png)
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/P4bIc6.png)

### 查看两次commit的diff

在commits面板，`W`显示diff选项，选择后commitId变为粉红色

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/LgtyD4.png)

### 分支diff

比如我有两个分支, master主干和 feat/lazygit_update 特性分支. 

选择分支后按 `ctrl+e` 进入diff 模式

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/20230530-165321.jpeg)
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/Xnip2023-05-30_16-54-51.png)


### 解决冲突
这个工具有个不好的地方就是，没找到文档或者官网，只有github一个渠道。from https://github.com/jesseduffield/lazygit#resolving-merge-conflicts
![](https://github.com/jesseduffield/lazygit/raw/assets/resolving-merge-conflicts.gif)

## 参考
- [快捷键](https://github.com/jesseduffield/lazygit/blob/master/docs/keybindings/Keybindings_zh.md)
- [用最高效的工具，学会Git最强的功能 —— 命令行神器 Lazygit](https://www.bilibili.com/video/BV1gV411k7fC)