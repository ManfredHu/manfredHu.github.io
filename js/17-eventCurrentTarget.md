# event.target 的亲兄弟 event.currentTarget

![Target](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/target.jpg)

做项目的时候遇到的一个挺好玩的属性，就是`event.currentTarget`这个东西，可能我们以前用的比较多的是`event.target`。

## 场景

我们在列表下`<li>`标签绑定了事件，然后`<li>`下是一堆的`<i>` 标签用作动画。并且`<li>`上有用属性定义着要跳转的地址。

## 提取例子

```html
<ul id="outer">
  <li id="inner"></li>
</ul>
<div id="result"></div>
```

```css
body {
  padding: 25px;
  font-family: Helvetica, Arial, sans-serif;
}

#outer {
  float: left;
  padding: 50px;
  margin: 0 0 25px;
  background-color: #086fa1;
}

#inner {
  width: 100px;
  height: 100px;
  background-color: #3ca0d0;
}

#result {
  clear: left;
}

code {
  font-size: 1.2em;
}

p,
ul {
  margin: 0 0 25px;
}
```

```javascript
var outer = document.getElementById('outer'),
  result = document.getElementById('result')

outer.addEventListener('click', function(e) {
  var html = ''
  if (e.target === outer && e.currentTarget === outer) {
    html +=
      '<p>Outer element was clicked directly - it is <code>e.target</code> <em>and</em> <code>e.currentTarget</code>.</p>'
  }

  if (e.target !== outer && e.currentTarget === outer) {
    html +=
      '<p>Outer element is the current target, but it was not clicked directly - it is <code>e.currentTarget</code>.</p>'
  }

  html += [
    '<ul>',
    '<li><code>e.target === &lt;div id="',
    e.target.id,
    '"&gt;</code></li>',
    '<li><code>e.currentTarget === &lt;div id="',
    e.currentTarget.id,
    '"&gt;</code></li>',
    '</ul>'
  ].join('')

  result.innerHTML = html
})
```

## 总结

针对不同的属性，总结两点如下：

- `event.target`捕获发出事件的目标，也是就相当于事件的产生者的意思
- `event.currentTarget`则是相当于事件冒泡被设置好监听的对象捕获了。

所以如果遇到外层元素如果设置了监听函数而里面还有其他元素的情况下，为了防止点击里面的元素通过`event.target`获取不到事件对象，可以用`event.currentTarget`来获取。
