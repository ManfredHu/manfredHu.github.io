# 解析JS对象布局（__proto__、prototype、constructor）

 

> **这篇是自己在之前的[博客](http://www.cnblogs.com/manfredHu/p/4418594.html)写的，各种转载就不说了。**

大家都说 JavaScript 的属性多，记不过来，各种结构复杂不易了解。确实 JS 是一门入门快提高难的语言，但是也有其他办法可以辅助记忆。下面就来讨论一下 JS 的一大难点-对象布局，究竟设计 JS 这门语言的人当时是怎么做的？设计完之后又变成了什么？

## 原型、构造函数和实例三者的关系

我们来看一张图：

![原型-构造函数-实例三者的关系图](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/prototypeAndConstructor.png)

相信大家对这张图都不陌生了，构造函数有一个 prototype 属性指向其原型。相反原型也有一个 constructor 指向构造函数。与此同时实例也有一个 constructor 指向构造函数，这简直就是互相捆绑生怕找不到啊不是吗？

还有一个我们称之为秘密链接的**proto**属性，原谅我第一眼见到这个属性就觉得特别的怪，\_下划线都用上了，驼峰命名规则呢？好吧，这是部分浏览器暴露出来的一个指针而已，可能当时设计的时候随便写出来，突然发现这货有点用就留下了（纯属个人猜测）。

附上上图的检测代码不信的童鞋可以自己玩玩：

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <title>JS函数原型，函数，实例的关系证明</title>
  </head>
  <body>
    <script type="text/javascript">
      function Foo() {} //构造函数
      var a = new Foo() //实例
      console.log(Foo === Foo.prototype.constructor) //true
      console.log(a.constructor === Foo) //true
      console.log(Foo.prototype === Foo.prototype) //true
      console.log(a.__proto__ === Foo.prototype) //true
    </script>
  </body>
</html>
```

---

## JavaScript Object Layout

上面只是基础而已，下面才是真正的重点，为了修改这张图我可是煞费苦心，绞尽脑汁，不知道死了多少脑细胞。

![JS对象布局图](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/JavaScriptObjectLayout.jpg)

可能大家已经看晕了，没事冲杯咖啡慢慢看。下面是相应的证明代码，友情提示 sublimeText 看更爽：

```javascript
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<title>JavaScript对象布局</title>
</head>
<body>
    <script type="text/javascript">
        //以下代码全部为true
        console.log("1:"+(Object.prototype.__proto__ === null));
        console.log("2:"+(Function.prototype.__proto__===Object.prototype));
        console.log("3.1:"+(Number.__proto__ === Function.prototype));
        console.log("3.2:"+(Boolean.__proto__ === Function.prototype));
        console.log("3.3:"+(String.__proto__ === Function.prototype));
        console.log("3.4:"+(Object.__proto__ === Function.prototype));
        console.log("3.5:"+(Function.__proto__ === Function.prototype));
        console.log("3.6:"+(Date.__proto__ === Function.prototype));
        console.log("3.7:"+(Error.__proto__ === Function.prototype));
        console.log("3.8:"+(Array.__proto__ === Function.prototype));
        console.log("3.9:"+(RegExp.__proto__ === Function.prototype));
        console.log("4.1:"+(Math.__proto__===Object.prototype));
        console.log("4.2"+(JSON.__proto__===Object.prototype));
        function Foo(){} //构造函数
        var f1 = new Foo(); //实例
        console.log("5:"+(Foo===Foo.prototype.constructor));
        console.log("6.1:"+(f1.__proto__===Foo.prototype));
        console.log("7:"+(f1.constructor===Foo));
        console.log("8.1:"+(Number.prototype.__proto__===Object.prototype));
        console.log("8.2:"+(Boolean.prototype.__proto__===Object.prototype));
        console.log("8.3:"+(String.prototype.__proto__===Object.prototype));
        console.log("8.5:"+(Function.prototype.__proto__===Object.prototype));
        console.log("8.6:"+(Date.prototype.__proto__===Object.prototype));
        console.log("8.7:"+(Error.prototype.__proto__===Object.prototype));
        console.log("8.8:"+(Array.prototype.__proto__===Object.prototype));
        console.log("8.9:"+(RegExp.prototype.__proto__===Object.prototype));
        console.log("9:"+(Foo.__proto__===Function.prototype));
        var manfred = new Object();//实例对象
        console.log("10:"+(manfred.__proto__===Object.prototype));
        console.log("11:"+(Foo.prototype.__proto__===Object.prototype));
        //manfred为object构造函数产生，manfred.constructor指向function Object()构造函数
        console.log("12:"+(manfred.constructor.__proto__===Function.prototype));
        console.log("13:"+(manfred.constructor===Object.prototype.constructor));
        var hu = new Function();
        console.log("14:"+(hu.constructor.__proto__===Function.prototype));
        console.log("15:"+(hu.constructor===Function.prototype.constructor));
    </script>
</body>
</html>
```

相信看完这些代码和原图比较之后大家对 JS 对象之间的关系已经了如指掌了，确实一开始我也让这货搞得头晕晕的，但是画出这张图之后已经觉得没什么了。大家可以自己动手画一下。

## Object.getPrototypeOf 和 Object.getOwnPropertyNames
ts支持对象的扩展，比如下面的

```ts
class BaseModel {
  firstName: string = "parent_nick";

  constructor() {
    this.firstName = "parent_yang";
  }

  father() {

  }
}

class Person extends BaseModel {
  // 方式一：直接在属性声明时给个默认值
  firstName: string = "tom";
  // 普通声明
  lastName: string;

  constructor() {
    super()
    // 方式二：在构造器中赋值
    this.firstName = "nick";
    this.lastName = "yang";
  }

  child() {

  }
}
console.log(new Person().firstName) // nick
```
首先这里对结果进行拆解，类定义的属性，会默认在构造函数开头初始化。

![](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/ppl/v12CUr.png)

如上图，类内部定义的`firstName`属性会在`constructor`构造函数时候被覆盖。其次是这里的`super()`调用了父类构造函数，所以一开始`tom`，执行父类构造函数的时候赋值为`parent_yang`，之后执行子类的赋值`this.firstName = "nick";`，最后就是nick。

### 如何由实例获取到所有属性和方法？
首先获取实例属性，可以用`Object.getOwnPropertyNames`方法，这个方法会把属性不管是否可枚举都输出为key的数组

```ts
class BaseModel {
  firstName: string = "parent_nick";

  constructor() {
    this.firstName = "parent_yang";
  }

  father() {

  }
}

class Person extends BaseModel {
  // 方式一：直接在属性声明时给个默认值
  firstName: string = "tom";
  // 普通声明
  lastName: string;

  constructor() {
    super()
    // 方式二：在构造器中赋值
    this.firstName = "nick";
    this.lastName = "yang";
  }

  child() {

  }
}
const person = new Person()
const personPrototype = Object.getPrototypeOf(person)
console.log('personPrototype', personPrototype) // BaseModel {} 对应父类
const parent = Object.getPrototypeOf(personPrototype)
console.log('parent', parent) // {} 对应BaseModel的原型，包含有方法

console.log(`实例的所有属性`, Object.getOwnPropertyNames(person)) // [ 'firstName', 'lastName' ]
console.log(`子类的方法`, Object.getOwnPropertyNames(personPrototype)) // [ 'constructor', 'child' ]
console.log(`父类的方法`, Object.getOwnPropertyNames(parent)) // [ 'constructor', 'father' ]

console.log(
  person[Object.getOwnPropertyNames(personPrototype)[1]] // [Function: child]
);
```


