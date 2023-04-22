# ES6 快速学习

![ECMAScript](../images/es6.jpeg)

ECMAScript6，由 ECMA 组织发布的一个新的 JS 语言标准。现在比较火的是一个叫 babel 的编译器，可以将 ES6 的语法代码转化为 ES5，即现在主流浏览器能支持运行的语言。而 React 这个火到不行的框架在**0.13 版本**之后将 JSX 的编译器由`JSTransform`和`react-tools`转换到`Babel`，也顺手将`Babel`这个支持 ES6 的编译器带火了，**现在`React`编写已支持 ES6 语法了**。

转化器只是手段，更多的说的话，现在的 ES6 被推广主要还是减少我们写代码的数量。

> 能自动化的过程不要手动去解决

这是懒人的标准思维。所以总的来说，未来几年 ES6 会逐渐普及并被应用于项目。Node 都到了 6.0 了你还有理由不学 ES6 吗？

下面一个一个来做例子，推荐**scratch.js**，一个 Chrome 浏览器的插件，安装完成在控制台可以看到多了一项选项，点击进去就可以打代码了，打完点击按钮 Run 就能运行代码了，Toggle output 可以让你看到翻译的 ES5 的语法。

## Arrows 箭头函数

```javascript
//ES6
var a = [9, 5, 2, 7].map(v => v + 1)

//ES5
var a = [9, 5, 2, 7].map(function(v) {
  return v + 1
})
```

这里将 v 作为参数传入返回 v+1。那如果有多个参数怎么办呢？

```javascript
//ES6
var a = [9, 5, 2, 7].map((v, k) => v + 1)

//ES5
var a = [9, 5, 2, 7].map(function(v, k) {
  return v + 1
})
```

其实要注意的一点是 ES6 的开始拥有**块级作用域**的概念，如函数里面的 this 就已经支持了。

```javascript
//ES6
function pushOne() {
  this.nums.forEach(v => {
    if (v % 2 === 0) {
      this.arr.push(v)
    }
  })
}

//ES5
function pushOne() {
  var _this = this

  this.nums.forEach(function(v) {
    if (v % 2 === 0) {
      _this.arr.push(v)
    }
  })
}
```

## let 和 const

块级作用域的结构，用`let`代替`var`来声明变量那么写法真的就跟 Java 和 C#没什么区别了。

```javascript
function f() {
  let x = 1
  console.log(x)
}
f() //1
```

但是如果是下面这样，就不行了

```javascript
function f() {
  {
    let x = 1
  }
  console.log(x)
}
f()
```

因为 let x 被`{}`括起来的块级作用域限定了范围了,再看一个 const 的例子:

```javascript
function f() {
  const x = 'ManfredHu'
  console.log(x)
}
f() //ManfredHu
```

但是如果修改了 const 声明的值，就不行了

```javascript
function f() {
  const x = 'ManfredHu'
  console.log(x)
  x = 'ManfredHu'
}
f() //Error
```

其实这些语法都已经成为规范了，不用太去考虑翻译变成什么了，除非浏览器放弃 ES6，否则 ES6 就将火下去。

## 剩余参数

```javascript
function f(x, y, ...a) {
  return x + y + a.length
}
console.log(f(1, 2, 'just do it', true, 9527)) //6
```

## 展开操作符

```javascript
var params = ['Hello', true, 7]
var other = [1, 2, ...params]
console.log(other) //[1, 2, "Hello", true, 7]
```

炫酷没有？直接迭代了 params 的值 copy 到 other 中，我们来试试引用的。

```javascript
var arr = [1, 2, 3]
var params = [arr, 'Hello', true, 7]
var other = [1, 2, ...params]
console.log(other) //[1, 2, Array[3], "Hello", true, 7]
```

翻译的代码是用到了 concat 来合并数组项的

## 字符串模板

模板这东西，用的多了，没想现在 ES6 也支持了，所以以后还能用的更爽。

```javascript
var name = 'ManfredHu'
var msg = `Hello World ,${name}!`
console.log(msg) //Hello World ,ManfredHu!
```

这货一出来突然发现以后不用自己拼装字符串了，很多代码习惯全部要改。越来越优雅越来越简单了。

## 对象

> 有这么一个关于程序员（媛）的笑话：你想要对象？new 一个啊，这么容易

```
let x = 1,y =2;
let obj = {
    x,y //直接声明了obj的x和y属性
}
console.log(obj.x) //1
console.log(obj.y) //2
```

## Class 类

这个应该是 ES6 比较有亮点的地方，JAVA 和 C#都有了类了，C++也是。所以很多童鞋写 JavaScript 总是有一种找不到方向的感觉。

```js
class Shape {
  constructor(id, x, y) {
    this.id = id
    this.move(x, y)
  }
  move(x, y) {
    this.x = x
    this.y = y
  }
}

class Reactangle extends Shape {
  constructor(id, x, y, width, height) {
    super(id, x, y)
    this.width = width
    this.height = height
  }
}

console.log(new Reactangle(1, 2, 3, 10, 20)) //Reactangle {id: 1, x: 2, y: 3, width: 10, height: 20}
```

还可以这么玩

```js
var Shape = class {
  constructor(h, w) {
    this.h = h
    this.w = w
  }
}
console.log(new Shape(10, 20)) //Shape {h: 10, w: 20}
```

## static 静态方法

```js
class Man {
  constructor(name) {
    this.name = name
  }
  static getSex() {
    return 'Man'
  }
}

console.log(Man.getSex()) //Man
```

## 进制的问题

```js
console.log(0b111) //二进制111转化为十进制7
console.log(0o11) //八进制11转化为十进制9
```

## 解构赋值

```js
let foo = ['one', 'two', 'three']
let [a, b, c] = foo
console.log(a) //onw
console.log(b) //two
console.log(c) //three
```

## Promise

1. new Promise(fn)  返回一个 promise 对象
2. 在 fn  中指定异步等处理·

   - 处理结果正常的话，调用 resolve(处理结果值)
   - 处理结果错误的话，调用 reject(Error 对象)

3. 两种状态，完成 OR 拒绝

   - promise 对象被  resolve  时的处理(onFulfilled)
   - promise 对象被  reject  时的处理(onRejected)

4. **Promise.resolve**
   一般情况下我们都会使用  new Promise()来创建 promise 对象，但是除此之外我们也可以使用其他方法。
   静态方法 Promise.resolve(value)  可以认为是  new Promise()  方法的快捷方式。

如：

```javascript
Promise.resolve(42)
```

可以认为是以下代码的语法糖。

```javascript
new Promise(function(resolve) {
  resolve(42)
})
```

在这段代码中的  resolve(42);  会让这个 promise 对象立即进入确定（即 resolved）状态，并将  42  传递给后面 then 里所指定的  onFulfilled  函数。
