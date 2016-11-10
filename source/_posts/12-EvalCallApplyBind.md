---
title: JavaScript的动态特性(通过eval,call,apply和bind来体现)
date: 2016-03-27 00:45:01
tags: 
    - 随笔
    - JavaScript
categories: 
    - 随笔
    - JavaScript
---


![](/images/js.jpg)

> JavaScript是一种**基于面向对象的、函数式的、动态的**编程语言。现在发展到已经可以用在浏览器和服务器端了。

这里不谈面向对象，也不去提及函数式编程，就单单讨论动态性。什么称为动态？

> 语言的动态性，是指程序在运行时可以改变其结构。

通俗地说就是没运行你根本不知道这段代码会出现什么情况，可能某个变量跟声明的时候不一样了，可能某个函数的作用域变了。如果有用到动态特性，很多时候你只能凭借经验来判断这段代码的执行流程。

个人觉得JavaScript的动态性可以用下面几个函数的使用来总结

> *   eval
> *   apply和call
> *   bind

## 1. eval函数

```javascript
eval(alert("汪峰又上头条了！"));  // -->汪峰又上头条了！
alert(window.eval === eval);   // -->true
alert(eval in window);         // -->false
```

这里大概能看明白用法了，eval是一个挂载在window对象下面的函数，而且eval是`不可枚举的`。

> eval函数的动态性体现在可以在脚本执行的时候，动态改变某些东西。

上面的例子就体现了这点，`eval()括号里面可以执行语句`，可以在程序执行的时候动态改变某些东西。

* * *

下面来讨论eval函数另外一个比较坑爹的问题：`eval的作用域问题`

举个栗子：

```javascript
var i = 100;
function myFunc() {
    var i = "text";
    window.eval('i = "hello"');
    alert(i);  // 现代浏览器提示text，IE6-8提示hello
}
myFunc();
alert(i); // 现代浏览器提示hello，IE6-8提示100
```

为什么会这样呢？ 

原因就是`不同的浏览器JS引擎对eval函数的作用域设定是不一样的`。这里我们指定的`window.eval函数`，意在让i的值改为hello字符串。但是不同浏览器JS解析内核对eval函数的作用域的设定是不同的，IE6-8因为用的是`JScript内核`，所以eval读到i是myFunc函数里面的`var i = "text"`的i，所以将myFunc函数里面的text改为hello之后就是显示hello了。**而现代浏览器则认为`window.eval`是改变的是全局`i=100`的值**。

那如果`window.eval`改为`eval`呢？

```javascript
var i = 100;
function myFunc() {
    var i = "text";
    eval('i = "hello"'); 
}
myFunc();
alert(i); // -->100
```

恭喜恭喜^_^，这里的`eval`没有指定`window`作用域，所以浏览器统一输出100。

> eval函数默认改变的就是当前作用域下的变量值。

附上常见浏览器JS引擎和内核的列表（不完全）：

|公司 | 浏览器 | JS引擎  |  渲染引擎
|:-------------:|:------------:| :-----:|:-----:|
|Microsoft   |  IE6-8   |  JScritp |Trident
|  |    IE9-11  |  Chakra   | Trident
|  |  Edge   |   Chakra   | Edge
|Mozilla |  Firefox |  JagerMonkey  | Gecko
|Google  |  Chrome  |  V8   |Blink
|Apple   |  Safari   | Webkit   | SquirrelFish Extreme
|Opera   |  Opera12.16+  | Blink    | Carakan


这些只是属于JS引擎和内核的一部分而已（现有的），其他版本的请自行搜索。

## 2. apply和call

### 2.1 apply和call的基本用法

apply和call的使用非常相似，举个栗子：

```javascript
var name = "JaminQian",
    obj = {
        name: "ManfredHu"
    };

function myFunc() {
    alert(this.name);
}
myFunc();         // -->JaminQian
myFunc.call(obj); // -->ManfredHu
```

这里的作用就是改变this的指向，我们知道this其实在不同的环境下的指向是不一样的。有时候是`window`全局对象，有时候是某个对象，通过apply和call，我们就可以**随意改变函数里面this的指向来达到我们的动态性**。

再看下面这个例子：

```javascript

function Animal(){    
    this.name = "Animal";
    this.args = arguments; //在实例上缓存构造函数的参数
    this.showName = function(){    
        console.log(this.name);
    };
    this.getArgsNum = function(){
        console.log(this.args);
    }
}    

function Cat(num1,num2,num3){    
    Animal.apply(this,arguments); //继承Animal
    this.name = "Cat";
}

function PersianCat(){ //波斯猫
    Cat.apply(this,arguments); //继承Cat
    this.name = "PersianCat";
}

var animal      = new Animal();    
var cat         = new Cat(1,2,3);
var PersianCat  = new PersianCat([1,"2",[3]]);

//输出this.name
animal.showName(); //-->Animal
animal.showName.call(cat); //-->Cat
animal.showName.call(PersianCat); //-->PersianCat

//获取构造函数的参数
animal.getArgsNum();    //-->[]
cat.getArgsNum();       //-->[1,2,3]
PersianCat.getArgsNum();//-->[[1,"2",[3]]]
```

这里的生物链是`Animal->Cat->PersianCat(波斯猫)`，生物学的不好不知道对不对暂且忽略哈^_^。然后是不停的用`call`在构造函数继承父类的属性（**借用构造函数继承**，也称为**对象冒充**），但是又有自己的特殊属性`name`，也就模仿着实现了面向对象的继承与多态。

最后是**apply一个最常用的做法，将参数毫无保留地传递到另外一个函数上**。

### 2.2 apply和call的实用用法

#### 2.2.1 获取数组的最大值、最小值

如果让你来用JS求一个数组的最大值最小值的方法的话，你可能回想到遍历，可能会问下是不是有序的，用折半查找算法。但是这里的用法是比较巧妙滴。

```javascript
var numbers = [5,"30",-1,6, //这里定义了一个数组，numbers[1]是一个字符串"30"
    {   
        a:20, //其中最后一个元素是一个对象，重写了valueOf方法
        valueOf:function() {
            return 40
        }
    },
];
//求数组的最大最小值
var max = Math.max.apply(Math,numbers),
    min = Math.min.call(Math,-10,2,6,10);
console.log(max); //-->40
console.log(min); //-->-10
```

大概说一下：**我们知道JS是非常懒的，只有当需要字符串的时候会去调用`Object.prototype.toString()`方法转化成字符串，而当需要数值的时候去调用`Object.prototype.valueOf()`方法转化为数字。**这里就是用到了`valueOf`来转化字符串`"30"`为数值30了。当然如果全部是数字的情况就更简单了，这里不赘述了。

#### 2.2.2 在原来的数组追加项

如果有人问你要合并两个数组要怎么做？ 

你可以会想到`Array.prototype.concat()`方法

```javascript
var arr1 = [22, 'foo', {
    age: "21"
}, -2046];
var arr2 = ["do", 55, 100];
var arr3 = arr1.concat(arr2);
console.log(arr3); //-->[22, "foo", Object, -2046, "do", 55, 100]
```

OK合并完成，你也可能会想到用循环arr2然后`push`每一项到arr1的方法。 

那比较优雅的合并数组的方法呢？狗血编剧肯定会写有的啦。

```javascript
var arr1 = [22, 'foo', {
    age: "21"
}, -2046];
var arr2 = ["do", 55, 100];
Array.prototype.push.apply(arr1,arr2); //注意这里用的是apply，传入的是数组
console.log(arr1); //-->[22, "foo", Object, -2046, "do", 55, 100]
```

有没有一种四两拨千斤的赶脚？

#### 2.2.3 验证数组类型

某天，BOSS要你将AB两个同事的代码重构一下提升下效率，那么对于重复的部分肯定要抽象出来。嗯，两边都有一个检测数组的操作，很自然，你要封装一个`isArray`函数来判断。 

然后你一拍大腿，丫的不是有原生的判断`isArray`的方法了吗？OK你搜了一遍发现了一个坑爹的问题：**IE9+才有`Array.isArray()`方法**，那OK，做好兼容不就行了嘛？

```javascript
function isArray(value) {
    if(typeof Array.isArray === "function") { //ES5新增加的判断数组的方法，IE9+支持
        return Array.isArray(value);
    } else {
        return Object.prototype.toString.call(value) === "[object Array]";
    }
}
```

逻辑非常简单粗暴，就是下面的兼容的方法要仔细看下，原理就是数组调用`Object.prototype.toString()`的时候会返回`"[object Array]"`字符串。当然这里可以扩展下，类型检测大体来说**基本类型检测用`typeof`是够的，像`number`, `string`,`boolean`,`undefined`都可以用`typof`检测。对于自定义引用类型的话用`instanceof`和`Object.prototype.hasOwnProperty`或者`constructor`属性也是够的**。 

比较容易出错的地方在**检测数组**和**检测函数**这两个地方，特别是有`iframe`的地方，原来的检测方法失效，所以要特别注意。 

检测数组如上所述，是比较公认的方法。检测函数的话用**`typeof foo === "function"`**(假定foo是一个函数)来检测。

#### 2.2.4 类数组用数组的方法

类数组是什么就不说了，有兴趣的可以翻一下之前的[文章](http://www.cnblogs.com/manfredHu/p/4803993.html)，搜一下**类数组**或者**array-like**就有了。 

其实这里用的最多的，估计就是jQuery了，抽象一下jQuery源码的用法。或者你可以去Look下有加了点[中文注释版的jQuery源码](http://github.com/manfredHu/read-jQuery-SC)，下面代码不能运行，只是加深下理解而已。

```javascript
var arr = [];
var slice = arr.slice; //数组的slice方法
toArray: function() {
    return slice.call( this ); //这里就是可以将类数组转化为可以用原生数组的一个方法
}
```

**类数组转化为数组的方法不外乎两种：一种是`slice`，一种是`concat`**。

## 3. bind函数

### 3.1 jQuery中的bind方法

说到bind这里本篇的正题就到了，什么是bind？如果你用老版本的[jQuery](http://jquery.com/)用的比较多你可能经常会这样写（jQuery1.7+之后是推荐用`on`来绑定事件的）：

```javascript
$( "#foo" ).bind( "click", function() {
    alert( "User clicked on 'foo.'" );
});
```

意思非常明确了，就是给`id`为`foo`的元素绑定`click`事件和一个匿名的回调函数。 

当然你也可以绑定多种类型的事件

```javascript
$( "#foo" ).bind( "mouseenter mouseleave", function() {
    $( this ).toggleClass( "entered" );
});
```

更详细的用法请参考[jQuery官网的`.bind()`的API](http://api.jquery.com/bind/)

* * *

### 3.2 原生JavaScript中的bind方法

还有一种是原生的bind函数，在ECMAScript5为`Function.prototype`添加了一些原生的扩展方法，其中就包括`Function.prototype.bind`。 

不信的话你可以在谷歌或者火狐下运行下下面的代码看看，IE就比较傻逼了，**IE9+才支持`bind`方法**。

```javascript
console.log(Function.prototype.bind); //-->bind() { [native code] }
```

**老式浏览器兼容bind的方法**(来自MDN)：

```javascript
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") { //调用的不是函数的时候抛出类型错误
            throw new TypeError("Function.prototype.bind() error");
        }

        var aArgs = Array.prototype.slice.call(arguments, 1), 
            fToBind = this, //缓存this，调用返回的函数时候会用到
            fNOP = function () {},
            fBound = function () {
                //用闭包缓存了绑定时候赋予的参数，在调用的时候将绑定和调用的参数拼接起来
                return fToBind.apply(this instanceof fNOP 
                                    && oThis ? this : oThis 
                                    || window,
                               aArgs.concat(Array.prototype.slice.call(arguments)));
            };

        fNOP.prototype = this.prototype;
        fBound.prototype = new fNOP();

        return fBound;
    };
}
```

下面我们来看下**JS原生bind的基本用法**：

```javascript
function foo() {
    console.log(this.name);
    console.log(arguments);
}
var obj = {
    name: 'ManfredHu'
}

//将foo绑定obj的作用域，返回一个绑定了作用域的新的函数
var newFunc = foo.bind(obj, '我是参数1', '我是参数2'); 
newFunc(); 

//output:(最好自己试一下)
//ManfredHu
//Arguments[2]   0: "我是参数1"  1: "我是参数2"
```

so，其实用法也很简单。原理简单说一下：**`bind`将原来的函数copy了一份，并且绑定了copy副本的上下文。**当然这里的上下文体现出来的就是`this`的指向了，而且后面就算你想改都改不了。

```javascript
var obj = {};
function foo() {
    return this;
}
var foo2 = foo.bind(obj); //复制函数绑定上下文
var obj2 = {};
obj2.foo2 = foo2;

console.log(obj === foo2());        //-->true
console.log(obj === window.foo2()); //-->true
console.log(obj === obj2.foo2());   //-->true
```

这里尝试用`window`和`obj2`来改变函数运行的上下文，都没有成功。

* * *

下面就是终结部分了，比较高能。 

某天闲逛时候看到了[一篇很有趣的译文](http://www.html-js.com/article/JavaScript-functional-programming-in-Javascript-Bind-Call-and-Apply)，起初看了下，有的地方没看的太懂，而且也赶着去做别的事，就先搁一边了，后面有空去看的时候发现这篇译文，或者说是代码。灰常犀利，不管是作用还是写法处处都将JS的动态特性体现得淋漓尽致。

```javascript
var context = { foo: "bar" };

function returnFoo () { //返回this.foo的简单函数
    return this.foo;
}

returnFoo(); //-->undefined（因为window.foo不存在）

var bound = returnFoo.bind(context); //用bind绑定函数上下文

bound(); //-->"bar"（因为上面被绑定了上下文了，这里输出context.foo）

returnFoo.call(context);  //--> bar（call的基本用法）

returnFoo.apply(context); //--> bar

context.returnFoo = returnFoo; //将函数引用赋给context对象

context.returnFoo(); //--> bar（returnFoo函数里面的this是context）

//-----------------------------------------------------------------------   
// 上面的应该都不会很难，下面是比较实用的部分，每一句都要看得懂之后才往下看
//-----------------------------------------------------------------------

[1,2,3].slice(0,1);  //-->[1]（简单的分割数组，比较麻烦是不是）

var slice = Array.prototype.slice; //更简单的做法，将原型上的slice方法缓存到本地，方便快捷调用

//因为没有绑定上下文，slice也不知道去截取哪个数组
slice(0, 1); //--> TypeError: can't convert undefined to object

//同上，还是因为没有绑定上下文，slice也不知道去截取哪个数组
slice([1,2,3], 0, 1); //--> TypeError: ...

//绑定了上下文，跟上面的[1,2,3].slice(0,1);一样，但是slice方法被封装起来了
slice.call([1,2,3], 0, 1); //--> [1]

//跟上面差不多，只是换成了apply方法的调用，参数变成了数组的形式
slice.apply([1,2,3], [0,1]); //--> [1]

//精髓的一句，上面的演进只是为了解释这一句而已，整个的思想就是“封装”，方便调用
//就是将slice.call这句简写成slice一句就完成了
//我们上面其实用的很多都是函数绑定对象，但是却忘记了其实JS函数也是对象，也可以被绑定
//这里将slice当作对象，用call去绑定它，返回一个绑定了的函数，方便后面复用，也就是缓存的作用
slice = Function.prototype.call.bind(Array.prototype.slice);

//跟上面的slice.call([1,2,3], 0, 1);对比一下发现原来把call封装到slice里面去了
slice([1,2,3], 0, 1); //--> [1]

//上面一句看懂了这句就很好懂了，bind.call省略为bind的意思
var bind = Function.prototype.call.bind(Function.prototype.bind);

//OK，经过我们的处理，slice和bind的功能都很厉害了

//回到最初的例子
var context = { foo: "bar" };
function returnFoo () {
    return this.foo;
}

//现在来使用神奇的"bind"函数
//bind(function,context)
//@function 待绑定上下文的函数
//@context  绑定的上下文
//@return   返回一个绑定了上下文的函数
//按照以前的书写顺序是这样的:returnFoo.bind(context,[args1,args2……])
//书写顺序完全改变了有木有？封装起来了有木有？
var amazing = bind(returnFoo, context);
amazing(); // --> bar
```

## 4. 总结

> 1.  bind和call以及apply都可以动态改变函数执行的上下文，可以说很好地体现了JavaScript的动态特性
> 2.  JavaScript的动态特性远不止上面的eval(),call/apply,bind()这些
> 3.  多试着用这些东西，可以更好地理解JS这门语言，而且，代码会变得优雅，代码量复用的几率也会增大

## 5. 引用参考：

[MDN官方文档——Function.prototype.bind()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind)
[张小俊128——Javascript中的Bind，Call和Apply](http://www.html-js.com/article/JavaScript-functional-programming-in-Javascript-Bind-Call-and-Apply)
