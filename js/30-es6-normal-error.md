# 几种常见的 ES6 改进写法

![ES6改进的写法](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/es6-2.jpeg)

下面是自己总结的 ES6 对 ES5 提升非常大的写法,代码会更加优雅.如果你真的想让自己的代码写的更少,作用更大,那你应该好好研究研究下面出现的情况.

## 用解构写法替换 object 写法

```js
//---bad---
// options 上的属性表示附加参数
function setCookie(name, value, options) {
  options = options || {}

  let secure = options.secure,
    path = options.path,
    domain = options.domain,
    expires = options.expires

  // 设置 cookie 的代码
}

// 第三个参数映射到 options
setCookie('type', 'js', {
  secure: true,
  expires: 60000
})
```

很多 JS 库都包含了与此例 setCookie() 类似的函数。在此函数内， name 与 value 参数是必需的，而 secure 、 path 、 domain 与 expires 则可选。并且由于此处对其余数据并没有顺序要求，将它们作为 options 对象的特定属性会更有效，避免列出一堆额外的具名参数。虽然这种方法有用，但无法仅通过查看函数定义就判断出函数所期望的输入，你必须阅读函数体的代码。

```js
//---bad---
function setCookie(
  name,
  value,
  { secure, path, domain, expires = 24 * 3600 * 1000 } = {}
) {
  // 设置 cookie 的代码
}

setCookie('type', 'js', {
  secure: true,
  expires: 60000
})
```

这种更好的写法用了解构函数,让你的方法定义更加明确.**传入默认的空的方法会防止你没有传入 options 多选参数的时候导致的解构错误**.

## 解构函数更加方便

```js
//---better---
let node = {
  type: 'Identifier',
  name: 'foo'
}

let type = node.type,
  name = node.name,
  value = node.value,
  baby = node.baby || 'BB'

console.log(type) // "Identifier"
console.log(name) // "foo"
console.log(value) // undefined
console.log(baby) // "BB"
```

不知道你写过这样的代码没有,反正我是写过,ES6 让我飞上了天.请看下面的代码:

```js
//---better---
let node = {
  type: 'Identifier',
  name: 'foo'
}

let { type, name, value, baby = 'BB' } = node

console.log(type) // "Identifier"
console.log(name) // "foo"
console.log(value) // undefined
console.log(baby) // "BB"
```

这里直接对 node 的变量进行解析使用,你不用重新声明变量然后再使用,也不用做判空和赋予默认值的操作,直接一句代码就可以搞定全部.

## 警惕错误 null 对解构的影响

```js
function setCookie(
  name,
  value,
  {
    secure = false,
    path = '/',
    domain = 'example.com',
    expires = new Date(Date.now() + 360000000)
  } = {}
) {
  console.log(arguments)
  console.log(secure)
}
setCookie('xixi', 123, null) //报错,null.secure找不到
setCookie('xixi', 123, undefined) //可以运行,secure等四个可选参数全部为默认值
```

## 多行字符串

以前写多行字符串用的是\做转意连接符,或者是用`\n`来做换行等.现在不需要了,写模版会更加方便.

```js
//---bad---
var message =
  'Multiline \
string'
console.log(message) // "Multiline string"

//better
let message = `Multiline
string`
console.log(message) // "Multiline
//  string"
console.log(message.length) // 16
```

## 扩展运算符

获取一个数组最大值的方法,有人是取数组第一项为最大,之后迭代数组,更加优雅的是用`Math.max`来做,但是 ES6 让优雅更近一步.

```js
//---bad---
let values = [25, 50, 75, 100]
console.log(Math.max.apply(Math, values)) // 100

//better
let values = [25, 50, 75, 100]
console.log(Math.max(...values)) // 100
```

## 异步文件

```js
import(/* webpackChunkName: "xxxx" */ 'xxxx.js')
```

一个 promise 的异步文件的用法，可以对文件起别名（chrome network 可以看到）

```js
//example
export let config = {
  resolve: props => import(`templates/${props.templateId}`)
}
```

当然这里依赖了一些模块和配置，如下
webpack 配置:

```
output: {
    publicPath: '/',
    filename: 'scripts/[name].[chunkhash].js',
    chunkFilename: 'scripts/[id].[name].[chunkhash].js',
},
```

> webpack 2.6.0 以后，支持使用注释的方式给动态导入的模块添加 chunk name

标准语法如下：

```js
import(
  /* webpackChunkName: "my-chunk-name" */
  /* webpackMode: "lazy" */
  'module'
)
```
