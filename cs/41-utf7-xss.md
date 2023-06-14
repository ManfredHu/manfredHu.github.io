# utf7 XSS 攻击

我们知道 XSS 攻击，但是不知道大家知道 utf7 攻击不？

这个漏洞的是这样的。

## ie 的 UTF-7 XSS 漏洞原理演示


> **IE 浏览器在解析网页时，会首先检查头几个字节是 fffe 还是+/v\*。**
>   - 如果是 fffe，编码转换为 unicode
>   - 如果是+/v\*，编码转化为 UTF-7

因此若网页文件的头几个字节为+/v*(*为 ’8’, ’9’, ’/’, ’+’等特殊字符)，IE 会将之后的内容按 UTF-7 编码来解析。若后面的内容为恶意 js 代码并采用 UTF7 格式编码，则可以绕过相关 CGI 的安全检测，导致执行 JS 代码。

测试代码

```js
+/v8 +ADw-script+AD4-alert('iron man')+ADsAPA-/script+AD4-
```

大家可以复制到一个 html 文件，然后应该会看到下图这样的。

![utf7 xss IE截图](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/utf7XSSForIE.png)

## payload

XSS 攻击的攻击源，就是恶意代码部分我们称为 payload。上面的是浏览器的解析原理部分。
但是一般我们的 XSS 攻击防范方法就是在传到后台的时候对一些字符进行过滤，如`<script>`之类的标签，但是如果用户输入的不是`<script>`。而是`+ADw-script+AD4- alert()+ADw-/script+AD4-`这么一串东西，普通 XSS 过滤是无效的。

那么就会被存入数据库，如果这个串被传输给用户或者其他用户。页面加载来自用户的输入的`+ADw-script+AD4- alert()+ADw-/script+AD4-`时，它将把它解释为`<script>alert()</script>`，因为有的浏览器使用 UTF-7 编码。

可喜的是很多现代不支持 utf-7 了。2011 年开始，Firefox 从 5 版开始就不支持 UTF-7。Chrome 在 2009 年停止支持它（如果你忽视了一个错误 - 否则就是 2013 年）。有趣的是，只有一个现代浏览器支持 UTF-7 - Internet Explorer 11

## 防范措施(node 接入层)

对请求强制进行 utf8 编码声明。应该达成一个共识，前端通用编码方式都是 utf8，不管是后台回传 node 的数据还是 node 到前端页面的数据，统一强制都用 utf8 编码。

```js
request.setHeader('Content-Type', 'text/html; charset=utf-8')
response.setHeader('Content-Type', 'text/html; charset=utf-8')
```
