# 跨域终结篇

![crossOrigin](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/crossOrigin.png)

# 前言

github 代码地址：[https://github.com/ManfredHu/cross-origin](https://github.com/ManfredHu/cross-origin)

原来的浏览器是裸奔的，会给人看光光。就算你加密了，还是有办法看到，所以各大浏览器裸奔厂商商量好了规范，就是禁止源 origin 访问其他源下的资源。

> 同源要求：同协议(http/https 属于不同的协议),同域名 IP，同端口。

判断是否跨域看下图：

![是否同源判断](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/checkCrossOrigin.png)

# CORS

请求头带 orgin 到服务器，然后服务器返回 Access-Control-Allow-origin 到客户端，客户端检测返回跟现在的域是否相同，通过协议 http,域名，端口判断。

## axios 开启 cookie 传输

我们知道 cookie 是会在每一个请求的 request header 加上的，axios 默认是发送请求的时候不会带上 cookie 的，需要通过设置`withCredentials: true`来解决。
代码如下

```js
axios
  .get(url, { withCredentials: true })
  .then(function(response) {
    // handle success
    if (response.data.retCode === 0) {
      log(`收到来自${url}的返回数据`)
      log(JSON.stringify(response.data))
    }
  })
  .catch(function(error) {
    // handle error
    log('请求失败')
    console.log(error)
  })
```

项目例子对应启动代码如下。具体的实现可以看代码

```js
npm run cors:node
npm run cors:web
```

## express 开启 cookie 传输

类似的，用到了 cors 中间件，就会在 response header 返回加上`Access-Control-Allow-Credentials: true`的返回头。
这个时候就可以传输 cookie 了。

```js
const cors = require('cors')
app.use(cors({ credentials: true, origin: 'http://localhost:9000' }))
```

经测试，express 开启设置`Access-Control-Allow-Origin: *`支持跨域传输数据。但是，如果前端 axios 开启了 cookie 传输，就是上面的`'withCredentials': true`选项，则后端不能开启`Access-Control-Allow-Origin: *`,否则会报下面的错误。

```
Access to XMLHttpRequest at 'http://localhost:3000/cors' from origin 'http://localhost:9000' has been blocked by CORS policy: The value of the 'Access-Control-Allow-Origin' header in the response must not be the wildcard '*' when the request's credentials mode is 'include'. The credentials mode of requests initiated by the XMLHttpRequest is controlled by the withCredentials attribute.

index.js:19 Error: Network Error
    at createError (createError.js:16)
    at XMLHttpRequest.handleError (xhr.js:87)
```

所以如果有开启 cookie 的需求，则按照上面示例代码设置。

# JSONP

缺点：只支持 get，需要服务端支持，需要挂载全局函数(windows)。

通过`script`标签可以加载不同源下的文件来实现，因为在网页里，图片,css,js 三种文件一般是放在 cdn 的，可以加快访问速度。
那其实网页也是允许图片，css,js 之类的文件放在不同源上的，这样也可以加快加载效率。

所以这种方式跨域本质上是浏览器支持的，只是运用起来需要后端支持。

前端代码：

```js
const jsonpScript = document.createElement('script')
jsonpScript.src = 'http://localhost:3000/jsonp?callback=jsonpCallback'
document.body.appendChild(jsonpScript)

window.jsonpCallback = data => {
  // todo
}
```

后端代码：

```js
app.get(item, (req, res) => {
  let callback = req.query.callback //前端需要的回调函数
  let obj = {
    name: 'manfredhu',
    age: '25'
  }
  const result = Object.assign({}, obj, { retCode: 0 })
  res.writeHead(200, {
    'Content-Type': 'text/javascript'
  })
  res.end(callback + '(' + JSON.stringify(result) + ')')
})
```

这样后端不用开启任何跨域设置，直接返回参数包裹的函数和数据就好了。

项目例子对应启动代码如下。具体的实现可以看代码

```js
npm run jsonp:node
npm run jsonp:web
```

# 服务器转发请求跨域

缺点：需要服务器支持

## nginx & CDN

nginx 和 CDN 都可以设置响应报头。所以原理上来说都跨域支持跨域，这里不细说，需要的同学自行实现。

## node

node 做为接入层的话，收到前端的请求，node 可以去获取其他域的数据，因为服务器是不受跨域影响的。
一般的，有中间件可以用，我用的是`http-proxy-middleware`。

```js
const proxy = require('http-proxy-middleware')
const baseConfig = {
  port: 3000
}
app.use(
  '/',
  proxy({
    // 代理跨域目标接口
    target: 'http://localhost:3001',
    changeOrigin: true,
    // 修改响应头信息，实现跨域并允许带 cookie
    onProxyRes: function(proxyRes, req, res) {
      res.header('Access-Control-Allow-Origin', 'http://localhost:9000')
      res.header('Access-Control-Allow-Credentials', 'true')
    },

    // 修改响应信息中的 cookie 域名
    cookieDomainRewrite: 'localhost' // 可以为 false，表示不修改
  })
)
```

项目例子对应启动代码如下。具体的实现可以看代码

```js
npm run proxy:web
npm run proxy:node1
npm run proxy:node2
```

# postMessage

通常，相同的协议（通常为 https），端口号（443 为 https 的默认值），以及主机 (两个页面的模数 Document.domain 设置为相同的值) 时，这两个脚本才能相互通信。

## 浏览器接口

```js
otherWindow.postMessage(message, targetOrigin, [transfer])
```

- **otherWindow**
  其他窗口的一个引用，比如 iframe 的 contentWindow 属性、执行 window.open 返回的窗口对象、或者是命名过或数值索引的 window.frames。
- **message**
  将要发送到其他 window 的数据。它将会被结构化克隆算法序列化。这意味着你可以不受什么限制的将数据对象安全的传送给目标窗口而无需自己序列化。
- **targetOrigin**
  通过窗口的 origin 属性来指定哪些窗口能接收到消息事件，其值可以是字符串"_"（表示无限制）或者一个 URI。在发送消息的时候，如果目标窗口的协议、主机地址或端口这三者的任意一项不匹配 targetOrigin 提供的值，那么消息就不会被发送；只有三者完全匹配，消息才会被发送。这个机制用来控制消息可以发送到哪些窗口；例如，当用 postMessage 传送密码时，这个参数就显得尤为重要，必须保证它的值与这条包含密码的信息的预期接受者的 origin 属性完全一致，来防止密码被恶意的第三方截获。如果你明确的知道消息应该发送到哪个窗口，那么请始终提供一个有确切值的 targetOrigin，而不是_。不提供确切的目标将导致数据泄露到任何对数据感兴趣的恶意站点。
- **transfer**
  是一串和 message 同时传递的 Transferable 对象. 这些对象的所有权将被转移给消息的接收方，而发送一方将不再保有所有权。

这里有个问题要特别注意下，如下代码广播数据到指定的域时候，有时候会自己也会触发自己监听的`window.onmessage`。例子端口分别起在 9000 和 9001 也会，消息前后顺序不确定。所以如果要确切的收到来自某个跨域消息的话，`window.onmessage`要做过滤。

```js
ifr.contentWindow.postMessage(data, 'http://localhost:9001')
```

```js
const otherOrigin = 'http://localhost:9001'
window.onmessage = function(e) {
  log(`收到otherPage的postMessage返回的消息`)
  if (e.origin === otherOrigin) {
    //这里做过滤
    log(JSON.stringify(e.data))
  }
}
```

项目例子对应启动代码如下。具体的实现可以看代码

```js
npm run postMessage:web1
npm run postMessage:web2
```

# 修改 document.domain 来跨子域

通常我们可以这么干，自己用 JS 动态添加一个 iframe,一般是隐藏不显示，通过设置`display:none`。
然后在 iframe 里面设置如下的代码

```js
document.domain = 'localhost' //这里不用端口只判断是否是子域
```

然后在我们的页面就可以动态载入一个存在服务器上的静态页面或者动态生成内容的页面。返回给前端，前端设置自己也在这个域内，代码如上，就可以起到跨域通信的目的。

有一点要特别注意的是，获取 iframe 的 document 对象的时候。要通过`contentWindow`属性，其他属性一概不行或者错误。

```js
const ifr = document.getElementsByTagName('iframe')[0]
const ifrDoc = ifr && ifr.contentWindow && ifr.contentWindow.document
```

项目例子对应启动代码`npm run domain`。具体的实现可以看代码

# window.name

window 对象有个 name 属性，该属性有个特征：即在一个窗口(window)的生命周期内,窗口载入的所有的页面都是共享一个 window.name 的，每个页面对 window.name 都有读写的权限，window.name 是持久存在一个窗口载入过的所有页面中的，并不会因新页面的载入而进行重置。

注意，window.name 的值只能是字符串的形式，这个字符串的大小最大能允许 2M 左右甚至更大的一个容量，具体取决于不同的浏览器，但一般是够用了。

其实跟子域的设置方式类似,就是创建一个隐藏的 iframe，然后获取到 window 对象，拿到那个页面挂在 window.name 的信息。

```js
window.name = JSON.stringify({
  msg: '这是来自otherPage的数据',
  type: 'window.name'
})
```

```js
const ifr = document.getElementsByTagName('iframe')[0]
const ifrWin = ifr && ifr.contentWindow && ifr.contentWindow
log(`${ifrWin.name}`)
```

项目例子对应启动代码`npm run windowName`。具体的实现可以看代码

# 使用 WebSocket 实现跨域

这个不说了，WS 是没有域限制的，不同域名、端口下随便连接，但是后台 WS 服务一般有鉴权，所以也不是随便就可以连伤的。还可以开多个 WS 连接链接好几个不同源（亲测 3 个稳定连接，在微信手 Q 里面）


# 参考

- [实现跨域的几种方式](https://juejin.im/entry/57d21eadbf22ec005f9c7d76)
- [无双-js 中几种实用的跨域方法原理详解](https://www.cnblogs.com/2050/p/3191744.html)
- [axios 的 cookie 跨域以及相关配置](https://segmentfault.com/a/1190000011811117)
