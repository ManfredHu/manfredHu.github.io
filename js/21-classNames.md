# React classNames 模块

![classNames](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/classNames.png)

# classNames

今天分享一个好玩的东西，它叫 [**classNames**](https://github.com/ManfredHu/classnames) ,这个是一个翻译的版本，原版链接在[这里](https://github.com/JedWatson/classnames)它是一个**小工具**。我是在 React 项目里面用到它的。一用就停不下来了

## 它是什么？

它是一个简单的对类名进行条件判断并且拼装的小工具。通过条件判断把对应的 class 串接起来，可以更清晰的展示组件的状态对应的 css.
总的来说，就是**让你的代码可读性更高**

## 它用在哪里？

React 官方推荐用它，当然，既然是小工具，那么肯定扩展性是非常强的。**不仅仅是 React**!!**不仅仅是 React**!!**不仅仅是 React**!!重要的事情我们说三遍

## 为什么要用它？

项目 CSS 代码的规范遵循的是[BEM](http://www.w3cplus.com/css/bem-definitions.html)，所以我们有很多的类名是有状态定义的，比如 `.sidebar__item--active` 。你应该可以一眼看出来，这是一个侧边导航栏的激活状态，在选中的时候显示。但是通常还有一个默认状态 `.sidebar__item` ，那么这个时候，你通常会加多一个判断语句，因为你需要判断是不是激活的。

![侧边栏激活状态](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/sidebar-active.png)

```javascript
var SideBar = React.createClass({
  // ...
  render() {
    var sideBarClass = 'sidebar__item'
    if (this.state.isActive) {
      sideBarClass += '--active'
    }
    return <div className={sideBarClass}>{this.props.text}</div>
  }
})
```

那么假设你还有一个自定义颜色的 `.sidebar__item-orange` 类。
那你的代码会多一个 `if` 判断.

```javascript
var SideBar = React.createClass({
  // ...
  render() {
    var sideBarClass = 'sidebar__item'
    if (this.state.isActive) {
      sideBarClass += '--active'
    }
    if (this.props.color) {
      sideBarClass += '' + this.props.color //'+'优先于'+='
    }
    return <div className={sideBarClass}>{this.props.text}</div>
  }
})
```

假如……好了没那么多假如了，你的类名有多长，你的 `if` 就会有多长。
所以作为一个有追求的前端，**不能忍!!**

![不能忍](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/canNotEndure.jpg)

## 怎么用？

还是上面的例子

```javascript
var cl = require('classnames');
var SideBar = React.createClass({
  // ...
  render () {
    var sideBarClass = cl({
        'sidebar__item': true,
        '--active': this.state.isActive,
        [this.props.color] :this.props.color, //这里用的是ES6的语法，可以用JSX编译工具如babel转换出来
        ....
        ....
        ....
    });
    return <div className={sideBarClass}>{this.props.text}</div>;
  }
});
```

有多少可以来多少，不怂好吗。
引用了一个模块，我们的代码就优雅了好多了，可能你还会担心，这模块大不大啊，引入的话会不会得不偿失啊。我们看一下源代码吧。

```javascript
;(function() {
  var hasOwn = {}.hasOwnProperty
  function classNames() {
    var classes = []
    for (var i = 0; i < arguments.length; i++) {
      var arg = arguments[i]
      if (!arg) continue
      var argType = typeof arg
      if (argType === 'string' || argType === 'number') {
        classes.push(arg)
      } else if (Array.isArray(arg)) {
        classes.push(classNames.apply(null, arg))
      } else if (argType === 'object') {
        for (var key in arg) {
          if (hasOwn.call(arg, key) && arg[key]) {
            classes.push(key)
          }
        }
      }
    }
    return classes.join(' ')
  }

  //CommonJS规范
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = classNames

    //AMD规范
  } else if (
    typeof define === 'function' &&
    typeof define.amd === 'object' &&
    define.amd
  ) {
    // register as 'classnames', consistent with npm package name
    define('classnames', [], function() {
      return classNames
    })

    //其他
  } else {
    window.classNames = classNames
  }
})()
```

代码真心短得可怜，而且还可以再 DIY,最后三个`if`，其实你可以选择你项目用的规范来引入。默认支持 CommonJS 规范/AMD 规范/全局定义 三种。

我们再观察一下原理部分，看有没有什么 bug。知己知彼才能放心**插入**嘛

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/heihei.gif)

一个内部数组`classes`，然后对参数进行判断后将参数添加到内部数组里
参数类型判断条件

- string 或者 number 类型直接 push 到数组
- Array 类型则递归这个数组
- Object 类型则把键为 true 的加入数组

最后`join`了数组返回一个字符串。代码很简单，但是创意无限。
非常推荐大家用这个模块。有问题可以留言哈。
