# zen·工作环境搭建之调试篇

一般浏览器或者微信开发工具都能调试，现网的话代码混淆过需要sourcemap映射源代码。这里主要说的是Node的调试。众所周知[Node提供了调试的方法](https://nodejs.org/zh-cn/docs/guides/debugging-getting-started/)
简单说一下有这么几种

## [node调试](https://nodejs.org/zh-cn/docs/guides/debugging-getting-started/)
`node inspect`命令使用方式如下
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/TbEPag.png)

简单说下就是node的debug模式有client跟server两部分，server运行代码并接收client的命令调整运行姿势。client可以是多种方式，如Chrome，VSCode，node默认的命令行CLI debugger

### node inspect

如下命令行直接进入**命令行调试模式**，可以通过按键进行调试等。本质是启动一个独立于node进程的调试程序
```bash
node inspect main.js # 等价于 node debug main.js
```
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/image-20210514155354408.png)
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/image-20210514155818145.png)

如上图，创建了两个进程pid分别为44335和44334
- 44334主进程用于运行CLI debugger调试器
- 44335子进程用于node进入`--inspect`监视模式跑用户的脚本。

**一句话总结就是node inspect 包含 node --inspect-brk**

`node inspect`这种CLI的方式比较low，没图形化界面，断点要执行命令，不适合大项目使用

### node --inspect与client结合调试
::: tip
`node --inspect`和`node --inspect-brk`很像，区别在于`node --inspect-brk`会进入**首行断点**模式，而`node --inspect`则是遇到`debugger`或者断点才会停止
:::

> 原理：V8 检查器的集成允许将 Chrome 开发者工具附加到 Node.js 实例，以便进行调试和性能分析。 它使用了 [Chrome 开发者工具协议](http://url.nodejs.cn/YpFEVu)。当node进程有`--inspect`参数的时候进入监听模式，会监听client的指令，默认node监听127.0.0.1:9229，同时有一个UUID随机数防止串听


::: details 注意下这里默认的监听IP是127.0.0.1本地，外部连过来的话IP要起到0.0.0.0才行
[node文档这里说的很明显](https://nodejs.org/en/docs/guides/debugging-getting-started/)，默认127.0.0.1:9229是为了保证安全。因为调试其实是可以执行任意代码的。127.0.0.1默认作为回环地址，用于调试。

可在/etc/hosts文件中与localhost绑定，如下
```bash
[root@VM-91-2-centos /etc]# cat /etc/hosts
127.0.0.1 VM-91-2-centos VM-91-2-centos
127.0.0.1 localhost.localdomain localhost
127.0.0.1 localhost4.localdomain4 localhost4

::1 VM-91-2-centos VM-91-2-centos
::1 localhost.localdomain localhost
::1 localhost6.localdomain6 localhost6
```
:::


```bash
node --inspect main.js
```

![image-20210514161312823](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/image-20210514161312823.png)
运行引用，浏览器键入`chrome://inspect/#devices`与进程链接，调试工具默认通信端口为9229，ip默认为127.0.0.1(本地用)

-e参数支持传入代码eval执行，如`node --inspect=9229 -e "setTimeout(function() { console.log('yes'); }, 30000)"`

### node --inspect-brk 首行断点

```bash
node --inspect-brk=9229 app.js
node --inspect-brk app.js
```

### process._debugProcess
如果一个 Node.js 进程已经启动，没有添加 --inspect 参数，我不想重启又想调试怎么办？幸好我们有 process._debugProcess。

1. 通过 ps 命令查看当前启动的 Node.js 进程的 pid，如：53911
2. 打开新的终端，运行：`node -e "process._debugProcess(53911)"`，原来的 Node.js 进程会打印出：`Debugger listening on ws://127.0.0.1:9229/2331fa07-32af-45eb-a1a8-bead7a0ab905`
3. 使用client链接debug server调试，如 NIM 调出 Chrome DevTools 进行调试

### 子进程调试
默认调试只能调试主进程，如果是多进程部署的话，子进程不能调试，可以用[ndb](https://github.com/GoogleChromeLabs/ndb)

也可以参考[这里](https://stackoverflow.com/questions/16840623/how-to-debug-node-js-child-forked-process)的做法

一般遇到子进程调试就是生产环境的模式了，我们生产环境是pm2多进程部署的，遇到**pm2调试多进程的坑**，大概如下

1. fork模式，单实例(instance)可以运行
2. fork模式，多实例，只能运行1个进程，其他报错
3. cluster模式，单实例(instance)不可以运行
4. cluster模式，多实例(instance)不可以运行

其次是调试看着是基于WS的，但是测试直接WS转发不行，能搜索到但是连接Chrome devtools没内容。
最后只能根据Node文档说的走SSH端口转发，但是SSH端口转发风险也很大，就是能到端口的都能到生产环境Node去执行，最后被运维ban了-_-!!

### Chrome浏览器插件[NIM](https://chrome.google.com/webstore/detail/empty-title/gnhhdgbaldcilmgcpfddgdbkhjohddkj?hl=zh-CN)
[NIM](https://chrome.google.com/webstore/detail/empty-title/gnhhdgbaldcilmgcpfddgdbkhjohddkj?hl=zh-CN)这个插件可以自动发现本地开启的debug server，并自动打开Chrome的调试页面

## VSCode调试
VSCode其实相当于client，发出命令给已经启动的debug server。同时VSCode又能另起debug server，配置好了直接一键启动debug server后attach上去。这里VSCode单独一篇是因为一些配置说明和确实符合实际使用，因此单独成章详细说明。VSCode已经内置了debug不需要安装插件，其他语言可能需要安装插件支持调试。

[VSCode Debugging](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations)

一个简单的例子

```js
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();

const a = 1
const b = 2
const main = (ctx, next) => {
  console.log(a+b)
  console.log(`main exec`)
  ctx.response.body = 'ManfredHu Hello World';
};

const welcome = (ctx, next) => {
  console.log(`welcome exec`, ctx.params)
  ctx.response.body = `Hello ${ctx.params}`;
};

const mainRouter = new Router()
mainRouter.get('/', main)
mainRouter.get('/:name', welcome)

// app.use(router.get('/', main));
// app.use(router.get('/:name', welcome));
app.use(mainRouter.routes());
app.use(mainRouter.allowedMethods());
app.listen(3000, '0.0.0.0');
console.log('listening on port 3000');
```

简单起个demo，运行koa监听端口3000

::: tip VSCode debug开关选项
- smart (default) - 如果在`node_modules`外执行代码则进程会进入debug模式,可以通过配置正则定义这里的范围，见setting (debug.javascript.autoAttachSmartPattern)
- always - 所有的node都会进入debug模式
- onlyWithFlag - 只有`--inspect` or `--inspect-brk`标识的会进入debug模式
:::

### Auto Attach
简单理解就是不用管debug，VSCode会自动检测需要作为debug client去attach debug server。

这里VSCode有开关，可以搜索auto attch开关来切换各个模式,`CMD+Shift+P`输入`auto attach`
![CMD+Shift+P输入auto attach](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/VLiFKP.png)
![auto attach选项](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/SY53f9.png)

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/uvPnjW.png)

选择好后重启终端再执行命令就可以了，如上图我打在请求进来的时候，浏览器访问[http://0.0.0.0:3000/](http://0.0.0.0:3000/)就停在那里了

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/m9Vi09.png)

可以看到这里ctx变量里header有host、user-agent等值

[视频可以看这里](https://www.youtube.com/watch?v=GHaf5iBRoD4)

### JavaScript Debug Terminal
很少用，不过也有
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/7qRuVZ.png)

### launch.json配置
Auto Attach比较智能，但是只有自己用，怎么给项目内其他人一起用呢？用配置文件，简单`.vscode/launch.json`配置如下，更复杂的看[launch-configuration-attributes](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_launch-configuration-attributes)

```json
{
  // 使用 IntelliSense 了解相关属性。 
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Launch Program",
      "skipFiles": [
        "<node_internals>/**"
      ],
      "program": "${workspaceFolder}/app.js"
    }
  ]
}
```

### ts-node调试cli
js的server调试估计看完上面的都会了，但是ts-node的cli调试不知道大家会不会。这里介绍一下

ts-node是一个可以直接运行ts代码的node工具，可以看下[npm文档](https://www.npmjs.com/package/ts-node)

基本可以认为ts-node就是ts版本的node执行工具了，毕竟node默认只支持js而不支持ts。ts要跑node的话要先tsc编译一遍,调试的时候就比较麻烦了。

```
# Execute a script as `node` + `tsc`.
ts-node script.ts

# Starts a TypeScript REPL.
ts-node

# Execute code with TypeScript.
ts-node -e 'console.log("Hello, world!")'

# Execute, and print, code with TypeScript.
ts-node -p -e '"Hello, world!"'

# Pipe scripts to execute with TypeScript.
echo 'console.log("Hello, world!")' | ts-node

# Equivalent to ts-node --transpile-only
ts-node-transpile-only script.ts

# Equivalent to ts-node --cwd-mode
ts-node-cwd script.ts
```

所以这里用ts-node代替node执行，然后cli因为不是在项目本身目录执行的，要做一些修改。我们要的效果是可以直接运行ts代码不需编译，这个称为debug模式

文件目录大致如下
- index.ts
- debug.js
- package.json
- src
  - index.ts

::: details package.json内容
```json
{
  "bin": {
    "xxx": "./dist/index.js",
    "xxx-debug": "debug.js"
  }
}
```
:::

::: details src/debug.js内容
```js
#!/usr/bin/env node

// picture-debug to enter debug mode
// will output debug info
const tsConfigPath = require('path').resolve(__dirname, "./tsconfig.json")
const config = require(tsConfigPath);
require("ts-node").register(config);
require("./index.ts");
```
:::

::: details index.ts内容
```js
#!/usr/bin/env node

import index from './src/index'
index()
```
:::

这时`npm link`后执行`xxx-debug`就直接跑ts代码了。

### VSCode+ts-node调试cli
上面可以直接执行ts代码，在调试的时候其实还不够，我想要配合VSCode做断点调试，设置VSCode的launch配合调试就可以了，此处配置来源于[这里](https://stackoverflow.com/questions/31169259/how-to-debug-typescript-files-in-visual-studio-code/31288582)

::: details .vscode/launch.json内容 
```json
{
  // 使用 IntelliSense 了解相关属性。 
  // 悬停以查看现有属性的描述。
  // 欲了解更多信息，请访问: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch index.ts",
      "type": "node",
      "request": "launch",
      "runtimeArgs": [
        "-r",
        "ts-node/register"
      ],
      "args": [
        "${workspaceFolder}/src/index.ts",
      ],
      "skipFiles": [
        "node_modules/**"
      ]
    }
  ]   
}
```
:::

也可以看这里[手把手教学：使用 TypeScript 开发 Node.js 应用](https://www.zhihu.com/zvideo/1416809436988362752?utm_source=wechat_session&utm_medium=social&utm_oi=780736059687325696)









