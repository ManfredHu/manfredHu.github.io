# CSS杂技 

![](../images/css.png)

## 浏览器默认样式
[浏览器默认样式](https://source.chromium.org/chromium/chromium/src/+/main:third_party/blink/renderer/core/html/resources/html.css) Chromium源码的HTML默认样式，默认元素的`margin:8px`就是这里加上去的

## CSS的本质
CSS在浏览器解析StyleSheet时会解析为每个DOM对应的**ComputedStyle**，这就是节点最终的样式，也可以通过JS的API`Window.getComputedStyle()`获取到节点的样式信息。隐藏的节点如`display:none`，不在`Layout Tree`里，所以也不需要对应的**ComputedStyle**。

同理伪类伪元素如`p::before{content:"Hi!"}`也不在DOM里而是在`Layout Tree`里

可以参考 [渲染流水线流程](https://developers.google.com/web/updates/2018/09/inside-browser-part3#style_calculation)
## 清除浮动

老生常谈的话题，面试经常问的问题
解决方法有很多种，这里讲几种

### 子元素加 clear

```html
<div class="news">
  <p>Some Text</p>
  <br class="clear" />
</div>
```

```css
.news {
  background: gray;
  border: solid 1px black;
}
.news p {
  float: right;
}
.clear {
  clear: both;
}
```

这种方法可以扩展出很多种不同的方法，如 JS 动态添加，设置一个公共的类然后添加，或者直接就是一段内联 style 的 html 代码，但是原理都是用到了`clear`这个属性

### 父元素 BFC 化

HTML 文档流是盒子模型的，BFC 就是组织盒子模型的形式，当元素的类型如标签(p 和 span)不一样的时候，其表现出来的样子是不一样的。
所以 BFC 就是让这个元素看起来像盒子的一种代称，BFC 全称 _Box Formatting Context_。CSS2.1 还有 IFC,即*Inline Formatting Context*。

**BFC 布局规则：**

- 内部的 Box 会在垂直方向，一个接一个地放置
- Box 垂直方向的距离由 margin 决定。属于同一个 BFC 的两个相邻 Box 的 margin 会发生重叠
- 每个元素的 margin box 的左边， 与包含块 border box 的左边相接触(对于从左往右的格式化，否则相反)。即使存在浮动也是如此
- BFC 的区域不会与 float box 重叠
- BFC 就是页面上的一个隔离的独立容器，容器里面的子元素不会影响到外面的元素。反之也如此
- 计算 BFC 的高度时，浮动元素也参与计算

**产生 BFC 的条件：** 当然普通的块级元素默认呈现块级的样子，但是通过 CSS 我们可以可以让某些元素呈现 BFC 的形态（块级形态）

1. 根元素(html 元素)
2. float 不为 none 的元素(包括 left,right,inherit 三个，因为 float 只有四个值)
3. position 为 absolute 或 fixed
4. display 为 inline-block,table-cell,table-caption,flex,inline-flex
5. overflow 不为 visible(包括 hidden,scroll,auto,inherit 四个值)

如下面的为在父元素加`float`属性使其 BFC 化

```html
<div class="news">
  <p>Some Text</p>
  <br class="clear" />
</div>
```

```css
.news {
  background: gray;
  border: solid 1px black;
}
.news p {
  float: right;
}
.clear {
  clear: both;
}
```

## 透明度

### opacity

> `opacity`属性是 CSS3 新增的属性，取值为 0.0(完全透明)到 1.0(完全不透明)，后代元素也会一起被影响

```css
p {
  filter: alpha(opacity=80); /*IE5-7，注意这里取值80*/
  opacity: 0.8; /*IE8+*/
  color: #000;
}
```

### RGBA

RGBA 是扩展透明度的一种格式，a 代表 alpha 透明度。IE9+支持 RGBA 写法。

```css
p {
  background-color: rgba(0, 0, 0, 0.8); /*取值0-1*/
  color: #fff;
}
```

**RGBA 与 opacity 的区别是**：opacity 会影响整个元素，而 RGBA 影响单一的属性。

### PNG 图片的问题

png 图片的最大优势是支持 alpha 透明度，但是 IE6 不直接支持 PNG 透明度，PNG 透明度自 IE7 才支持。
好的是现在已经逐渐淘汰了 IE6，

## 拥有布局的问题

**默认拥有布局的元素：**

- body/html
- table/tr/td
- img
- hr
- input/select/textarea/button
- iframe/embed/object/applet/marquee

**所以其实`div`和`span`是没有布局的。**

设置以下 CSS 属性会让元素获得布局。

1. float: left/right
2. display: inline-block
3. width/height
4. zoom: 任何值（只有 IE）

IE7 中以下属性也触发布局(下面三个属性只有 IE7+才支持)

1. overflow: hidden/scroll/auto
2. min-width: 任何值
3. max-width: 除 none 之外的任何值

## 条件注释

- lt <
- lte <=
- gt >
- gte >=

条件注释写法如下，这里的是 XHTML 写法，所以后面会以`/>`结尾，HTML5 写法最好是没有反斜杠

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

## IE 常见的 BUG 及其解决方法

下面这些 BUG 都是很有代表性的，在我做的项目中下面的 bug 基本都遇到了。-\_-!!这运气真不是一般好。
当然现在说起 IE6 兼容很多人可能会嗤之以鼻，但是我觉得在天朝大国这个连学校都在用着 XP 的地方，身为一名合格的前端，IE6 兼容必须要过关。

### 双外边距浮动 BUG

在元素有外边距且浮动的时候

```css
div.someone {
  float: left;
  margin-left: 20px;
}
```

**解决方法**
对`float`的元素设置`display:inline`

```css
div.someone {
  float: left;
  margin-left: 20px;
  display: inline;
}
```

### 3 像素文本偏移 bug

当文本与一个浮动元素相邻时这个 bug 有可能出现

```css
div.myFloat {
  float: left;
  width: 200px;
}
p {
  margin-left: 200px;
}
```

**解决方法(IE6 以上)**

```css
p {
  height: 1%; /*拥有布局*/
  margin-left: 0;
}
.myFloat {
  margin-left: -3px; /*重要的一句，等于左边的浮动元素的宽度缩小了3px*/
}
```

### IE6 的重复字符 bug

当一系列浮动元素排列在一排，如果最后的元素重复出现则是这个 bug。
ps：通常是代码有添加注释的情况

**解决方法**

1. 运用负外边距
2. 清除注释

### IE6 的“躲猫猫”bug

当一个浮动元素后面跟着一些非浮动元素，然后是一个清理元素，所有这些元素包含在一个设置了背景颜色或图像的父元素中。如果清理元素碰到了浮动元素，那么中间的非浮动元素看起来像消失了，只有在刷新页面的时候才出现。

**解决方法**

1. 去掉父元素上的背景颜色或图像
2. 避免清理元素与浮动元素接触
3. 容器指定行高
4. 将浮动元素和容器元素的 position 属性设置为 relative
