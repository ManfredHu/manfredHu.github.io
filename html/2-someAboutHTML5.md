# 写 HTML5 代码要注意的东西

![html](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/html.png)

## DOCTYPE

这是一个写在 HTML 头部的东西，浏览器会根据不同的`DOCTYPE`来识别不同的模式，后面的渲染和优化也会不一样，作为一个前端我们会严格要求自己。所以通常会 copy 一下的是不是^\_^。
但是`在Eclipse中默认的不是HTML5的DOCTYPE`,切记切记改过来噢亲。

### 常见的 DOCTYPE 有

- 1.HTML 4.01 Strict

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

- 2.XHTML 1.0 Strict

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
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

## 标签写法

### 字符编码不用写那么长了
还有的，如 charset 也不用像下面这样写了。

```html
<meta http-equiv="Content-Type" content="text/html;charset=utf-8" />
```

取而代之的是下面这样简便的写法

```html
<meta charset="utf-8" />
```

### script 标签不用添加 type="text/javascirpt"

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