---
title: 谈谈url这东西
date: 2016-08-16 22:58:40
tags:
    - JavaScript
    - 随笔
    - 分享
    - URL
categories:
    - 随笔
    - 分享
---

> 作者：ManfredHu
> 链接：http://www.manfredhu.com/2016/08/16/22-url
> 声明：版权所有，转载请保留本段信息，否则请不要转载

![URL](/images/urlPic/main.jpg)

# URL

> 统一资源定位符（或称统一资源定位器/定位地址、URL地址等，英语：Uniform / Universal Resource Locator，常缩写为URL），有时也被俗称为网页地址（网址）。如同在网络上的门牌，是因特网上标准的资源的地址（Address）。——维基百科

一个完整的URL通常有这样的几部分构成：

```
标准格式：
scheme://host:port/pathname?search#hash

例子：
http://www.x2y2.com/fisker/post/0703/gg.mm.html?ver=1.0&id=6#imhere
```

格式部分 | 例子对应的部分 | 获取代码
------------ | ------------- | ------------- 
protocol | http: | `window.location.protocol`
host | www.x2y2.com | `window.location.host`
port | http默认为80，https默认为443，本例为空 | `window.location.port`
pathname | /fisker/post/0703/gg.mm.html | `window.location.pathname`
search | ?ver=1.0&id=6 | `window.location.search`
hash | #imhere | `window.location.hash`

## window.location.href 和 window.location.replace
- `window.location.href` 是一个可读可写的属性。读则返回整个URI字符串，写则跳转页面。
- `window.location.replace` 是一个方法，同样用于页面跳转，只是同时会把历史纪录替换掉，所以你后退回不去原来的链接，而 `window.location.href` 是有记录的。

**注意：**这里只可以跳转到同个host下的不同pathname。

```js
//如果你打开www.baidu.com在控制台输入
window.location.href = "www.qq.com";
//则url会变成 https://www.baidu.com/www.qq.com
//百度会告诉你它根本不认识这货而跳转到错误搜索
//测试环境为Chrome
```








