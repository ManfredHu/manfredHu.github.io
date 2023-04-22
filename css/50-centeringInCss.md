# CSS 中的居中思路

原文：[Centering in CSS: A Complete Guide](https://css-tricks.com/centering-css-complete-guide/)

## 水平居中 Horizontally

### 内联元素

包括文本 span 和链接 a 标签之类的内联元素，可以用

```css
.center-children {
  text-align: center;
}
```

对于类似`inline, inline-block, inline-table, inline-flex`的元素都会起作用

### 块级元素

对于有宽度的块级元素可以设置`margin:0 auto`来居中

```css
.center-me {
  margin: 0 auto;
}
```

### 多个块级元素

原理类似，可以设置子元素`display:inline-block`使其变为内联元素，然后通过`text-align:center`居中，如下

```html
<main class="inline-block-center">
  <div>
    I'm an element that is block-like with my siblings and we're centered in a
    row.
  </div>
  <div>
    I'm an element that is block-like with my siblings and we're centered in a
    row. I have more content in me than my siblings do.
  </div>
  <div>
    I'm an element that is block-like with my siblings and we're centered in a
    row.
  </div>
</main>
```

```css
.inline-block-center {
  text-align: center;
}
.inline-block-center div {
  display: inline-block;
  text-align: left;
}
```

flex 也可以起作用，而且更简单

```html
<main class="flex-center">
  <div>
    I'm an element that is block-like with my siblings and we're centered in a
    row.
  </div>
  <div>
    I'm an element that is block-like with my siblings and we're centered in a
    row. I have more content in me than my siblings do.
  </div>
  <div>
    I'm an element that is block-like with my siblings and we're centered in a
    row.
  </div>
</main>
```

```css
.flex-center {
  display: flex;
  justify-content: center;
}
```

## 垂直居中 Vertically

### 内联元素

#### 单行文本

可以设置上下 padding 一样

```css
.link {
  padding-top: 30px;
  padding-bottom: 30px;
}
```

也可以设置 `line-height`和 `height` 一样大小

```css
.center-text-trick {
  height: 100px;
  line-height: 100px;
  white-space: nowrap;
}
```

#### 多行文本

多行文本用上下 padding 的方式也可以居中，但是如果这还不能满足你的需求，例如在表格单元格里面，可以考虑`vertical-align`属性

```html
<div class="center-table">
  <p>
    I'm vertically centered multiple lines of text in a CSS-created table
    layout.
  </p>
</div>
```

```css
.center-table {
  display: table;
  height: 250px;
  background: white;
  width: 240px;
  margin: 20px;
}
.center-table p {
  display: table-cell;
  margin: 0;
  background: black;
  color: white;
  padding: 20px;
  border: 10px solid white;
  vertical-align: middle;
}
```

如上，如果不设置`vertical-align`则默认为`baseline`，文本会在顶部。设置为`middle`则居中

::: tip
浏览器默认 td 标签的`vertical-align`为`middle`
:::

当然你还是可以用 flexbox 实现

```css
.flex-center-vertically {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 400px;
}
```

使用一个透明的元素撑起容器，通过`vertical-align: middle`来实现垂直居中

```html
<div class="ghost-center">
  <p>
    I'm vertically centered multiple lines of text in a container. Centered with
    a ghost pseudo element
  </p>
</div>
```

```css
.ghost-center::before {
  content: ' ';
  display: inline-block;
  height: 100%;
  width: 1%;
  vertical-align: middle;
}
.ghost-center p {
  display: inline-block;
  vertical-align: middle;
}
```

### 块级元素

#### 高度已知

可以使用负边距来实现，如下已知高度`100px`，可以设置`margin-top: -50px`来居中

```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  height: 100px;
  margin-top: -50px; /* account for padding and border if not using box-sizing: border-box; */
}
```

#### 高度未知

虽然高度未知，但是还是可以居中，使用 transform 实现

```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}
```

#### 不关心撑开容器的高度

如果不关心撑开容器的高度的高度，可以用`table`布局，这样在子元素设置`display: table-cell`和`vertical-align:midlle`可以实现垂直居中，可以参考上面，与`<td>`标签一样。

```html
<main>
  <div>
    I'm a block-level element with an unknown height, centered vertically within
    my parent.
  </div>
</main>
```

```css
main {
  background: white;
  height: 300px;
  margin: 20px;
  width: 300px;
  position: relative;
  padding: 20px;
  display: table;
}
main div {
  background: black;
  color: white;
  padding: 20px;
  display: table-cell;
  vertical-align: middle;
}
```

#### flexbox

```css
.parent {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
```

## 水平垂直居中

小孩子才做选择，大人全都要。不只是水平，我垂直也要居中。

### 固定宽高

还是利用的负边距，实现水平垂直居中，当然这里注意父元素的`position: relative`

```css
.parent {
  position: relative;
}

.child {
  width: 300px;
  height: 100px;
  padding: 20px;

  position: absolute;
  top: 50%;
  left: 50%;

  margin: -70px 0 0 -170px;
}
```

### 宽高未知

使用`transform`来实现

```css
.parent {
  position: relative;
}
.child {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
```

### flexbox

```css
.parent {
  display: flex;
  justify-content: center;
  align-items: center;
}
```

### grid

这是一个比较新的属性，微信还没完全支持。桌面端用的话可以开始了。可以看[这里](https://www.zhangxinxu.com/wordpress/2018/11/display-grid-css-css3/)

```html
<span>
  I'm centered!
</span>
```

```css
body,
html {
  height: 100%;
  display: grid;
}
span {
  /* thing to center */
  margin: auto;
}
```
