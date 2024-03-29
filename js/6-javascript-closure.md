# js 闭包

![闭包](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/closure.jpg)

## 词法作用域（Lexical scoping）、声明上下文对象（Declaration context object）

说到变量，我们会关注变量的两个东西。

- 作用域-空间来理解变量的存在
- 生命周期-时间来理解变量的存在

变量的词法作用域是指在程序源代码定义的这个变量的区域。通常分为**函数**和**全局**两部分。

```javascript
var scope = 'global' //全局作用域
function func() {
  var scope = 'local' //函数作用域，只在这个函数内存活
  return scope
}
```

那如果换成下面这样的呢？

```javascript
var scope = 'global' //全局作用域
function checkscope() {
  var scope = 'local' //外层函数的作用域
  function nested() {
    var scope = 'nested' //内层函数的作用域
    return scope
  }
  return nested()
}
console.log(checkscope()) //nested
```

结论：**当代码被编译器读取，词法作用域就已经确定了**
而这跟下面的变量作用域和闭包又会有关联,**词法作用域到函数执行时依然是有效的**。浏览器提前做好了大部分的工作，所以 JS 很快，so fast!!

## 编译过程干了什么？

传统的编译器会干这些东西

1. 词法分析过程，将代码读取并且扫描代码，分解成一个一个的词
2. 语法分析过程，分解语法短语构造语法树
3. 语义分析过程，审查代码是否有错，收集各个阶段类型的信息
4. 代码优化过程，对中间代码进行优化，使其更加高效
5. 生成目标代码，即二进制的本地代码

具体到浏览器的引擎，也不外乎是这几个过程。
我们能明显感受到的就是下面几个过程。

1. 声明函数、变量——声明提升
2. 检查代码，优化——代码执行效率大大提高，有`ERROR`

上面两个过程，很明显可以体会到上面 1-4 步的过程。而最后一步，学过计算机的都懂的。
我们来看下面的代码体会下编译过程干的事情——**声明提升**

```javascript
var scope = 'global'
function f() {
  console.log(scope) //undefined
  var scope = 'local'
  console.log(scope) //local
}
```

这段代码跟下面是等价的，只是下面的看起来更清晰,编译器干的事情也更少。

```javascript
var scope = 'global'
function f() {
  var scope
  console.log(scope) //undefined
  scope = 'local'
  console.log(scope) //local
}
```

## 变量的作用域和生命周期

JS 中变量的生命周期跟函数有关，函数内定义的变量在函数执行结束后会释放。
JS 中变量的作用域也跟函数有关，内层函数可以随作用域链访问外层函数的变量。具体原因就是作用域链的存在。

所以你不难看出，为什么 JS 里面函数非常非常重要，也许你应该听过了：

> JavaScript 的世界里函数是一等公民

正正因为你用的变量的生命周期和作用域都跟函数有关。你平常是否想到了呢？
但是闭包是个 bug，它为你提供了破坏这种已定规则的限制。为你的代码提供无限可能，这也许就是 JavaScript 真正的魅力所在，它让一切变得可能。

函数如果嵌套的话，随作用域链来定，如果作用域链上没有则访问不到。会出现`ReferenceError`

## 执行环境（execution context）、作用域链（scope chain）的创建

上面都是程序还没运行的时候干的事情，下面来说下程序运行起来会发生什么。

当 JavaScript 在运行的时候，也就是某个函数被**调用**时，会创建一个**执行环境**（execution context），以及相应的**作用域链**。然后**使用 arguments 和其他命名参数的值来初始化函数的活动对象**(activation object)，也有称为作用域对象（scope object）的。这东西你摸不到看不见，但是它却真正存在着——就像真理

## 活动对象（activation object）、作用域对象（scope object）

当我们的代码有多个函数嵌套的时候，一个个作用域对象就被串联起来形成**作用域链**（Scope chain）

## 闭包

我至少见过 N 种定义闭包概念的版本，让我们来欣赏一下：

### 函数对象可以通过作用域相互关联，函数体内部的变量可以保存在函数作用域内

这种观点引申出来的就是，**所有 JavaScript 函数都是闭包**。因为它们都是对象，都关联到作用域链。

### 函数变量可以被隐藏于作用域链之内，因此看起来是函数将变量包裹起来了

这是从计算机科学文献中引申出来的闭包的解释。

### 闭包是指有权访问另一个函数作用域中的变量的函数

这是《JavaScript 高级程序设计第三版》的定义。也就是说至少需要 2 个函数才能构成闭包

### 闭包是指函数有自由独立的变量。换句话说，定义在闭包中的函数可以“记忆”它创建时候的环境。

这是 MDN 的解释。**闭包由两部分构成：函数以及创建改函数的环境**
环境由闭包创建时在作用域中的任何局部变量组成。

现在觉得，上面说的其实都有道理。特别是第二个和第三个解释,所以我觉得最最准确描述就是下面两句了。

**闭包是指有权访问另一个函数作用域中的变量的函数**

## 最后以一道少见的题目结尾
```js
const anonymous = id => () => ({text: id})
console.log(anonymous) // id => () => ({text: id})
console.log(anonymous(1)()) // {text: 1}

const anonymous2 = function (id) {
  return function() {
    return {
      text: id
    }
  }
}
console.log(anonymous2)
// output: 
// ƒ (id) {
//   return function() {
//     return {
//       text: id
//     }
//   }
// }
console.log(anonymous2(1)()) // {text: 1}

const anonymous3 = id => () => () => () => () => () => () => ({text: id})
console.log(anonymous3(1)()()()()()()) // {text: 1}
```

这里可能大家很少遇到`()=>()=>()=>()`的情况，理论上可以无限嵌套下去，因为这里语法简单了，让本来函数嵌套复杂的情况得到了简化。
有人可能懵了，这里这么多箭头函数嵌套，这么算呢？
一个箭头函数代表一层函数，最后返回函数，上面最后返回的是一个对象

```js
const a = () => {}
```

可以简单归结为： **箭头函数形成的高阶函数，有多少个箭头符号就需要多少个()去对应执行** 

如上面`const a = () => {}`只需要`a()`就可以执行，一个箭头符号对应一个小括号对