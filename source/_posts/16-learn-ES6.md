---
title: ES6快速学习
date: 2016-05-20 19:19:36
tags:
    - JavaScript
    - 随笔
    - ES6
categories:
    - 随笔
    - JavaScript
---

> 作者：ManfredHu
> 链接：http://www.manfredhu.com/2016/05/20/16-learn-ES6
> 声明：版权所有，转载请保留本段信息，否则请不要转载

![ECMAScript](/images/es6.jpeg)

ECMAScript6，由ECMA组织发布的一个新的JS语言标准。现在比较火的是一个叫babel的编译器，可以将ES6的语法代码转化为ES5，即现在主流浏览器能支持运行的语言。而React这个火到不行的框架在**0.13版本**之后将JSX的编译器由`JSTransform`和`react-tools`转换到`Babel`，也顺手将`Babel`这个支持ES6的编译器带火了，**现在`React`编写已支持ES6语法了**。

转化器只是手段，更多的说的话，现在的ES6被推广主要还是减少我们写代码的数量。

> 能自动化的过程不要手动去解决

这是懒人的标准思维。所以总的来说，未来几年ES6会逐渐普及并被应用于项目。Node都到了6.0了你还有理由不学ES6吗？

下面一个一个来做例子，推荐**scratch.js**，一个Chrome浏览器的插件，安装完成在控制台可以看到多了一项选项，点击进去就可以打代码了，打完点击按钮Run就能运行代码了，Toggle output可以让你看到翻译的ES5的语法。

## 1. Arrows箭头函数
```javascript
//ES6
var a = [9,5,2,7].map(v => v+1)

//ES5
var a = [9, 5, 2, 7].map(function (v) {
  return v + 1;
});
```
这里将v作为参数传入返回v+1。那如果有多个参数怎么办呢？

```javascript
//ES6
var a = [9,5,2,7].map((v,k) => v+1)

//ES5
var a = [9, 5, 2, 7].map(function (v, k) {
  return v + 1;
});
```

其实要注意的一点是ES6的开始拥有**块级作用域**的概念，如函数里面的this就已经支持了。

```javascript
//ES6
function pushOne() {
  this.nums.forEach(v => {
    if(v % 2 === 0) {
      this.arr.push(v);
    }
  })
}

//ES5
function pushOne() {
  var _this = this;

  this.nums.forEach(function (v) {
    if (v % 2 === 0) {
      _this.arr.push(v);
    }
  });
}

```

## 2. let和const

块级作用域的结构，用`let`代替`var`来声明变量那么写法真的就跟Java和C#没什么区别了。
```javascript
function f() {
  let x = 1;
  console.log(x);
}
f(); //1
```
但是如果是下面这样，就不行了
```javascript
function f() {
  {let x = 1;}
  console.log(x);
}
f();

```
因为let x被`{}`括起来的块级作用域限定了范围了,再看一个const的例子:

```javascript
function f() {
  const x = "pphu";
  console.log(x);
}
f(); //pphu
```
但是如果修改了const声明的值，就不行了
```javascript
function f() {
  const x = "pphu";
  console.log(x);
  x = "ManfredHu";
}
f(); //Error
```
其实这些语法都已经成为规范了，不用太去考虑翻译变成什么了，除非浏览器放弃ES6，否则ES6就将火下去。

### 3. 剩余参数

```javascript
function f(x,y,...a) {
    return (x+y) + a.length
}
console.log(f(1,2,"just do it",true,9527)) //6
```

### 4. 展开操作符

```javascript
var params = ['Hello',true,7];
var other = [1,2,...params];
console.log(other); //[1, 2, "Hello", true, 7]
```
炫酷没有？直接迭代了params的值copy到other中，我们来试试引用的。

```javascript
var arr = [1,2,3]
var params = [arr,'Hello',true,7];
var other = [1,2,...params];
console.log(other); //[1, 2, Array[3], "Hello", true, 7]
```
翻译的代码是用到了concat来合并数组项的


### 5. 字符串模板
模板这东西，用的多了，没想现在ES6也支持了，所以以后还能用的更爽。
```javascript
var name = 'ManfredHu' ;
var msg = `Hello World ,${name}!`
console.log(msg); //Hello World ,ManfredHu!
```
这货一出来突然发现以后不用自己拼装字符串了，很多代码习惯全部要改。越来越优雅越来越简单了。

### 6. 对象
> 有这么一个关于程序员（媛）的笑话：你想要对象？new一个啊，这么容易


```
let x = 1,y =2;
let obj = {
    x,y //直接声明了obj的x和y属性
}
console.log(obj.x) //1
console.log(obj.y) //2
```

### 7.Class类
这个应该是ES6比较有亮点的地方，JAVA和C#都有了类了，C++也是。所以很多童鞋写JavaScript总是有一种找不到方向的感觉。

```javascirpt
class Shape{
  constructor(id,x,y){
    this.id = id
    this.move(x,y)
  }
  move(x,y){
    this.x = x
    this.y = y
  }
}

class Reactangle extends Shape {
  constructor(id,x,y,width,height){
    super(id,x,y)
    this.width = width
    this.height = height
  }
}

console.log(new Reactangle(1,2,3,10,20)) //Reactangle {id: 1, x: 2, y: 3, width: 10, height: 20}
```
还可以这么玩
```javascirpt
var Shape = class{
  constructor(h,w){
    this.h= h
    this.w= w
  }
}
console.log(new Shape(10,20)) //Shape {h: 10, w: 20}
```
### 8.static静态方法
```javascirpt
class Man{
  constructor(name){
    this.name = name
  }
  static getSex(){
    return "Man"
  }
}

console.log(Man.getSex()) //Man
```

### 9.进制的问题
```javascirpt
console.log(0b111) //二进制111转化为十进制7
console.log(0o11) //八进制11转化为十进制9
```

### 10.解构赋值
```javascirpt
let foo = ['one','two','three'];
let [a,b,c] = foo;
console.log(a) //onw
console.log(b) //two
console.log(c) //three
```

### 11.Promise

1. new Promise(fn) 返回一个promise对象
2. 在fn 中指定异步等处理·
    - 处理结果正常的话，调用resolve(处理结果值)
    - 处理结果错误的话，调用reject(Error对象)

3. 两种状态，完成OR拒绝
    - promise对象被 resolve 时的处理(onFulfilled)
    - promise对象被 reject 时的处理(onRejected)

4. **Promise.resolve**
一般情况下我们都会使用 new Promise()来创建promise对象，但是除此之外我们也可以使用其他方法。
静态方法Promise.resolve(value) 可以认为是 new Promise() 方法的快捷方式。

如：
```javascript
Promise.resolve(42); 
```
可以认为是以下代码的语法糖。
```javascript
new Promise(function(resolve){
    resolve(42);
});
```
在这段代码中的 resolve(42); 会让这个promise对象立即进入确定（即resolved）状态，并将 42 传递给后面then里所指定的 onFulfilled 函数。


