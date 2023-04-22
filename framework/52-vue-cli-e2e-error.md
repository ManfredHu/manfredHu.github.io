# Chrome76+ vue-cli 执行 nightwatch e2e 测试错误

## 错误原因

创建项目如果选了 nightwatch 去执行 e2e 测试的话，应该是跑不起来的，原因是 Chrome 自动升级到 76 版本了，而 selenium server 版本只能支持 Chrome71-75 版本的。

错误如下

```
[Test] Test Suite
=====================

Running:  default e2e tests

Error retrieving a new session from the selenium server

Connection refused! Is selenium server started?
{ value:
   { message: 'session not created: Chrome version must be between 71 and 75\n  (Driver info: chromedriver=2.46.628411 (3324f4c8be9ff2f70a05a30ebc72ffb013e1a71e),platform=Mac OS X 10.14.5 x86_64) (WARNING: The server did not provide any stacktrace information)\nCommand duration or timeout: 1.52 seconds\nBuild info: version: \'3.141.59\', revision: \'e82be7d358\', time: \'2018-11-14T08:25:53\'\nSystem info: host: \'ManfredHu-MC1\', ip: \'fe80:0:0:0:c14:7d47:939e:e382%en0\', os.name: \'Mac OS X\', os.arch: \'x86_64\', os.version: \'10.14.5\', java.version: \'1.8.0_191\'\nDriver info: driver.version: unknown',
     error: 'session not created' },
  status: 33 }

 ERROR  Error: Command failed: /Users/ManfredHu/Documents/vue-jest-nightwatch/node_modules/nightwatch/bin/nightwatch --config /Users/ManfredHu/Documents/vue-jest-nightwatch/node_modules/@vue/cli-plugin-e2e-nightwatch/nightwatch.config.js --env chrome
Error: Command failed: /Users/ManfredHu/Documents/vue-jest-nightwatch/node_modules/nightwatch/bin/nightwatch --config /Users/ManfredHu/Documents/vue-jest-nightwatch/node_modules/@vue/cli-plugin-e2e-nightwatch/nightwatch.config.js --env chrome
    at makeError (/Users/ManfredHu/Documents/vue-jest-nightwatch/node_modules/execa/index.js:174:9)
    at Promise.all.then.arr (/Users/ManfredHu/Documents/vue-jest-nightwatch/node_modules/execa/index.js:278:16)
    at <anonymous>
    at process._tickCallback (internal/process/next_tick.js:189:7)
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! vue-jest-nightwatch@0.1.0 test:e2e: `vue-cli-service test:e2e`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the vue-jest-nightwatch@0.1.0 test:e2e script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /Users/ManfredHu/.npm/_logs/2019-09-11T06_26_26_317Z-debug.log
```

## 解决方法

1. 安装`@vue/cli-plugin-e2e-nightwatch`的最新版本 v4+.版本可以在[npm](https://www.npmjs.com/package/@vue/cli-plugin-e2e-nightwatch)看，version 选项看最新的版本。暂时是`4.0.0-rc.3`。所以执行`npm i @vue/cli-plugin-e2e-nightwatch@4.0.0-rc.3`安装最新版本
2. 第一步的 warning 会提示缺少模块，故安装依赖，`npm i chromedriver geckodriver selenium-server@^3.141.59 -D`
3. vue add 不支持插件指定版本，刷新项目目录后自己手动复制 node_modules 下的`@vue/cli-plugin-e2e-nightwatch`文件夹到 test 文件夹

![e2e文件夹](https://manfredhu-1252588796.cos.ap-guangzhou.myqcloud.com/clipboard_20190911034822.png)

4. 修复语法报错，删掉错误的语法，已经提了 issue 给 vue 团队

```bash
TEST FAILURE: 1 error during execution 0 assertions failed, 5 passed. 3.236s

  SyntaxError: missing ) after argument list
         .assert.containsText('h1', 'Welcome to Your Vue.js <%- hasTS ? '+ TypeScript ' : '' %>App')
                                                                           ^^^^^^^^^^

   SyntaxError: missing ) after argument list
       at createScript (vm.js:80:10)
       at Object.runInThisContext (vm.js:139:10)
       at Module._compile (module.js:617:28)
       at Object.Module._extensions..js (module.js:664:10)
       at Module.load (module.js:566:32)
       at tryModuleLoad (module.js:506:12)
       at Function.Module._load (module.js:498:3)
       at Module.require (module.js:597:17)
       at require (internal/module.js:11:18)


 ERROR  Error: Command failed: /Users/ManfredHu/Documents/vue-jest-nightwatch/node_modules/nightwatch/bin/nightwatch --config /Users/ManfredHu/Documents/vue-jest-nightwatch/node_modules/@vue/cli-plugin-e2e-nightwatch/nightwatch.config.js --env chrome
```

## 完美运行

```bash
entrypoint size limit: The following entrypoint(s) combined asset size exceeds the recommended limit (244 KiB). This can impact web performance.
Entrypoints:
  app (273 KiB)
      js/chunk-vendors.60b5f6b3.js
      css/app.b4b7d908.css
      js/app.33e358de.js



  App running at:
  - Local:   http://localhost:8080/
  - Network: http://10.43.69.157:8080/

  App is served in production mode.
  Note this is for preview or E2E testing only.

 INFO  Running end-to-end tests ...

[Test With Pageobjects] Test Suite
==================================
Running:  e2e tests using page objects

✔ Element <#app> was visible after 21 milliseconds.
✔ Testing if element <img> has count: 1  - 6 ms.
✔ Expected element <Section [name=app],Element [name=@welcome]> to be visible - condition was met in 29ms
✔ Expected element <Section [name=app],Element [name=@headline]> text to match: "/^Welcome to Your Vue\.js (.*)App$/" - condition was met in 28ms

OK. 4 assertions passed. (438ms)
Running:  verify if string "e2e-nightwatch" is within the cli plugin links

✔ Expected element <Section [name=app],Section [name=welcome],Element [name=@cliPluginLinks[0]]> text to contain: "e2e-nightwatch" - condition was met in 43ms

OK. 1 assertions passed. (1.093s)

[Test] Test Suite
=================
Running:  default e2e tests

✔ Element <#app> was visible after 20 milliseconds.
✔ Testing if element <.hello> is present  - 12 ms.
✔ Testing if element <h1> contains text: "Welcome to Your Vue.js App"  - 23 ms.
✔ Testing if element <img> has count: 1  - 14 ms.

OK. 4 assertions passed. (348ms)
Running:  example e2e test using a custom command

✔ Element <#app> was visible after 19 milliseconds.
✔ Passed [strictEqual]: 3 === 3
✔ Testing if element <.hello> is present  - 12 ms.

OK. 3 assertions passed. (1.108s)

OK. 12  total assertions passed. (4.807s)
```
