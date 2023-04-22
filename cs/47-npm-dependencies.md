# npm 的 dependencies（http,git,ssh）

![npm version](../images/npm-dependencies.jpeg)

# 版本号

`npm install xxx` 大家都知道，一般版本号会以类似`1.2.3`这样三位表示，具体的，第一位的 1 表示主版本号 major，第二位是次版本号 minor，第三位是修补版本 patch。
比如 vue 的 package.json 有这么一段

```json
{
  "devDependencies": {
    "typescript": "^3.1.3",
    "webpack": "~4.28.4",
    "weex-js-runtime": "^0.23.6",
    "weex-styler": "^0.3.0",
    "yorkie": "^2.0.0"
  }
}
```

其中，webpack 的版本为`"~4.28.4"`，前面的波浪号与其他的`^`确实不同。

## 版本号前缀^和~的区别

> `^`和`~`的区别如下
>
> - ~会匹配最近的小版本依赖包，比如~4.28.4 会匹配所有 4.28.x 版本，但是不包括 4.29.x
> - ^会匹配最新的大版本依赖包，比如^3.1.3 会匹配所有 3.x.x 的包，包括 3.2.0，但是不包括 4.0.0

自动升级最后一位版本号可以看我之前写的[npm version 升级版本号](https://manfredhu.com/2019/03/30/46-npm-version/)

## 模块名和命令行执行命令不一定一样

写过 npm 模块的同学会发现，大部分的命令行全局模块，如 vue 跟 npm 的模块名是一样的，都是 vue。但是有的是不一样的，比如
[egg-ts-helper](https://github.com/whxaxes/egg-ts-helper)提供的生成 ts 类型的辅助工具，命令行为`ets`，是通过 package.json 的 bin 属性来定义的。如果这里定义了一样的就是一样的命令，但是偏偏有的名字长的不一样。

```json
{
    "name": "egg-ts-helper",
    "version": "1.25.2",
    "description": "egg typescript helper",
    "bin": {
        "ets": "dist/bin.js"
    },
    "main": "dist/index.js",
    "types": "dist/index.d.ts",
    "repository": {
    "type": "git",
    "url": "git@github.com:whxaxes/egg-ts-helper.git"
}
```

# 依赖 dependencies

## devDependencies

如字面意思，这个是开发时候用到的依赖，比如代码格式化，美化，编译相关的。反正代码运行没用到的都会在这里。可以用下面两个指令安装依赖，命令等价

```bash
npm i xxx --save-dev
npm i xxx -D
```

如果是下面的命令，通常是一些 CI 程序，会强制区分生产环境和其他环境，不会安装`devDependencies`的依赖

```bash
npm i --production
```

## dependencies

这个是运行时候的依赖，如下命令会安装依赖到这里。其实 npm 可以支持很多种写法

```bash
npm install (with no args, in package dir)
npm install [<@scope>/]<name>
npm install [<@scope>/]<name>@<tag>
npm install [<@scope>/]<name>@<version>
npm install [<@scope>/]<name>@<version range>
npm install <git-host>:<git-user>/<repo-name>
npm install <git repo url>
npm install <tarball file>
npm install <tarball url>
npm install <folder>
```

举个例子，如下安装的是 react 指定的版本，当然你也可以指定 git 仓库

```bash
npm install react@16.8.3
npm install facebook/react@16.8.3
npm install https://github.com/facebook/react.git
```

特别的，某些 CI 程序，只会安装 dependencies 的依赖

```bash
npm i --production
```

# git url 的组成

```bash
<protocol>://[<user>[:<password>]@]<hostname>[:<port>][:][/]<path>[#<commit-ish> | #semver:<semver>]
```

一个完整的 git url 组成如上就是这么复杂。protocal 有`https`，`git`，`git+ssh`,`git+https`。如下是官方给出的几个例子和几个我测试的例子。

```bash
# 具体版本分支
git+ssh://git@github.com:npm/cli.git#v1.0.27
# 主版本
git+ssh://git@github.com:npm/cli#semver:^5.0
# https链接
git+https://isaacs@github.com/npm/cli.git
# git协议
git://github.com/npm/cli.git#v1.0.27
# 具体到git的commitId
git://github.com/ManfredHu/someExercise.git#7813e8d9879add108b2c04944f529d1bdbbe41f2
# 具体到哪个分支
git://github.com/ManfredHu/someExercise.git#js
# 具体到某个版本号
git+https://github.com/vuejs/vue.git#semver:2.5.21
```

如果是 ssh，需要在账号加上 ssh-key 生成的公钥。
如果是 https 或者 http 可以指定账号密码，比如我的账号是 abc,密码是 cba，那么链接就是`git+https://abc:cba@github.com/vuejs/vue.git#semver:2.5.21`

# 私密包安装形式的介绍

我们知道 npm 包是公开的，比如 npm 是对整个互联网公开，cnpm 淘宝是对阿里整个集团公开，腾讯 tnpm 是对整个腾讯内网公开。
但是如果你做的是很私密的业务，不希望把 npm 包公开，那么还有啥好方法组织你的代码呢？再举个例子，npm 包是公用的，如果这个 npm 包只有你一个人用，你还需要发 npm 包吗？

我们可以有几种方法来构建一个非 npm 包形式的工程，会在执行`npm i`的时候区拉取模块代码，如上面几个链接的话拉取速度会偏慢，但是因为每次拉取到的代码是最新的，一些潜在的 bug 会修复。最近在做基于 egg+ts 结合 protobuf 与后台通信的时候，在选型的时候出现了几个选择，因为我们项目有类似`git://github.com/ManfredHu/someExercise.git#js`的外部 pb 协议生成 egg 的 service 需求，所以没有基于发布 npm 包的形式安装了几个 npm 包。很绕但是比较真实，我们不希望我们的协议文件暴露出去，npm 包大家都可以拉。但是协议这块希望是私密的，没有权限是拉不到的。

## CI 过程依赖包安装的几种方法

思考后，有下面几种方法

- ssh-key
- http 或者 https 配合 公共账号
- 项目写死公共账号的账号和密码

分析一下，ssh-key 的形式，在 CI 的时候会很蛋疼，因为 CI 部分是在独立的 docker 容器上的，如果这个 docker 容器配置了公共的账号并且生成 ssh-key 加入了账号还好，但如果像我们这边一样没有的话就非常蛋疼了。如果可能推荐走这种形式

第二种是 http 或者 https 配合 公共账号,也是我们现在用的，速度会比 ssh 的慢但是还能用。遇到项目嵌套的话，也是非常蛋疼，原因请看第三种

第三种不推荐，一个原因是账号密码在代码里面，泄露源码会非常麻烦，第二个原因是如果遇到 A 项目嵌套 B 项目，B 项目嵌套 C 项目，你在 A 项目写了账号密码的依赖，B 项目可以拉了，但是 B 项目依赖了 C 项目也需要写上账号密码，否则拉不下来。**也就是说账号密码这种形式，全部依赖仓库都需要写上账号密码，否则会报 npm install 失败，具体原因也很难从错误提醒看出来**

# 参考

- [npm-package.json](https://docs.npmjs.com/files/package.json#local-paths)
- [npm-install](https://docs.npmjs.com/cli/install)
