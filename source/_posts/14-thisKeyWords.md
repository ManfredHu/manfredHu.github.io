---
title: JavaScript中this关键字的使用比较
date: 2016-03-27 00:24:33
tags: 
    - 随笔
    - JavaScript
categories: 
    - 随笔
    - JavaScript
---

> **这篇是自己在之前的[博客](http://www.cnblogs.com/manfredHu/p/4803993.html)写的，各种转载就不说了。**


![This One,That One](/images/this.jpg)

this关键字在JavaScript中，用的不能说比较多，而是非常多。那么熟悉this关键字的各种用法则显得非常关键。

> this有时候就是我们经常说的上下文，这个东西的指代对象。它灵活多变，有时候你看它是对象，有时候是window宿主对象。

## 1.this指向宿主对象

```javascript
function myWindow() {
    this.id = 1; // 等价于window.id = 1
    console.log(this); // 这里的this就是window了
    console.log(this.id); // 1
}
myWindow();
```

这种情况比较普遍，也就是指向宿主对象的情况，在客户端是 `window对象` 在node里是 `Global对象` 第一个说，下面看第二种。

## 2.this指向调用函数的对象的时候

```javascript
function myObj() {
    console.log(this.x); // 在这个例子里面是obj对象
}
var obj = {};
obj.x = "xx";
obj.myObj = myObj;
obj.myObj(); // xx
```

这里的myObj()函数里面的 `this` 指向的就是obj这个外部传递来的对象了。注意看 `obj.myObj()` 这里前面的 `obj.` 这里，因为myObj是obj这个对象的方法，下面obj作为对象调用了myObj这个函数，所以这里的this就是指向调用函数的对象了。

## 3.this指向构造函数生成的新对象的时候

```javascript
// 作为构造函数的函数记得首字母要大写
function People(gender) { 
    this.gender = gender;
    this.sayGender = function() {
        console.log(this.gender);
    }
}

// 输出man,函数this是新的People{}对象
var girl = new People("women"); 

// 输出women,函数this是指向girl{gender:"women"}对象
girl.sayGender(); 
```

这里的执行过程理一下，首先 `new People("man")` 这句做了几件事情：

> 1.  根据构造函数创建一个空的对象People{}
> 2.  然后传递到People里面（这里才叫开始构造的过程，添砖加瓦的意思）
> 3.  然后这里开始的函数里面的this就是指向传进来新的People{}对象了

这里就是构造函数生成对象的一个简单的过程了，可以自己模拟着执行以下。

## 4.this指向需要继承属性的对象的时候（apply和call）

```javascript
function People(gender) { 
    this.gender = gender;
    this.sayGender = function() {
        console.log(this.gender);
    }
}

var sally = new People("women");

var bob = { // bob是直接量创建的,但是没有sayGender方法可以用
    gender: "man";
}
```

所以这里如果bob要用 `sayGender()` 方法的话要怎么破呢？这个时候就要用到 `apply()` 或者 `call()` 了，这两个方法差不多。

> *   apply(obj, arguments) 这里的arguments是一个参数数组
> *   call(obj,argument) 这里没有复数

所以bob要调用 `sayGender()` 的话，就要用到 `call()` 方法或者 `apply()` 方法了。

> 这个其实可以理解为继承的一种，Java里面继承分为实现继承跟接口继承两种，JavaScript的继承是只有实现继承的，但是实现继承JavaScript里面又有很多种，比如原型链继承，还有这里的 `apply()` 和 `call()` 也算是继承的一种。

```javascript
function People(gender) { 
    this.gender = gender;
    this.sayGender = function(str) {
        console.log(this.gender);
    }
}

var sally = new People("women");

var bob = { // bob是直接量创建的,但是没有sayGender方法可以用
    gender: "man";
}

sally.sayGender("这是什么性别的？"); // 这是什么性别的？women
sally.sayGender.call(bob,"这是什么性别的？"); // 这是什么性别的？man
```

这里最后一句代码的执行过程分析下：

> 1.  将bob{gender: “man”}这个对象传递到People里面
> 2.  更改函数里面this指向
> 3.  继续执行函数里面其他代码

这里可以看出，bob这个对象继承要继承另外一个对象的某个方法的时候可以用上面这种写法 `function.call(obj, argument)`

**同时也可以知道，this在函数里面的指向其实是可以有很多种的，要根据不同的环境来判断。**

下面开始apply的例子，在开始 `apply()` 的例子之前先普及一下基本知识：

> 首先普及下一个概念 **类数组（array-like）** ，类数组其实我们平时接触的很多的。比如函数里面的 `arguments对象` ，注意这里说的是 `arguments对象` 而不是 `arguments数组` 。因为arguments不是一个数组而是一个对象，只是我们平时用的时候喜欢用 `arguments[0]` 这样的写法所以看起来像数组而已。类数组通常的定义就是 **有维护一个length属性** 和 **可以根据数字下标来获取元素** 比如 `arguments[0]` 这样的一个对象。

不信的话我们可以测试下的：

```javascript
function arrayLike() {
    console.log(arguments instaceof Array); // false
    console.log(arguments instaceof Object); // true
}
arrayLike();
```

其实JavaScript里面的数组对象叫 **关联数组** ，也就是我们数据库表那样的 **键-值对** 组成的形式。所以你如果以为JavaScript可以像其他语言那样优化循环比如 `for(var i=0; i<100; i++)` 这样的过程的话你就想多了。 


> 甚至，JavaScript的对象内部实现也是**关联数组** ，比如你可以定义键为0而值为其他的对象。

```javascript
var obj = {
    0: "12345"
}
var arr = ["12345"];
console.log(obj[0]); // 12345
console.log(arr[0]); // 12345
```

有没有觉得JavaScript内部的实现其实很简单？或者可以说原理基本上就一个，但是通过简单的加点属性减点属性让对象跟数组看起来完全不一样。其实内部的实现原理是一模一样的。

废话扯得有点多，下面看 `apply()` 方法的例子：

```javascript
function People(gender) { 
    this.gender = gender;
    this.sayGender = function() {
        var str = Array.prototype.join.call(arguments,""); // arguments为类数组
        console.log(str + this.gender); // 
    }
}

var sally = new People("women");

var bob = {
    gender: "man"
}

var textArr = "这是什么性别的？".split(""); // 这里将字符串分割为数组

sally.sayGender.apply(bob, textArr); // 这是什么性别的？man
```

大概就到这里吧，有兴趣的可以留言讨论下。