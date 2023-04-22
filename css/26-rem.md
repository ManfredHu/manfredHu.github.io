# CSS 的 rem 单位

![](../images/niu.jpg)

## 原理：改变 font-size 来进行自适应

`rem` 这个属性，通过在 `html` 元素设置一个初始大小，然后全部单位用 `rem` 来计算，则页面自适应。

## 兼容性

现在大部分浏览器 IE9+，Firefox、Chrome、Safari、Opera ，如果我们不修改相关的字体配置，都是默认显示 **font-size 是 16px** 即：

```css
html {
  font-size: 16px;
}
```

则设置了 `<html>` 之后，后面的大小样式会这样写，如

```css
p {
  font-size: 0.75rem; //12÷16=0.75（rem）
}
```

所以你很容易想到，根据屏幕宽度和高度来动态改变 `<html>` 的 `font-size` 的大小，那么页面的大小也随之变化了。

## [deprected] 结合 JS 做自适应布局
### Style Set
全局reset html元素font-size为100px，再定一个less全局变量`@rem`
```css
/* CSS全局设置 reset */
html {
  font-size: 100px;
}
```

```less
/* less全局变量 global variables */
@rem: 200rem;
```

如上设置后，当我们less代码写`width: 750/@rem`后会被换算，按照设计稿750，取标准的iphone6/7/8宽度为375,换算过程如下
```
width: 750 / @rem
=> width: 750 / 200rem
=> width 750/200*100px
=> width: 375px
```

OK，这里适配了标准的移动端设备了。但是还有414宽度这种，例如iphone6/7/8 plus，所以还有一个小范围的动态适配过程
### JS脚本动态修改font-size
下面是一段做自适应布局的 JS 脚本

```js
/**
 * 判断用户client width
 * 然后给html设置一个font-size
 * 目的是为了方便rem做自适应布局
 */

;(function(doc, win) {
  var docEl = doc.documentElement,
    //判断是横竖屏
    resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
    func = function() {
      var clientWidth = docEl.clientWidth
      if (!clientWidth) return
      //按照比例缩放
      var docElWidth = 100 * (clientWidth / 320)
      //最大值
      if (docElWidth > 200) docElWidth = 200
      // console.log(docElWidth);
      docEl.style.fontSize = docElWidth + 'px'
    }

  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, func, false)
  doc.addEventListener('DOMContentLoaded', func, false)
})(document, window)
```

## 更好的方式
没有最好的，只有更好。上面的方法虽然已经支持移动端自适应了，但是还不够优雅
随着了解和深入，发现有一种简单的解决方法，这里补充下更简单的方法。

```bash
npm i postcss postcss-pxtorem -D
```

项目根目录新建`postcss.config.js`，内容如下

```js
module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5, // 按照1rem = 37.5px转化，则750宽度为20rem
      propList: ['*'],
      unitPrecision: 5
    }
  }
}
```

`postcss-pxtorem`会在编译时候把px转化为rem单位，默认标准移动端网页设计稿宽度为750px，标准iphone宽度`document.documentElement.clientWidth`为375
固代码里写750px，postcss应转为`<x> rem`，这里通过下面代码求比值

```ts
// import {deaultRem} from '@/config/rem'
import debug from 'debug'
const log = debug('worker:rem')

/**
 * change the fontSize property in html tag
 * 判断用户client width
 * 然后给html设置一个font-size
 * 目的是为了方便rem做自适应布局
 */

function rem(logicWidth = 750): void {
  const win = window
  const doc = document
  if (!win || !doc) {
    throw new Error('not window or document global object')
  }
  const docEl = doc.documentElement
  // 判断是横竖屏
  const resizeEvt =
    'orientationchange' in window ? 'orientationchange' : 'resize'

  function recalc() {
    const clientWidth = docEl.clientWidth
    if (!clientWidth) return
    // 按照比例缩放
    const salepro = clientWidth / logicWidth
    const baseSize = 37.5 // 与postcss.config.js的rootValue一致
    docEl.style.fontSize = baseSize * Math.min(salepro, 2) + 'px'
    log('set <html> font-size', docEl.style.fontSize)
  }

  if (!doc.addEventListener) return
  win.addEventListener(resizeEvt, recalc, false)
  doc.addEventListener('DOMContentLoaded', recalc, false)
}
export default rem
```

`postcss-pxtorem`会默认16px为1rem，所以`rootValue: 16`，这里需要修改为`rootValue: 37.5`，即**一屏幕750px宽度默认为20rem**，以此求1rem值。与[阿里的flexible](https://github.com/amfe/lib-flexible)不一样，flexible默认375宽，且切割为10份。但是一般sketch稿子规定750宽


## vw
还有另一种vw的方案，原理就是切割为100份，因兼容性问题后面再介绍

可以看[这里](https://zhuanlan.zhihu.com/p/340299974)
