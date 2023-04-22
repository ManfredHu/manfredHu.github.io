# ios 下时间初始化错误

## PC 上都正常

```js
new Date('2019.10.02 10:10:10')
new Date('2019-10-02 10:10:10')
new Date('2019/10/02 10:10:10')
new Date('2011-10-10T14:48:00')
Date.parse('2019.10.02 10:10:10')
Date.parse('2019-10-02 10:10:10')
Date.parse('2019/10/02 10:10:10')
Date.parse(`2011-10-10T14:48:00`)
```

在 PC 上都支持，测试的是 Chrome 浏览器

## ios 下

奇葩的 ios 就神奇了，有的返回 NaN，有的解析不了，也是醉了

```js
new Date('2019.10.02 10:10:10') // 无法解析
new Date('2019-10-02 10:10:10') // OK
new Date('2019/10/02 10:10:10') // OK
Date.parse('2019.10.02 10:10:10') // NaN
Date.parse('2019-10-02 10:10:10') // NaN
Date.parse('2019/10/02 10:10:10') // OK
new Date('2011-10-10T14:48:00') // OK
Date.parse(`2011-10-10T14:48:00`) // OK
```

![](https://manfredhu-1252588796.cos.ap-guangzhou.myqcloud.com/clipboard_20200115114200.png)

综上，如果你用的 new Date 比较多可以用`2019-10-02 10:10:10`这样的时间格式，如果用`Date.parse`的话请用`2019-10-02T10:10:10`这样的标准时间格式。

## 深层原因
因为iOS底层的JS解析引擎跟安卓的并不一致, 这里可以看 [浏览器现状](../broswer/2022-5-5.broswer-present-situation)