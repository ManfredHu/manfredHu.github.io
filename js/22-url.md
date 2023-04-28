# 谈谈 url 这东西

![URL](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/urlPic/main.jpg)

# URL

普及篇，作为互联网从业者如果连链接都不认识，很难交流。不知道你们有没有遇到这样的情况，开发要给产品一个链接叫产品体验，开发说打开链接加个`_test=1`的参数，产品说，怎么搞啊，我不会呀！！！我不会呀！！！我不会呀！！！所以要普及一些网络姿势！！

# URL 的由来

我们的身份证有 18 个号码，标识了我们的唯一。

> URL 全称**Uniform Resource Locator** 统一资源定位符（或称统一资源定位器/定位地址、URL 地址等，常缩写为 URL），有时也被俗称为网页地址（网址）。如同在网络上的门牌，是因特网上标准的资源的地址（Address）。它最初是由蒂姆·伯纳斯-李发明用来作为万维网的地址。现在它已经被万维网联盟编制为因特网标准 RFC 1738。

# URL 的组成部分

URL 的协议类型:

- http://www.tmtpost.com/2737087.html?mobile=1&mdebug=1#haha=init&lh=1
- [scheme:][//host][:port][/pathname][?search][#hash]
- [http:][//www.tmtpost.com][/2737087.html][?mobile=1&mdebug=1][#haha=init&lh=1]

举个栗子，如下 URL：

http://www.tmtpost.com/2737087.html?mobile=1&mdebug=1#haha=init&lh=1

标识了一个互联网上的文件的地址。

在控制台输入`window.location` 会输出信息，大概如下

```js
Location
hash: '#haha=init&lh=1'
host: 'www.tmtpost.com'
hostname: 'www.tmtpost.com'
href: 'http://www.tmtpost.com/2737087.html?mobile=1&mdebug=1#haha=init&lh=1&test=1'
origin: 'http://www.tmtpost.com'
pathname: '/2737087.html'
port: ''
protocol: 'http:'
search: '?mobile=1&mdebug=1'
```

| 格式部分 | 例子对应的部分                             | 获取代码                   |
| -------- | ------------------------------------------ | -------------------------- |
| protocol | http:                                      | `window.location.protocol` |
| host     | //www.tmtpost.com                          | `window.location.host`     |
| port     | http 默认为 80，https 默认为 443，本例为空 | `window.location.port`     |
| pathname | /2737087.html                              | `window.location.pathname` |
| search   | ?mobile=1&mdebug=1                         | `window.location.search`   |
| hash     | #haha=init&lh=1                            | `window.location.hash`     |

## window.location.href 和 window.location.replace

- `window.location.href` 是一个可读可写的属性。读则返回整个 URI 字符串，写则跳转页面。
- `window.location.replace` 是一个方法，同样用于页面跳转，只是同时会把历史纪录替换掉，所以你后退回不去原来的链接，而 `window.location.href` 是有记录的。

**注意：**这里只可以跳转到同个 host 下的不同 pathname。

```js
//如果你打开www.baidu.com在控制台输入
window.location.href = 'www.qq.com'
//则url会变成 https://www.baidu.com/www.qq.com
//百度会告诉你它根本不认识这货而跳转到错误搜索
//测试环境为Chrome
```

# 构建 URL

业务中经常会用 URL 的参数，通常是 `location.search` 这里的部分来做一些业务相关的操作，比如某些功能的体验，加了一个参数就可以打开体验等等。这里通常就是操作

http://www.tmtpost.com/2737087.html?mobile=1&mdebug=1#haha=init&lh=1

这样链接的 `?mobile=1&mdebug=1`部分，通过添加其他参数来构成 URL.
比如我们上面情景下的开发哥哥想要你加上`_test=1`。

那么就会形成 `?mobile=1&mdebug=1&_test=1`的 search 部分。
这里参数以`&`符号来分割。

总的链接为

http://www.tmtpost.com/2737087.html?mobile=1&mdebug=1&_test=1#haha=init&lh=1

这就是开发哥哥想要的 URL 了。

## HASH 的读写

`location.hash`为获取的 hash，通常的单页 SPA 下会通过 hash 的变化来判断执行的模块方法。这块通常也是一些基础面试里面会问到的题目，让你现场写一个东西来获取 URL 里面的参数，因为场景太常用了，所以是必修题。记得在大三去微信 TIT 面试的时候有一道就是这样的，考察的是 JS 正则表达式的使用和对 URL 的理解是否深刻。

hash 的常见类型如： #haha=init&lh=1&test=1

```js
var URL = {}
URL.setHash = function(hash) {
  location.hash = hash
}
URL.getHash = function() {
  var hash = location.hash
  return hash ? hash.replace(/.*#/, '') : '' //删除掉#前面（包括#）的所有字符
}
URL.getHashParam = function(key) {
  var hash = URL.getHash()
  //这里会取到haha=init&lh=1这样的字符串，用正则来捕获key为传入key的值
  var result = hash.match(new RegExp('(^|&)' + key + '=([^&]*)(&|$)'))
  return result != null ? result[2] : ''
}
```

# SEARCH 部分

`location.search`部分为`?`号 后面的内容，跟 HASH 类似，也是**key=value**的模式。

search 的常见类型如： ?mobile=1&mdebug=1&\_test=1

```js
var URL = {}

//HASH部分
URL.setHash = function(hash) {
  location.hash = hash
}
URL.getHash = function() {
  var hash = location.hash
  return hash ? hash.replace(/.*#/, '') : '' //删除掉#前面（包括#）的所有字符
}
URL.getHashParam = function(key) {
  var hash = URL.getHash()
  //这里会取到haha=init&lh=1这样的字符串，用正则来捕获key为传入key的值
  var result = hash.match(new RegExp('(^|&)' + key + '=([^&]*)(&|$)'))
  return result != null ? result[2] : ''
}

//SEARCH部分
URL.getSearch = function() {
  var search = location.search //得到形如 ?mobile=1&mdebug=1 这样的字符串
  return search ? search.replace(/.*?/, '') : '' //删除掉?前面（包括?）的所有字符
}
//支持传入url
URL.getSearchParam = function(key, url) {
  var search = url ? url : URL.getSearch()
  //这里会取到haha=init&lh=1这样的字符串，用正则来捕获key为传入key的值
  var result = search.match(new RegExp('(^|&)' + key + '=([^&]*)(&|$)'))
  return result != null ? result[2] : ''
}
```

# URL 编码解码

window 全局对象下有几个方法函数是对 URL 进行处理的。有这些

- `window.decodeURI`
- `window.encodeURI`
- `window.decodeURIComponent`
- `window.encodeURIComponent`
- `window.unescape`
- `window.escape`

很明显，这是三对类似的情侣。相爱相杀，一个用来解码一个用来编码。

首先，我们看一下阮一疯的[关于 URL 编码](http://www.ruanyifeng.com/blog/2010/02/url_encoding.html)这里先入个门再来看我们下面的总结部分。

## 废弃的 escape 和 unescape

这一对可以对中文进行编解码操作，以前用的比较多，现在已经**不提倡使用(废弃)**看下面的例子：

```js
escape('醉了')
//"%u9189%u4E86"
unescape('%u9189%u4E86')
//"醉了"
```

同理我们可以对比 String.charCodeAt 方法，这个方法会返回字符串某个字符的 unicode 编码。

### escape 和 String.charCodeAt 方法的联系

```js
'醉了'.charCodeAt(0) //37257（十进制）
'醉了'.charCodeAt(1) //20102（十进制）
parseInt(escape('醉').match(/\d+/)[0], 16) //37257（十进制）
parseInt(escape('了').match(/\d+/)[0], 16) //20102（十进制）
```

这里我们用 escape 编码 *醉*字得到字符的 unicode 编码`"%u9189"`，然后用 String.match 匹配整数部分得到 16 进制的 9189，然后用 parseInt 方法将 9189 转码为十进制得到与 charCodeAt 方法一样的数字——37257

## encodeURI 和 decodeURI

这一对会对一些符号进行编码（如空格转为%20），其他一些在网址中有特殊含义的符号"; / ? : @ & = + \$ , #"，不进行编码。编码后，它输出符号的 utf-8 形式，并且在每个字节前加上%。

```js
encodeURI('醉了')
//"%E9%86%89%E4%BA%86"
encodeURI('醉了 ')
//"%E9%86%89%E4%BA%86%20"
decodeURI('%E9%86%89%E4%BA%86%20')
//"醉了 "
```

## encodeURIComponent 和 decodeURIComponent

**与 encodeURI()的区别是，它用于对 URL 的组成部分进行个别编码，而不用于对整个 URL 进行编码。**

因此，"; / ? : @ & = + \$ , #"，这些在 encodeURI()中不被编码的符号，在 encodeURIComponent()中统统会被编码

```js
encodeURI('哈哈hao123;/?:@&=+$,#')
;('%E5%93%88%E5%93%88hao123;/?:@&=+$,#')
encodeURIComponent('哈哈hao123;/?:@&=+$,#')
;('%E5%93%88%E5%93%88hao123%3B%2F%3F%3A%40%26%3D%2B%24%2C%23')
```

## escape 和 encodeURIComponent 的区别

上例说了 encodeURI 和 encodeURIComponent 的区别,区别不大.只是在`; / ? : @ & = + $ , #`这些特殊符号编不编码的问题.
而 escape 和 encodeURI 的区别则是——**Unicode 编码和 UTF-8 的区别.**

因为 escape 会将传入的字符串参数转码为 Unicode,而 encodeURI 则会将传入的字符串参数转码为可以直接在互联网传递的 UTF-8 格式.

# Unicode 和 UTf-8

## UTF-8

UTF-8 是一种变长的编码方式。它可以使用 1~4 个字节表示一个符号，根据不同的符号而变化字节长度。

UTF-8 的编码规则很简单，只有二条：

1. 对于单字节的符号，字节的第一位设为 0，后面 7 位为这个符号的 unicode 码。因此对于英语字母，UTF-8 编码和 ASCII 码是相同的。
2. 对于 n 字节的符号（n>1），第一个字节的前 n 位都设为 1，第 n+1 位设为 0，后面字节的前两位一律设为 10。剩下的没有提及的二进制位，全部为这个符号的 unicode 码。

对照关系如下:

| Unicode 符号范围(十六进制) | UTF-8 编码方式（二进制）            |
| -------------------------- | ----------------------------------- |
| 0000 0000-0000 007F        | 0xxxxxxx                            |
| 0000 0080-0000 07FF        | 110xxxxx 10xxxxxx                   |
| 0000 0800-0000 FFFF        | 1110xxxx 10xxxxxx 10xxxxxx          |
| 0001 0000-0010 FFFF        | 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx |

## Unicode 和 UTF-8 的转化

以醉了的醉字为例

```js
'醉'.charCodeAt(0)
//37257(十进制)
encodeURI('醉')
//"%E9%86%89"
```

可以这里醉字的 UTF-8 编码为三字节,`E9 86 89`
转化为二进制为 `11101001 10000011 10001001`
对应上面表格的第三行,将其代入第三行的 UTF-8 编码的部分,得到替代的 x 部分为`1001 000011 001001`则为醉字的 Unicode 编码部分.

```js
parseInt('1001 000011 001001'.replace(/\s/g, ''), 2)
//37065
'醉'.charCodeAt(0)
//37257(十进制)
parseInt(escape('醉').match(/\d+/)[0], 16)
//37257(十进制)
```
