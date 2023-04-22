# Git 合并与撤销合并

Git 的 revert 命令可以用来撤销提交（commit），对于常规的提交来说，revert 命令十分直观易用，相当于做一次被 revert 的提交的「反操作」并形成一个新的 commit，但是当你需要撤销一个合并（merge）的时候，事情就变得稍微复杂了一些。

::: tip
因为会产生新的提交，一般 `git revert` 用于回退公共仓库这样可以同步大家的修改
:::

## Merge Commit

在描述 merge commit 之前，先来简短地描述一下常规的 commit。每当你做了一批操作（增加、修改、或删除）之后，你执行 `git commit` 便会得到一个常规的 Commit。执行 `git show <commit>` 将会输出详细的增删情况。

Merge commit 则不是这样。每当你使用 `git merge` 合并两个分支，你将会得到一个新的 **merge** commit。执行 `git show <commit>` 之后，会有类似的输出：

```bash
commit 19b7d40d2ebefb4236a8ab630f89e4afca6e9dbe
Merge: b0ef24a cca45f9
......
```

其中，Merge 这一行代表的是这个合并 **parents**，**它可以用来表明 merge 操作的线索**。

举个例子，通常，我们的稳定代码都在 master 分支，而开发过程使用 dev 分支，当开发完成后，再把 dev 分支 merge 进 master 分支：

```bash
a -> b -> c -> f -- g -> h (master)
            \      /
            d -> e  (dev)
```

上图中，`g` 是 merge commit，其他的都是常规 commit。`g` 的两个 parent 分别是 `f` 和 `e`。


### Merge Commit with `--squash`

其实我们在merge代码的时候，最好加上`--squash`参数，比如我们要master合并dev的修改

> 判断是否使用`--squash`选项最根本的标准是，待合并分支上的历史是否有意义。

```bash
# in master branch
git merge --squash dev
```

这样dev的所有修改都会同步到master上，但是此时需要额外的`git commit`来提交，这个提交的commit message会作为新的提交内容记录。一般我们分支做好开发发布后合并代码，代码合成一个commit方便做回退，而且这里可以保持commit message干净整洁

## Revert a Merge Commit
`git revert -m [parent-number]`,其中`parent-number`参数从1开始，对应需要保留的**mainline**。比如`dev`分支内容合并到`master`后提交了远程仓库，此时要想取消合并最好提交revert，其他人就不会受影响，只是认为多了一次commit。
此时的操作就是`$ git revert -m 1 [commitId]`

当你使用 `git revert` 撤销一个 merge commit 时，如果除了 commit 号而不加任何其他参数，git 将会提示错误：

```bash
$ git revert g
error: Commit g is a merge but no -m option was given.
fatal: revert failed
```

在你合并两个分支并试图撤销时，Git 并不知道你到底需要保留哪一个分支上所做的修改。从 Git 的角度来看，`master` 分支和 `dev` 在地位上是完全平等的，只是在 workflow 中，`master` 被人为约定成了「主分支」。

于是 Git 需要你通过 `m` 或 `mainline` 参数来指定「主线」。merge commit 的 parents 一定是在两个不同的线上，因此可以通过 parent 来表示「主线」。`m` 参数的值可以是 1 或者 2（从1开始），对应着 parent 在 merge commit 信息中的顺序。

以上面那张图为例，我们查看 commit `g` 的内容：

```bash
$ git show g
commit g
Merge: f e
```

那么，`$ git revert -m 1 g` 将会保留 master 分支上的修改，撤销 dev 分支上的修改。

::: tip
一般使用 `git revert -m 1 [commit-id]` 回退合并就可以了，很少有用到`-m 2的情况`，除非你需要保留分支的代码
:::

撤销成功之后，Git 将会生成一个新的 Commit，提交历史就成了这样：

```bash
a -> b -> c -> f -- g -> h -> G (master)
            \      /
            d -> e  (dev)
```

其中 `G` 是撤销 `g` 生成的 commit。通过 `$ git show G` 之后，我们会发现 `G` 是一个**常规**提交，内容就是撤销 merge 时**被丢弃**的那条线索的所有 commit 的「反操作」的合集。

## Recover a Reverted Merging

上面的提交历史在实践中通常对应着这样的情况：

工程师在 master 分支切出了 dev 分支编写新功能，开发完成后合并 dev 分支到 master 分支并上线。上线之后，发现了 dev 分支引入了严重的 bug，而其他人已经在最新的 master 上切出了新的分支并进行开发，所以不能简单地在 master 分支上通过重置（`git reset` ）来回滚代码，只能选择 revert 那个 merge commit。

但是事情还没有结束。工程师必须切回 dev 分支修复那些 bug，于是提交记录变成了这个样子：

```bash
a -> b -> c -> f -- g -> h -> G -> i (master)
            \      /
            d -> e -> j -> k (dev)
```

工程师返回 dev 分支通过 `j`，`k` 两个 commit 修复了 bug，其他工程师在 master 上有了新的提交 `i`。现在到了 dev 分支的内容重新上线的时候了。

直觉上来说，还是和之前一样，把 dev 分支合并到 master 分支就好了。于是：

```bash
$ git checkout master
$ git merge dev
```

得到的提交记录变成了这样：

```bash
a -> b -> c -> f -- g -> h -> G -> i -- m (master)
            \      /                    /
            d -> e -> j -> k ---------    (dev)
```

`m` 是新的 merge commit。需要注意的是，这**不能**得到我们期望的结果。因为 `d` 和 `e` 两个提交曾经被丢弃过，如此合并到 master 的代码，并不会重新包含 `d` 和 `e` 两个提交的内容，相当于只有 dev 上的新 commit 被合并了进来，而 dev 分支之前的内容，依然是被 revert 掉了。

::: warning
这里需要特别注意，特别是又要合并的时候
:::

所以，如果想恢复整个 dev 所做的修改，应该：

```bash
$ git checkout master
$ git revert G
$ git merge dev
```

于是，提交历史变成了这样：

```bash
a -> b -> c -> f -- g -> h -> G -> i -> G' -- m (master)
            \      /                          /
            d -> e -> j -> k ---------------    (dev)
```

其中 `G'` 是这次 revert 操作生成的 commit，把之前撤销合并时丢弃的代码恢复了回来，然后再 merge dev 分支，把解 bug 写的新代码合并到 master 分支。

现在，工程师可以放心地上线没有 bug 的新功能了。

## 实际项目记录

```bash
➜  node-cc git:(master) git revert 5131937f111c3cd7cc9ba28657a6cf32b513ee26
error: commit 5131937f111c3cd7cc9ba28657a6cf32b513ee26 is a merge but no -m option was given.
fatal: revert failed

➜  node-cc git:(master) git revert -m 1 5131937f111c3cd7cc9ba28657a6cf32b513ee26
"master b936bd6] Revert "Merge branch 'paymentNoticeApi' into 'master'
 1 file changed, 1 insertion(+)
```
