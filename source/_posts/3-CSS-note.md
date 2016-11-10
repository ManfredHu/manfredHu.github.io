---
title: CSS笔记
date: 2016-01-17 20:27:02
tags: 
	- CSS
	- 笔记
categories: 
	- 笔记
	- CSS
---

![](/images/css.png)

## 1.清除浮动
老生常谈的话题，面试经常问的问题
解决方法有很多种，这里讲几种

### 1.1 子元素加clear

```html
<div class="news">
    <p>Some Text</p>
    <br class="clear">
</div>
```

```css
.news{
    background: gray;
    border: solid 1px black;
}
.news p{
    float: right;
}
.clear{
    clear: both;
}
```
这种方法可以扩展出很多种不同的方法，如JS动态添加，设置一个公共的类然后添加，或者直接就是一段内联style的html代码，但是原理都是用到了`clear`这个属性

### 1.2 父元素BFC化


HTML文档流是盒子模型的，BFC就是组织盒子模型的形式，当元素的类型如标签(p和span)不一样的时候，其表现出来的样子是不一样的。
所以BFC就是让这个元素看起来像盒子的一种代称，BFC全称 *Box Formatting Context*。CSS2.1还有IFC,即*Inline Formatting Context*。


**BFC布局规则：**

* 内部的Box会在垂直方向，一个接一个地放置
* Box垂直方向的距离由margin决定。属于同一个BFC的两个相邻Box的margin会发生重叠
* 每个元素的margin box的左边， 与包含块border box的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此
* BFC的区域不会与float box重叠
* BFC就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此
* 计算BFC的高度时，浮动元素也参与计算


**产生BFC的条件：**当然普通的块级元素默认呈现块级的样子，但是通过CSS我们可以可以让某些元素呈现BFC的形态（块级形态）

1. 根元素(html元素)
2. float不为none的元素(包括left,right,inherit三个，因为float只有四个值)
3. position为absolute或fixed
4. display为inline-block,table-cell,table-caption,flex,inline-flex
5. overflow不为visible(包括hidden,scroll,auto,inherit四个值)


如下面的为在父元素加`float`属性使其BFC化

```html
<div class="news">
    <p>Some Text</p>
    <br class="clear">
</div>
```

```css
.news{
    background: gray;
    border: solid 1px black;
}
.news p{
    float: right;
}
.clear{
    clear: both;
}
```

## 2.透明度


### 2.1 opacity

>`opacity`属性是CSS3新增的属性，取值为0.0(完全透明)到1.0(完全不透明)，后代元素也会一起被影响

```css
p{
    filter: alpha(opacity=80); /*IE5-7，注意这里取值80*/
    opacity: 0.8; /*IE8+*/
    color: #000;
}
```

### 2.2 RGBA
RGBA是扩展透明度的一种格式，a代表alpha透明度。IE9+支持RGBA写法。

```css
p{
    background-color: rgba(0,0,0,0.8); /*取值0-1*/
    color: #fff;
}
```
**RGBA与opacity的区别是**：opacity会影响整个元素，而RGBA影响单一的属性。

### 2.3 PNG图片的问题
png图片的最大优势是支持alpha透明度，但是IE6不直接支持PNG透明度，PNG透明度自IE7才支持。
好的是现在已经逐渐淘汰了IE6，


## 3.拥有布局的问题

**默认拥有布局的元素：**

- body/html
- table/tr/td
- img
- hr
- input/select/textarea/button
- iframe/embed/object/applet/marquee

**所以其实`div`和`span`是没有布局的。**

设置以下CSS属性会让元素获得布局。

1. float: left/right
2. display: inline-block
3. width/height
4. zoom: 任何值（只有IE）

IE7中以下属性也触发布局(下面三个属性只有IE7+才支持)

1. overflow: hidden/scroll/auto
2. min-width: 任何值
3. max-width: 除none之外的任何值

## 4.条件注释

- lt  <
- lte <=
- gt  >
- gte >=

条件注释写法如下，这里的是XHTML写法，所以后面会以`/>`结尾，HTML5写法最好是没有反斜杠

```html
<!-- [if IE 6]>
    <link rel="stylesheet" type="text/css" href="/css/ie6.css" />
<![endif]-->

<!-- [if !IE 6]>
    <link rel="stylesheet" type="text/css" href="/css/ie6.css" />
<![endif]-->

<!-- [if gte IE 6]>
    <link rel="stylesheet" type="text/css" href="/css/ie6.css" />
<![endif]-->
```

## 5.IE常见的BUG及其解决方法
下面这些BUG都是很有代表性的，在我做的项目中下面的bug基本都遇到了。-_-!!这运气真不是一般好。
当然现在说起IE6兼容很多人可能会嗤之以鼻，但是我觉得在天朝大国这个连学校都在用着XP的地方，身为一名合格的前端，IE6兼容必须要过关。

### 5.1 双外边距浮动BUG

在元素有外边距且浮动的时候

```css
div.someone{
    float: left;
    margin-left: 20px;
}

```
**解决方法**
对`float`的元素设置`display:inline`

```css
div.someone{
    float: left;
    margin-left: 20px;
    display: inline;
}

```

### 5.2 3像素文本偏移bug
当文本与一个浮动元素相邻时这个bug有可能出现

```css
div.myFloat{
    float: left;
    width:200px;
}
p{
    margin-left:200px;
}
```
**解决方法(IE6以上)**

```css
p{
    height: 1%; /*拥有布局*/
    margin-left: 0;
}
.myFloat{
    margin-left: -3px; /*重要的一句，等于左边的浮动元素的宽度缩小了3px*/
}
```

### 5.3 IE6的重复字符bug
当一系列浮动元素排列在一排，如果最后的元素重复出现则是这个bug。
ps：通常是代码有添加注释的情况

**解决方法**

1. 运用负外边距
2. 清除注释

### 5.4 IE6的“躲猫猫”bug
当一个浮动元素后面跟着一些非浮动元素，然后是一个清理元素，所有这些元素包含在一个设置了背景颜色或图像的父元素中。如果清理元素碰到了浮动元素，那么中间的非浮动元素看起来像消失了，只有在刷新页面的时候才出现。

**解决方法**

1. 去掉父元素上的背景颜色或图像
2. 避免清理元素与浮动元素接触
3. 容器指定行高
4. 将浮动元素和容器元素的position属性设置为relative







