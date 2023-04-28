# JS 编程题

![传说中的Coding](https://raw.githubusercontent.com/ManfredHu/manfredHu.github.io/master/images/coding.gif)

几道觉得挺有意思的编程题，感觉做下来，自己对一些新方法的看法有了新的变化。
比如`indexOf`,`reduce`,`Array.isArray`,`forEach`这些方法，以前一看到兼容性是 IE9+就有点害怕，项目中不敢用，导致后面越来越陌生，不过现在一想的话。其实只要用 Polyfill 或者提前 fix 掉就可以了。^\_^
而且随着浏览器的更新迭代，这些方法肯定会获得更多的支持。

**ps:希望新手更要多用这些方法，在特别是学日常学习训练的时候**

**更新：**参加腾讯笔试的编程题，觉得挺有意思的，补上，不过可惜选择语言的时候没有`JavaScript`。郁闷了好久-\_-!!

## 蛇形矩阵（2016 腾讯校招编程题）

作为一种常用的数学数列，是由 1 开始的自然数一次排列成的一个 N\*N 的正方形矩阵，数字一次由外而内的递增，如下面实例：

```
n=3的蛇形矩阵
1 2 3
8 9 4
7 6 5

n=6的蛇形矩阵
 1  2  3  4  5  6
20 21 22 23 24  7
19 32 33 34 25  8
18 31 36 35 26  9
17 30 29 28 27 10
16 15 14 13 12 11

此题要求输入蛇形矩阵宽度N，输出整个蛇形矩阵结果，注意输出格式要求按照矩阵从上至下的依次按行输出，每行中间无需换行输出。

样本输入： 3
样本输出： 1 2 3 8 9 4 7 6 5
```

自己写的答案（欢迎补充）^\_^

```javascript
//可以把代码复制到Chrome控制台运行
;(function() {
  function fixIsArray() {
    if (!Array.isArray) {
      Array.isArray = function(arr) {
        return Object.prototype.toString.call(arr).slice(8, -1) === 'Array'
      }
    }
  }
  fixIsArray() //fix Array.isArray（Array.isArray在IE9+支持）

  function Arr2D(d) {
    if (typeof d !== 'number')
      throw new Error('Arr2D():arguments d must be number')
    this.d = d
    this.arr = this.init2DArr(d)
  }

  Arr2D.prototype.reat2DArr = function() {
    var c = 0, //环数
      i = 0, //行
      j = 0, //列
      out = 1, //总数
      z,
      n = this.d,
      a = this.arr

    //检验参数
    if (!Array.isArray(a))
      throw new Error('reat2DArr():arguments a must be Array')
    if (typeof n !== 'number')
      throw new Error('reat2DArr():arguments n must be Number')

    z = n * n

    while (out <= z) {
      i = 0 /*每轮后初始化下i,j*/
      j = 0
      for (i += c, j += c; j < n - c; j++) {
        if (out > z) break
        a[i][j] = out++
      }
      for (j--, i = i + 1; i < n - c; i++) {
        if (out > z) break
        a[i][j] = out++
      }
      for (i--, j = j - 1; j >= c; j--) {
        if (out > z) break
        a[i][j] = out++
      }
      for (j++, i = i - 1; i > c; i--) {
        if (out > z) break
        a[i][j] = out++
      }
      c++
    }

    return this
  }

  Arr2D.prototype.printArr = function() {
    var a = this.arr,
      n = this.d,
      lineStr
    if (!Array.isArray(a))
      throw new Error('printArr():arguments a must be Array')
    for (i = 0; i < n; i++) {
      lineStr = ''
      for (j = 0; j < n; j++) {
        lineStr += ' ' + a[i][j]
      }
      console.log(lineStr)
    }

    return this
  }

  //初始化二维矩形数组
  Arr2D.prototype.init2DArr = function(m) {
    var arr = [],
      i,
      j
    for (i = 0; i < m; i++) {
      arr[i] = []
      for (j = 0; j < m; j++) {
        arr[i][j] = 0
      }
    }
    return arr
  }

  //调用函数,测试数据数据为3
  var arr = new Arr2D(3)
  arr.reat2DArr().printArr()
})()
```

## 大招来了：特别的回文字符串（2016 腾讯校招编程题）

所谓回文字符串，就是一个字符串，从左到右和从右到左读是完全一样的。比如"aba"、"c"。
对于一个字符串，可以通过删除某些字符而变成回文字符串，如"cabebaf"，删除'c','e','f'后
剩下子串'abba'就是回文字符串。
要求，给定任意一个字符串，字符串最大长度 1000，计算出最长的回文字符串长度。
如'cabebaf'的回文字符串包括'c','aba','abba'等，最长回文"abba"长度为 4。
输入：字符串
输出：最大的回文字符串长度。
示例：
输入：cabbeaf
输出：4

> **问题：**个人是觉得上面这道题的描述是有问题的，比如`cabebaf`，那么`abeba`算不算回文？通常应该是算的。但是按照题目的意思则是`abba`才算回文，`abeba`是不算的。

而且这里有干扰项，输入示例的`cabbeaf`中，要删除字符`e`才能检测出回文`abba`。所以这跟普通的回文判断完全不一样。

普通的估计用这样的方法就能判断了

```javascript
//判断如abba,abeba这样的字符串
function testArr(str) {
  //将字符串切割为字符数组，倒序反转再判断跟原来的字符串是否一样
  return (
    str
      .split('')
      .reverse()
      .join('') === str
  )
}
```

但是这里不是普通的题目，所以刚开始我想的是用`indexOf`和`lastIndexOf`来做，通过字符串的逐渐缩小范围，`indexOf`和`lastIndexOf`又可以避免要删除字符 e 的尴尬。

```javascript
;(function() {
  //输入：cabbeaf
  //4
  String.prototype.roundWord = function() {
    var i = 0,
      str = this,
      count = 0, //回文计数
      left,
      right = str.length - 1,
      max = 0,
      flag = false

    if (str.length <= 0)
      throw new Error('roundWord(): arguments str/this must be string')

    while (i < str.length) {
      charOne = str.charAt(i)
      left = str.indexOf(charOne, i)

      if (!flag) {
        right = str.lastIndexOf(charOne)
      } else {
        right = str.lastIndexOf(charOne, right)
      }

      if (left !== right && left < right) {
        //头尾有相同字符
        if (++count >= max) max = count
        flag = true //开始有回文
      }
      i++
    }
    return count * 2
  }

  var str = 'cababeacf123'
  console.log(str.roundWord()) //6
  str = 'cabbeaf'
  console.log(str.roundWord()) //4
})()
```

## 用 reduce 统计一个数组中单词出现的次数

```javascript
var arr = ['apple', 'orange', 'apple', 'orange', 'pear', 'orange']

function getWordCnt() {
  //以下应掏空
  return arr.reduce(function(prev, next, index, arr) {
    prev[next] = prev[next] + 1 || 1 //这句是重点,刚开始都是undefined的时候undefined+1会是NaN
    return prev
  }, {})
}

console.log(getWordCnt())
```

**注意**：这里传入了`{}`作为初始参数，所以第一个`prev`会是一个空对象，所以第一次的`prev[next]`会是`undefined`，而这里用了赋值

## 给定字符串 str，检查其是否包含连续重复的字母（a-zA-Z），包含返回 true，否则返回 false

```
function containsRepeatingLetter(str) {
    //以下应掏空
    return /([a-zA-Z])\1/.test(str); // \1指代第一个括号的匹配项
}
```

> 在正则表达式中，利用()进行分组，使用斜杠加数字表示引用，\1 就是引用第一个分组，\2 就是引用第二个分组。将[a-zA-Z]做为一个分组，然后引用，就可以判断是否有连续重复的字母。

## 已知 fn 为一个预定义函数，实现函数 curryIt

**需要补全的代码**

```javascript
var fn = function(a, b, c) {
  return a + b + c
}
curryIt(fn)(1)(2)(3) //6

function curryIt(fn) {
  //这里补充
}
```

可以试着玩一下，这里是用的函数的**柯里化**

```javascript
var fn = function(a, b, c) {
  return a + b + c
}
console.log(curryIt(fn)(1)(2)(3)) //6

function curryIt(fn) {
  //以下应掏空
  if (typeof fn !== 'function') throw new Error('curryIt():fn must be function')
  var len = fn.length //获取函数形参数量
  var slice = Array.prototype.slice
  var arg = slice.call(arguments, 1)
  return function() {
    arg = arg.concat(slice.call(arguments))
    if (arg.length < len) {
      //当等于函数需要的形参数量时候调用
      return arguments.callee
    } else {
      return fn.apply(null, arg)
    }
  }
}
```
