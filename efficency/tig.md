# zen·工作环境搭建之git篇之tig
tig是一个图形化git命令行工具，将很多操作简化了，如果你使用的是的VIM或者你对linux的操作有了解，那么它可以很好帮助你提高开发效率。众所周知，很多开发任务并行时候，环境切来切去是很费时间的。对于工具来说，tig上手成本足够低

## [tig](https://jonas.github.io/tig/)
就是git反过来写，很强大的终端图形化git管理工具。

主要是熟悉几个命令， `Ctrl+C` 可以退出交互

### 安装

:::: code-group
::: code-group-item Mac
```bash
brew update
brew install tig
```
:::
::: code-group-item CentOS
```bash
sudo yum update
sudo yum install tig
```
:::
::: code-group-item Ubuntu
```bash
sudo apt-get update
sudo apt-get install tig
```
:::
::::

### 视图
有这么几种视图模式

### m mainView(默认视图)
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/mdm0UQ.png)

### s statusView
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/n6MiDI.png)

自上而下分别是
- 需要提交的文件，可以按`C`提交
- 有追踪未提交的文件
- 新增未追踪的文件
### r refs
感觉类似git branch，方便查看所有分支。加上`/`的搜索，`n/N`切换上下可以很快定位到你需要的分支

### y stash
中文应该翻译为储藏区，比如要将本地修改但是不需要提交的文件缓存，方便bugfix后回来恢复现场

### d diffView
类似git diff

### l logView
类似git log

其他的可以看`tig h`帮助文档

### 分屏操作
查看信息的时候会发现会自动分左右两块屏幕，可以通过`Tab`切换左右两块屏幕的视图

也可以在选中右侧屏幕时，按住`shift`+上下切换(`j/k`)来固定右分屏切换左侧分屏选择信息

#### [指南](https://devhints.io/tig)

```bash
tig status # 进入status视图，会注明 Untracked files/Changes not staged for commit/Changes to be committed 的文件
tig blame <file> # 查询文件的每一行最后修改信息
tig <branchname> # 查看某个分支的提交信息
tig <oldBranch>..<newBranch> # 查看两个分支的diff
tig <filename> # 查看某个文件的提交历史
```

需要结合常见的vim光标移动和翻页操作

```bash
hjkl 左下上右
ctrl+d down下翻半页
ctrl+u up上翻半页
空格 下翻一页
- 上翻一页
@ 代码块粒度滚动
```

### 常见操作

#### add/unadd
常见的，可以这么几步
1. `tig`后`s` 进入status View
2. 选择文件后按`u`，可以将文件加入staged，也可以将staged的文件移出

#### commit/uncommit
上面进入status View后，staged的文件，按`C`可以进入Commit，然后`i`输入commit message后`:x`保存退出就可以了

> 顺手查了下`:x`和`:wq`的区别: `:wq`会强制写入文件，就算内容没变化也会改mtime，而`:x`比较智能内容不变化mtime不变

#### switch branch
进入tig的refs视图，选择好分支后`C`检出分支即可
```
Run `git checkout aftersale`? [Yy/Nn]
```
输入`y`即可

#### stash(@todo)
当然上面你会说有文件要先存一下再去切换分支做bugfixs，可以用到stash
stash一般翻译为暂存区，就是缓存文件的一个区域

##### 存
```bash
gsta # git plugin缩写
git stash push # git stash push -u,-u 参数是包含未跟踪的文件
```
通过git plugin的快捷键操作

##### 取
`tig`+`y` 进入stashView, 通过`P`将暂存区的内容应用到本地

```bash
A ?git stash apply %(stash)
P ?git stash pop %(stash)
! ?git stash drop %(stash)
```
### 搜索
`/`进入搜索，`n/N`选择下/上一个搜索对象

### revert

有时候要丢弃工作区的修改，可能会用`git checkout -- .`或者`git reset HEAD`来恢复整个工作区

有了tig可以直接在status View直接按`!`，会提示你是否revert，输入`y`即可

```
Are you sure you want to revert changes? [Yy/Nn]
```

### diff branch
比较两个分支的不同，比如当前在B分支已经合并了master，需要与master分支比对

```bash
tig master..B # 可省略为下面的写法，因为当前为B分支
tig master..
```

此时跟`git diff`视图类似，会列出B分支多出来的commit，这时输入`f`会进入查找，输入`d`会进入diff view，都会列出所有的改动文件列表