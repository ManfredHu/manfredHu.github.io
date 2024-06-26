# 重学HTML

## 文档结构
![新文档结构](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/html/html-new-architecture.png)

正如html下有head,body一样. 文档结构被重新定义, 现代文档结构一般拥有

```html
<body>
  <header>Header</header>
  <nav>Nav</nav>
  <main>
    <article>First post</article>
    <article>Second post</article>
  </main>
  <aside>Aside</aside>
  <footer>Footer</footer>
</body>
```

## <!DOCTYPE html>

这是一个写在 HTML 头部的东西，浏览器会根据不同的`DOCTYPE`来识别不同的模式，后面的渲染和优化也会不一样，作为一个前端我们会严格要求自己。所以通常会 copy 一下的是不是^\_^。
但是`在Eclipse中默认的不是HTML5的DOCTYPE`,切记切记改过来噢亲。

### 常见的 DOCTYPE 有

- 1. HTML 4.01 Strict
请直接忽略这种写法
```html
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

- 2. XHTML 1.0 Strict

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```

- 3. **推荐最简洁的写法**
```html
<!DOCTYPE html>
```

## Content language
类似下面的ISO+地区表达, 作为标识文档为美式英文. lang属性不只是用在HTML, 也可以用在body或者其他标签上. 
```html
<html lang="en-US">
</html>
```

同理也可以用在标签上配合CSS属性选择器实现一些特殊效果

```html
<span lang="fr-fr">Ceci n'est pas une pipe.</span>
```

```CSS
[lang|="fr"] // 表示带有以 lang 命名的属性的元素，属性值为“fr”或是以“fr-”为前缀（- 为连字符，Unicode 编码为 U+002D）开头。典型的应用场景是用来匹配语言简写代码（如 zh-CN、zh-TW 可以用 zh 作为 value）。
:lang(fr) // 可以看 https://developer.mozilla.org/zh-CN/docs/Web/CSS/:lang 这个例子
```

## charset
绝大多数浏览器默认的编码是windows-1252而不是UTF-8, 所以一般都需要申明文档编码

```html
<meta charset="utf-8" />
```

而不用像下面这样复杂

```html
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
```

## viewport
告诉浏览器响应式处理, 规定默认内容在默认视口的渲染形式. 虽然从2007年6月第一款iPhone问世以来，viewport meta标签就一直存在，但直到最近才在规范中记录下来。由于它可以控制视区的大小和比例，并防止站点内容被缩小到适合960px站点的320px屏幕，因此绝对推荐使用它。

```html
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=1" />
```

width=device-width: 设置视口宽度等于设备宽度，确保页面不会因为过大的初始缩放而在小屏设备上显示不全。
initial-scale=1: 设置初始缩放级别为1，确保页面首次加载时以正常的缩放级别呈现。
user-scalable=1: 允许用户手动缩放页面。

## Favicon
打开网站Tab会有一个小图标, 通常会是一个16倍数的小icon. 

```html
<link rel="icon" sizes="16x16 32x32 48x48" type="image/png" href="/images/mlwicon.png" />
```

## 标签不再自闭合

如果你从 XHTML 开始严格要求自己，你会经常写这样的代码

```html
<input type="text" placeholder="请输入作者……" id="writer" name="writer" />
```

本来这应该是没错的，但是如果转到 HTML5 时代的话，后面的`/>`变成`>`会更好。虽然很多Lint还是提示你标签没闭合

```html
<input type="text" placeholder="请输入作者……" id="writer" name="writer">
```

自己有时候也没意识过来，在 XHTML 时代这种叫自闭合标签，但是在 HTML5 时代，不需要了。

## script 标签不用添加 type="text/javascirpt"

以前是这么写的，但是现在如果里面的是 js，可以省略`type="text/javascirpt`了。

```html
<script
  type="text/javascript"
  src="https://unpkg.com/ggtool@1.0.9/lib/ggtool.js"
></script>
```

简单直接，不要啰嗦

```html
<script src="https://unpkg.com/ggtool@1.0.9/lib/ggtool.js"></script>
```

## 常见的块级元素和内联元素

| 项目        | 块级元素   |  行内元素  |
| --------   | -----:  | :----:  |
| 常见标签 | `p,div,blockquote,form,h1~h6,ol,ul,table` | `a,i,img,input,span,strong,textarea` |
| 排列        | 独占一行,默认情况下，其宽度自动填满其父元素宽度 | 相邻的行内元素会排列在同一行里，直到一行排不下，才会换行，其宽度随元素的内容而变化 |
| width/height | 可以设置width，height属性 | 设置width，height属性无效 |
| margin/padding | 可以设置margin和padding属性 | 起边距作用的只有margin-left、margin-right、padding-left、padding-right，其它属性不会起边距效果。 |

## 表单

### 表单Submit

下面两种都可以触发表单的submit事件

```
<input type="submit" value="提交"/><button>Button</button>
```

下面这样写不可以触发表单发送

```
<input type="button" value="Button"/>
```

自己可以[试下](http://www.w3school.com.cn/tiy/t.asp?f=html_form_submit)

## 字体

五大字体系列 

- sans-serif 无衬线系列，适合电脑端（Verdana，Arial，Geneva，Trebuchet MS)
- serif 有衬线系列，适合报纸等(Times,Times New Roman,Georgia)
- monospace 等宽字体，用于显示软件，网页等
- cursive 
- fantasy

## 一些容易忽略的点

- body里只可以填充块级元素，块元素在任何情况下都不允许包含在内联元素里
- 块元素禁止包含在p元素中，但是p元素可以包含所有的内联元素
- `<blockqoute>`只包含块元素，其他的内联元素置于块元素中再添加到`<blockquote>`
- `<a>`元素不能自我嵌套
- 空元素`<img /><hr /><br />`等不能嵌套其他元素
- **text-align**影响所有的内联元素，但只能作用于块元素,在`<div>`中使用时`<div>`内部的块元素默认继承此属性（有时候的居中是用这个做的）
- **line-height**属性属性被`<div>`内的所有元素继承，**line-height**可以用数字表示相对值(倍数)
- font是字体的属性缩写，如`font : font-style font-variant font-weight font-size/line-height font-family`

## 换行符

可以借助"&NewLine;" 实现换行效果，需要对元素设置 `white-space: pre-wrap`
例如：

```html
<div style='white-space: pre-wrap'>Line1&NewLine;Line2</div>
```

用`<br>`可以换行，`\n`在`JSON.parse()`会报错，

`&#10;` 也可以看 https://stackoverflow.com/questions/55707629/what-s-the-difference-between-10-and-newline

同时`&#8288;`可以实现强制不换行的效果


## 自定义数据

```html
<blockquote data-machine-learning="workshop"
  data-first-name="Blendan" data-last-name="Smooth"
  data-formerly="Margarita Maker" data-aspiring="Load Balancer"
  data-year-graduated="2022">
  HAL and EVE could teach a fan to blow hot air.
</blockquote>
```

如何获取这里的属性你? 如dat-machine-learning里的workshop. 有下面的方式

```js
el.dataset[machineLearning]; // workshop
e.dataset.machineLearning; // workshop
```

## 移动端Mobile

### format-detection

在HTML中，<meta> 标签的 format-detection 属性主要用于控制如何显示或处理在页面上遇到的格式化内容，例如电话号码、电子邮件地址或日期。这个属性通常在移动端网站开发中使用，以控制设备如何识别和处理这些信息。

例如，在默认情况下，许多移动浏览器会自动检测页面上的电话号码，并将其转换成可以点击的链接，允许用户直接拨打电话。如果你不希望这种自动转换发生，可以使用 format-detection 属性来禁用这一功能。

这里有一些常见的用法示例：

1. **禁用电话号码自动检测和链接化：**

```html
<meta name="format-detection" content="telephone=no">
```

这会告诉浏览器不要自动将数字转换为电话链接。

2. 开启或关闭其他自动检测功能：入地址, email等
```html
<meta name="format-detection" content="telephone=no,address=no,email=no">
```


可以通过这些代码来测试
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="format-detection" content="telephone=no" />
    <title>示例页面</title>
  </head>
  <body>
    <h1>欢迎来到我的网页</h1>
    <p>这是一个基本的HTML页面，展示了如何使用format-detection元标签。</p>
    <p>下面的数字不会被自动转换为电话链接：</p>
    <p>123-456-7890</p>
  </body>
</html>
```

结果展示如下, 数字部分会被检测为号码, 点击可以拉起手机的拨打电话. 通过format-detection可以阻止这种行为
![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/html/format-detection.jpg)