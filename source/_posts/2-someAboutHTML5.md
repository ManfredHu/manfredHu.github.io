---
title: 到了HTML5时代写HTML代码要注意的东西
date: 2016-01-17 19:16:21
tags: 
	- HTML
	- 笔记
categories: 
	- 笔记
	- HTML
---

![](/images/html.png)

## DOCTYPE
这是一个写在HTML头部的东西，浏览器会根据不同的`DOCTYPE`来识别不同的模式，后面的渲染和优化也会不一样，作为一个前端我们会严格要求自己。所以通常会copy一下的是不是^_^。
但是`在Eclipse中默认的不是HTML5的DOCTYPE`,切记切记改过来噢亲。

### 常见的DOCTYPE有

- 1.HTML 4.01 Strict

```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

- 2.XHTML 1.0 Strict

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" 
"http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```

## 标签不再自闭合
如果你从XHTML开始严格要求自己，你会经常写这样的代码

```html
<input type="text" placeholder="请输入作者……" id="writer" name="writer" />
 ```

 本来这应该是没错的，但是如果转到HTML5时代的话，后面的`/>`变成`>`会更好。
 自己有时候也没意识过来，在XHTML时代这种叫自闭合标签，但是在HTML5时代，不需要了。


## 字符编码不用写那么长了

还有的，如charset也不用像下面这样写了。

 ```html
<meta http-equiv="Content-Type" content="text/html;charset=utf-8">
```

取而代之的是下面这样简便的写法

```html
<meta charset="utf-8">
```